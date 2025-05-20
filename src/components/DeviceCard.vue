<template>
  <div class="device-card" :class="{ 'selected': isSelected }">
    <div class="device-info">
      <div class="device-name">{{ device.name || 'Unknown Device' }}</div>
      <div class="device-id">{{ device.id }}</div>
    </div>
    <div class="device-actions">
      <button v-if="!isSelected" @click="$emit('select-device', device)">Select</button>
      <span v-else class="selected-badge">Selected</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DeviceInfo } from '@/types/hardware';

export default defineComponent({
  name: 'DeviceCard',
  props: {
    device: {
      type: Object as PropType<DeviceInfo>,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select-device']
});
</script>

<style scoped>
.device-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  margin-bottom: 10px;
  border: 1px solid #eee;
  transition: all 0.2s ease;
}

.device-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.device-card.selected {
  border-color: #4e72b8;
  background-color: #f0f4fa;
}

.device-info {
  display: flex;
  flex-direction: column;
}

.device-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}

.device-id {
  font-size: 12px;
  color: #777;
}

.device-actions {
  display: flex;
  align-items: center;
}

.selected-badge {
  background-color: #4e72b8;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}
</style> 