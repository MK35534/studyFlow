<template>
  <title>StudyFlow - Mode Focus</title>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-6 md:mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Mode Focus 🎯</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base transition-colors duration-300">
            Booste ta productivité avec la technique Pomodoro
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Bouton guide -->
          <button
            @click="showGuide = true"
            class="px-3 md:px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center text-sm font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="hidden md:inline">Guide</span>
          </button>
          
          <!-- Statistiques rapides du jour -->
          <div class="flex gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4 transition-colors duration-300">
            <div class="text-center px-2 md:px-3">
              <div class="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ todayStats.sessions }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Sessions</div>
            </div>
            <div class="border-l border-gray-200 dark:border-gray-700"></div>
            <div class="text-center px-2 md:px-3">
              <div class="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{{ todayStats.focusMinutes }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Minutes</div>
            </div>
            <div class="border-l border-gray-200 dark:border-gray-700"></div>
            <div class="text-center px-2 md:px-3">
              <div class="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">{{ todayStats.streak }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Série</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal en grille responsive -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Timer principal - occupe 2 colonnes sur desktop -->
      <div class="lg:col-span-2 space-y-4 md:space-y-6">
        <!-- Sélection de tâche -->
        <FocusSessionSelector
          v-model:selectedAssignment="selectedAssignment"
          :assignments="assignments"
          :loading="loadingAssignments"
        />
        
        <!-- Timer Pomodoro -->
        <FocusTimer
          :assignment="selectedAssignment"
          :autoStart="false"
          @session-complete="handleSessionComplete"
          @cycle-complete="handleCycleComplete"
        />
        
        <!-- Contrôles rapides -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center transition-colors duration-300">
            <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Paramètres de session
          </h3>
          
          <div class="space-y-4">
            <!-- Durée focus -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Durée de focus (minutes)
              </label>
              <input
                type="range"
                v-model="settings.focusDuration"
                min="15"
                max="60"
                step="5"
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                <span>15 min</span>
                <span class="font-semibold text-blue-600 dark:text-blue-400">{{ settings.focusDuration }} min</span>
                <span>60 min</span>
              </div>
            </div>
            
            <!-- Durée pause courte -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                Durée pause courte (minutes)
              </label>
              <input
                type="range"
                v-model="settings.shortBreakDuration"
                min="3"
                max="10"
                step="1"
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-colors duration-300"
              />
              <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                <span>3 min</span>
                <span class="font-semibold text-green-600 dark:text-green-400 transition-colors duration-300">{{ settings.shortBreakDuration }} min</span>
                <span>10 min</span>
              </div>
            </div>
            
            <!-- Auto-démarrage pauses -->
            <div class="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Auto-démarrer pauses</span>
              </div>
              <button
                @click="settings.autoStartBreaks = !settings.autoStartBreaks"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.autoStartBreaks ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
            
            <!-- Notifications -->
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Notifications sonores</span>
              </div>
              <button
                @click="settings.soundNotifications = !settings.soundNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.soundNotifications ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.soundNotifications ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau latéral - 1 colonne sur desktop -->
      <div class="space-y-4 md:space-y-6">
        <!-- Sons d'ambiance -->
        <AmbientSound v-model:enabled="ambientSoundEnabled" />
        
        <!-- Historique des sessions d'aujourd'hui -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center transition-colors duration-300">
            <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Sessions d'aujourd'hui
          </h3>
          
          <div v-if="sessionHistory.length === 0" class="text-center py-8">
            <div class="text-gray-400 dark:text-gray-500 mb-2 transition-colors duration-300">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Aucune session terminée</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Lance ton premier Pomodoro !</p>
          </div>
          
          <div v-else class="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
            <div
              v-for="(session, index) in sessionHistory"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <div class="flex items-center space-x-3 flex-1 min-w-0">
                <div
                  :class="[
                    'w-2 h-2 rounded-full flex-shrink-0',
                    session.type === 'focus' ? 'bg-red-500 dark:bg-red-400' : 'bg-green-500 dark:bg-green-400'
                  ]"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate transition-colors duration-300">
                    {{ session.assignmentTitle || 'Session libre' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {{ session.type === 'focus' ? '🍅 Focus' : '☕ Pause' }} - {{ session.duration }} min
                  </p>
                </div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2 transition-colors duration-300">
                {{ formatTime(session.timestamp) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Conseils de productivité -->
        <div class="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-indigo-50 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 p-4 md:p-6 transition-colors duration-300">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center transition-colors duration-300">
            <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Conseil du jour
          </h3>
          <div class="bg-white dark:bg-gray-800/50 bg-opacity-50 rounded-lg p-3 transition-colors duration-300">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
              {{ currentTip }}
            </p>
          </div>
          <button
            @click="nextTip"
            class="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center transition-colors duration-300"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Conseil suivant
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal guide -->
    <FocusGuideModal :show="showGuide" @close="showGuide = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'desktop'
})

// États réactifs
const selectedAssignment = ref(null)
const assignments = ref([])
const loadingAssignments = ref(true)
const sessionHistory = ref([])
const ambientSoundEnabled = ref(false)
const currentTipIndex = ref(0)
const showGuide = ref(false)

// Paramètres personnalisables
const settings = ref({
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  soundNotifications: true
})

// Conseils de productivité
const productivityTips = [
  "💡 Élimine toutes les distractions avant de commencer une session de focus.",
  "🎯 Fixe-toi un objectif clair pour chaque session Pomodoro.",
  "💧 Profite des pauses pour t'hydrater et t'étirer.",
  "📱 Mets ton téléphone en mode silencieux pendant les sessions.",
  "🌿 Une courte marche pendant les pauses longues booste la créativité.",
  "✅ Commence par la tâche la plus difficile quand tu es le plus concentré.",
  "🧘 Prends 2-3 respirations profondes avant chaque session.",
  "📝 Note tes distractions sur papier pour y revenir plus tard.",
  "🎵 La musique instrumentale peut améliorer la concentration.",
  "⏰ Respecte les pauses, elles sont essentielles à ta productivité."
]

// Computed
const currentTip = computed(() => productivityTips[currentTipIndex.value])

const todayStats = computed(() => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`focus-stats-${today}`)
  
  if (saved) {
    const stats = JSON.parse(saved)
    return {
      sessions: stats.completedSessions || 0,
      focusMinutes: stats.focusTime || 0,
      streak: stats.streak || 0
    }
  }
  
  return {
    sessions: 0,
    focusMinutes: 0,
    streak: 0
  }
})

