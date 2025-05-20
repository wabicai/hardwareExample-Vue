<template>
  <div class="home">
    <h1>OneKey Hardware Demo</h1>

    <!-- Status messages -->
    <StatusMessage 
      :message="statusMessage.text" 
      :type="statusMessage.type" 
      v-if="statusMessage.text"
    />

    <!-- Device search section -->
    <div class="card">
      <h2>Device Management</h2>
      <button @click="searchDevices" :disabled="isSearching">
        {{ isSearching ? 'Searching...' : 'Search Devices' }}
      </button>

      <!-- Device list -->
      <div class="device-list" v-if="devices.length">
        <h3>Available Devices</h3>
        <DeviceCard 
          v-for="device in devices" 
          :key="device.id" 
          :device="device"
          :isSelected="selectedDevice && selectedDevice.id === device.id"
          @select-device="selectDevice"
        />
      </div>
      <p v-else-if="!isSearching && hasSearched">No devices found</p>
    </div>

    <!-- Actions section (only shown when device is selected) -->
    <div class="card" v-if="selectedDevice">
      <h2>Device Actions</h2>
      <div class="device-info-display">
        <p><strong>Selected Device:</strong> {{ selectedDevice.name || 'Unknown' }}</p>
        <p><strong>ID:</strong> {{ selectedDevice.id }}</p>
      </div>
      
      <div class="action-buttons">
        <button @click="getFeatures">Get Features</button>
        <button @click="getBTCAddress">Get BTC Address</button>
        <button @click="getEVMAddress">Get ETH/EVM Address</button>
        <button @click="checkFirmwareRelease">Check Firmware</button>
        <button @click="checkBLEFirmwareRelease">Check BLE Firmware</button>
      </div>
    </div>

    <!-- Results section -->
    <div class="card" v-if="result">
      <h2>Result</h2>
      <div class="result-content">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>

    <!-- Dialogs -->
    <PinDialog 
      :isVisible="showPinDialog" 
      @pin-entered="handlePinEntered"
    />
    <PassphraseDialog 
      :isVisible="showPassphraseDialog" 
      @passphrase-entered="handlePassphraseEntered"
      @passphrase-cancelled="handlePassphraseCancelled"
    />
    <ButtonConfirmDialog 
      :isVisible="showButtonConfirmDialog" 
      :message="buttonConfirmMessage"
      @confirm-acknowledged="handleButtonConfirmAcknowledged"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import DeviceCard from '@/components/DeviceCard.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import PinDialog from '@/components/PinDialog.vue';
import PassphraseDialog from '@/components/PassphraseDialog.vue';
import ButtonConfirmDialog from '@/components/ButtonConfirmDialog.vue';
import {
  initializeSDK,
  setupEventListeners,
  searchDevices,
  submitPin,
  submitPassphrase,
  btcGetAddress,
  evmGetAddress,
  checkFirmwareRelease,
  checkBLEFirmwareRelease,
  getPassphraseState,
  UI_REQUEST
} from '@/services/hardwareService';
import { DeviceInfo, UIEventMessage, StatusMessage as StatusMessageType } from '@/types/hardware';
import type { IDeviceType } from '@onekeyfe/hd-core';

