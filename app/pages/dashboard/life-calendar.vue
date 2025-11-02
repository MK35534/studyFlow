<script setup>
definePageMeta({
  ssr: false,
  middleware: 'auth'
})

const { getToken } = useAuth()
const { theme } = useTheme()
const {
  events,
  loading,
  currentDate,
  categories,
  loadEvents,
  createEvent,
  deleteEvent,
  goToNextDay,
  goToPreviousDay,
  goToToday,
  formatDate
} = useLifeCalendar()

// Vue sélectionnée (day ou week)
const viewMode = ref('week')
const weekEvents = ref({})
const weekLoading = ref(false)

// Calculer le lundi de la semaine actuelle
const getCurrentMonday = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is sunday
  return new Date(d.setDate(diff))
}

const currentMonday = ref(getCurrentMonday(currentDate.value))

// Charger les événements de la semaine
const loadWeekEvents = async () => {
  weekLoading.value = true
  try {
    const token = getToken()
    const weekStart = formatDate(currentMonday.value)
    
    const data = await $fetch(`/api/life-calendar/events-week?weekStart=${weekStart}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    weekEvents.value = data.eventsByDay || {}
  } catch (err) {
    console.error('Erreur chargement semaine:', err)
  } finally {
    weekLoading.value = false
  }
}

// Navigation semaine
const goToNextWeek = () => {
  currentMonday.value = new Date(currentMonday.value.setDate(currentMonday.value.getDate() + 7))
  loadWeekEvents()
}

const goToPreviousWeek = () => {
  currentMonday.value = new Date(currentMonday.value.setDate(currentMonday.value.getDate() - 7))
  loadWeekEvents()
}

const goToThisWeek = () => {
  currentMonday.value = getCurrentMonday(new Date())
  loadWeekEvents()
}

// Générer les 7 jours de la semaine à partir du lundi
const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentMonday.value)
    date.setDate(date.getDate() + i)
    days.push(date)
  }
  return days
})

// Modal d'ajout d'événement
const showAddModal = ref(false)
const newEvent = ref({
  title: '',
  category: 'personal',
  startTime: '',
  endTime: '',
  description: '',
  color: '#6B7280',
  linkedHomework: [], // Devoirs liés (pour sessions de travail)
  isRecurring: false,
  recurringDays: [], // [1,2,3,4,5] pour Lun-Ven
  recurringEndDate: null
})

// Jours de la semaine pour récurrence
const daysOfWeek = [
  { value: 1, label: 'Lun', fullLabel: 'Lundi' },
  { value: 2, label: 'Mar', fullLabel: 'Mardi' },
  { value: 3, label: 'Mer', fullLabel: 'Mercredi' },
  { value: 4, label: 'Jeu', fullLabel: 'Jeudi' },
  { value: 5, label: 'Ven', fullLabel: 'Vendredi' },
  { value: 6, label: 'Sam', fullLabel: 'Samedi' },
  { value: 0, label: 'Dim', fullLabel: 'Dimanche' }
]

// Heures de la journée pour la grille (6h à 23h)
const gridHours = Array.from({ length: 18 }, (_, i) => i + 6)

// Liste des devoirs disponibles (pour lier aux sessions de travail)
const availableHomework = ref([])
const loadingHomework = ref(false)

// Charger les devoirs disponibles
const loadHomework = async () => {
  loadingHomework.value = true
  try {
    const token = getToken()
    const data = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    availableHomework.value = (data.assignments || []).filter(hw => !hw.is_completed)
  } catch (err) {
    console.error('Erreur chargement devoirs:', err)
  } finally {
    loadingHomework.value = false
  }
}

// Charger les événements au montage
onMounted(() => {
  if (viewMode.value === 'day') {
    loadEvents(currentDate.value)
  } else {
    loadWeekEvents()
  }
})

// Watcher pour changer de vue
watch(viewMode, (newMode) => {
  if (newMode === 'day') {
    loadEvents(currentDate.value)
  } else {
    loadWeekEvents()
  }
})

// Date formatée pour l'affichage
const formattedDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return currentDate.value.toLocaleDateString('fr-FR', options)
})

// Générer les heures de la journée (00:00 à 23:00)
const dayHours = computed(() => {
  return Array.from({ length: 24 }, (_, i) => i)
})

// Obtenir les événements pour une heure donnée
const getEventsForHour = (hour) => {
  return events.value.filter(event => {
    if (!event.startTime) return false
    const eventDate = new Date(event.startTime)
    return eventDate.getHours() === hour
  })
}

// Ouvrir le modal d'ajout
const openAddModal = (hour = null, day = null) => {
  // Charger les devoirs disponibles si c'est une session de travail
  loadHomework()
  
  let dateStr
  if (viewMode.value === 'week' && day) {
    dateStr = formatDateString(day)
  } else {
    dateStr = formatDate(currentDate.value)
  }
  
  const hourStr = hour !== null ? String(hour).padStart(2, '0') : '08'
  
  newEvent.value = {
    title: '',
    category: 'personal',
    startTime: `${dateStr}T${hourStr}:00`,
    endTime: `${dateStr}T${hourStr}:30`,
    description: '',
    color: categories.personal.color,
    linkedHomework: [],
    isRecurring: false,
    recurringDays: [],
    recurringEndDate: ''
  }
  showAddModal.value = true
}

// Calcule la position CSS d'un événement sur la grille horaire
const getEventPosition = (event) => {
  if (!event.startTime || !event.endTime) {
    return { display: 'none' }
  }

  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)
  
  // Heure de début et fin en décimal (ex: 14.5 pour 14h30)
  const startHour = startDate.getHours() + startDate.getMinutes() / 60
  const endHour = endDate.getHours() + endDate.getMinutes() / 60
  
  // Calculer la position par rapport à la grille (6h = 0)
  const gridStart = 6 // Première heure de la grille
  const topPosition = (startHour - gridStart) * 64 // 64px par heure (h-16)
  const height = (endHour - startHour) * 64
  
  return {
    top: `${topPosition}px`,
    height: `${height}px`,
    minHeight: '32px' // Hauteur minimale
  }
}


// Sauvegarder l'événement
const saveEvent = async () => {
  if (!newEvent.value.title.trim()) {
    const { error } = useToast()
    error('Erreur', 'Le titre est obligatoire')
    return
  }

  await createEvent({
    title: newEvent.value.title,
    category: newEvent.value.category,
    startTime: newEvent.value.startTime,
    endTime: newEvent.value.endTime,
    description: newEvent.value.description,
    color: newEvent.value.color
  })

  showAddModal.value = false
}

// Mettre à jour la couleur selon la catégorie
watch(() => newEvent.value.category, (newCategory) => {
  newEvent.value.color = categories[newCategory]?.color || '#6B7280'
})

// Obtenir la catégorie d'un événement
const getCategory = (event) => {
  if (event.source === 'homework') return categories.homework
  if (event.source === 'pronote_timetable') return categories.course
  return categories[event.category] || categories.other
}

// Calculer la hauteur d'un événement en fonction de sa durée
const getEventHeight = (event) => {
  if (!event.startTime || !event.endTime) return 'auto'
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  const durationMinutes = (end - start) / (1000 * 60)
  const heightRem = Math.max(3, durationMinutes / 10) // Min 3rem
  return `${heightRem}rem`
}

// Formater une date en string YYYY-MM-DD
const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Header compact et fixe -->
    <div class="flex-shrink-0 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Titre -->
          <div class="flex items-center gap-4">
            <div :class="`p-3 bg-gradient-to-br ${theme.gradient} rounded-xl shadow-lg`">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Life Calendar
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Organisez votre vie
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Navigation -->
            <div v-if="viewMode === 'week'" class="flex items-center gap-2">
              <button 
                @click="goToPreviousWeek"
                :class="`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all border ${theme.border}`"
              >
                <svg class="w-5 h-5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button 
                @click="goToThisWeek"
                :class="`px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-lg font-medium shadow hover:shadow-lg transition-all text-sm`"
              >
                Cette semaine
              </button>

              <button 
                @click="goToNextWeek"
                :class="`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all border ${theme.border}`"
              >
                <svg class="w-5 h-5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Toggle Vue -->
            <div :class="`flex items-center gap-1 p-1 rounded-lg border ${theme.border} bg-gray-50 dark:bg-gray-900`">
              <button
                @click="viewMode = 'day'"
                :class="[
                  'px-3 py-1.5 rounded-md font-medium transition-all text-sm',
                  viewMode === 'day' 
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow` 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                ]"
              >
                Jour
              </button>
              <button
                @click="viewMode = 'week'"
                :class="[
                  'px-3 py-1.5 rounded-md font-medium transition-all text-sm',
                  viewMode === 'week' 
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow` 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                ]"
              >
                Semaine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu en plein écran -->
    <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <!-- Loader -->
      <div v-if="(viewMode === 'day' && loading) || (viewMode === 'week' && weekLoading)" class="flex justify-center items-center h-full">
        <div :class="`animate-spin rounded-full h-12 w-12 border-b-2 ${theme.border}`"></div>
      </div>

      <!-- VUE SEMAINE PLEIN ÉCRAN AVEC GRILLE HORAIRE -->
      <div v-else-if="viewMode === 'week'" class="h-full flex">
        <!-- Colonne des heures -->
        <div class="flex-shrink-0 w-20 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div class="h-24"></div> <!-- Espace pour header -->
          <div class="relative">
            <div 
              v-for="hour in gridHours" 
              :key="hour"
              class="h-16 border-t border-gray-200 dark:border-gray-700 flex items-start justify-end pr-3 pt-1"
            >
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ String(hour).padStart(2, '0') }}:00
              </span>
            </div>
          </div>
        </div>

        <!-- Grille des jours avec heures -->
        <div class="flex-1 overflow-auto">
          <div class="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="(day, index) in weekDays" 
              :key="index"
              class="min-w-[140px]"
            >
              <!-- Header du jour (fixe) -->
              <div :class="[
                'sticky top-0 z-10 text-center py-4 border-b-2 border-gray-200 dark:border-gray-700 h-24 flex flex-col items-center justify-center',
                formatDateString(day) === formatDateString(new Date()) 
                  ? 'bg-gradient-to-r ' + theme.gradientBg + ' border-b-4 ' + theme.border
                  : 'bg-white dark:bg-gray-800'
              ]">
                <div class="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {{ day.toLocaleDateString('fr-FR', { weekday: 'short' }) }}
                </div>
                <div :class="[
                  'text-3xl font-bold mt-1',
                  formatDateString(day) === formatDateString(new Date()) 
                    ? theme.text 
                    : 'text-gray-900 dark:text-gray-100'
                ]">
                  {{ day.getDate() }}
                </div>
              </div>

              <!-- Grille horaire du jour -->
              <div class="relative bg-white dark:bg-gray-800">
                <!-- Lignes d'heures en arrière-plan -->
                <div 
                  v-for="hour in gridHours" 
                  :key="hour"
                  class="h-16 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group cursor-pointer"
                  @click="openAddModal(hour, day)"
                >
                  <!-- Indicateur au hover -->
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center h-full">
                    <svg class="w-5 h-5" :class="theme.text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                <!-- Événements positionnés absolument -->
                <div class="absolute inset-0 pointer-events-none">
                  <div
                    v-for="event in weekEvents[formatDateString(day)] || []"
                    :key="event.id"
                    :style="getEventPosition(event)"
                    class="absolute left-1 right-1 rounded-lg border-l-4 p-2 shadow-md hover:shadow-xl transition-all pointer-events-auto cursor-pointer group overflow-hidden"
                    :class="[getCategory(event).bgClass, getCategory(event).borderClass]"
                  >
                    <div class="flex items-start justify-between gap-1">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1">
                          <span class="text-sm">{{ getCategory(event).icon }}</span>
                          <h3 class="font-bold text-xs text-gray-900 dark:text-white truncate">
                            {{ event.title }}
                          </h3>
                        </div>
                        
                        <div v-if="event.startTime && event.endTime" class="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
                          {{ new Date(event.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
                        </div>

                        <div v-if="event.source === 'pronote_timetable'" class="mt-1">
                          <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Pronote
                          </span>
                        </div>
                      </div>

                      <!-- Bouton suppression -->
                      <button
                        v-if="event.source !== 'pronote_timetable'"
                        @click.stop="deleteEvent(event.id)"
                        class="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex-shrink-0"
                      >
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VUE JOUR (ancienne timeline) -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Chaque heure -->
          <div 
            v-for="hour in dayHours" 
            :key="hour"
            class="flex hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <!-- Colonne Heure -->
            <div class="w-20 flex-shrink-0 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-right border-r border-gray-200 dark:border-gray-700">
              {{ String(hour).padStart(2, '0') }}:00
            </div>

            <!-- Colonne Événements -->
            <div class="flex-1 p-2 min-h-[4rem] relative">
              <!-- Bouton d'ajout au survol -->
              <button
                @click="openAddModal(hour)"
                class="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Ajouter un événement"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <!-- Événements de cette heure -->
              <div class="space-y-2">
                <div
                  v-for="event in getEventsForHour(hour)"
                  :key="event.id"
                  class="p-3 rounded-lg border-l-4 transition-all hover:shadow-md cursor-pointer"
                  :class="[getCategory(event).bgClass, getCategory(event).borderClass]"
                  :style="{ minHeight: getEventHeight(event) }"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-lg">{{ getCategory(event).icon }}</span>
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                          {{ event.title }}
                        </h3>
                      </div>
                      
                      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{{ getCategory(event).label }}</span>
                        <span v-if="event.startTime && event.endTime">
                          • {{ new Date(event.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }} - 
                          {{ new Date(event.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                        <span v-if="event.source === 'homework'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Devoir à faire
                        </span>
                        <span v-if="event.source === 'pronote_timetable'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          📖 Auto-importé de Pronote
                        </span>
                      </div>
                      
                      <p v-if="event.description" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {{ event.description }}
                      </p>
                    </div>

                    <!-- Bouton suppression (seulement pour événements personnels) -->
                    <button
                      v-if="event.source !== 'homework' && event.source !== 'pronote_timetable'"
                      @click.stop="deleteEvent(event.id)"
                      class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Message si aucun événement -->
                <div v-if="getEventsForHour(hour).length === 0" class="text-center text-gray-400 dark:text-gray-600 text-sm py-2">
                  Aucun événement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout d'événement -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span :class="`p-2 bg-gradient-to-br ${theme.gradient} rounded-lg`">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                Nouvelle activité
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Organisez votre temps et vos activités
              </p>
            </div>
            <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveEvent" class="space-y-4">
            <!-- Titre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre *
              </label>
              <input
                v-model="newEvent.title"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Football"
                required
              />
            </div>

            <!-- Catégorie -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type d'activité *
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="(cat, key) in categories"
                  :key="key"
                  v-show="key !== 'course'"
                  type="button"
                  @click="newEvent.category = key"
                  :class="[
                    'p-3 rounded-lg border-2 transition-all text-left',
                    newEvent.category === key 
                      ? `${cat.borderClass} ${cat.bgClass} border-opacity-100` 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{{ cat.icon }}</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ cat.label }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Lier des devoirs (seulement pour sessions de travail) -->
            <div v-if="newEvent.category === 'work' && availableHomework.length > 0" class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <label class="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-3">
                📚 Lier des devoirs à cette session
              </label>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <label 
                  v-for="hw in availableHomework" 
                  :key="hw.id"
                  class="flex items-center gap-2 p-2 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="hw.id"
                    v-model="newEvent.linkedHomework"
                    class="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ hw.title }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ hw.subject_name }}</div>
                  </div>
                </label>
              </div>
              <p class="text-xs text-purple-700 dark:text-purple-300 mt-2">
                💡 Sélectionnez les devoirs sur lesquels vous allez travailler
              </p>
            </div>

            <!-- Heure début -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ⏰ Heure de début
              </label>
              <input
                v-model="newEvent.startTime"
                type="datetime-local"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-all',
                  'focus:ring-4 focus:outline-none',
                  'dark:bg-gray-700 dark:text-white',
                  `border-${theme.color}-200 focus:border-${theme.color}-500 focus:ring-${theme.color}-100`
                ]"
                required
              />
            </div>

            <!-- Heure fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ⏱️ Heure de fin
              </label>
              <input
                v-model="newEvent.endTime"
                type="datetime-local"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-all',
                  'focus:ring-4 focus:outline-none',
                  'dark:bg-gray-700 dark:text-white',
                  `border-${theme.color}-200 focus:border-${theme.color}-500 focus:ring-${theme.color}-100`
                ]"
                required
              />
            </div>

            <!-- Événement récurrent -->
            <div class="border-2 border-dashed rounded-xl p-4" :class="`border-${theme.color}-200 dark:border-${theme.color}-800`">
              <div class="flex items-center gap-3 mb-3">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="newEvent.isRecurring" class="sr-only peer">
                  <div :class="`w-11 h-6 ${theme.bg} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${theme.color}-300 dark:peer-focus:ring-${theme.color}-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`"></div>
                  <span class="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">🔁 Événement récurrent</span>
                </label>
              </div>

              <div v-if="newEvent.isRecurring" class="space-y-3 mt-3 pl-2 border-l-4" :class="`border-${theme.color}-300`">
                <!-- Sélection des jours -->
                <div>
                  <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Jours de répétition
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="day in daysOfWeek"
                      :key="day.value"
                      class="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        :value="day.value"
                        v-model="newEvent.recurringDays"
                        class="sr-only peer"
                      />
                      <div :class="[
                        'px-3 py-1.5 rounded-lg border-2 transition-all font-medium text-sm',
                        'peer-checked:' + theme.bg + ' peer-checked:border-' + theme.color + '-500 peer-checked:text-white',
                        'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      ]">
                        {{ day.short }}
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Date de fin de récurrence -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Jusqu'au (optionnel)
                  </label>
                  <input
                    v-model="newEvent.recurringEndDate"
                    type="date"
                    :class="[
                      'w-full px-3 py-2 border-2 rounded-lg transition-all text-sm',
                      'focus:ring-2 focus:outline-none',
                      'dark:bg-gray-700 dark:text-white',
                      `border-${theme.color}-200 focus:border-${theme.color}-500`
                    ]"
                  />
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                v-model="newEvent.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Détails optionnels..."
              ></textarea>
            </div>

            <!-- Boutons -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="showAddModal = false"
                class="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                :class="`flex-1 px-4 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-lg hover:shadow-lg transition-all font-semibold`"
              >
                ✨ Créer l'activité
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
