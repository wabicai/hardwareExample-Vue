<template>
  <div v-if="isVisible" class="dialog-backdrop">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>Confirm Action</h3>
      </div>
      <div class="dialog-body">
        <div class="message">
          {{ message || 'Please confirm this operation on your device' }}
        </div>
        <div class="device-icon">
          <div class="device">
            <div class="device-screen">
              <div class="screen-text">Confirm on Device</div>
            </div>
            <div class="device-button"></div>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="action-btn" @click="handleAcknowledge">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ButtonConfirmDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  },
  emits: ['confirm-acknowledged'],
  setup(props, { emit }) {
    const handleAcknowledge = () => {
      emit('confirm-acknowledged');
    };

    return {
      handleAcknowledge
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message {
  margin-bottom: 20px;
  text-align: center;
  font-size: 16px;
}

.device-icon {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.device {
  width: 80px;
  height: 150px;
  background-color: #333;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.device-screen {
  width: 65px;
  height: 85px;
  background-color: #4e72b8;
  border-radius: 5px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.screen-text {
  color: white;
  font-size: 10px;
  text-align: center;
}

.device-button {
  width: 25px;
  height: 25px;
  background-color: #666;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.dialog-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  padding: 8px 30px;
  background-color: #4e72b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-btn:hover {
  background-color: #3a5a9b;
}
</style> 