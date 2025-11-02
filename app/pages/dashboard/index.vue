<template>
  <div class="min-h-screen">
    <title>StudyFlow - Dashboard</title>
    
    <!-- Header avec salutation personnalisée -->
    <div class="mb-8">
      <div class="relative">
        <div :class="`absolute inset-0 bg-gradient-to-r ${theme.gradientBg} rounded-2xl opacity-50 blur-3xl`"></div>
        <div class="relative">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
            {{ greeting }}, {{ userName }} 👋
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">
            {{ motivationalQuote }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats rapides -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <!-- Devoirs urgents -->
      <div :class="`group relative overflow-hidden bg-gradient-to-br ${theme.gradientBg} dark:from-gray-800 dark:to-gray-900 to-white rounded-2xl p-6 border-2 ${theme.border} dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100 dark:from-red-900/30 to-transparent rounded-full blur-2xl opacity-50"></div>
        <div class="relative">
          <div class="p-3 bg-white dark:bg-gray-800/50 rounded-xl mb-4 inline-flex shadow-sm transition-colors duration-300">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">{{ stats.urgent }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Devoirs urgents</p>
          <p class="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 transition-colors duration-300">≤ 3 jours</p>
        </div>
      </div>

      <!-- Complétés cette semaine -->
      <div :class="`group relative overflow-hidden bg-gradient-to-br from-green-50 dark:from-gray-800 to-white dark:to-gray-900 rounded-2xl p-6 border-2 border-green-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 dark:from-green-900/30 to-transparent rounded-full blur-2xl opacity-50"></div>
        <div class="relative">
          <div class="p-3 bg-white dark:bg-gray-800/50 rounded-xl mb-4 inline-flex shadow-sm transition-colors duration-300">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">{{ stats.completedThisWeek }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Cette semaine</p>
          <p class="text-xs text-green-600 dark:text-green-400 font-semibold mt-1 transition-colors duration-300">+{{ stats.weekProgress }}%</p>
        </div>
      </div>

      <!-- Matières actives -->
      <div :class="`group relative overflow-hidden bg-gradient-to-br ${theme.gradientBg} dark:from-gray-800 dark:to-gray-900 to-white rounded-2xl p-6 border-2 ${theme.border} dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-transparent rounded-full blur-2xl opacity-50"></div>
        <div class="relative">
          <div class="p-3 bg-white dark:bg-gray-800/50 rounded-xl mb-4 inline-flex shadow-sm transition-colors duration-300">
            <svg class="w-6 h-6" :class="theme.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">{{ stats.totalSubjects }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Matières</p>
        </div>
      </div>

      <!-- Taux de réussite -->
      <div :class="`group relative overflow-hidden bg-gradient-to-br from-purple-50 dark:from-gray-800 to-white dark:to-gray-900 rounded-2xl p-6 border-2 border-purple-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`">
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 dark:from-purple-900/30 to-transparent rounded-full blur-2xl opacity-50"></div>
        <div class="relative">
          <div class="p-3 bg-white dark:bg-gray-800/50 rounded-xl mb-4 inline-flex shadow-sm transition-colors duration-300">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">{{ stats.completionRate }}%</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">Taux de réussite</p>
        </div>
      </div>
    </div>

    <!-- Grille principale : Devoirs urgents + Prochains cours -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Devoirs urgents -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 dark:from-red-900/20 to-white dark:to-gray-800 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Devoirs urgents</h2>
            </div>
            <NuxtLink to="/dashboard/assignments" class="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300">
              Voir tout →
            </NuxtLink>
          </div>
        </div>
        
        <div class="p-6">
          <div v-if="urgentAssignments.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">Aucun devoir urgent !</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">Excellent travail 🎉</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="assignment in urgentAssignments"
              :key="assignment.id"
              class="flex items-start gap-4 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200 group cursor-pointer"
              @click="navigateTo('/dashboard/assignments')"
            >
              <div :class="`flex-shrink-0 w-10 h-10 rounded-xl ${getSubjectColor(assignment.subject_id)} flex items-center justify-center text-white font-bold shadow-sm`">
                {{ getSubjectInitials(assignment.subject_id) }}
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {{ assignment.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">{{ getSubjectName(assignment.subject_id) }}</p>
                <div class="flex items-center gap-2">
                  <span :class="`px-2 py-1 rounded-lg text-xs font-bold ${getUrgencyStyle(assignment.due_date)}`">
                    {{ formatDaysLeft(assignment.due_date) }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">{{ formatDate(assignment.due_date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochains cours -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div :class="`p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${theme.gradientBg} dark:from-gray-800 to-white dark:to-gray-800 transition-colors duration-300`">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="`p-2 bg-gradient-to-br ${theme.gradient} rounded-xl`">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Aujourd'hui</h2>
            </div>
            <span class="text-sm font-medium text-gray-400 dark:text-gray-500 italic">
              Calendrier (bientôt)
            </span>
          </div>
        </div>
        
        <div class="p-6">
          <div class="text-center py-8">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">Emploi du temps bientôt disponible</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">En attendant, consultez votre calendrier</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Raccourcis rapides -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2 transition-colors duration-300">
        <svg class="w-6 h-6" :class="theme.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Actions rapides
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          @click="navigateTo('/dashboard/assignments')"
          :class="`p-4 rounded-xl border-2 ${theme.border} dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group`"
        >
          <div :class="`p-3 bg-gradient-to-br ${theme.gradient} rounded-xl mb-3 inline-flex`">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p class="font-semibold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">Ajouter un devoir</p>
        </button>

        <button
          @click="navigateTo('/dashboard/subjects')"
          :class="`p-4 rounded-xl border-2 border-green-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group`"
        >
          <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-3 inline-flex">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p class="font-semibold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">Gérer matières</p>
        </button>

        <button
          @click="navigateTo('/dashboard/focus')"
          class="p-4 rounded-xl border-2 border-purple-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
        >
          <div class="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-3 inline-flex">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="font-semibold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">Mode Focus</p>
        </button>

        <div
          class="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
        >
          <div class="p-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl mb-3 inline-flex">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="font-semibold text-gray-900 dark:text-gray-100 text-sm transition-colors duration-300">Calendrier</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Bientôt disponible</p>
        </div>
      </div>
    </div>

    <!-- Par matière -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2 transition-colors duration-300">
        <svg class="w-6 h-6" :class="theme.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Devoirs par matière
      </h2>
      
      <div v-if="subjects.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">Aucune matière</p>
        <button
          @click="navigateTo('/dashboard/subjects')"
          :class="`mt-4 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all`"
        >
          Créer une matière
        </button>
      </div>
      
      <div v-else class="grid md:grid-cols-3 gap-4">
        <div
          v-for="subject in subjects"
          :key="subject.id"
          class="p-5 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 group cursor-pointer bg-white dark:bg-gray-800/50"
          @click="navigateTo('/dashboard/assignments')"
        >
          <div class="flex items-center gap-3 mb-4">
            <div :class="`w-12 h-12 rounded-xl ${getSubjectColor(subject.id)} flex items-center justify-center text-white font-bold shadow-sm`">
              {{ getSubjectInitials(subject.id) }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{{ subject.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{{ subject.teacher || 'Pas de professeur' }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ getSubjectAssignmentsCount(subject.id) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">devoirs</p>
            </div>
            <div :class="`px-3 py-1 rounded-lg text-xs font-bold ${getSubjectUrgencyBadge(subject.id)}`">
              {{ getSubjectUrgentCount(subject.id) }} urgent{{ getSubjectUrgentCount(subject.id) > 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// Désactiver SSR pour éviter les problèmes de cookies
definePageMeta({
  ssr: false,
  middleware: 'auth'
})

// Authentification
const { getToken } = useAuth()

// Thème
const { theme } = useTheme()

// Données réactives
const assignments = ref([])
const subjects = ref([])
const loading = ref(false)
const userName = ref('')
const motivationalQuote = ref('Bienvenue sur StudyFlow ✨') // Valeur par défaut

// Salutation selon l'heure
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
})

// Citations motivantes
const quotes = [
  'Chaque petit pas compte vers ton succès 🌟',
  'La constance mène au succès 💪',
  'Transforme tes objectifs en réalité ✨',
  'Aujourd\'hui est un nouveau départ 🚀',
  'Crois en toi et tout est possible 🎯',
  'Le succès est la somme de petits efforts répétés 📚',
  'Ton avenir commence maintenant ⭐',
]

// Statistiques
const stats = computed(() => {
  const total = assignments.value.length
  const completed = assignments.value.filter(a => a.is_completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  
  // Devoirs urgents (≤ 3 jours)
  const now = new Date()
  const urgent = assignments.value.filter(a => {
    if (a.is_completed) return false
    const dueDate = new Date(a.due_date)
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 3
  }).length
  
  // Complétés cette semaine
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const completedThisWeek = assignments.value.filter(a => {
    return a.is_completed && new Date(a.completed_at || a.updated_at) >= weekStart
  }).length
  
  // Progression de la semaine (%)
  const lastWeekCompleted = 10 // Mock pour l'instant
  const weekProgress = lastWeekCompleted > 0 
    ? Math.round(((completedThisWeek - lastWeekCompleted) / lastWeekCompleted) * 100) 
    : 0
  
  return {
    totalSubjects: subjects.value.length,
    totalAssignments: total,
    completedAssignments: completed,
    completionRate,
    urgent,
    completedThisWeek,
    weekProgress: Math.abs(weekProgress)
  }
})

// Devoirs urgents (≤ 3 jours)
const urgentAssignments = computed(() => {
  const now = new Date()
  return assignments.value
    .filter(a => {
      if (a.is_completed) return false
      const dueDate = new Date(a.due_date)
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 3
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5)
})

// Helpers
const getSubjectName = (subjectId) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

const getSubjectInitials = (subjectId) => {
  const name = getSubjectName(subjectId)
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const colors = ['bg-gradient-to-br from-blue-500 to-indigo-600', 'bg-gradient-to-br from-purple-500 to-pink-600', 'bg-gradient-to-br from-green-500 to-emerald-600', 'bg-gradient-to-br from-orange-500 to-amber-600', 'bg-gradient-to-br from-red-500 to-rose-600']
const getSubjectColor = (subjectId) => {
  return colors[subjectId % colors.length]
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const formatDaysLeft = (dueDate) => {
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Demain'
  if (diffDays < 0) return 'En retard'
  return `Dans ${diffDays}j`
}

const getUrgencyStyle = (dueDate) => {
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'bg-red-100 text-red-700'
  if (diffDays === 0) return 'bg-red-500 text-white'
  if (diffDays === 1) return 'bg-orange-500 text-white'
  if (diffDays <= 3) return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-700'
}

const getSubjectAssignmentsCount = (subjectId) => {
  return assignments.value.filter(a => a.subject_id === subjectId && !a.is_completed).length
}

const getSubjectUrgentCount = (subjectId) => {
  const now = new Date()
  return assignments.value.filter(a => {
    if (a.is_completed || a.subject_id !== subjectId) return false
    const dueDate = new Date(a.due_date)
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 3
  }).length
}

const getSubjectUrgencyBadge = (subjectId) => {
  const urgentCount = getSubjectUrgentCount(subjectId)
  if (urgentCount === 0) return 'bg-green-100 text-green-700'
  if (urgentCount >= 3) return 'bg-red-100 text-red-700'
  return 'bg-orange-100 text-orange-700'
}

// API
async function loadData() {
  if (typeof window === 'undefined') return
  const token = getToken()
  if (!token) {
    await navigateTo('/login')
    return
  }
  
  // Charger le nom utilisateur depuis localStorage
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    userName.value = user.firstname || user.username || 'Étudiant'
  } catch (e) {
    console.error('Error loading user:', e)
  }
  
  await Promise.all([loadSubjects(), loadAssignments()])
}

async function loadSubjects() {
  try {
    const token = getToken()
    const response = await $fetch('/api/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    subjects.value = response.data || []
  } catch (error) {
    console.error('Erreur matières:', error)
  }
}

async function loadAssignments() {
  try {
    loading.value = true
    const token = getToken()
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    assignments.value = response.data || []
  } catch (error) {
    console.error('Erreur devoirs:', error)
    if (error.status === 401) {
      localStorage.removeItem('token')
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  nextTick(() => {
    // Générer une citation aléatoire après le montage pour éviter les problèmes d'hydration
    motivationalQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
    loadData()
  })
})
</script>