<template>
  <title>StudyFlow - Mes devoirs</title>
  <div 
    class="min-h-screen"
    @touchstart="pullTouchStart"
    @touchmove="pullTouchMove"
    @touchend="pullTouchEnd"
  >
    <!-- Pull-to-refresh indicator -->
    <div 
      v-if="isPulling || isRefreshing"
      class="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 transition-all duration-200 pull-to-refresh-indicator"
      :style="{ transform: `translateY(${Math.min(pullDistance, refreshThreshold)}px)`, opacity: pullDistance / refreshThreshold }"
    >
      <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <svg 
          class="w-5 h-5 transition-transform duration-200"
          :class="[
            isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-600 dark:text-gray-400',
            pullDistance >= refreshThreshold && !isRefreshing ? 'rotate-180' : ''
          ]"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ isRefreshing ? 'Actualisation...' : pullDistance >= refreshThreshold ? 'Relâcher pour actualiser' : 'Tirer pour actualiser' }}
        </span>
      </div>
    </div>

    <!-- Header moderne avec dégradé -->
    <div class="mb-8 md:mb-12">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl opacity-50 blur-3xl"></div>
        <div class="relative flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div class="flex-1">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">Mes devoirs</h1>
            <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">Organise et suis tes devoirs par matière</p>
          </div>
          <button 
            @click="showAddForm = true"
            :disabled="loading || subjects.length === 0"
            class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <svg class="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="font-semibold relative">Ajouter un devoir</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Message si pas de matières -->
    <div v-if="subjects.length === 0" class="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-8">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-transparent rounded-full blur-3xl opacity-40"></div>
      <div class="relative flex gap-4">
        <div class="p-3 bg-yellow-100 rounded-xl flex-shrink-0">
          <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.854-.833-2.5 0l-5.898 8.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <p class="text-base font-semibold text-yellow-900 mb-1">Créez d'abord vos matières</p>
          <p class="text-sm text-yellow-700">
            Tu dois créer des matières pour pouvoir ajouter des devoirs.
            <NuxtLink to="/subjects" class="font-bold underline hover:text-yellow-800 ml-1">
              Créer mes matières →
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire d'ajout moderne -->
    <div v-if="showAddForm" class="relative overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 to-blue-50/30 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-lg transition-colors duration-300">
      <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-transparent rounded-full blur-3xl opacity-30"></div>
      <div class="relative">
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors duration-300">
          <span class="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Nouveau devoir
        </h3>
        <form @submit.prevent="addAssignment" class="space-y-5">
          <div>
            <label for="title" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Titre du devoir
            </label>
            <input
              type="text"
              id="title"
              v-model="newAssignment.title"
              placeholder="Ex: Exercices chapitre 5..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label for="subject" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Matière
            </label>
            <select
              id="subject"
              v-model="newAssignment.subject_id"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Choisir une matière</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Date d'échéance
            </label>
            <DatePicker v-model="newAssignment.due_date" />
          </div>

          <div>
            <label for="description" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              v-model="newAssignment.description"
              rows="3"
              placeholder="Détails, consignes..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <!-- Section Tags -->
          <div>
            <TagSelector v-model="newAssignment.tags" @manage-tags="navigateTo('/subjects')" />
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              {{ loading ? 'Création...' : 'Créer le devoir' }}
            </button>
            <button
              type="button"
              @click="cancelAdd"
              :disabled="loading"
              class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Filtres modernes -->
    <div class="flex gap-3 mb-6 overflow-x-auto pb-2">
      <button
        @click="currentFilter = 'all'"
        :class="[
          'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
          currentFilter === 'all'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        ]"
      >
        <span class="flex items-center gap-2">
          Tous
          <span class="px-2 py-0.5 bg-white/20 rounded-lg text-xs">{{ assignments.length }}</span>
        </span>
      </button>
      <button
        @click="currentFilter = 'pending'"
        :class="[
          'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
          currentFilter === 'pending'
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
        ]"
      >
        <span class="flex items-center gap-2">
          À faire
          <span class="px-2 py-0.5 bg-white/20 rounded-lg text-xs">{{ pendingAssignments.length }}</span>
        </span>
      </button>
      <button
        @click="currentFilter = 'completed'"
        :class="[
          'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
          currentFilter === 'completed'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
        ]"
      >
        <span class="flex items-center gap-2">
          Terminés
          <span class="px-2 py-0.5 bg-white/20 rounded-lg text-xs">{{ completedAssignments.length }}</span>
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && assignments.length === 0" class="text-center py-12">
      <div class="inline-block w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">Chargement des devoirs...</p>
    </div>

    <!-- Liste des devoirs - Design moderne -->
    <div v-else-if="filteredAssignments.length > 0" class="space-y-4 no-swipe">
      <!-- Wrapper pour swipe-to-delete -->
      <div
        v-for="(assignment, index) in filteredAssignments" 
        :key="assignment.id"
        class="relative touch-manipulation"
      >
        <!-- Background de suppression (visible au swipe) -->
        <div class="swipe-delete-bg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span class="ml-2">Supprimer</span>
        </div>
        
        <!-- Carte de devoir (avec swipe) -->
        <div 
          :class="[
            'swipe-delete-container group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
            assignment.is_completed 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50/30 border-green-200 hover:border-green-300 dark:from-green-900/20 dark:to-emerald-900/10 dark:border-green-800 dark:hover:border-green-700' 
              : 'bg-gradient-to-br from-white to-blue-50/20 border-gray-200 hover:border-blue-300 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:hover:border-blue-600'
          ]"
          :style="{ animationDelay: `${index * 0.05}s`, transform: `translateX(${getSwipeTransform(assignment.id)}px)` }"
          @touchstart="(e) => handleSwipeStart(e, assignment)"
          @touchmove="(e) => handleSwipeMove(e, assignment)"
          @touchend="() => handleSwipeEnd(assignment)"
        >
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-transparent rounded-full blur-3xl opacity-20"></div>
        <div class="relative p-5 md:p-6">
          <div class="flex items-start gap-4">
            <!-- Checkbox moderne -->
            <button
              @click="toggleAssignment(assignment)"
              :disabled="loading"
              class="mt-1 flex-shrink-0 group/check"
            >
              <div :class="[
                'w-7 h-7 rounded-xl border-2 transition-all duration-200 flex items-center justify-center',
                assignment.is_completed 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 shadow-lg shadow-green-500/30' 
                  : 'border-gray-300 dark:border-gray-600 group-hover/check:border-blue-500 dark:group-hover/check:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              ]">
                <svg 
                  v-if="assignment.is_completed"
                  class="w-5 h-5 text-white"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </button>

            <!-- Contenu -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3 mb-3">
                <h3 :class="[
                  'text-lg md:text-xl font-bold transition-colors duration-300',
                  assignment.is_completed ? 'text-gray-500 dark:text-gray-600 line-through' : 'text-gray-900 dark:text-gray-100'
                ]">
                  {{ assignment.title }}
                </h3>
              </div>
              
              <div class="flex items-center gap-4 mb-3">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-3 h-3 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-sm"
                    :style="{ backgroundColor: getSubjectColor(assignment.subject_id) }"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    {{ getSubjectName(assignment.subject_id) }}
                  </span>
                </div>
                
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span :class="[
                    'text-sm font-bold px-3 py-1 rounded-lg',
                    getDueDateClass(assignment.due_date) === 'text-red-600' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                    getDueDateClass(assignment.due_date) === 'text-orange-600' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                    getDueDateClass(assignment.due_date) === 'text-yellow-600' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  ]">
                    {{ formatDueDate(assignment.due_date) }}
                  </span>
                </div>
              </div>

              <p v-if="assignment.description" :class="[
                'text-sm leading-relaxed transition-colors duration-300',
                assignment.is_completed ? 'text-gray-500 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'
              ]">
                {{ assignment.description }}
              </p>

              <!-- Tags -->
              <div v-if="assignment.tags && assignment.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in assignment.tags"
                  :key="tag.id"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105"
                  :style="{ backgroundColor: tag.color }"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <!-- Bouton supprimer moderne -->
            <button
              @click="deleteAssignment(assignment.id)"
              :disabled="loading"
              class="flex-shrink-0 p-2.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all disabled:opacity-50 group/delete"
            >
              <svg class="w-5 h-5 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Fin du wrapper swipe-to-delete -->
      </div>
    </div>

    <!-- État vide -->
    <EmptyState
      v-else
      :title="currentFilter === 'completed' ? 'Aucun devoir terminé' : 
            currentFilter === 'pending' ? 'Aucun devoir en attente' : 'Aucun devoir'"
      :description="getEmptyDescription()"
      :emoji="getEmptyEmoji()"
      :primary-action="currentFilter === 'all' && subjects.length > 0 ? {
        text: 'Créer mon premier devoir',
        icon: 'M12 4v16m8-8H4'
      } : null"
      :secondary-action="currentFilter !== 'all' ? {
        text: 'Voir tous les devoirs'
      } : null"
      :tips="getEmptyTips()"
      @primary-action="showAddForm = true"
      @secondary-action="currentFilter = 'all'"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { usePullToRefresh, useSwipeToDelete } from '~/composables/useTouchOptimizations'