// Méthodes
const loadAssignments = async () => {
  try {
    if (typeof window === 'undefined') return
    
    loadingAssignments.value = true
    
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }

    const response = await $fetch('/api/assignments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Filtrer les devoirs non terminés
    assignments.value = (response.data || []).filter(a => !a.completed)
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
  } catch (error) {
    console.error('Erreur:', error)
    
    // Rediriger vers login si erreur 401
    if (error.response?.status === 401) {
      await navigateTo('/login')
      return
    }
    
    const { error: showError } = useToast()
    showError('Erreur', 'Impossible de charger les devoirs')
  } finally {
    loadingAssignments.value = false
  }
}

const handleSessionComplete = async (session) => {
  // Ajouter à l'historique
  sessionHistory.value.unshift({
    type: session.type,
    duration: session.duration,
    assignmentTitle: selectedAssignment.value?.title,
    timestamp: new Date()
  })
  
  // Garder seulement les 20 dernières sessions
  if (sessionHistory.value.length > 20) {
    sessionHistory.value = sessionHistory.value.slice(0, 20)
  }
  
  // Sauvegarder l'historique
  const today = new Date().toDateString()
  localStorage.setItem(`focus-history-${today}`, JSON.stringify(sessionHistory.value))
  
  // Sauvegarder dans la base de données
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    
    await $fetch('/api/focus/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        session_type: session.type,
        duration: session.duration,
        assignment_id: selectedAssignment.value?.id || null,
        completed_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur sauvegarde session:', error)
  }
}

const handleCycleComplete = (cycleData) => {
  const { success } = useToast()
  success(
    '🎉 Cycle Pomodoro terminé !',
    `Tu as complété ${cycleData.focusTime} minutes de focus intense`
  )
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const nextTip = () => {
  currentTipIndex.value = (currentTipIndex.value + 1) % productivityTips.length
}

const loadSessionHistory = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`focus-history-${today}`)
  
  if (saved) {
    sessionHistory.value = JSON.parse(saved)
  }
}

// Lifecycle
onMounted(() => {
  // Vérifier l'authentification avant tout
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (!token) {
      navigateTo('/login')
      return
    }
  }
  
  loadAssignments()
  loadSessionHistory()
  
  // Charger les paramètres sauvegardés
  const savedSettings = localStorage.getItem('focus-settings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
  
  // Afficher le guide à la première visite
  const hasSeenGuide = localStorage.getItem('focus-guide-seen')
  if (!hasSeenGuide) {
    showGuide.value = true
    localStorage.setItem('focus-guide-seen', 'true')
  }
  
  // Sauvegarder les paramètres à chaque changement
  watch(settings, (newSettings) => {
    localStorage.setItem('focus-settings', JSON.stringify(newSettings))
  }, { deep: true })
})
</script>
