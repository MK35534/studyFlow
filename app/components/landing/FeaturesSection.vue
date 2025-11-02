<template>
  <section id="features" class="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Section header -->
      <div ref="headerRef" class="text-center mb-20 opacity-0 translate-y-10 transition-all duration-700" :class="{ '!opacity-100 !translate-y-0': headerVisible }">
        <span class="inline-block px-4 py-2 mb-4 text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-full">
          Fonctionnalités
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Tout ce dont tu as besoin,
          <br />
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            rien de superflu
          </span>
        </h2>
      </div>

      <!-- Features grid -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Feature 1 -->
        <div 
          ref="feature1Ref"
          class="group feature-card p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-500 opacity-0 translate-x-10"
          :class="{ '!opacity-100 !translate-x-0': feature1Visible }"
          :style="{ transitionDelay: '100ms' }"
          @mouseenter="activeFeature = 1"
          @mouseleave="activeFeature = null"
        >
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              📚
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Organise tes cours et devoirs simplement
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Centralise tous tes devoirs, notes et sessions d'étude dans un seul endroit. Fini les oublis et le stress de dernière minute.
              </p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Vue calendrier intuitive</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Gestion par matière avec couleurs</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Deadlines et priorités claires</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Feature 2 -->
        <div 
          ref="feature2Ref"
          class="group feature-card p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-2xl transition-all duration-500 opacity-0 -translate-x-10"
          :class="{ '!opacity-100 !translate-x-0': feature2Visible }"
          :style="{ transitionDelay: '200ms' }"
          @mouseenter="activeFeature = 2"
          @mouseleave="activeFeature = null"
        >
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              📅
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Planifie tes sessions sans stress
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Crée des blocs de travail adaptés à ton rythme. Visualise ta semaine d'un coup d'œil et reste motivé.
              </p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Planification intelligente</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Vue semaine complète</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Statistiques de progression</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Feature 3 -->
        <div 
          ref="feature3Ref"
          class="group feature-card p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-2xl transition-all duration-500 opacity-0 translate-x-10"
          :class="{ '!opacity-100 !translate-x-0': feature3Visible }"
          :style="{ transitionDelay: '300ms' }"
          @mouseenter="activeFeature = 3"
          @mouseleave="activeFeature = null"
        >
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              🎯
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Reste concentré avec le mode Focus
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Lance une session de travail immersive avec timer Pomodoro, sons d'ambiance et suivi de temps automatique.
              </p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Timer Pomodoro intégré</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sons d'ambiance relaxants</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Suivi automatique du temps</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Feature 4 -->
        <div 
          ref="feature4Ref"
          class="group feature-card p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-2xl transition-all duration-500 opacity-0 -translate-x-10"
          :class="{ '!opacity-100 !translate-x-0': feature4Visible }"
          :style="{ transitionDelay: '400ms' }"
          @mouseenter="activeFeature = 4"
          @mouseleave="activeFeature = null"
        >
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              🔄
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Synchronise ton emploi du temps Pronote
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Importe automatiquement tes devoirs et ton emploi du temps depuis Pronote. Tout est synchronisé en temps réel.
              </p>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Import automatique Pronote</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sync en temps réel</span>
                </li>
                <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Compatible tous ENT</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeFeature = ref(null)
const headerRef = ref(null)
const feature1Ref = ref(null)
const feature2Ref = ref(null)
const feature3Ref = ref(null)
const feature4Ref = ref(null)

const headerVisible = ref(false)
const feature1Visible = ref(false)
const feature2Visible = ref(false)
const feature3Visible = ref(false)
const feature4Visible = ref(false)

const observer = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.value) headerVisible.value = true
          else if (entry.target === feature1Ref.value) feature1Visible.value = true
          else if (entry.target === feature2Ref.value) feature2Visible.value = true
          else if (entry.target === feature3Ref.value) feature3Visible.value = true
          else if (entry.target === feature4Ref.value) feature4Visible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  if (headerRef.value) observer.value.observe(headerRef.value)
  if (feature1Ref.value) observer.value.observe(feature1Ref.value)
  if (feature2Ref.value) observer.value.observe(feature2Ref.value)
  if (feature3Ref.value) observer.value.observe(feature3Ref.value)
  if (feature4Ref.value) observer.value.observe(feature4Ref.value)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})
</script>

<style scoped>
.feature-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
}
</style>
