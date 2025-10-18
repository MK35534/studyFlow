<template>
  <Transition name="fade">
    <div
      v-if="isActive"
      class="fixed inset-0 z-40 pointer-events-none"
    >
      <!-- Overlay semi-transparent -->
      <div class="absolute inset-0 bg-black opacity-10"></div>
      
      <!-- Indicateur en haut -->
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div class="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 animate-pulse-soft">
          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span class="font-semibold text-sm">Mode Focus Intense</span>
          <button
            @click="$emit('deactivate')"
            class="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Timer floating en bas à droite -->
      <div class="absolute bottom-8 right-8 pointer-events-auto">
        <div class="bg-white rounded-2xl shadow-2xl p-4 border-2 border-red-500">
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-900 font-mono tabular-nums">
              {{ formattedTime }}
            </div>
            <div class="text-xs text-gray-600 mt-1">
              {{ statusText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  timeLeft: {
    type: Number,
    default: 0
  },
  sessionType: {
    type: String,
    default: 'focus'
  }
})

defineEmits(['deactivate'])

const formattedTime = computed(() => {
  const mins = Math.floor(props.timeLeft / 60)
  const secs = props.timeLeft % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const statusText = computed(() => {
  const texts = {
    focus: 'Focus en cours 🍅',
    'short-break': 'Pause courte ☕',
    'long-break': 'Pause longue 🌴'
  }
  return texts[props.sessionType] || 'Session en cours'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes animate-pulse-soft {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-soft {
  animation: animate-pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
