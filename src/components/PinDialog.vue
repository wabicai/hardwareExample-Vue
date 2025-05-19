<template>
  <div v-if="isVisible" class="dialog-backdrop">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>Enter PIN</h3>
      </div>
      <div class="dialog-body">
        <!-- PIN Display (shows dots for entered numbers) -->
        <div class="pin-display">{{ pinDisplay }}</div>
        
        <!-- PIN Keypad (mapped like on OneKey devices) -->
        <div class="pin-keypad">
          <button 
            v-for="(num, index) in keyboardMap" 
            :key="index" 
            class="pin-key" 
            @click="addPinDigit(num)"
          >
            •
          </button>
        </div>
        
        <div class="dialog-actions">
          <button class="action-btn" @click="clearPin">Clear</button>
          <button class="action-btn confirm-btn" @click="confirmPin" :disabled="!pin.length">Confirm</button>
          <button class="action-btn" @click="useDeviceInput">Use Device Input</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PinDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pin: '',
      // The keyboard map that matches OneKey device PIN layout
      keyboardMap: ['7', '8', '9', '4', '5', '6', '1', '2', '3']
    }
  },
  computed: {
    pinDisplay() {
      return '•'.repeat(this.pin.length);
    }
  },
  methods: {
    addPinDigit(digit) {
      this.pin += digit;
    },
    clearPin() {
      this.pin = '';
    },
    confirmPin() {
      if (this.pin.length > 0) {
        this.$emit('pin-entered', this.pin);
        this.pin = '';
      }
    },
    useDeviceInput() {
      this.$emit('pin-entered', '');
      this.pin = '';
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
  width: 350px;
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

.pin-display {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  min-height: 45px;
  letter-spacing: 5px;
}

.pin-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  margin-bottom: 20px;
}

.pin-key {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-key:hover {
  background-color: #e3e3e3;
}

.pin-key:active {
  background-color: #d0d0d0;
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