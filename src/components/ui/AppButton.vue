<template>
  <button :type="type" :class="variantClass">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  type: {
    type: String,
    default: 'button'
  }
})

const variantClass = computed(() => {
  return props.variant
})
</script>

<style scoped>
button {
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.primary {
  background: #B65C68;
  color: white;
}

.secondary {
  background: #E8A6A1;
  color: #4B2C2D;
}

.outline {
  background: transparent;
  border: 1px solid #B65C68;
  color: #4B2C2D;
}
</style>