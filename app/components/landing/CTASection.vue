<template>
  <section id="waitlist" class="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-96 h-96 bg-blue-300/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
    </div>

    <div ref="contentRef" class="relative z-10 max-w-4xl mx-auto px-6 text-center opacity-0 translate-y-10 transition-all duration-700" :class="{ '!opacity-100 !translate-y-0': contentVisible }">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Places limitées</span>
      </div>

      <!-- Title -->
      <h2 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        Rejoins les étudiants qui
        <br />
        <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          s'organisent mieux
        </span>
      </h2>

      <!-- Subtitle -->
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
        Rejoins la bêta privée et sois parmi les premiers à découvrir StudyUp. Accès gratuit et prioritaire.
      </p>

      <!-- Email form -->
      <form @submit.prevent="handleSubmit" class="max-w-lg mx-auto mb-8">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            v-model="email"
            type="email"
            required
            placeholder="ton.email@exemple.com"
            class="flex-1 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
          <button
            type="submit"
            :disabled="isSubmitting"
            class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSubmitting" class="relative z-10 flex items-center justify-center gap-2">
              {{ submitText }}
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <span v-else class="relative z-10">
              <svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </form>

      <!-- Success message -->
      <transition name="fade">
        <div v-if="showSuccess" class="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl">
          <p class="text-green-700 dark:text-green-300 font-medium flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Merci ! Tu es inscrit à la bêta. Check tes emails 📧
          </p>
        </div>
      </transition>

      <!-- Trust badges -->
      <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Gratuit pendant la bêta</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Sans engagement</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Accès prioritaire</span>
        </div>
      </div>

      <!-- Social proof -->
      <div class="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
        <p class="text-gray-600 dark:text-gray-400 mb-4">Déjà 500+ étudiants inscrits 🎉</p>
        <div class="flex justify-center -space-x-2">
          <div v-for="i in 8" :key="i" class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {{ String.fromCharCode(65 + i) }}
          </div>
          <div class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs">
            +500
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const email = ref('')
const isSubmitting = ref(false)
const showSuccess = ref(false)
const submitText = ref('Rejoindre la bêta')

const contentRef = ref(null)
const contentVisible = ref(false)
const observer = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === contentRef.value) {
          contentVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  if (contentRef.value) observer.value.observe(contentRef.value)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

const handleSubmit = async () => {
  if (!email.value) return

  isSubmitting.value = true
  
  // Simulate API call (replace with real endpoint later)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Show success state
  showSuccess.value = true
  email.value = ''
  isSubmitting.value = false
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    showSuccess.value = false
  }, 5000)
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

@keyframes pulse-slow-delayed {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-pulse-slow-delayed {
  animation: pulse-slow-delayed 10s ease-in-out infinite;
  animation-delay: 1s;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
