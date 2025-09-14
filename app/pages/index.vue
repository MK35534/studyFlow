<template>
  <div>
    <title>StudyFlow - Tableau de bord</title>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
      <p class="text-gray-600 mt-2">Bienvenue sur StudyFlow, {{ userName }}</p>
    </div>

    <!-- Statistiques détaillées -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Stats existantes + nouvelle -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ stats.completionRate }}%</p>
            <p class="text-gray-600 text-sm">Taux de réussite</p>
          </div>
        </div>
      </div>
      
      <!-- ... autres stats existantes -->
      <!-- Stats rapides -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalSubjects }}</p>
              <p class="text-gray-600 text-sm">Matières</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ stats.completedAssignments }}</p>
            <p class="text-gray-600 text-sm">Devoirs terminés</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ stats.pendingAssignments }}</p>
            <p class="text-gray-600 text-sm">À faire</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900">{{ stats.thisWeekAssignments }}</p>
            <p class="text-gray-600 text-sm">Cette semaine</p>
          </div>
        </div>

    </div>

    </div>

    <!-- Prochains devoirs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">Devoirs urgents</h2>
        <NuxtLink 
          to="/assignments" 
          class="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          Voir tous →
        </NuxtLink>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center text-gray-500 py-4">
          <p>Chargement...</p>
        </div>
        <div v-else-if="urgentAssignments.length > 0" class="space-y-4">
          <div 
            v-for="assignment in urgentAssignments" 
            :key="assignment.id"
            class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: assignment.subject_color }"
              />
              <div>
                <p class="font-medium text-gray-900">{{ assignment.title }}</p>
                <p class="text-sm text-gray-600">{{ assignment.subject_name }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="getDueDateClass(assignment.due_date)" class="text-sm font-medium">
                {{ formatDueDate(assignment.due_date) }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mb-2">Aucun devoir urgent</p>
          <p class="text-sm">Tous tes devoirs sont sous contrôle ! 🎉</p>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div class="space-y-3">
          <NuxtLink
            to="/assignments"
            class="flex items-center p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un devoir
          </NuxtLink>
          
          <NuxtLink
            to="/subjects"
            class="flex items-center p-3 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Gérer mes matières
          </NuxtLink>

          <NuxtLink
            to="/calendar"
            class="flex items-center p-3 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>

            Voir le calendrier
          </NuxtLink>

          <NuxtLink
            to="/focus"
            class="flex items-center p-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mode Focus
          </NuxtLink>
        </div>
      </div>

      <!-- Matières avec le plus de devoirs -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Matières actives</h3>
        <div v-if="subjectStats.length > 0" class="space-y-3">
          <div 
            v-for="subject in subjectStats" 
            :key="subject.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: subject.color }"
              />
              <span class="text-gray-900">{{ subject.name }}</span>
            </div>
            <span class="text-sm text-gray-600">
              {{ subject.pending_count }} en cours
            </span>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          <p class="text-sm">Aucune matière avec des devoirs en cours</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// Données réactives
const assignments = ref([])
const subjects = ref([])
const loading = ref(false)
const userName = ref('')

// Stats calculées
const stats = computed(() => {
  const today = new Date()
  const weekEnd = new Date(today)
  const total = assignments.value.length
  const completed = assignments.value.filter(a => a.is_completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  weekEnd.setDate(today.getDate() + 7)
  
  const thisWeekCount = assignments.value.filter(a => {
    const dueDate = new Date(a.due_date)
    return !a.is_completed && dueDate >= today && dueDate <= weekEnd
  }).length

  return {
    totalSubjects: subjects.value.length,
    completedAssignments: assignments.value.filter(a => a.is_completed).length,
    pendingAssignments: assignments.value.filter(a => !a.is_completed).length,
    thisWeekAssignments: thisWeekCount,
    completionRate,
    totalAssignments: total
  }
})

// Devoirs urgents (dans les 3 prochains jours)
const urgentAssignments = computed(() => {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000))
  
  return assignments.value
    .filter(a => !a.is_completed && new Date(a.due_date) <= threeDaysFromNow)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5) // Max 5 devoirs
})

// Stats par matière
const subjectStats = computed(() => {
  const stats = subjects.value.map(subject => {
    const pendingCount = assignments.value.filter(a => 
      a.subject_id === subject.id && !a.is_completed
    ).length
    
    return {
      ...subject,
      pending_count: pendingCount
    }
  })
  
  return stats
    .filter(s => s.pending_count > 0)
    .sort((a, b) => b.pending_count - a.pending_count)
    .slice(0, 5)
})

// Fonctions utilitaires
function formatDueDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain"
  } else {
    return new Intl.DateTimeFormat('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(date)
  }
}

function getDueDateClass(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'text-red-600' // En retard
  } else if (diffDays <= 1) {
    return 'text-orange-600' // Urgent
  } else if (diffDays <= 3) {
    return 'text-yellow-600' // Bientôt
  }
  return 'text-gray-600' // Normal
}

// Fonctions de chargement des données
async function loadData() {
  if (typeof window === 'undefined') return
  
  const token = localStorage.getItem('token')
  if (!token) {
    await navigateTo('/login')
    return
  }
  
  // Récupérer le nom de l'utilisateur
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = user.firstname || 'lycéen'
  
  await Promise.all([loadSubjects(), loadAssignments()])
}

async function loadSubjects() {
  try {
    console.log('=== CHARGEMENT MATIÈRES DASHBOARD ===')
    const token = localStorage.getItem('token')
    console.log('Token présent:', !!token)
    
    if (!token) {
      console.log('Pas de token, redirection')
      await navigateTo('/login')
      return
    }
    
    console.log('Envoi requête subjects...')
    const response = await $fetch('/api/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Réponse subjects:', response)
    subjects.value = response.data || []
    console.log('Matières chargées:', subjects.value.length)
  } catch (error) {
    console.error('=== ERREUR MATIÈRES ===')
    console.error('Type:', error.constructor.name)
    console.error('Message:', error.message)
    console.error('Status:', error.status || error.statusCode)
    console.error('Full error:', error)
  }
}

async function loadAssignments() {
  try {
    loading.value = true
    console.log('=== CHARGEMENT DEVOIRS DASHBOARD ===')
    const token = localStorage.getItem('token')
    
    console.log('Envoi requête assignments...')
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Réponse assignments:', response)
    assignments.value = response.data || []
    console.log('Devoirs chargés:', assignments.value.length)
  } catch (error) {
    console.error('=== ERREUR DEVOIRS ===')
    console.error('Type:', error.constructor.name)
    console.error('Message:', error.message)
    console.error('Status:', error.status || error.statusCode)
    console.error('Full error:', error)
    if (error.status === 401) {
      localStorage.removeItem('token')
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

// Charger les données au montage
onMounted(() => {
  nextTick(() => {
    loadData()
  })
})
</script>