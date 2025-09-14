import { ref } from 'vue'

// État global des toasts
const toasts = ref([])
let toastId = 0

export const useToast = () => {
  // Ajouter un toast
  const addToast = (title, message = '', type = 'info', duration = 4000) => {
    const id = ++toastId
    const toast = {
      id,
      title,
      message,
      type,
      duration,
      progress: 100,
      timer: null
    }

    toasts.value.push(toast)

    // Démarrer le timer de suppression automatique
    if (duration > 0) {
      startToastTimer(toast)
    }

    return id
  }

  // Démarrer le timer avec barre de progression
  const startToastTimer = (toast) => {
    const interval = 100 // Mise à jour toutes les 100ms
    const decrement = (interval / toast.duration) * 100

    toast.timer = setInterval(() => {
      toast.progress -= decrement
      
      if (toast.progress <= 0) {
        removeToast(toast.id)
      }
    }, interval)
  }

  // Supprimer un toast
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      const toast = toasts.value[index]
      if (toast.timer) {
        clearInterval(toast.timer)
      }
      toasts.value.splice(index, 1)
    }
  }

  // Supprimer tous les toasts
  const clearToasts = () => {
    toasts.value.forEach(toast => {
      if (toast.timer) {
        clearInterval(toast.timer)
      }
    })
    toasts.value = []
  }

  // Méthodes de commodité
  const success = (title, message = '') => {
    return addToast(title, message, 'success')
  }

  const error = (title, message = '') => {
    return addToast(title, message, 'error', 6000) // Plus long pour les erreurs
  }

  const warning = (title, message = '') => {
    return addToast(title, message, 'warning')
  }

  const info = (title, message = '') => {
    return addToast(title, message, 'info')
  }

  // Pauser/reprendre un toast au hover
  const pauseToast = (id) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast && toast.timer) {
      clearInterval(toast.timer)
      toast.timer = null
    }
  }

  const resumeToast = (id) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast && !toast.timer && toast.progress > 0) {
      startToastTimer(toast)
    }
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    pauseToast,
    resumeToast
  }
}