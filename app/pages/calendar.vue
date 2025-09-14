<template>
  <div>
    <!-- Header avec navigation -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Calendrier</h1>
        <p class="text-gray-600 mt-2">Vue d'ensemble de tes devoirs</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Sélecteur de vue -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="currentView = 'month'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              currentView === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Mois
          </button>
          <button
            @click="currentView = 'week'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              currentView === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            Semaine
          </button>
        </div>
        
        <!-- Navigation mois/semaine -->
        <div class="flex items-center space-x-2">
          <button
            @click="navigatePrevious"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 class="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {{ currentPeriodTitle }}
          </h2>
          
          <button
            @click="navigateNext"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <!-- Bouton aujourd'hui -->
        <button
          @click="goToToday"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Aujourd'hui
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Chargement du calendrier...</p>
    </div>

    <!-- Vue mensuelle -->
    <div v-else-if="currentView === 'month'" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- En-têtes des jours -->
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div
          v-for="day in weekDays"
          :key="day"
          class="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Grille du calendrier -->
      <!-- Grille du calendrier -->
      <div class="grid grid-cols-7">
        <div
          v-for="day in calendarDays"
          :key="day.dateKey"
          :class="[
            'min-h-[120px] border-r border-b border-gray-200 p-2 transition-colors',
            !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white',
            day.isToday ? 'bg-blue-50' : '',
            'hover:bg-gray-50',
            dragOverDate === day.dateKey ? 'bg-blue-100 ring-2 ring-blue-300' : ''
          ]"
          @dragover="allowDrop"
          @dragenter="setDragOver(day.dateKey)"
          @dragleave="clearDragOver"
          @drop="handleDrop(day.date, $event)"
        >
          <!-- Numéro du jour -->
          <div class="flex justify-between items-start mb-2">
            <span
              :class="[
                'text-sm font-medium',
                !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900',
                day.isToday ? 'text-blue-600 font-bold' : ''
              ]"
            >
              {{ day.date.getDate() }}
            </span>
          </div>
          
          <!-- Devoirs du jour -->
          <div class="space-y-1">
            <div
              v-for="assignment in getAssignmentsForDay(day.date)"
              :key="assignment.id"
              :class="[
                'text-xs p-1 rounded truncate cursor-grab transition-all hover:shadow-md',
                assignment.is_completed 
                  ? 'bg-green-100 text-green-700 line-through cursor-not-allowed' 
                  : getDayAssignmentClass(assignment),
                draggedAssignment?.id === assignment.id ? 'opacity-50 scale-95' : ''
              ]"
              :style="{ borderLeft: `3px solid ${assignment.subject_color}` }"
              :draggable="!assignment.is_completed"
              @dragstart="startDrag(assignment, $event)"
              @dragend="endDrag"
              @click="openAssignmentModal(assignment)"
              :title="`${assignment.title} - ${assignment.subject_name}`"
            >
              {{ assignment.title }}
            </div>
            
            <!-- Indicateur de devoirs supplémentaires -->
            <div
              v-if="getAssignmentsForDay(day.date).length > 3"
              class="text-xs text-gray-500 font-medium"
            >
              +{{ getAssignmentsForDay(day.date).length - 3 }} autres...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue hebdomadaire -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- En-têtes des jours de la semaine -->
      <div class="grid grid-cols-8 border-b border-gray-200">
        <div class="p-4 bg-gray-50"></div> <!-- Colonne heures vide -->
        <div
          v-for="day in weekDays"
          :key="day"
          class="p-4 text-center bg-gray-50"
        >
          <div class="text-sm font-medium text-gray-700">{{ day }}</div>
          <div
            :class="[
              'text-lg font-semibold mt-1',
              isToday(getCurrentWeekDays()[weekDays.indexOf(day)]) 
                ? 'text-blue-600' 
                : 'text-gray-900'
            ]"
          >
            {{ getCurrentWeekDays()[weekDays.indexOf(day)].getDate() }}
          </div>
        </div>
      </div>
      
      <!-- Corps de la semaine -->
      <div class="grid grid-cols-8">
        <!-- Colonne des heures -->
        <div class="border-r border-gray-200">
          <div
            v-for="hour in timeSlots"
            :key="hour"
            class="h-16 border-b border-gray-200 p-2 text-xs text-gray-500 bg-gray-50"
          >
            {{ hour }}
          </div>
        </div>
        
        <!-- Colonnes des jours -->
        <div
          v-for="(day, index) in getCurrentWeekDays()"
          :key="day.toISOString()"
          class="border-r border-gray-200 relative"
        >
          <!-- Slots horaires -->
          <div
            v-for="hour in timeSlots"
            :key="hour"
            class="h-16 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          ></div>
          
          <!-- Devoirs de la journée (positionnement absolu) -->
          <div class="absolute inset-0 p-1 pointer-events-none">
            <div
              v-for="(assignment, assignmentIndex) in getAssignmentsForDay(day)"
              :key="assignment.id"
              :class="[
                'mb-1 p-2 rounded shadow-sm text-xs font-medium cursor-pointer pointer-events-auto transition-all hover:shadow-md',
                assignment.is_completed 
                  ? 'bg-green-100 text-green-700 line-through opacity-60' 
                  : 'text-white'
              ]"
              :style="{
                backgroundColor: assignment.is_completed ? '' : assignment.subject_color,
                top: `${assignmentIndex * 25}px`
              }"
              @click="openAssignmentModal(assignment)"
            >
              <div class="font-semibold truncate">{{ assignment.title }}</div>
              <div class="text-xs opacity-90 truncate">{{ assignment.subject_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détail du devoir -->
    <div
      v-if="selectedAssignment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeAssignmentModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        @click.stop
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: selectedAssignment.subject_color }"
            ></div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedAssignment.title }}</h3>
              <p class="text-sm text-gray-600">{{ selectedAssignment.subject_name }}</p>
            </div>
          </div>
          <button
            @click="closeAssignmentModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
            <p class="text-sm text-gray-900">{{ formatFullDate(selectedAssignment.due_date) }}</p>
          </div>
          
          <div v-if="selectedAssignment.description">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p class="text-sm text-gray-900">{{ selectedAssignment.description }}</p>
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              :checked="selectedAssignment.is_completed"
              @change="toggleAssignmentFromModal"
              class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            >
            <label class="text-sm text-gray-700">Marquer comme terminé</label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="closeAssignmentModal"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
          <NuxtLink
            :to="`/assignments`"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="closeAssignmentModal"
          >
            Voir tous les devoirs
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// États réactifs
const assignments = ref([])
const subjects = ref([])
const loading = ref(false)
const currentView = ref('month')
const currentDate = ref(new Date())
const selectedAssignment = ref(null)

