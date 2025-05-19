<template>
  <div v-if="isVisible" class="dialog-backdrop">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>Enter Passphrase</h3>
      </div>
      <div class="dialog-body">
        <div class="input-group">
          <label for="passphrase">Passphrase:</label>
          <input 
            type="password" 
            id="passphrase" 
            v-model="passphrase"
            placeholder="Enter your passphrase"
          />
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="save-passphrase" v-model="savePassphrase">
          <label for="save-passphrase">Save for this session</label>
        </div>
        
        <div class="dialog-actions">
          <button class="action-btn" @click="cancel">Cancel</button>
          <button class="action-btn confirm-btn" @click="confirm">Confirm</button>
          <button class="action-btn" @click="useDeviceInput">Enter on Device</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PassphraseDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      passphrase: '',
      savePassphrase: false
    }
  },
  methods: {
    confirm() {
      this.$emit('passphrase-entered', {
        value: this.passphrase,
        save: this.savePassphrase,
        onDevice: false
      });
      this.resetForm();
    },
    useDeviceInput() {
      this.$emit('passphrase-entered', {
        value: '',
        save: this.savePassphrase,
        onDevice: true
      });
      this.resetForm();
    },
    cancel() {
      this.$emit('passphrase-cancelled');
      this.resetForm();
    },
    resetForm() {
      this.passphrase = '';
      this.savePassphrase = false;
    }
  }
}
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

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox-group input {
  margin-right: 10px;
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
</style> 