const assignments = ref([])
const subjects = ref([])
const showAddForm = ref(false)
const loading = ref(false)
const currentFilter = ref('all')

const newAssignment = reactive({
  title: '',
  subject_id: '',
  due_date: '',
  description: '',
  tags: []
})

const today = new Date().toISOString().split('T')[0]

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

// Pull-to-refresh pour mobile
const {
  isPulling,
  isRefreshing,
  pullDistance,
  refreshThreshold,
  handleTouchStart: pullTouchStart,
  handleTouchMove: pullTouchMove,
  handleTouchEnd: pullTouchEnd
} = usePullToRefresh(async () => {
  // Recharger les devoirs et matières
  await Promise.all([loadAssignments(), loadSubjects()])
})

// Swipe-to-delete sur les cartes
const swipeStates = ref({}) // {assignmentId: translateX}

const handleSwipeStart = (e, assignment) => {
  if (!swipeStates.value[assignment.id]) {
    swipeStates.value[assignment.id] = { startX: e.touches[0].clientX, currentX: 0 }
  } else {
    swipeStates.value[assignment.id].startX = e.touches[0].clientX
  }
}

const handleSwipeMove = (e, assignment) => {
  const state = swipeStates.value[assignment.id]
  if (!state) return
  
  const deltaX = e.touches[0].clientX - state.startX
  // Limiter le swipe vers la gauche uniquement (valeurs négatives)
  if (deltaX < 0) {
    state.currentX = Math.max(deltaX, -120) // Max -120px
  }
}

