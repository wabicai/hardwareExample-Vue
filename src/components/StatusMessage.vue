<template>
  <div class="status-message" :class="messageClass">
    <div class="icon" v-if="showIcon">
      <svg v-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <svg v-else-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="8 12 12 16 17 9"></polyline>
      </svg>
      <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    <div class="message">{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

type MessageType = 'info' | 'success' | 'warning' | 'error';

export default defineComponent({
  name: 'StatusMessage',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String as () => MessageType,
      default: 'info',
      validator: (value: string) => {
        return ['info', 'success', 'warning', 'error'].includes(value);
      }
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const messageClass = computed(() => {
      return {
        'status-message--info': props.type === 'info',
        'status-message--success': props.type === 'success',
        'status-message--warning': props.type === 'warning',
        'status-message--error': props.type === 'error'
      };
    });

    return {
      messageClass
    };
  }
});
</script>

<style scoped>
.status-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
}

.status-message--info {
  background-color: #e8f0fe;
  color: #174ea6;
  border-left: 4px solid #4285f4;
}

.status-message--success {
  background-color: #e6f4ea;
  color: #137333;
  border-left: 4px solid #34a853;
}

.status-message--warning {
  background-color: #fef7e0;
  color: #b06000;
  border-left: 4px solid #fbbc04;
}

.status-message--error {
  background-color: #fce8e6;
  color: #c5221f;
  border-left: 4px solid #ea4335;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.message {
  flex: 1;
}
</style> 