<template>
  <!-- Container des toasts -->
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[99999] space-y-3 max-w-sm">
      <TransitionGroup
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
        tag="div"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'w-full backdrop-blur-sm shadow-2xl rounded-2xl pointer-events-auto overflow-hidden transform transition-all duration-300 hover:scale-105 border-2',
            getToastStyle(toast.type)
          ]"
        >
          <!-- Contenu principal -->
          <div class="p-4">
            <div class="flex items-start gap-3">
              <!-- Icône moderne avec background -->
              <div :class="[
                'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ring-2 ring-white/50',
                getToastIconBg(toast.type)
              ]">
                <span class="text-xl">{{ getToastEmoji(toast.type) }}</span>
              </div>
              
              <!-- Contenu -->
              <div class="flex-1 min-w-0">
                <p :class="[
                  'text-sm font-bold',
                  getToastTextColor(toast.type)
                ]">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" :class="[
                  'mt-1 text-sm font-medium',
                  getToastSubTextColor(toast.type)
                ]">
                  {{ toast.message }}
                </p>
              </div>
              
              <!-- Bouton fermeture moderne -->
              <div class="flex-shrink-0">
                <button
                  @click="removeToast(toast.id)"
                  :class="[
                    'rounded-lg p-1.5 transition-all duration-200 hover:scale-110',
                    getToastCloseStyle(toast.type)
                  ]"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Barre de progression moderne -->
          <div v-if="toast.duration > 0" class="h-1.5 bg-black/5">
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

// Fonctions utilitaires pour les styles modernes
const getToastStyle = (type) => {
  const styles = {
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300',
    error: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300',
    warning: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300',
    info: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
  }
  return styles[type] || styles.info
}

const getToastIconBg = (type) => {
  const styles = {
    success: 'bg-gradient-to-br from-green-500 to-emerald-500',
    error: 'bg-gradient-to-br from-red-500 to-rose-500',
    warning: 'bg-gradient-to-br from-yellow-500 to-amber-500',
    info: 'bg-gradient-to-br from-blue-500 to-indigo-500'
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
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900'
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

const getToastCloseStyle = (type) => {
  const colors = {
    success: 'text-green-600 hover:bg-green-100 hover:text-green-800',
    error: 'text-red-600 hover:bg-red-100 hover:text-red-800',
    warning: 'text-yellow-600 hover:bg-yellow-100 hover:text-yellow-800',
    info: 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'
  }
  return colors[type] || colors.info
}

const getToastProgressColor = (type) => {
  const colors = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    error: 'bg-gradient-to-r from-red-500 to-rose-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500'
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