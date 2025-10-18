<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors duration-300">
    <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center transition-colors duration-300">
      <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      Sur quoi veux-tu te concentrer ?
    </h3>
    
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">Chargement...</p>
    </div>
    
    <div v-else-if="assignments.length === 0" class="text-center py-8">
      <div class="text-gray-400 dark:text-gray-500 mb-3 transition-colors duration-300">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">Aucun devoir à faire</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Tu peux quand même lancer une session libre !</p>
      <button
        @click="selectFreeSession"
        class="mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
      >
        Démarrer une session libre
      </button>
    </div>
    
    <div v-else class="space-y-3">
      <!-- Option session libre -->
      <button
        @click="selectFreeSession"
        :class="[
          'w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md',
          !selectedAssignment ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              !selectedAssignment ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            ]">
              <svg :class="[
                'w-5 h-5 transition-colors duration-300',
                !selectedAssignment ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p :class="[
                'font-semibold text-sm md:text-base transition-colors duration-300',
                !selectedAssignment ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
              ]">
                Session libre
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                Focus sans devoir spécifique
              </p>
            </div>
          </div>
          <div v-if="!selectedAssignment" class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </button>
      
      <!-- Liste des devoirs -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 transition-colors duration-300">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 transition-colors duration-300">
          Tes devoirs à faire
        </p>
        
        <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          <button
            v-for="assignment in assignments"
            :key="assignment.id"
            @click="selectAssignment(assignment)"
            :class="[
              'w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-sm',
              isSelected(assignment) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3 flex-1 min-w-0">
                <!-- Couleur de la matière -->
                <div
                  :style="{ backgroundColor: assignment.subject?.color || '#6B7280' }"
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                >
                  {{ getSubjectInitial(assignment.subject?.name) }}
                </div>
                
                <div class="flex-1 min-w-0">
                  <p :class="[
                    'font-medium text-sm truncate transition-colors duration-300',
                    isSelected(assignment) ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                  ]">
                    {{ assignment.title }}
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {{ assignment.subject?.name }}
                    </span>
                    <span class="text-gray-300 dark:text-gray-600 transition-colors duration-300">•</span>
                    <span :class="[
                      'text-xs font-medium',
                      getDueDateColor(assignment.due_date)
                    ]">
                      {{ formatDueDate(assignment.due_date) }}
                    </span>
                  </div>
                  
                  <!-- Barre de priorité -->
                  <div v-if="assignment.priority" class="flex items-center mt-2 space-x-1">
                    <div
                      v-for="i in 3"
                      :key="i"
                      :class="[
                        'h-1 w-6 rounded-full transition-colors duration-300',
                        i <= getPriorityLevel(assignment.priority) ? getPriorityColor(assignment.priority) : 'bg-gray-200 dark:bg-gray-700'
                      ]"
                    />
                  </div>
                </div>
              </div>
              
              <div v-if="isSelected(assignment)" class="flex-shrink-0 ml-2">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedAssignment: {
    type: Object,
    default: null
  },
  assignments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:selectedAssignment'])

// Méthodes
const selectAssignment = (assignment) => {
  emit('update:selectedAssignment', assignment)
}

const selectFreeSession = () => {
  emit('update:selectedAssignment', null)
}

const isSelected = (assignment) => {
  return props.selectedAssignment?.id === assignment.id
}

const getSubjectInitial = (subjectName) => {
  if (!subjectName) return '?'
  return subjectName.charAt(0).toUpperCase()
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'En retard'
  if (diffDays === 0) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Demain'
  if (diffDays <= 7) return `Dans ${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const getDueDateColor = (dueDate) => {
  const date = new Date(dueDate)
  const now = new Date()
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600'
  if (diffDays === 0) return 'text-orange-600'
  if (diffDays <= 3) return 'text-yellow-600'
  return 'text-green-600'
}

const getPriorityLevel = (priority) => {
  const levels = { low: 1, medium: 2, high: 3 }
  return levels[priority] || 1
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }
  return colors[priority] || 'bg-gray-500'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
