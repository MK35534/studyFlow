<template>
  <title>StudyFlow - Mes matières</title>
  <div class="min-h-screen">
    <!-- Header moderne avec dégradé dynamique -->
    <div class="mb-8">
      <div class="relative">
        <div :class="`absolute inset-0 bg-gradient-to-r ${theme.gradientBg} rounded-2xl opacity-50 blur-3xl`"></div>
        <div class="relative flex justify-between items-start gap-4">
          <div class="flex-1">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mes matières</h1>
            <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg">Organise tes cours et devoirs par discipline</p>
          </div>
          <button 
            @click="openAddModal"
            :disabled="loading"
            :class="`group relative overflow-hidden bg-gradient-to-r ${theme.gradient} text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg ${theme.shadow} hover:shadow-xl hover:-translate-y-0.5`"
          >
            <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <svg class="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="font-semibold relative hidden md:inline">Ajouter une matière</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading && subjects.length === 0" class="text-center py-12">
      <div :class="`inline-block w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4`" :style="`border-top-color: ${theme.primary}`"></div>
      <p class="text-gray-500 dark:text-gray-400 font-medium">Chargement des matières...</p>
    </div>

    <!-- Liste des matières avec statistiques -->
    <div v-else-if="subjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 no-swipe">
      <div 
        v-for="(subject, index) in subjects" 
        :key="subject.id"
        :class="`group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`"
        :style="{ animationDelay: `${index * 0.05}s`, borderColor: subject.color + '40' }"
      >
        <div 
          class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          :style="{ background: `linear-gradient(135deg, ${subject.color}, transparent)` }"
        ></div>
        
        <div class="relative p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800 flex-shrink-0"
                :style="{ backgroundColor: subject.color }"
              >
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 truncate mb-0.5">{{ subject.name }}</h3>
                <p v-if="subject.teacher" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ subject.teacher }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 flex-shrink-0 ml-2">
              <button
                @click="openEditModal(subject)"
                :disabled="loading"
                class="p-2 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all disabled:opacity-50"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteSubject(subject.id)"
                :disabled="loading"
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="subject.schedule" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">Emploi du temps</span>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ subject.schedule }}</p>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div class="flex items-center justify-center mb-1">
                <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ getSubjectStats(subject.id).total }}</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Total</p>
            </div>

            <div class="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <div class="flex items-center justify-center mb-1">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ getSubjectStats(subject.id).completionRate }}%</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Fait</p>
            </div>

            <div :class="`text-center p-3 rounded-xl ${getSubjectStats(subject.id).urgent > 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-gray-800/50'}`">
              <div class="flex items-center justify-center mb-1">
                <svg :class="`w-4 h-4 ${getSubjectStats(subject.id).urgent > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p :class="`text-xl font-bold ${getSubjectStats(subject.id).urgent > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`">{{ getSubjectStats(subject.id).urgent }}</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Urgent</p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Créée le {{ formatDate(subject.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- État vide amélioré -->
    <EmptyState
      v-else
      title="Aucune matière"
      description="Commence par créer tes premières matières pour organiser tes cours et devoirs par discipline."
      emoji="📚"
      :primary-action="{
        text: 'Créer ma première matière',
        icon: 'M12 4v16m8-8H4'
      }"
      :tips="[
        'Personnalise chaque matière avec une couleur',
        'Ajoute le nom du professeur et l\'emploi du temps',
        'Suis tes statistiques par matière en temps réel'
      ]"
      @primary-action="openAddModal"
    />
  </div>

  <!-- Modal Teleport pour ajouter/éditer -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[99999] p-4"
      @click="closeModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div :class="`sticky top-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${theme.gradientBg} z-10`">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="`p-2.5 bg-gradient-to-br ${theme.gradient} rounded-xl`">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                {{ isEditMode ? 'Modifier la matière' : 'Nouvelle matière' }}
              </h2>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveSubject" class="p-6 space-y-6">
          <div>
            <label for="name" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Nom de la matière *
            </label>
            <input
              type="text"
              id="name"
              v-model="subjectForm.name"
              placeholder="Ex: Mathématiques, Histoire..."
              class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label for="teacher" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Professeur
            </label>
            <input
              type="text"
              id="teacher"
              v-model="subjectForm.teacher"
              placeholder="Ex: M. Dupont, Mme Martin..."
              class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label for="schedule" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Emploi du temps
            </label>
            <textarea
              id="schedule"
              v-model="subjectForm.schedule"
              placeholder="Ex: Lundi 8h-10h, Mercredi 14h-16h..."
              rows="3"
              class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              Couleur *
            </label>
            <div class="grid grid-cols-8 gap-3">
              <button
                v-for="color in availableColors"
                :key="color.value"
                type="button"
                @click="subjectForm.color = color.value"
                :class="[
                  'w-full aspect-square rounded-xl border-3 transition-all duration-200 hover:scale-110',
                  subjectForm.color === color.value 
                    ? 'border-gray-900 dark:border-gray-100 scale-110 ring-4 ring-offset-2 dark:ring-offset-gray-800' 
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                ]"
                :style="{ 
                  backgroundColor: color.value,
                  ringColor: color.value + '40'
                }"
                :title="color.name"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              :disabled="loading"
              :class="`flex-1 bg-gradient-to-r ${theme.gradient} text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg ${theme.shadow} hover:shadow-xl hover:-translate-y-0.5`"
            >
              {{ loading ? 'Enregistrement...' : (isEditMode ? 'Modifier' : 'Créer la matière') }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="loading"
              class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const { theme } = useTheme()
const { success, error } = useToast()

const subjects = ref([])
const assignments = ref([])
const showModal = ref(false)
const loading = ref(false)
const isEditMode = ref(false)
const editingId = ref(null)

const subjectForm = reactive({
  name: '',
  color: '#3B82F6',
  teacher: '',
  schedule: ''
})

const availableColors = [
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Ambre', value: '#F59E0B' },
  { name: 'Jaune', value: '#EAB308' },
  { name: 'Citron', value: '#84CC16' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Émeraude', value: '#059669' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Bleu ciel', value: '#0EA5E9' },
  { name: 'Ardoise', value: '#64748B' },
  { name: 'Gris', value: '#6B7280' },
  { name: 'Zinc', value: '#71717A' },
]

const getSubjectStats = (subjectId) => {
  const subjectAssignments = assignments.value.filter(a => a.subject_id === subjectId)
  const total = subjectAssignments.length
  const completed = subjectAssignments.filter(a => a.is_completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const now = new Date()
  const urgent = subjectAssignments.filter(a => {
    if (a.is_completed) return false
    const dueDate = new Date(a.due_date)
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 3
  }).length
  
  return { total, completed, completionRate, urgent }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const openAddModal = () => {
  isEditMode.value = false
  editingId.value = null
  subjectForm.name = ''
  subjectForm.color = '#3B82F6'
  subjectForm.teacher = ''
  subjectForm.schedule = ''
  showModal.value = true
}

const openEditModal = (subject) => {
  isEditMode.value = true
  editingId.value = subject.id
  subjectForm.name = subject.name
  subjectForm.color = subject.color
  subjectForm.teacher = subject.teacher || ''
  subjectForm.schedule = subject.schedule || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveSubject = async () => {
  if (!subjectForm.name.trim()) {
    error('Le nom de la matière est requis')
    return
  }
  
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    const payload = {
      name: subjectForm.name.trim(),
      color: subjectForm.color,
      teacher: subjectForm.teacher.trim() || null,
      schedule: subjectForm.schedule.trim() || null
    }
    
    if (isEditMode.value) {
      await $fetch(`/api/subjects/${editingId.value}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      })
      success('Matière modifiée avec succès !')
    } else {
      await $fetch('/api/subjects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      })
      success('Matière créée avec succès !')
    }
    
    closeModal()
    await loadSubjects()
  } catch (err) {
    console.error('Erreur sauvegarde matière:', err)
    error(err.data?.message || 'Erreur lors de la sauvegarde')
  } finally {
    loading.value = false
  }
}

const deleteSubject = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return
  
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    await $fetch(`/api/subjects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    success('Matière supprimée')
    await loadSubjects()
  } catch (err) {
    console.error('Erreur suppression matière:', err)
    error('Erreur lors de la suppression')
  } finally {
    loading.value = false
  }
}

const loadSubjects = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    
    const response = await $fetch('/api/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    subjects.value = response.data || []
  } catch (err) {
    console.error('Erreur chargement matières:', err)
    if (err.status === 401) {
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

const loadAssignments = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    assignments.value = response.data || []
  } catch (err) {
    console.error('Erreur chargement devoirs:', err)
  }
}

onMounted(() => {
  nextTick(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }
    await Promise.all([loadSubjects(), loadAssignments()])
  })
})
</script>