const handleSwipeEnd = async (assignment) => {
  const state = swipeStates.value[assignment.id]
  if (!state) return
  
  // Si le swipe dépasse -80px, supprimer
  if (state.currentX < -80) {
    await deleteAssignment(assignment.id)
  }
  
  // Reset
  state.currentX = 0
  state.startX = 0
}

const getSwipeTransform = (assignmentId) => {
  return swipeStates.value[assignmentId]?.currentX || 0
}

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
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    }).format(date)
  }
}

function getDueDateClass(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'text-red-600 font-medium'
  } else if (diffDays <= 1) {
    return 'text-orange-600 font-medium'
  } else if (diffDays <= 3) {
    return 'text-yellow-600'
  }
  return 'text-gray-600'
}

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
    
    const assignmentsData = response.data || []
    
    // Charger les tags pour chaque devoir
    for (const assignment of assignmentsData) {
      try {
        const tagsResponse = await $fetch(`/api/assignments/${assignment.id}/tags`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        assignment.tags = tagsResponse.tags || []
      } catch (tagError) {
        console.error(`Erreur chargement tags pour devoir ${assignment.id}:`, tagError)
        assignment.tags = []
      }
    }
    
    assignments.value = assignmentsData
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
      const newAssignmentData = response.data
      
      // Associer les tags au devoir si des tags ont été sélectionnés
      if (newAssignment.tags && newAssignment.tags.length > 0) {
        for (const tagId of newAssignment.tags) {
          try {
            await $fetch(`/api/assignments/${newAssignmentData.id}/tags`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: { tag_id: tagId }
            })
          } catch (tagError) {
            console.error('Erreur association tag:', tagError)
          }
        }
        // Ajouter les tags au devoir pour l'affichage
        newAssignmentData.tags = newAssignment.tags
      }
      
      assignments.value.unshift(newAssignmentData)
      
      const { success } = useToast()
      const dueDate = new Date(newAssignment.due_date)
      const isToday = dueDate.toDateString() === new Date().toDateString()
      const isTomorrow = dueDate.toDateString() === new Date(Date.now() + 86400000).toDateString()
      
      let message = ''
      if (isToday) {
        message = '⚡ À faire aujourd\'hui !'
      } else if (isTomorrow) {
        message = '🔔 À faire demain'
      } else {
        message = `📅 Échéance: ${formatDueDate(newAssignment.due_date)}`
      }
      
      success(
        `Devoir "${newAssignment.title}" créé !`,
        message
      )
      
      newAssignment.title = ''
      newAssignment.subject_id = ''
      newAssignment.due_date = ''
      newAssignment.description = ''
      newAssignment.tags = []
      showAddForm.value = false
    }
  } catch (error) {
    console.error('Erreur création devoir:', error)
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de créer le devoir')
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
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de mettre à jour le devoir')
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
    const { success } = useToast()
    success('Devoir supprimé', 'Le devoir a été supprimé avec succès')
  } catch (error) {
    console.error('Erreur suppression devoir:', error)
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de supprimer le devoir')
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

function getEmptyDescription() {
  if (currentFilter.value === 'completed') {
    return 'Aucun devoir terminé pour le moment. Continue ton excellent travail !'
  } else if (currentFilter.value === 'pending') {
    return 'Parfait ! Aucun devoir en attente. Tu es à jour dans tes révisions.'
  } else if (subjects.value.length === 0) {
    return 'Tu dois d\'abord créer des matières pour pouvoir ajouter des devoirs.'
  } else {
    return 'Commence par ajouter tes premiers devoirs pour organiser ton travail scolaire.'
  }
}

function getEmptyEmoji() {
  if (currentFilter.value === 'completed') return '🎉'
  if (currentFilter.value === 'pending') return '✨'
  return '📝'
}

function getEmptyTips() {
  if (currentFilter.value !== 'all') return []
  
  if (subjects.value.length === 0) {
    return [
      'Crée d\'abord tes matières dans la section "Matières"',
      'Puis reviens ici pour ajouter tes devoirs'
    ]
  }
  
  return [
    'Utilise les filtres pour organiser tes devoirs',
    'Marque les devoirs comme terminés en cliquant le cercle',
    'Les devoirs en retard apparaissent en rouge'
  ]
}

onMounted(() => {
  nextTick(() => {
    loadData()
  })
})
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>