export default defineComponent({
  name: 'HomeView',
  components: {
    DeviceCard,
    StatusMessage,
    PinDialog,
    PassphraseDialog,
    ButtonConfirmDialog
  },
  setup() {
    // 状态
    const devices = ref<DeviceInfo[]>([]);
    const selectedDevice = ref<DeviceInfo | null>(null);
    const deviceType = ref<IDeviceType>('unknown');
    const isSearching = ref(false);
    const hasSearched = ref(false);
    const statusMessage = reactive<StatusMessageType>({
      text: '',
      type: 'info'
    });
    const result = ref<any>(null);
    
    // Passphrase 状态
    const passphraseState = ref<string | null>(null);
    
    // Dialog states
    const showPinDialog = ref(false);
    const showPassphraseDialog = ref(false);
    const showButtonConfirmDialog = ref(false);
    const buttonConfirmMessage = ref('');

    // 初始化
    onMounted(async () => {
      try {
        await initializeSDK();
        setStatus('SDK initialized successfully', 'success');
        
        // Setup event listeners
        setupEventListeners(
          handlePinRequest,
          handlePassphraseRequest,
          handleButtonRequest,
          handleCloseUI
        );
      } catch (error: any) {
        setStatus(`Failed to initialize SDK: ${error.message}`, 'error');
      }
    });

    // 设置状态消息
    const setStatus = (text: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
      statusMessage.text = text;
      statusMessage.type = type;
      console.log(`[${type.toUpperCase()}] ${text}`);
    };

    // 搜索设备
    const searchDevicesAction = async () => {
      isSearching.value = true;
      devices.value = [];
      setStatus('Searching for devices...', 'info');
      
      try {
        const result = await searchDevices();
        hasSearched.value = true;
        
        if (result && result.success && result.payload) {
          devices.value = result.payload.map((device: any) => ({
            id: device.connectId,
            name: device.name || device.deviceType || 'OneKey Device',
            deviceType: device.deviceType || 'unknown'
          }));
          
          setStatus(
            devices.value.length > 0 
              ? `Found ${devices.value.length} devices` 
              : 'No devices found',
            devices.value.length > 0 ? 'success' : 'info'
          );
        } else {
          setStatus('No devices found or search failed', 'warning');
        }
      } catch (error: any) {
        setStatus(`Error searching devices: ${error.message}`, 'error');
      } finally {
        isSearching.value = false;
      }
    };
    
    // 选择设备
    const selectDevice = (device: DeviceInfo) => {
      selectedDevice.value = device;
      setStatus(`Selected device: ${device.name || device.id}`, 'success');
      
      // 获取设备类型
      deviceType.value = (device.deviceType as IDeviceType) || 'unknown';
      console.log('Device type:', deviceType.value);
      
      // 获取 passphrase 状态
      checkPassphraseState();
    };
    
    // 检查 passphrase 状态
    const checkPassphraseState = async () => {
      if (!selectedDevice.value) return;
      
      try {
        const result = await getPassphraseState(selectedDevice.value.id);
        if (result && result.success) {
          passphraseState.value = result.payload;
          console.log('Passphrase state:', passphraseState.value);
          
          if (passphraseState.value) {
            setStatus('Device has passphrase enabled', 'info');
          }
        }
      } catch (error: any) {
        console.error('Error checking passphrase state:', error);
      }
    };
    
    // UI 事件处理
    const handlePinRequest = (message: UIEventMessage) => {
      console.log('PIN requested:', message);
      
      // 只有 Classic 设备支持在软件上输入 PIN
      if (deviceType.value.toLowerCase() === 'classic') {
        showPinDialog.value = true;
      } else {
        // Pro 和 Touch 设备只能在设备上输入 PIN
        setStatus('Please enter PIN on your device', 'info');
        submitPin(''); // 使用空字符串表示在设备上输入
      }
    };
    
    const handlePassphraseRequest = (message: UIEventMessage) => {
      console.log('Passphrase requested:', message);
      showPassphraseDialog.value = true;
    };
    
    const handleButtonRequest = (message: UIEventMessage) => {
      console.log('Button confirmation requested:', message);
      buttonConfirmMessage.value = message.payload?.message || 'Please confirm on your device';
      showButtonConfirmDialog.value = true;
    };
    
    const handleCloseUI = () => {
      showPinDialog.value = false;
      showPassphraseDialog.value = false;
      showButtonConfirmDialog.value = false;
    };
    
    // 对话框动作处理
    const handlePinEntered = (pin: string) => {
      console.log('PIN entered:', pin ? 'Custom PIN' : 'Use device PIN');
      submitPin(pin);
      showPinDialog.value = false;
    };
    
    interface PassphraseData {
      value: string;
      onDevice: boolean;
      save: boolean;
    }
    
    const handlePassphraseEntered = (passphraseData: PassphraseData) => {
      console.log('Passphrase entered:', passphraseData.onDevice ? 'On device' : 'Custom passphrase');
      submitPassphrase(passphraseData.value, passphraseData.onDevice, passphraseData.save);
      showPassphraseDialog.value = false;
    };
    
    const handlePassphraseCancelled = () => {
      console.log('Passphrase cancelled');
      submitPassphrase('', true, false); // Default to on-device entry
      showPassphraseDialog.value = false;
    };
    
    const handleButtonConfirmAcknowledged = () => {
      console.log('Button confirmation acknowledged');
      showButtonConfirmDialog.value = false;
    };
    
    // 设备操作
    const getFeatures = async () => {
      if (!selectedDevice.value) {
        setStatus('No device selected', 'warning');
        return;
      }
      
      setStatus('Getting device features...', 'info');
      try {
        const sdk = await initializeSDK();
        const callResult = await sdk.getFeatures(selectedDevice.value.id);
        result.value = callResult;
        
        if (callResult.success) {
          setStatus('Successfully retrieved device features', 'success');
        } else {
          setStatus(`Failed to get features: ${callResult.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error: any) {
        setStatus(`Error getting features: ${error.message}`, 'error');
      }
    };
    
    const getBTCAddress = async () => {
      if (!selectedDevice.value) {
        setStatus('No device selected', 'warning');
        return;
      }
      
      setStatus('Getting BTC address...', 'info');
      try {
        // 使用新的调用格式，符合 OneKey 文档标准
        const callResult = await btcGetAddress(
          selectedDevice.value.id, 
          '', // deviceId can be empty for web
          {
            path: "m/44'/0'/0'/0/0", // standard BTC path
            showOnOneKey: true, // show on device
            passphraseState: passphraseState.value || undefined,
            retryCount: 3, // 尝试3次连接
            timeout: 60000, // 60秒超时
            keepSession: true // 保持会话
          }
        );
        result.value = callResult;
        
        if (callResult.success) {
          setStatus('Successfully retrieved BTC address', 'success');
        } else {
          setStatus(`Failed to get BTC address: ${callResult.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error: any) {
        setStatus(`Error getting BTC address: ${error.message}`, 'error');
      }
    };
    
    const getEVMAddress = async () => {
      if (!selectedDevice.value) {
        setStatus('No device selected', 'warning');
        return;
      }
      
      setStatus('Getting ETH/EVM address...', 'info');
      try {
        // 使用新的调用格式，符合 OneKey 文档标准
        const callResult = await evmGetAddress(
          selectedDevice.value.id,
          '', // deviceId can be empty for web
          {
            path: "m/44'/60'/0'/0/0", // standard ETH path
            chainId: 1, // Ethereum mainnet chain ID
            showOnOneKey: true, // show on device
            passphraseState: passphraseState.value || undefined,
            retryCount: 3,
            timeout: 60000,
            keepSession: true
          }
        );
        result.value = callResult;
        
        if (callResult.success) {
          setStatus('Successfully retrieved ETH address', 'success');
        } else {
          setStatus(`Failed to get ETH address: ${callResult.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error: any) {
        setStatus(`Error getting ETH address: ${error.message}`, 'error');
      }
    };
    
    const checkFirmwareReleaseAction = async () => {
      if (!selectedDevice.value) {
        setStatus('No device selected', 'warning');
        return;
      }
      
      setStatus('Checking firmware release...', 'info');
      try {
        // 使用新的调用格式
        const callResult = await checkFirmwareRelease(
          selectedDevice.value.id, 
          '',
          {
            timeout: 30000,
            keepSession: false
          }
        );
        result.value = callResult;
        
        if (callResult.success) {
          setStatus('Successfully checked firmware release', 'success');
        } else {
          setStatus(`Failed to check firmware: ${callResult.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error: any) {
        setStatus(`Error checking firmware: ${error.message}`, 'error');
      }
    };
    
    const checkBLEFirmwareReleaseAction = async () => {
      if (!selectedDevice.value) {
        setStatus('No device selected', 'warning');
        return;
      }
      
      setStatus('Checking BLE firmware release...', 'info');
      try {
        // 使用新的调用格式
        const callResult = await checkBLEFirmwareRelease(
          selectedDevice.value.id, 
          '',
          {
            timeout: 30000,
            keepSession: false
          }
        );
        result.value = callResult;
        
        if (callResult.success) {
          setStatus('Successfully checked BLE firmware release', 'success');
        } else {
          setStatus(`Failed to check BLE firmware: ${callResult.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error: any) {
        setStatus(`Error checking BLE firmware: ${error.message}`, 'error');
      }
    };

    return {
      // 状态
      devices,
      selectedDevice,
      deviceType,
      isSearching,
      hasSearched,
      statusMessage,
      result,
      passphraseState,
      showPinDialog,
      showPassphraseDialog,
      showButtonConfirmDialog,
      buttonConfirmMessage,
      
      // 方法
      searchDevices: searchDevicesAction,
      selectDevice,
      handlePinRequest,
      handlePassphraseRequest,
      handleButtonRequest,
      handleCloseUI,
      handlePinEntered,
      handlePassphraseEntered,
      handlePassphraseCancelled,
      handleButtonConfirmAcknowledged,
      getFeatures,
      getBTCAddress,
      getEVMAddress,
      checkFirmwareRelease: checkFirmwareReleaseAction,
      checkBLEFirmwareRelease: checkBLEFirmwareReleaseAction,
      setStatus
    };
  }
});
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #4e72b8;
  margin-bottom: 20px;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

h3 {
  color: #555;
  margin: 15px 0;
}

.device-list {
  margin-top: 20px;
}

.device-info-display {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.device-info-display p {
  margin: 5px 0;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.result-content {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style> 