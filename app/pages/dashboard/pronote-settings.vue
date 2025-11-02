<script setup>
definePageMeta({
  ssr: false,
  middleware: 'auth'
})

const { getToken } = useAuth()
const { theme } = useTheme()
const loading = ref(true)
const saving = ref(false)

// Fréquences disponibles avec icônes
const frequencies = [
  { 
    value: 'hourly', 
    label: 'Toutes les heures', 
    desc: 'Données toujours à jour',
    icon: defineComponent({
      template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`
    })
  },
  { 
    value: 'daily', 
    label: 'Une fois par jour', 
    desc: 'Synchronisation quotidienne',
    icon: defineComponent({
      template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
    })
  },
  { 
    value: 'manual', 
    label: 'Manuelle uniquement', 
    desc: 'Vous contrôlez quand synchroniser',
    icon: defineComponent({
      template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>`
    })
  }
]

// Configuration - propriétés individuelles
const syncHomework = ref(true)
const syncTimetable = ref(true)
const syncGrades = ref(false)
const autoSync = ref(true)
const syncFrequency = ref('daily')

// Charger la config au montage
onMounted(async () => {
  try {
    const token = getToken()
    const data = await $fetch('/api/pronote/config', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('=== DATA REÇUE ===', data)
    
    if (data?.config) {
      console.log('Config:', data.config)
      console.log('syncHomework:', data.config.syncHomework, typeof data.config.syncHomework)
      console.log('syncTimetable:', data.config.syncTimetable, typeof data.config.syncTimetable)
      console.log('autoSync:', data.config.autoSync, typeof data.config.autoSync)
      console.log('syncFrequency:', data.config.syncFrequency, typeof data.config.syncFrequency)
      
      syncHomework.value = data.config.syncHomework
      syncTimetable.value = data.config.syncTimetable
      syncGrades.value = data.config.syncGrades
      autoSync.value = data.config.autoSync
      syncFrequency.value = data.config.syncFrequency
      
      console.log('=== APRÈS ASSIGNATION ===')
      console.log('syncHomework.value:', syncHomework.value)
      console.log('syncTimetable.value:', syncTimetable.value)
      console.log('autoSync.value:', autoSync.value)
      console.log('syncFrequency.value:', syncFrequency.value)
    }
  } catch (err) {
    console.error('Erreur chargement:', err)
  } finally {
    // Toujours désactiver le loading à la fin
    loading.value = false
  }
})

// Sauvegarder
const save = async () => {
  saving.value = true
  try {
    const token = getToken()
    await $fetch('/api/pronote/config', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        syncHomework: syncHomework.value,
        syncTimetable: syncTimetable.value,
        syncGrades: syncGrades.value,
        autoSync: autoSync.value,
        syncFrequency: syncFrequency.value
      }
    })
    const { success } = useToast()
    success('Sauvegardé', 'Configuration mise à jour')
  } catch (err) {
    const { error } = useToast()
    error('Erreur', 'Impossible de sauvegarder')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header avec dégradé -->
    <div class="mb-8">
      <div class="relative">
        <div :class="`absolute inset-0 bg-gradient-to-r ${theme.gradientBg} rounded-2xl opacity-50 blur-3xl`"></div>
        <div class="relative flex items-center gap-4">
          <NuxtLink to="/dashboard/profile" :class="`p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border-2 ${theme.border}`">
            <svg class="w-5 h-5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              Configuration Pronote
            </h1>
            <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">
              Personnalisez votre synchronisation automatique
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu -->
    <div class="max-w-4xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Contenu principal -->
      <div v-else class="space-y-6">
        <!-- Données à synchroniser -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div :class="`p-2 bg-gradient-to-br ${theme.gradient} rounded-lg`">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Données à importer
            </h2>
          </div>
          
          <div class="space-y-3">
            <!-- Devoirs -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-transparent border border-purple-100 dark:border-purple-800">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-purple-500 rounded-xl shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">Devoirs</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Importés dans Assignments & Life Calendar</div>
                </div>
              </div>
              <button 
                @click="syncHomework = !syncHomework"
                :class="[
                  'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                  syncHomework ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600',
                  theme.focusRing
                ]"
              >
                <span
                  :class="[
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                    syncHomework ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>

            <!-- Emploi du temps -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-transparent border border-blue-100 dark:border-blue-800">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-blue-500 rounded-xl shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">Emploi du temps</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Affiché dans le Life Calendar</div>
                </div>
              </div>
              <button 
                @click="syncTimetable = !syncTimetable"
                :class="[
                  'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                  syncTimetable ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600',
                  theme.focusRing
                ]"
              >
                <span
                  :class="[
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                    syncTimetable ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>

            <!-- Notes -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 dark:from-gray-800/50 to-transparent border border-gray-200 dark:border-gray-700 opacity-60">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-gray-400 rounded-xl shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Notes
                    <span class="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">Bientôt</span>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Suivi des moyennes</div>
                </div>
              </div>
              <button 
                disabled
                class="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Fréquence de synchronisation -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div :class="`p-2 bg-gradient-to-br ${theme.gradient} rounded-lg`">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Synchronisation automatique
            </h2>
          </div>

          <div class="space-y-4">
            <!-- Toggle auto sync -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 dark:from-green-900/20 to-transparent border border-green-100 dark:border-green-800">
              <div class="flex items-center gap-4">
                <div :class="`p-3 bg-gradient-to-br ${theme.gradient} rounded-xl shadow-lg`">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">Mode automatique</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Mise à jour régulière des données</div>
                </div>
              </div>
              <button 
                @click="autoSync = !autoSync"
                :class="[
                  'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                  autoSync ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-300 dark:bg-gray-600',
                  theme.focusRing
                ]"
              >
                <span
                  :class="[
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                    autoSync ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>

            <!-- Fréquence options -->
            <div v-if="autoSync" class="pl-4 space-y-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Fréquence de mise à jour</p>
              
              <label 
                v-for="freq in frequencies" 
                :key="freq.value"
                :class="[
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2',
                  syncFrequency === freq.value 
                    ? `${theme.border} bg-gradient-to-r ${theme.gradientBg}` 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                ]"
              >
                <div :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  syncFrequency === freq.value ? theme.border : 'border-gray-300 dark:border-gray-600'
                ]">
                  <div 
                    v-if="syncFrequency === freq.value" 
                    :class="`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${theme.gradient}`"
                  ></div>
                </div>
                <input 
                  v-model="syncFrequency" 
                  type="radio" 
                  :value="freq.value"
                  class="sr-only"
                />
                <div class="flex-1">
                  <div :class="['font-medium', syncFrequency === freq.value ? theme.text : 'text-gray-900 dark:text-white']">
                    {{ freq.label }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ freq.desc }}</div>
                </div>
                <component :is="freq.icon" :class="[
                  'w-5 h-5',
                  syncFrequency === freq.value ? theme.text : 'text-gray-400'
                ]" />
              </label>
            </div>
          </div>
        </div>

        <!-- Bouton sauvegarder -->
        <div class="sticky bottom-6">
          <button
            @click="save"
            :disabled="saving"
            :class="[
              'w-full px-6 py-4 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg',
              `bg-gradient-to-r ${theme.gradient} hover:scale-[1.02]`
            ]"
          >
            <svg v-if="!saving" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div v-else class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            {{ saving ? 'Enregistrement...' : 'Enregistrer la configuration' }}
          </button>
        </div>

        <!-- Info -->
        <div :class="`bg-gradient-to-r ${theme.gradientBg} rounded-2xl p-6 border-2 ${theme.border}`">
          <div class="flex gap-4">
            <div :class="`p-3 bg-gradient-to-br ${theme.gradient} rounded-xl shadow-lg flex-shrink-0`">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p :class="`font-bold text-lg mb-2 ${theme.text}`">Comment ça marche ?</p>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Les <strong>devoirs</strong> apparaissent dans Assignments et Life Calendar</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>L'<strong>emploi du temps</strong> s'affiche automatiquement dans Life Calendar</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Vos identifiants restent <strong>cryptés et sécurisés</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