// États pour le drag & drop
const draggedAssignment = ref(null)
const dragOverDate = ref(null)
const isDragging = ref(false)

// Constantes
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const timeSlots = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h']

// Computed properties
const currentPeriodTitle = computed(() => {
  if (currentView.value === 'month') {
    return new Intl.DateTimeFormat('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    }).format(currentDate.value)
  } else {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${new Intl.DateTimeFormat('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    }).format(weekStart)}`
  }
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1)
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0)
  
  // Premier lundi de la grille (peut être du mois précédent)
  const startDate = new Date(firstDay)
  const dayOfWeek = firstDay.getDay()
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(firstDay.getDate() - daysToSubtract)
  
  // Générer 42 jours (6 semaines)
  const days = []
  const current = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(current),
      dateKey: current.toISOString().split('T')[0],
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === today.toDateString()
    })
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

// Fonctions utilitaires
function getWeekStart(date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1) // Lundi = début de semaine
  result.setDate(diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function getCurrentWeekDays() {
  const weekStart = getWeekStart(currentDate.value)
  const days = []
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push(day)
  }
  
  return days
}

function getAssignmentsForDay(date) {
  // Convertir la date en string locale (pas UTC)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  console.log('🔍 Recherche devoirs pour:', dateStr)
  console.log('📅 Devoirs disponibles:', assignments.value.length)
  
  if (assignments.value.length > 0) {
    console.log('📋 Exemple devoir:', assignments.value[0])
  }
  
  const matchingAssignments = assignments.value.filter(assignment => {
    const assignmentDate = typeof assignment.due_date === 'string' 
      ? assignment.due_date.split('T')[0]
      : assignment.due_date
      
    const match = assignmentDate === dateStr
    if (match) {
      console.log('✅ Match trouvé:', assignment.title, 'pour', dateStr)
    }
    return match
  })
  
  console.log(`📊 ${matchingAssignments.length} devoirs trouvés pour ${dateStr}`)
  
  return matchingAssignments.slice(0, currentView.value === 'month' ? 3 : 10)
}

function getDayAssignmentClass(assignment) {
  const today = new Date()
  const dueDate = new Date(assignment.due_date)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'bg-red-100 text-red-700' // En retard
  } else if (diffDays === 0) {
    return 'bg-orange-100 text-orange-700' // Aujourd'hui
  } else if (diffDays === 1) {
    return 'bg-yellow-100 text-yellow-700' // Demain
  }
  return 'bg-gray-100 text-gray-700' // Plus tard
}

