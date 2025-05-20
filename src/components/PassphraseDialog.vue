<template>
  <div v-if="isVisible" class="dialog-backdrop">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>Enter Passphrase</h3>
      </div>
      <div class="dialog-body">
        <div class="info-text">
          <p>Your device requires a passphrase to access this wallet.</p>
          <p><strong>Note:</strong> Passphrase is case-sensitive and creates completely different wallets.</p>
        </div>
        
        <div class="passphrase-options">
          <div class="toggle-option">
            <label class="toggle-switch">
              <span class="toggle-label">Enter on device</span>
              <input type="checkbox" v-model="onDevice">
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div v-if="!onDevice" class="passphrase-input-container">
            <label>Enter passphrase:</label>
            <input 
              type="password" 
              v-model="passphrase" 
              class="passphrase-input" 
              :placeholder="passphraseInputPlaceholder"
            />
          </div>
        </div>
        
        <div class="save-option">
          <label class="checkbox-container">
            <input type="checkbox" v-model="savePassphrase">
            <span class="checkmark"></span>
            <span>Save passphrase for this session</span>
          </label>
          <div class="option-info">
            This allows you to avoid re-entering your passphrase until you disconnect your device.
          </div>
        </div>
        
        <div class="dialog-actions">
          <button class="action-btn" @click="cancelPassphrase">Cancel</button>
          <button 
            class="action-btn confirm-btn" 
            @click="confirmPassphrase" 
            :disabled="!onDevice && !passphrase"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'PassphraseDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['passphrase-entered', 'passphrase-cancelled'],
  setup(props, { emit }) {
    const passphrase = ref('');
    const onDevice = ref(false);
    const savePassphrase = ref(true);
    
    const passphraseInputPlaceholder = computed(() => {
      return onDevice.value ? 'Will be entered on device' : 'Enter passphrase here';
    });
    
    const confirmPassphrase = () => {
      emit('passphrase-entered', {
        value: passphrase.value,
        onDevice: onDevice.value,
        save: savePassphrase.value
      });
      resetForm();
    };
    
    const cancelPassphrase = () => {
      emit('passphrase-cancelled');
      resetForm();
    };
    
    const resetForm = () => {
      passphrase.value = '';
      // Keep the last user preferences for onDevice and savePassphrase
    };
    
    return {
      passphrase,
      onDevice,
      savePassphrase,
      passphraseInputPlaceholder,
      confirmPassphrase,
      cancelPassphrase
    };
  }
});
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-container {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  background-color: #4e72b8;
  color: white;
  padding: 15px;
  text-align: center;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
}

.dialog-body {
  padding: 20px;
}

.info-text {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.info-text p {
  margin: 5px 0;
}

.passphrase-options {
  margin-bottom: 20px;
}

.toggle-option {
  margin-bottom: 15px;
}

.toggle-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.toggle-label {
  flex: 1;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  transition: all 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s;
}

input:checked + .toggle-slider {
  background-color: #4e72b8;
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
}

.passphrase-input-container {
  margin-top: 15px;
}

.passphrase-input-container label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.passphrase-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.save-option {
  margin-bottom: 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4e72b8;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.option-info {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
  margin-left: 30px;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  padding: 8px 16px;
  background-color: #e4e4e4;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-btn:hover {
  background-color: #d4d4d4;
}

.confirm-btn {
  background-color: #4e72b8;
  color: white;
}

.confirm-btn:hover {
  background-color: #3a5a9b;
}

.confirm-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 