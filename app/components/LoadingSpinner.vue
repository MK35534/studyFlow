<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <!-- Spinner type 1: Rotating circle -->
    <div v-if="type === 'spinner'" class="loading-spinner">
      <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.25"/>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>

    <!-- Spinner type 2: Dots -->
    <div v-else-if="type === 'dots'" class="flex space-x-1">
      <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
      <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
      <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
    </div>

    <!-- Spinner type 3: Skeleton -->
    <div v-else-if="type === 'skeleton'" class="w-full space-y-3">
      <div class="h-4 bg-gray-200 rounded skeleton"></div>
      <div class="h-4 bg-gray-200 rounded skeleton w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded skeleton w-4/6"></div>
    </div>

    <!-- Message optionnel -->
    <span v-if="message" class="ml-3 text-gray-600 text-sm">{{ message }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'dots', 'skeleton'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  }
})

const containerClass = computed(() => {
  const sizes = {
    small: 'py-2',
    normal: 'py-8',
    large: 'py-12'
  }
  return sizes[props.size]
})
</script>