<template>
  <div>
    <!-- Header avec bouton d'ajout -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Mes devoirs</h1>
        <p class="text-gray-600 mt-2">Organise et suit tes devoirs par matière</p>
      </div>
      <button 
        @click="showAddForm = true"
        :disabled="loading || subjects.length === 0"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un devoir
      </button>
    </div>

    <!-- Message si pas de matières -->
    <div v-if="subjects.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.854-.833-2.5 0l-5.898 8.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Tu dois d'abord créer des matières pour pouvoir ajouter des devoirs.
            <NuxtLink to="/subjects" class="font-medium underline hover:text-yellow-600">
              Créer des matières
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire d'ajout (conditionnel) -->
    <div v-if="showAddForm" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouveau devoir</h3>
      <form @submit.prevent="addAssignment" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Titre du devoir
          </label>
          <input
            type="text"
            id="title"
            v-model="newAssignment.title"
            placeholder="Ex: Exercices chapitre 5, Dissertation sur..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
            Matière
          </label>
          <select
            id="subject"
            v-model="newAssignment.subject_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choisir une matière</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
            Date d'échéance
          </label>
          <input
            type="date"
            id="due_date"
            v-model="newAssignment.due_date"
            :min="today"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description (optionnel)
          </label>
          <textarea
            id="description"
            v-model="newAssignment.description"
            rows="3"
            placeholder="Détails, consignes, pages à faire..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Création...' : 'Créer le devoir' }}
          </button>
          <button
            type="button"
            @click="cancelAdd"
            :disabled="loading"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Filtres -->
    <div class="flex space-x-4 mb-6">
      <button
        @click="currentFilter = 'all'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'all'
            ? 'bg-blue-100 text-blue-700 border border-blue-300'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        ]"
      >
        Tous ({{ assignments.length }})
      </button>
      <button
        @click="currentFilter = 'pending'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'pending'
            ? 'bg-orange-100 text-orange-700 border border-orange-300'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        ]"
      >
        À faire ({{ pendingAssignments.length }})
      </button>
      <button
        @click="currentFilter = 'completed'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'completed'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        ]"
      >
        Terminés ({{ completedAssignments.length }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && assignments.length === 0" class="text-center py-8">
      <p class="text-gray-500">Chargement des devoirs...</p>
    </div>

    <!-- Liste des devoirs -->
    <div v-else-if="filteredAssignments.length > 0" class="space-y-4">
      <div 
        v-for="assignment in filteredAssignments" 
        :key="assignment.id"
        :class="[
          'bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow',
          assignment.is_completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-4 flex-1">
            <!-- Checkbox -->
            <button
              @click="toggleAssignment(assignment)"
              :disabled="loading"
              class="mt-1"
            >
              <svg 
                :class="[
                  'w-6 h-6 transition-colors',
                  assignment.is_completed 
                    ? 'text-green-600' 
                    : 'text-gray-400 hover:text-green-500'
                ]"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  v-if="assignment.is_completed"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <circle 
                  v-else
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke-width="2"
                />
              </svg>
            </button>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-2">
                <h3 :class="[
                  'text-lg font-semibold',
                  assignment.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'
                ]">
                  {{ assignment.title }}
                </h3>
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: getSubjectColor(assignment.subject_id) }"
                  />
                  <span class="text-sm text-gray-600">{{ getSubjectName(assignment.subject_id) }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span :class="getDueDateClass(assignment.due_date)">
                    {{ formatDueDate(assignment.due_date) }}
                  </span>
                </div>
              </div>

              <p v-if="assignment.description" :class="[
                'text-sm',
                assignment.is_completed ? 'text-gray-400' : 'text-gray-700'
              ]">
                {{ assignment.description }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <button
            @click="deleteAssignment(assignment.id)"
            :disabled="loading"
            class="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ currentFilter === 'completed' ? 'Aucun devoir terminé' : 
           currentFilter === 'pending' ? 'Aucun devoir à faire' : 'Aucun devoir' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ currentFilter === 'all' ? 'Commence par ajouter ton premier devoir !' : 
           'Change de filtre pour voir d\'autres devoirs.' }}
      </p>
      <button 
        v-if="currentFilter === 'all' && subjects.length > 0"
        @click="showAddForm = true"
        :disabled="loading"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        Ajouter mon premier devoir
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'

