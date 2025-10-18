<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
    <!-- Header avec dégradé animé -->
    <div :class="[
      'px-4 md:px-6 py-4 text-white transition-all duration-700',
      getHeaderColor()
    ]">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <div class="w-3 h-3 rounded-full bg-white bg-opacity-30 animate-pulse"></div>
          <h3 class="font-semibold text-sm md:text-base truncate">
            {{ currentSession.title }}
          </h3>
        </div>
        <div class="flex items-center space-x-2 flex-shrink-0">
          <span class="text-sm opacity-90">{{ currentCycle }}/4</span>
          <button
            @click="resetTimer"
            class="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title="Réinitialiser"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Timer central -->
    <div class="p-6 md:p-8 text-center">
      <!-- Cercle de progression SVG -->
      <div class="relative mx-auto mb-6 md:mb-8" style="width: 200px; height: 200px;">
        <svg class="transform -rotate-90 w-full h-full" viewBox="0 0 200 200">
          <!-- Cercle de fond -->
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            stroke-width="8"
            fill="none"
            class="text-gray-100 dark:text-gray-700 transition-colors duration-300"
          />
          <!-- Cercle de progression -->
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            stroke-width="8"
            fill="none"
            :class="getProgressColor()"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="transition-all duration-1000 ease-linear"
          />
          
          <!-- Décorations (points de progression) -->
          <circle
            v-for="i in 4"
            :key="i"
            :cx="100 + 90 * Math.cos((i * Math.PI / 2) - Math.PI / 2)"
            :cy="100 + 90 * Math.sin((i * Math.PI / 2) - Math.PI / 2)"
            r="3"
            :class="i === currentCycle ? getProgressColor() : 'text-gray-300 dark:text-gray-600'"
            fill="currentColor"
          />
        </svg>
        
        <!-- Temps au centre -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 font-mono tabular-nums transition-colors duration-300">
              {{ formatTime(timeLeft) }}
            </div>
            <div class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium transition-colors duration-300">
              {{ getStatusText() }}
            </div>
            <!-- Mini progress bar -->
            <div class="mt-3 w-32 mx-auto">
              <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                <div
                  :class="[
                    'h-full transition-all duration-1000 ease-linear rounded-full',
                    getProgressBgColor()
                  ]"
                  :style="{ width: `${progress}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles principaux -->
      <div class="flex justify-center space-x-3 md:space-x-4 mb-6">
        <button
          @click="toggleTimer"
          :class="[
            'px-6 md:px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg',
            isRunning ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          ]"
        >
          <span class="flex items-center space-x-2">
            <svg v-if="!isRunning" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
            <span class="text-sm md:text-base">{{ isRunning ? 'Pause' : 'Démarrer' }}</span>
          </span>
        </button>
        
        <button
          @click="skipSession"
          class="px-4 md:px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95"
        >
          <span class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span class="hidden md:inline text-sm">Passer</span>
          </span>
        </button>
      </div>

      <!-- Informations sur la session -->
      <div class="bg-gradient-to-r from-gray-50 dark:from-gray-800/50 to-gray-100 dark:to-gray-800 rounded-xl p-4 space-y-2 transition-colors duration-300">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Type de session
          </span>
          <span class="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {{ currentSession.type === 'focus' ? '🍅 Focus' : currentSession.type === 'short-break' ? '☕ Pause courte' : '🌴 Pause longue' }}
          </span>
        </div>
        
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Durée prévue
          </span>
          <span class="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ currentSession.duration }} minutes</span>
        </div>
        
        <div class="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <span class="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Progression
          </span>
          <span class="font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-300">{{ Math.round(progress) }}%</span>
        </div>
      </div>
    </div>

    <!-- Footer avec statistiques -->
    <div class="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 dark:from-gray-800/50 to-gray-100 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div class="grid grid-cols-3 gap-3 md:gap-4 text-center">
        <div class="p-2 bg-white dark:bg-gray-900/50 rounded-lg transition-colors duration-300">
          <div class="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{{ stats.completedSessions }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Sessions</div>
        </div>
        <div class="p-2 bg-white dark:bg-gray-900/50 rounded-lg transition-colors duration-300">
          <div class="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">{{ stats.focusTime }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Min focus</div>
        </div>
        <div class="p-2 bg-white dark:bg-gray-900/50 rounded-lg transition-colors duration-300">
          <div class="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">{{ stats.streak }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Série 🔥</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Props
const props = defineProps({
  assignment: {
    type: Object,
    default: null
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  focusDuration: {
    type: Number,
    default: 25
  },
  shortBreakDuration: {
    type: Number,
    default: 5
  },
  longBreakDuration: {
    type: Number,
    default: 15
  }
})

// Emits
const emit = defineEmits(['session-complete', 'cycle-complete', 'timer-start', 'timer-pause'])

// Configuration Pomodoro (dynamique via props)
const FOCUS_TIME = computed(() => props.focusDuration * 60)
const SHORT_BREAK = computed(() => props.shortBreakDuration * 60)
const LONG_BREAK = computed(() => props.longBreakDuration * 60)

// États réactifs
const isRunning = ref(false)
const timeLeft = ref(FOCUS_TIME.value)
const currentCycle = ref(1)
const currentSessionType = ref('focus') // 'focus', 'short-break', 'long-break'
const timerInterval = ref(null)

// Statistiques du jour
const stats = ref({
  completedSessions: 0,
  focusTime: 0,
  streak: 0
})

// Computed properties
const circumference = 2 * Math.PI * 90

const currentSession = computed(() => {
  const sessions = {
    focus: {
      title: props.assignment ? `Focus: ${props.assignment.title}` : 'Session de focus',
      duration: props.focusDuration,
      type: 'focus'
    },
    'short-break': {
      title: 'Pause courte',
      duration: props.shortBreakDuration,
      type: 'break'
    },
    'long-break': {
      title: 'Pause longue',
      duration: props.longBreakDuration,
      type: 'break'
    }
  }
  return sessions[currentSessionType.value]
})

const progress = computed(() => {
  const totalTime = currentSession.value.duration * 60
  return ((totalTime - timeLeft.value) / totalTime) * 100
})

const strokeDashoffset = computed(() => {
  const offset = circumference - (progress.value / 100) * circumference
  return offset
})

// Fonctions utilitaires
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getHeaderColor = () => {
  const colors = {
    focus: 'bg-gradient-to-r from-red-500 via-red-600 to-orange-500',
    'short-break': 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-500',
    'long-break': 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500'
  }
  return colors[currentSessionType.value]
}

const getProgressColor = () => {
  const colors = {
    focus: 'text-red-500',
    'short-break': 'text-green-500',
    'long-break': 'text-blue-500'
  }
  return colors[currentSessionType.value]
}

const getProgressBgColor = () => {
  const colors = {
    focus: 'bg-red-500',
    'short-break': 'bg-green-500',
    'long-break': 'bg-blue-500'
  }
  return colors[currentSessionType.value]
}

const getStatusText = () => {
  if (!isRunning.value) return 'En pause'
  
  const texts = {
    focus: 'Concentré(e) 💪',
    'short-break': 'Pause courte ☕',
    'long-break': 'Pause longue 🌴'
  }
  return texts[currentSessionType.value]
}

// Actions
const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  isRunning.value = true
  emit('timer-start')
  
  timerInterval.value = setInterval(() => {
    timeLeft.value--
    
    if (timeLeft.value <= 0) {
      completeSession()
    }
  }, 1000)
}

const pauseTimer = () => {
  isRunning.value = false
  emit('timer-pause')
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
}

const resetTimer = () => {
  pauseTimer()
  timeLeft.value = currentSession.value.duration * 60
}

const completeSession = () => {
  pauseTimer()
  
  // Mettre à jour les statistiques
  updateStats()
  
  // Notifications
  showNotification()
  playSound()
  
  // Émettre l'événement
  emit('session-complete', {
    type: currentSessionType.value,
    duration: currentSession.value.duration,
    cycle: currentCycle.value
  })
  
  // Passer à la session suivante
  nextSession()
}

const skipSession = () => {
  if (confirm('Êtes-vous sûr de vouloir passer cette session ?')) {
    pauseTimer()
    nextSession()
  }
}

const nextSession = () => {
  if (currentSessionType.value === 'focus') {
    // Après une session de focus
    if (currentCycle.value % 4 === 0) {
      currentSessionType.value = 'long-break'
      timeLeft.value = LONG_BREAK.value
    } else {
      currentSessionType.value = 'short-break'
      timeLeft.value = SHORT_BREAK.value
    }
  } else {
    // Après une pause, retour au focus
    currentSessionType.value = 'focus'
    timeLeft.value = FOCUS_TIME.value
    currentCycle.value++
    
    if (currentCycle.value > 4) {
      emit('cycle-complete', {
        totalSessions: 8,
        focusTime: 4 * props.focusDuration
      })
      currentCycle.value = 1
    }
  }
}

// Gestion des statistiques
const updateStats = () => {
  if (currentSessionType.value === 'focus') {
    stats.value.completedSessions++
    stats.value.focusTime += props.focusDuration
    stats.value.streak++
  }
  
  const today = new Date().toDateString()
  localStorage.setItem(`focus-stats-${today}`, JSON.stringify(stats.value))
}

const loadStats = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`focus-stats-${today}`)
  
  if (saved) {
    stats.value = JSON.parse(saved)
  }
}

// Notifications et son
const showNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const title = currentSessionType.value === 'focus' ? 
      '🍅 Session terminée !' : '☕ Pause terminée !'
    
    const body = currentSessionType.value === 'focus' ?
      'Bien joué ! Prends une petite pause.' :
      'C\'est reparti pour une session de focus !'
    
    new Notification(title, { body, icon: '/favicon.ico' })
  }
  
  const { success } = useToast()
  success(
    currentSessionType.value === 'focus' ? 'Session terminée !' : 'Pause terminée !',
    currentSessionType.value === 'focus' ? 'Temps de faire une pause 😊' : 'Prêt pour une nouvelle session 💪'
  )
}

const playSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('Audio not available')
  }
}

const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

// Watchers
watch(() => props.focusDuration, (newVal) => {
  if (currentSessionType.value === 'focus' && !isRunning.value) {
    timeLeft.value = newVal * 60
  }
})

// Lifecycle
onMounted(() => {
  loadStats()
  requestNotificationPermission()
  
  if (props.autoStart) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script>
