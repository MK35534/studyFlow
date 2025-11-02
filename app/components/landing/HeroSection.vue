<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
    <!-- Animated background circles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm animate-fade-in">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Actuellement en bêta</span>
      </div>

      <!-- Main title with gradient -->
      <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
        <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Planifie intelligemment,
        </span>
        <br />
        <span class="text-gray-900 dark:text-white">
          progresse sereinement.
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up-delayed leading-relaxed">
        L'app qui aide les étudiants à gagner du temps et à rester constants dans leur travail.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delayed">
        <button 
          @click="scrollToWaitlist"
          class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <span class="relative z-10 flex items-center gap-2">
            Rejoindre la bêta
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        <button 
          @click="scrollToFeatures"
          class="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 transition-all duration-300"
        >
          Découvrir les fonctionnalités
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-fade-in-delayed-2">
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">500+</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Étudiants inscrits</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">10k+</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Devoirs organisés</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">95%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">De satisfaction</div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollToWaitlist = () => {
  const element = document.getElementById('waitlist')
  element?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToFeatures = () => {
  const element = document.getElementById('features')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-fade-in-delayed {
  animation: fade-in 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-fade-in-delayed-2 {
  animation: fade-in 0.8s ease-out 0.6s forwards;
  opacity: 0;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-slide-up-delayed {
  animation: slide-up 0.8s ease-out 0.2s forwards;
  opacity: 0;
}
</style>
