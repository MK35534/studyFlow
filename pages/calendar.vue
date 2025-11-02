<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
    <!-- Header -->
    <div class="container mx-auto px-4 py-8">
      <NuxtLink to="/" class="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </NuxtLink>
    </div>

    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-12 md:py-20">
      <div class="text-center mb-12">
        <!-- Badge "Coming Soon" -->
        <div class="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
          <span class="relative flex h-3 w-3 mr-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span class="text-indigo-800 dark:text-indigo-300 font-semibold text-sm">Prochainement</span>
        </div>

        <!-- Titre -->
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Life Calendar
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
          Gère <span class="font-bold text-indigo-600 dark:text-indigo-400">toute ta vie</span> au même endroit
        </p>
        
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tes cours, tes devoirs, ton sport, tes loisirs... Un planning intelligent qui comprend que tu n'es pas qu'un élève.
        </p>
      </div>

      <!-- Preview mockup -->
      <div class="max-w-5xl mx-auto mb-16 relative">
        <!-- Glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-4">
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 class="text-2xl font-bold">Lundi 4 Novembre 2024</h2>
              <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div class="flex space-x-2">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Aujourd'hui
              </button>
            </div>
          </div>

          <!-- Time blocks -->
          <div class="space-y-1">
            <!-- Morning -->
            <div class="flex items-center space-x-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">08:00</span>
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="text-2xl mr-2">📖</span>
                  <div>
                    <p class="font-semibold">Mathématiques</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Cours • Salle 204</p>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">1h</span>
            </div>

            <div class="flex items-center space-x-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">09:00</span>
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="text-2xl mr-2">📖</span>
                  <div>
                    <p class="font-semibold">Physique-Chimie</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Cours • Salle 101</p>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">1h</span>
            </div>

            <!-- Free time -->
            <div class="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-gray-300 dark:border-gray-600 border-dashed hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">10:00</span>
              <div class="flex-1 flex items-center text-gray-500 dark:text-gray-400">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Ajouter une activité</span>
              </div>
            </div>

            <!-- Afternoon -->
            <div class="flex items-center space-x-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">17:00</span>
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="text-2xl mr-2">✍️</span>
                  <div>
                    <p class="font-semibold">DM Mathématiques</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Travail personnel • Ex 42-45</p>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">2h</span>
            </div>

            <div class="flex items-center space-x-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">19:00</span>
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="text-2xl mr-2">⚽</span>
                  <div>
                    <p class="font-semibold">Football</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Sport • Stade municipal</p>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">1h</span>
            </div>

            <div class="flex items-center space-x-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">21:00</span>
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="text-2xl mr-2">🎮</span>
                  <div>
                    <p class="font-semibold">Détente</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Loisirs</p>
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-500">1h</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Import automatique</h3>
          <p class="text-gray-600 dark:text-gray-400">Tes cours depuis Pronote sont automatiquement ajoutés. Tu n'as qu'à remplir le reste de ta journée.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Catégories intelligentes</h3>
          <p class="text-gray-600 dark:text-gray-400">Cours, devoirs, sport, loisirs... Visualise en un coup d'œil comment tu passes ton temps.</p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Statistiques détaillées</h3>
          <p class="text-gray-600 dark:text-gray-400">Découvre combien de temps tu passes réellement sur chaque activité. Optimise ton équilibre vie pro/perso.</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Bientôt disponible</h2>
        <p class="text-xl mb-8 opacity-90">On travaille dur pour te proposer la meilleure expérience de planning.</p>
        
        <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
          <div class="flex -space-x-2">
            <div class="w-8 h-8 bg-indigo-400 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold">📚</div>
            <div class="w-8 h-8 bg-purple-400 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold">⚽</div>
            <div class="w-8 h-8 bg-green-400 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold">🎮</div>
          </div>
          <span class="font-semibold">Cours + Sport + Loisirs = Équilibre parfait</span>
        </div>
      </div>

      <!-- Timeline -->
      <div class="mt-16 max-w-3xl mx-auto">
        <h3 class="text-2xl font-bold text-center mb-8">Roadmap</h3>
        <div class="space-y-4">
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 class="font-bold">Novembre 2025</h4>
              <p class="text-gray-600 dark:text-gray-400">Vue calendrier par jour • Ajout de blocs personnalisés</p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-sm">2</span>
            </div>
            <div>
              <h4 class="font-bold">Décembre 2025</h4>
              <p class="text-gray-600 dark:text-gray-400">Statistiques hebdomadaires • Templates de journée</p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-sm">3</span>
            </div>
            <div>
              <h4 class="font-bold">Janvier 2026</h4>
              <p class="text-gray-600 dark:text-gray-400">Suggestions intelligentes • Gamification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

useHead({
  title: 'Life Calendar - Bientôt disponible | StudyFlow',
  meta: [
    { name: 'description', content: 'Gère toute ta vie au même endroit : cours, devoirs, sport, loisirs. Le Life Calendar arrive bientôt sur StudyFlow.' }
  ]
});
</script>

<style scoped>
/* Animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
