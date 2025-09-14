<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div :class="[
      'px-6 py-4 text-white transition-colors duration-500',
      getHeaderColor()
    ]">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-white bg-opacity-30 animate-pulse"></div>
          <h3 class="font-semibold">
            {{ currentSession.title }}
          </h3>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm opacity-90">{{ currentCycle }}/4</span>
          <button
            @click="resetTimer"
            class="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Timer central -->
    <div class="p-8 text-center">
      <!-- Cercle de progression -->
      <div class="relative mx-auto mb-8" style="width: 200px; height: 200px;">
        <svg class="transform -rotate-90" width="200" height="200">
          <!-- Cercle de fond -->
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            stroke-width="8"
            fill="none"
            class="text-gray-200"
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
            class="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        <!-- Temps au centre -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 font-mono">
              {{ formatTime(timeLeft) }}
            </div>
            <div class="text-sm text-gray-600 mt-1">
              {{ getStatusText() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles -->
      <div class="flex justify-center space-x-4 mb-6">
        <button
          @click="toggleTimer"
          :class="[
            'px-8 py-3 rounded-lg font-semibold text-white transition-all btn-animate',
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          ]"
        >
          {{ isRunning ? '⏸️ Pause' : '▶️ Start' }}
        </button>
        
        <button
          @click="skipSession"
          class="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all btn-animate"
        >
          ⏭️ Skip
        </button>
      </div>

      <!-- Informations sur la session -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Session actuelle :</span>
          <span class="font-medium">{{ currentSession.type === 'focus' ? '🍅 Focus' : '☕ Pause' }}</span>
        </div>
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-gray-600">Temps prévu :</span>
          <span class="font-medium">{{ currentSession.duration }} min</span>
        </div>
      </div>
    </div>

    <!-- Statistiques du jour -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ stats.completedSessions }}</div>
          <div class="text-xs text-gray-600">Sessions</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ stats.focusTime }}</div>
          <div class="text-xs text-gray-600">Min focus</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600">{{ stats.streak }}</div>
          <div class="text-xs text-gray-600">Série</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  assignment: Object, // Le devoir sur lequel on se concentre
  autoStart: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['session-complete', 'cycle-complete', 'timer-start', 'timer-pause'])

// Configuration Pomodoro
const FOCUS_TIME = 25 * 60 // 25 minutes
const SHORT_BREAK = 5 * 60  // 5 minutes  
const LONG_BREAK = 15 * 60  // 15 minutes

// États réactifs
const isRunning = ref(false)
const timeLeft = ref(FOCUS_TIME)
const currentCycle = ref(1)
const currentSessionType = ref('focus') // 'focus', 'short-break', 'long-break'
const timerInterval = ref(null)

// Statistiques du jour (stockées en localStorage)
const stats = ref({
  completedSessions: 0,
  focusTime: 0,
  streak: 0
})

// Computed properties
const circumference = 2 * Math.PI * 90 // rayon de 90px

const currentSession = computed(() => {
  const sessions = {
    focus: {
      title: props.assignment ? `Focus: ${props.assignment.title}` : 'Session de focus',
      duration: 25,
      type: 'focus'
    },
    'short-break': {
      title: 'Pause courte',
      duration: 5,
      type: 'break'
    },
    'long-break': {
      title: 'Pause longue',
      duration: 15,
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
    focus: 'bg-gradient-to-r from-red-500 to-red-600',
    'short-break': 'bg-gradient-to-r from-green-500 to-green-600',
    'long-break': 'bg-gradient-to-r from-blue-500 to-blue-600'
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

const getStatusText = () => {
  if (!isRunning.value) return 'En pause'
  
  const texts = {
    focus: 'Concentré(e)',
    'short-break': 'Pause courte',
    'long-break': 'Pause longue'
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
    nextSession()
  }
}

const nextSession = () => {
  if (currentSessionType.value === 'focus') {
    // Après une session de focus
    if (currentCycle.value % 4 === 0) {
      // Pause longue après 4 cycles
      currentSessionType.value = 'long-break'
      timeLeft.value = LONG_BREAK
    } else {
      // Pause courte
      currentSessionType.value = 'short-break'
      timeLeft.value = SHORT_BREAK
    }
  } else {
    // Après une pause, retour au focus
    currentSessionType.value = 'focus'
    timeLeft.value = FOCUS_TIME
    currentCycle.value++
    
    if (currentCycle.value > 4) {
      // Cycle complet terminé
      emit('cycle-complete', {
        totalSessions: 8, // 4 focus + 4 pauses
        focusTime: 4 * 25 // 4 sessions de 25 min
      })
      currentCycle.value = 1
    }
  }
}

// Gestion des statistiques
const updateStats = () => {
  if (currentSessionType.value === 'focus') {
    stats.value.completedSessions++
    stats.value.focusTime += 25
    stats.value.streak++
  }
  
  // Sauvegarder dans localStorage
  const today = new Date().toDateString()
  localStorage.setItem(`pomodoro-stats-${today}`, JSON.stringify(stats.value))
}

const loadStats = () => {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(`pomodoro-stats-${today}`)
  
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
  
  // Toast de fallback
  const { success } = useToast()
  success(
    currentSessionType.value === 'focus' ? 'Session terminée !' : 'Pause terminée !',
    currentSessionType.value === 'focus' ? 'Temps de faire une pause' : 'Prêt pour une nouvelle session'
  )
}

const playSound = () => {
  // Son simple avec Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('Audio not available')
  }
}

// Demander permission pour notifications
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

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