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

<script>
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
  UI_REQUEST
} from '@/services/hardwareService';

export default {
  name: 'HomeView',
  components: {
    DeviceCard,
    StatusMessage,
    PinDialog,
    PassphraseDialog,
    ButtonConfirmDialog
  },
  data() {
    return {
      devices: [],
      selectedDevice: null,
      isSearching: false,
      hasSearched: false,
      statusMessage: {
        text: '',
        type: 'info'
      },
      result: null,
      
      // Dialog states
      showPinDialog: false,
      showPassphraseDialog: false,
      showButtonConfirmDialog: false,
      buttonConfirmMessage: ''
    };
  },
  async mounted() {
    try {
      await initializeSDK();
      this.setStatus('SDK initialized successfully', 'success');
      
      // Setup event listeners
      setupEventListeners(
        this.handlePinRequest,
        this.handlePassphraseRequest,
        this.handleButtonRequest,
        this.handleCloseUI
      );
    } catch (error) {
      this.setStatus(`Failed to initialize SDK: ${error.message}`, 'error');
    }
  },
  methods: {
    // Device management
    async searchDevices() {
      this.isSearching = true;
      this.devices = [];
      this.setStatus('Searching for devices...', 'info');
      
      try {
        const result = await searchDevices();
        this.hasSearched = true;
        
        if (result && result.success && result.payload) {
          this.devices = result.payload.map(device => ({
            id: device.connectId,
            name: device.name || device.deviceType || 'OneKey Device',
            deviceType: device.deviceType || 'unknown'
          }));
          
          this.setStatus(
            this.devices.length > 0 
              ? `Found ${this.devices.length} devices` 
              : 'No devices found',
            this.devices.length > 0 ? 'success' : 'info'
          );
        } else {
          this.setStatus('No devices found or search failed', 'warning');
        }
      } catch (error) {
        this.setStatus(`Error searching devices: ${error.message}`, 'error');
      } finally {
        this.isSearching = false;
      }
    },
    
    selectDevice(device) {
      this.selectedDevice = device;
      this.setStatus(`Selected device: ${device.name || device.id}`, 'success');
    },
    
    // UI event handlers
    handlePinRequest(message) {
      console.log('PIN requested:', message);
      this.showPinDialog = true;
    },
    
    handlePassphraseRequest(message) {
      console.log('Passphrase requested:', message);
      this.showPassphraseDialog = true;
    },
    
    handleButtonRequest(message) {
      console.log('Button confirmation requested:', message);
      this.buttonConfirmMessage = message.payload?.message || 'Please confirm on your device';
      this.showButtonConfirmDialog = true;
    },
    
    handleCloseUI() {
      this.showPinDialog = false;
      this.showPassphraseDialog = false;
      this.showButtonConfirmDialog = false;
    },
    
    // Dialog action handlers
    handlePinEntered(pin) {
      console.log('PIN entered:', pin ? 'Custom PIN' : 'Use device PIN');
      submitPin(pin);
      this.showPinDialog = false;
    },
    
    handlePassphraseEntered(passphraseData) {
      console.log('Passphrase entered:', passphraseData.onDevice ? 'On device' : 'Custom passphrase');
      submitPassphrase(passphraseData.value, passphraseData.onDevice, passphraseData.save);
      this.showPassphraseDialog = false;
    },
    
    handlePassphraseCancelled() {
      console.log('Passphrase cancelled');
      submitPassphrase('', true, false); // Default to on-device entry
      this.showPassphraseDialog = false;
    },
    
    handleButtonConfirmAcknowledged() {
      console.log('Button confirmation acknowledged');
      this.showButtonConfirmDialog = false;
    },
    
    // Device actions
    async getFeatures() {
      if (!this.selectedDevice) {
        this.setStatus('No device selected', 'warning');
        return;
      }
      
      this.setStatus('Getting device features...', 'info');
      try {
        const sdk = await initializeSDK();
        const result = await sdk.getFeatures(this.selectedDevice.id);
        this.result = result;
        
        if (result.success) {
          this.setStatus('Successfully retrieved device features', 'success');
        } else {
          this.setStatus(`Failed to get features: ${result.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        this.setStatus(`Error getting features: ${error.message}`, 'error');
      }
    },
    
    async getBTCAddress() {
      if (!this.selectedDevice) {
        this.setStatus('No device selected', 'warning');
        return;
      }
      
      this.setStatus('Getting BTC address...', 'info');
      try {
        const result = await btcGetAddress(
          this.selectedDevice.id, 
          '', // deviceId can be empty for web
          "m/44'/0'/0'/0/0", // standard BTC path
          true, // show on device 
          true  // use empty passphrase
        );
        this.result = result;
        
        if (result.success) {
          this.setStatus('Successfully retrieved BTC address', 'success');
        } else {
          this.setStatus(`Failed to get BTC address: ${result.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        this.setStatus(`Error getting BTC address: ${error.message}`, 'error');
      }
    },
    
    async getEVMAddress() {
      if (!this.selectedDevice) {
        this.setStatus('No device selected', 'warning');
        return;
      }
      
      this.setStatus('Getting ETH/EVM address...', 'info');
      try {
        const result = await evmGetAddress(
          this.selectedDevice.id,
          '', // deviceId can be empty for web
          "m/44'/60'/0'/0/0", // standard ETH path
          1,  // Ethereum mainnet chain ID
          true, // show on device
          true  // use empty passphrase
        );
        this.result = result;
        
        if (result.success) {
          this.setStatus('Successfully retrieved ETH address', 'success');
        } else {
          this.setStatus(`Failed to get ETH address: ${result.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        this.setStatus(`Error getting ETH address: ${error.message}`, 'error');
      }
    },
    
    async checkFirmwareRelease() {
      if (!this.selectedDevice) {
        this.setStatus('No device selected', 'warning');
        return;
      }
      
      this.setStatus('Checking firmware release...', 'info');
      try {
        const result = await checkFirmwareRelease(this.selectedDevice.id, '');
        this.result = result;
        
        if (result.success) {
          this.setStatus('Successfully checked firmware release', 'success');
        } else {
          this.setStatus(`Failed to check firmware: ${result.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        this.setStatus(`Error checking firmware: ${error.message}`, 'error');
      }
    },
    
    async checkBLEFirmwareRelease() {
      if (!this.selectedDevice) {
        this.setStatus('No device selected', 'warning');
        return;
      }
      
      this.setStatus('Checking BLE firmware release...', 'info');
      try {
        const result = await checkBLEFirmwareRelease(this.selectedDevice.id, '');
        this.result = result;
        
        if (result.success) {
          this.setStatus('Successfully checked BLE firmware release', 'success');
        } else {
          this.setStatus(`Failed to check BLE firmware: ${result.payload?.error || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        this.setStatus(`Error checking BLE firmware: ${error.message}`, 'error');
      }
    },
    
    // Utility methods
    setStatus(text, type = 'info') {
      this.statusMessage = { text, type };
      console.log(`[${type.toUpperCase()}] ${text}`);
    }
  }
};
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