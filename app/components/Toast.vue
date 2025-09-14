<template>
  <!-- Container des toasts -->
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300',
            getToastStyle(toast.type)
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <!-- Icône simple avec emoji -->
              <div class="flex-shrink-0 mr-3">
                <span class="text-xl">{{ getToastEmoji(toast.type) }}</span>
              </div>
              
              <!-- Contenu -->
              <div class="flex-1 min-w-0">
                <p :class="[
                  'text-sm font-medium',
                  getToastTextColor(toast.type)
                ]">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" :class="[
                  'mt-1 text-sm',
                  getToastSubTextColor(toast.type)
                ]">
                  {{ toast.message }}
                </p>
              </div>
              
              <!-- Bouton fermeture -->
              <div class="ml-4 flex-shrink-0">
                <button
                  @click="removeToast(toast.id)"
                  :class="[
                    'rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none transition-colors p-1',
                    getToastCloseColor(toast.type)
                  ]"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Barre de progression -->
          <div v-if="toast.duration > 0" class="h-1 bg-black bg-opacity-10">
            <div
              :class="[
                'h-full transition-all ease-linear',
                getToastProgressColor(toast.type)
              ]"
              :style="{
                width: `${toast.progress}%`,
                transitionDuration: '100ms'
              }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['remove'])

// Fonctions utilitaires pour les styles
const getToastStyle = (type) => {
  const styles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }
  return styles[type] || styles.info
}

const getToastEmoji = (type) => {
  const emojis = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return emojis[type] || emojis.info
}

const getToastTextColor = (type) => {
  const colors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return colors[type] || colors.info
}

const getToastSubTextColor = (type) => {
  const colors = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }
  return colors[type] || colors.info
}

const getToastCloseColor = (type) => {
  const colors = {
    success: 'text-green-500 hover:text-green-600',
    error: 'text-red-500 hover:text-red-600',
    warning: 'text-yellow-500 hover:text-yellow-600',
    info: 'text-blue-500 hover:text-blue-600'
  }
  return colors[type] || colors.info
}

const getToastProgressColor = (type) => {
  const colors = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400'
  }
  return colors[type] || colors.info
}

// Actions
const removeToast = (id) => {
  emit('remove', id)
}
</script>

<style scoped>
/* Animations pour les transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>