// Données réactives
const assignments = ref([])
const subjects = ref([])
const showAddForm = ref(false)
const loading = ref(false)
const currentFilter = ref('all')

const newAssignment = reactive({
  title: '',
  subject_id: '',
  due_date: '',
  description: ''
})

// Date d'aujourd'hui pour le minimum du date picker
const today = new Date().toISOString().split('T')[0]

// Computed properties pour les filtres
const pendingAssignments = computed(() => 
  assignments.value.filter(a => !a.is_completed)
)

const completedAssignments = computed(() => 
  assignments.value.filter(a => a.is_completed)
)

const filteredAssignments = computed(() => {
  switch (currentFilter.value) {
    case 'pending':
      return pendingAssignments.value
    case 'completed':
      return completedAssignments.value
    default:
      return assignments.value
  }
})

// Fonctions utilitaires
function getSubjectName(subjectId) {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

function getSubjectColor(subjectId) {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject ? subject.color : '#6B7280'
}

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
    return 'text-red-600 font-medium' // En retard
  } else if (diffDays <= 1) {
    return 'text-orange-600 font-medium' // Urgent
  } else if (diffDays <= 3) {
    return 'text-yellow-600' // Bientôt
  }
  return 'text-gray-600' // Normal
}

// Fonctions API (à implémenter)
async function loadData() {
  await Promise.all([loadSubjects(), loadAssignments()])
}

async function loadSubjects() {
  try {
    if (typeof window === 'undefined') return
    
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }
    
    const response = await $fetch('/api/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    subjects.value = response.data || []
  } catch (error) {
    console.error('Erreur chargement matières:', error)
  }
}

async function loadAssignments() {
  try {
    if (typeof window === 'undefined') return
    loading.value = true
    
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }
    
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    assignments.value = response.data || []
  } catch (error) {
    console.error('Erreur chargement devoirs:', error)
    if (error.status === 401) {
      localStorage.removeItem('token')
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

async function addAssignment() {
  if (!newAssignment.title.trim() || !newAssignment.subject_id || !newAssignment.due_date) return
  
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    const response = await $fetch('/api/assignments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: newAssignment.title.trim(),
        subject_id: parseInt(newAssignment.subject_id),
        due_date: newAssignment.due_date,
        description: newAssignment.description.trim()
      }
    })
    
    if (response.success) {
      assignments.value.unshift(response.data)
      
      // Reset du formulaire
      newAssignment.title = ''
      newAssignment.subject_id = ''
      newAssignment.due_date = ''
      newAssignment.description = ''
      showAddForm.value = false
    }
  } catch (error) {
    console.error('Erreur création devoir:', error)
    alert('Erreur lors de la création du devoir')
  } finally {
    loading.value = false
  }
}

async function toggleAssignment(assignment) {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    const response = await $fetch(`/api/assignments/${assignment.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        is_completed: !assignment.is_completed
      }
    })
    
    if (response.success) {
      assignment.is_completed = !assignment.is_completed
    }
  } catch (error) {
    console.error('Erreur toggle devoir:', error)
    alert('Erreur lors de la mise à jour du devoir')
  } finally {
    loading.value = false
  }
}

async function deleteAssignment(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) return
  
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    await $fetch(`/api/assignments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    assignments.value = assignments.value.filter(a => a.id !== id)
  } catch (error) {
    console.error('Erreur suppression devoir:', error)
    alert('Erreur lors de la suppression du devoir')
  } finally {
    loading.value = false
  }
}

function cancelAdd() {
  newAssignment.title = ''
  newAssignment.subject_id = ''
  newAssignment.due_date = ''
  newAssignment.description = ''
  showAddForm.value = false
}

// Charger les données au montage
onMounted(() => {
  nextTick(() => {
    loadData()
  })
})
</script>