function isToday(date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function formatFullDate(dateString) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

// Navigation
function navigatePrevious() {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 7)
    currentDate.value = newDate
  }
}

function navigateNext() {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 7)
    currentDate.value = newDate
  }
}

function goToToday() {
  currentDate.value = new Date()
}

// Modal
function openAssignmentModal(assignment) {
  selectedAssignment.value = assignment
}

function closeAssignmentModal() {
  selectedAssignment.value = null
}

async function toggleAssignmentFromModal() {
  if (!selectedAssignment.value) return
  
  try {
    const token = localStorage.getItem('token')
    await $fetch(`/api/assignments/${selectedAssignment.value.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { is_completed: !selectedAssignment.value.is_completed }
    })
    
    // Mettre à jour localement
    selectedAssignment.value.is_completed = !selectedAssignment.value.is_completed
    const assignment = assignments.value.find(a => a.id === selectedAssignment.value.id)
    if (assignment) {
      assignment.is_completed = selectedAssignment.value.is_completed
    }
  } catch (error) {
    console.error('Erreur toggle assignment:', error)
    alert('Erreur lors de la mise à jour du devoir')
  }
}

// Chargement des données
async function loadData() {
  if (typeof window === 'undefined') return
  
  const token = localStorage.getItem('token')
  if (!token) {
    await navigateTo('/login')
    return
  }
  
  await Promise.all([loadSubjects(), loadAssignments()])
}

async function loadSubjects() {
  try {
    const token = localStorage.getItem('token')
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
    loading.value = true
    console.log('🔄 Chargement devoirs calendrier...')
    const token = localStorage.getItem('token')
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    assignments.value = response.data || []
    console.log('✅ Devoirs chargés:', assignments.value.length)
    console.log('📋 Premier devoir:', assignments.value[0])
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

// === FONCTIONS DRAG & DROP ===
function startDrag(assignment, event) {
  if (assignment.is_completed) return
  
  draggedAssignment.value = assignment
  isDragging.value = true
  
  event.dataTransfer.setData('text/plain', assignment.id.toString())
  event.dataTransfer.effectAllowed = 'move'
  
  console.log('Début drag:', assignment.title)
}

function endDrag() {
  setTimeout(() => {
    draggedAssignment.value = null
    dragOverDate.value = null
    isDragging.value = false
  }, 100)
}

function allowDrop(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function setDragOver(dateKey) {
  if (isDragging.value && draggedAssignment.value) {
    dragOverDate.value = dateKey
  }
}

function clearDragOver(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverDate.value = null
  }
}

async function handleDrop(targetDate, event) {
  event.preventDefault()
  
  if (!draggedAssignment.value) return
  
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const newDateStr = `${year}-${month}-${day}`
  
  const assignment = draggedAssignment.value
  
  if (assignment.due_date === newDateStr) {
    endDrag()
    return
  }
  
  try {
    loading.value = true
    
    const token = localStorage.getItem('token')
    const response = await $fetch(`/api/assignments/${assignment.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { due_date: newDateStr }
    })
    
    if (response.success) {
      const assignmentIndex = assignments.value.findIndex(a => a.id === assignment.id)
      if (assignmentIndex !== -1) {
        assignments.value[assignmentIndex].due_date = newDateStr
      }
      console.log('✅ Devoir déplacé avec succès')
    }
  } catch (error) {
    console.error('Erreur déplacement:', error)
    alert('Erreur lors du déplacement')
  } finally {
    loading.value = false
    endDrag()
  }
}

// Initialisation
onMounted(() => {
  nextTick(() => {
    loadData()
  })
})
</script>