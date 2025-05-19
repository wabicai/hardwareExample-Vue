<template>
  <div class="status-message" :class="typeClass">
    <div v-if="message" class="message-content">
      <span class="status-icon" v-if="type">{{ icon }}</span>
      <span class="status-text">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusMessage',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info', // 'info', 'success', 'error', 'warning'
      validator: (value) => ['info', 'success', 'error', 'warning'].includes(value)
    }
  },
  computed: {
    typeClass() {
      return `status-${this.type}`;
    },
    icon() {
      switch(this.type) {
        case 'success': return '✓';
        case 'error': return '✗';
        case 'warning': return '⚠';
        default: return 'ℹ'; // info
      }
    }
  }
}
</script>

<style scoped>
.status-message {
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.message-content {
  display: flex;
  align-items: center;
}

.status-icon {
  margin-right: 10px;
  font-size: 16px;
}

.status-info {
  background-color: #e8f4fd;
  color: #0072c6;
  border-left: 5px solid #0072c6;
}

.status-success {
  background-color: #e5f9e0;
  color: #1e9f3e;
  border-left: 5px solid #1e9f3e;
}

.status-error {
  background-color: #fde8e8;
  color: #e53935;
  border-left: 5px solid #e53935;
}

.status-warning {
  background-color: #fff8e6;
  color: #f2994a;
  border-left: 5px solid #f2994a;
}
</style> 