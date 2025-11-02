export const useLifeCalendar = () => {
  const events = ref([])
  const loading = ref(false)
  const currentDate = ref(new Date())

  // Catégories avec leurs couleurs et icônes
  const categories = {
    course: {
      label: 'Cours',
      color: '#3B82F6',
      icon: '📖',
      bgClass: 'bg-blue-50 dark:bg-blue-950',
      borderClass: 'border-blue-500'
    },
    work: {
      label: 'Session de travail',
      color: '#8B5CF6',
      icon: '✍️',
      bgClass: 'bg-purple-50 dark:bg-purple-950',
      borderClass: 'border-purple-500',
      canLinkHomework: true
    },
    sport: {
      label: 'Sport / Entraînement',
      color: '#10B981',
      icon: '⚽',
      bgClass: 'bg-green-50 dark:bg-green-950',
      borderClass: 'border-green-500'
    },
    sideproject: {
      label: 'Projet personnel',
      color: '#F59E0B',
      icon: '💡',
      bgClass: 'bg-amber-50 dark:bg-amber-950',
      borderClass: 'border-amber-500'
    },
    travel: {
      label: 'Trajet',
      color: '#6366F1',
      icon: '🚗',
      bgClass: 'bg-indigo-50 dark:bg-indigo-950',
      borderClass: 'border-indigo-500'
    },
    leisure: {
      label: 'Détente',
      color: '#EC4899',
      icon: '☕',
      bgClass: 'bg-pink-50 dark:bg-pink-950',
      borderClass: 'border-pink-500'
    },
    entertainment: {
      label: 'Divertissement',
      color: '#14B8A6',
      icon: '🎮',
      bgClass: 'bg-teal-50 dark:bg-teal-950',
      borderClass: 'border-teal-500'
    },
    meal: {
      label: 'Repas',
      color: '#EF4444',
      icon: '🍽️',
      bgClass: 'bg-red-50 dark:bg-red-950',
      borderClass: 'border-red-500'
    },
    sleep: {
      label: 'Sommeil',
      color: '#6B7280',
      icon: '😴',
      bgClass: 'bg-gray-50 dark:bg-gray-950',
      borderClass: 'border-gray-500'
    },
    personal: {
      label: 'Personnel',
      color: '#A855F7',
      icon: '✨',
      bgClass: 'bg-purple-50 dark:bg-purple-950',
      borderClass: 'border-purple-500'
    },
    other: {
      label: 'Autre',
      color: '#64748B',
      icon: '📌',
      bgClass: 'bg-slate-50 dark:bg-slate-950',
      borderClass: 'border-slate-500'
    }
  }

  // Charger les événements d'une date
  const loadEvents = async (date) => {
    loading.value = true
    try {
      const { getToken } = useAuth()
      const token = getToken()
      
      const dateStr = formatDate(date)
      
      const response = await $fetch('/api/life-calendar/events', {
        headers: { Authorization: `Bearer ${token}` },
        query: { date: dateStr }
      })
      
      events.value = response.events || []
    } catch (error) {
      console.error('Erreur chargement événements:', error)
      const { error: errorToast } = useToast()
      errorToast('Erreur', 'Impossible de charger les événements')
    } finally {
      loading.value = false
    }
  }

  // Créer un événement
  const createEvent = async (eventData) => {
    try {
      const { getToken } = useAuth()
      const token = getToken()
      
      const response = await $fetch('/api/life-calendar/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: eventData
      })
      
      if (response.success) {
        await loadEvents(currentDate.value)
        const { success } = useToast()
        success('Événement créé', eventData.title)
        return response.event
      }
    } catch (error) {
      console.error('Erreur création événement:', error)
      const { error: errorToast } = useToast()
      errorToast('Erreur', 'Impossible de créer l\'événement')
      throw error
    }
  }

  // Supprimer un événement
  const deleteEvent = async (eventId) => {
    try {
      const { getToken } = useAuth()
      const token = getToken()
      
      await $fetch(`/api/life-calendar/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      await loadEvents(currentDate.value)
      const { success } = useToast()
      success('Événement supprimé')
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      const { error: errorToast } = useToast()
      errorToast('Erreur', 'Impossible de supprimer l\'événement')
    }
  }

  // Formater la date pour l'API
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Naviguer entre les jours
  const goToNextDay = () => {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 1)
    currentDate.value = newDate
    loadEvents(newDate)
  }

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 1)
    currentDate.value = newDate
    loadEvents(newDate)
  }

  const goToToday = () => {
    currentDate.value = new Date()
    loadEvents(currentDate.value)
  }

  // Grouper les événements par heure
  const getEventsByTimeSlot = (hour) => {
    return events.value.filter(event => {
      if (!event.startTime) return false
      const eventDate = new Date(event.startTime)
      return eventDate.getHours() === hour
    })
  }

  // Obtenir les événements sans horaire (devoirs)
  const getUnscheduledEvents = () => {
    return events.value.filter(event => !event.startTime)
  }

  return {
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
    getEventsByTimeSlot,
    getUnscheduledEvents,
    formatDate
  }
}
