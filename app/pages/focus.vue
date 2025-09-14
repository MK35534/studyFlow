<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header minimaliste -->
    <div class="flex justify-between items-center p-6">
      <NuxtLink to="/" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour au dashboard
      </NuxtLink>
      
      <div class="flex items-center space-x-4">
        <!-- Sélecteur de devoir -->
        <select
          v-model="selectedAssignmentId"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="changeAssignment"
        >
          <option value="">Mode focus libre</option>
          <option v-for="assignment in availableAssignments" :key="assignment.id" :value="assignment.id">
            {{ assignment.title }} ({{ assignment.subject_name }})
          </option>
        </select>
        
        <!-- Toggle mode sombre -->
        <button
          @click="toggleDarkMode"
          class="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white hover:bg-opacity-50 transition-colors"
        >
          <svg v-if="!darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-4xl mx-auto px-6 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Timer Pomodoro -->
        <div class="lg:col-span-1">
          <PomodoroTimer
            :assignment="selectedAssignment"
            :auto-start="false"
            @session-complete="onSessionComplete"
            @cycle-complete="onCycleComplete"
          />
        </div>
        
        <!-- Informations et outils -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Devoir sélectionné -->
          <div v-if="selectedAssignment" class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-start space-x-4">
              <div
                class="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                :style="{ backgroundColor: selectedAssignment.subject_color }"
              ></div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ selectedAssignment.title }}
                </h3>
                <p class="text-sm text-gray-600 mb-3">
                  {{ selectedAssignment.subject_name }} • 
                  Échéance: {{ formatDueDate(selectedAssignment.due_date) }}
                </p>
                <div v-if="selectedAssignment.description" class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                  {{ selectedAssignment.description }}
                </div>
              </div>
            </div>
            
            <!-- Actions rapides -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                @click="markAsCompleted"
                :disabled="selectedAssignment.is_completed"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-animate"
              >
                {{ selectedAssignment.is_completed ? '✅ Terminé' : 'Marquer comme terminé' }}
              </button>
            </div>
          </div>
          
          <!-- Tips et conseils -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
              <span class="text-xl mr-2">💡</span>
              Conseils pour bien se concentrer
            </h4>
            <ul class="space-y-3 text-sm text-gray-700">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                Élimine toutes les distractions (téléphone, réseaux sociaux)
              </li>
              <li class="flex items-start">
                <span class="text-blue-500 mr-2">•</span>
                Prépare tout le matériel nécessaire avant de commencer
              </li>
              <li class="flex items-start">
                <span class="text-purple-500 mr-2">•</span>
                Reste hydraté et prends de vraies pauses
              </li>
              <li class="flex items-start">
                <span class="text-orange-500 mr-2">•</span>
                Un environnement calme améliore la concentration
              </li>
            </ul>
          </div>
          
          <!-- Musique de concentration -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
              <span class="text-xl mr-2">🎵</span>
              Musique de concentration
            </h4>
            <div class="space-y-2">
              <a
                href="https://www.youtube.com/results?search_query=lofi+study+music"
                target="_blank"
                class="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                🎶 Lofi Hip Hop - Musique d'étude
              </a>
              <a
                href="https://www.youtube.com/results?search_query=classical+study+music"
                target="_blank"
                class="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                🎼 Musique classique - Concentration
              </a>
              <a
                href="https://www.youtube.com/results?search_query=nature+sounds+study"
                target="_blank"
                class="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                🌿 Sons de la nature - Relaxation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Cette page n'utilise pas le layout par défaut
definePageMeta({
  layout: false
})

import { ref, computed, onMounted, nextTick } from 'vue'
import PomodoroTimer from '~/components/PomodoroTimer.vue'

// États réactifs
const assignments = ref([])
const subjects = ref([])
const selectedAssignmentId = ref('')
const darkMode = ref(false)

// Computed
const selectedAssignment = computed(() => {
  if (!selectedAssignmentId.value) return null
  return assignments.value.find(a => a.id === parseInt(selectedAssignmentId.value))
})

const availableAssignments = computed(() => {
  return assignments.value.filter(a => !a.is_completed)
})

// Méthodes
async function loadData() {
  if (typeof window === 'undefined') return
  
  const token = localStorage.getItem('token')
  if (!token) {
    await navigateTo('/login')
    return
  }
  
  try {
    // Charger les devoirs et matières
    const [assignmentsResponse, subjectsResponse] = await Promise.all([
      $fetch('/api/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      $fetch('/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    
    assignments.value = assignmentsResponse.data || []
    subjects.value = subjectsResponse.data || []
    
    // Auto-sélectionner le premier devoir urgent
    const urgentAssignment = assignments.value.find(a => {
      if (a.is_completed) return false
      const dueDate = new Date(a.due_date)
      const today = new Date()
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 2 // Urgent dans les 2 prochains jours
    })
    
    if (urgentAssignment) {
      selectedAssignmentId.value = urgentAssignment.id.toString()
    }
    
  } catch (error) {
    console.error('Erreur chargement données focus:', error)
    if (error.status === 401) {
      await navigateTo('/login')
    }
  }
}

function changeAssignment() {
  // Logique optionnelle lors du changement
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
}

async function markAsCompleted() {
  if (!selectedAssignment.value || selectedAssignment.value.is_completed) return
  
  try {
    const token = localStorage.getItem('token')
    await $fetch(`/api/assignments/${selectedAssignment.value.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { is_completed: true }
    })
    
    // Mettre à jour localement
    const assignmentIndex = assignments.value.findIndex(a => a.id === selectedAssignment.value.id)
    if (assignmentIndex !== -1) {
      assignments.value[assignmentIndex].is_completed = true
    }
    
    const { success } = useToast()
    success('Félicitations ! 🎉', `"${selectedAssignment.value.title}" terminé avec succès`)
    
  } catch (error) {
    console.error('Erreur marquer comme terminé:', error)
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de marquer le devoir comme terminé')
  }
}

function formatDueDate(dateString) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(dateString))
}

// Événements du timer
function onSessionComplete(sessionData) {
  console.log('Session terminée:', sessionData)
}

function onCycleComplete(cycleData) {
  const { success } = useToast()
  success('Cycle Pomodoro terminé ! 🍅', `${cycleData.focusTime} minutes de concentration pure`)
}

// Lifecycle
onMounted(() => {
  nextTick(() => {
    loadData()
  })
})
</script>

<style>

</style>