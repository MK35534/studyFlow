<template>
  <section class="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-6">
      <!-- Section header -->
      <div ref="headerRef" class="text-center mb-16 opacity-0 translate-y-10 transition-all duration-700" :class="{ '!opacity-100 !translate-y-0': headerVisible }">
        <span class="inline-block px-4 py-2 mb-4 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
          Le problème
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Trop d'outils,
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            pas assez de clarté
          </span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Tu jonglés entre Notion, Google Agenda, Todoist, et une dizaine d'autres apps juste pour suivre tes cours et devoirs.
        </p>
      </div>

      <!-- Problem cards -->
      <div ref="cardsRef" class="grid md:grid-cols-3 gap-6 mb-12 opacity-0 translate-y-10 transition-all duration-700 delay-200" :class="{ '!opacity-100 !translate-y-0': cardsVisible }">
        <div class="group p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-100 dark:border-red-800/30 hover:scale-105 transition-transform duration-300">
          <div class="w-12 h-12 mb-4 bg-red-500 rounded-xl flex items-center justify-center text-white text-2xl">
            😵
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Trop dispersé</h3>
          <p class="text-gray-600 dark:text-gray-300">Perdre du temps à switcher entre 5 apps différentes chaque jour.</p>
        </div>

        <div class="group p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-800/30 hover:scale-105 transition-transform duration-300">
          <div class="w-12 h-12 mb-4 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-2xl">
            😰
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Trop compliqué</h3>
          <p class="text-gray-600 dark:text-gray-300">Passer plus de temps à configurer qu'à travailler efficacement.</p>
        </div>

        <div class="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 hover:scale-105 transition-transform duration-300">
          <div class="w-12 h-12 mb-4 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
            😞
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Pas adapté</h3>
          <p class="text-gray-600 dark:text-gray-300">Aucun outil pensé spécifiquement pour les étudiants.</p>
        </div>
      </div>

      <!-- Solution statement -->
      <div class="relative p-8 md:p-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
        <!-- Decorative glow -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"></div>
        
        <div class="relative z-10 text-center">
          <div class="inline-block p-3 mb-4 bg-white/20 backdrop-blur-sm rounded-2xl">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Tu n'as pas besoin de dix outils pour t'organiser.
          </h3>
          <p class="text-xl text-white/90 font-medium">
            Un seul suffit. 🎯
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const headerRef = ref(null)
const cardsRef = ref(null)
const headerVisible = ref(false)
const cardsVisible = ref(false)

const observer = ref(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.value) {
            headerVisible.value = true
          } else if (entry.target === cardsRef.value) {
            cardsVisible.value = true
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  if (headerRef.value) observer.value.observe(headerRef.value)
  if (cardsRef.value) observer.value.observe(cardsRef.value)
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>
