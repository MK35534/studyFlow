import { ref } from 'vue'

// État global
const notifications = ref([])
const unreadCount = ref(0)
const loading = ref(false)

export const useNotifications = () => {
  // Utiliser le composable d'authentification
  const { getToken } = useAuth()

  /**
   * Charger les notifications de l'utilisateur
   */
  const loadNotifications = async (unreadOnly = false) => {
    loading.value = true

    try {
      const token = getToken()
      if (!token) {
        console.warn('Pas de token trouvé')
        return { success: false, message: 'Non authentifié' }
      }

      const url = unreadOnly 
        ? '/api/notifications?unread_only=true' 
        : '/api/notifications'

      const response = await $fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // Envoyer les cookies
      })

      if (response.success) {
        notifications.value = response.notifications
        unreadCount.value = response.unread_count
        return { success: true, data: response }
      }

      return { success: false, message: 'Erreur lors du chargement' }

    } catch (error) {
      console.error('Erreur chargement notifications:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Marquer une notification comme lue/non-lue
   */
  const toggleRead = async (notificationId, isRead = true) => {
    try {
      const token = getToken()
      const response = await $fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: { is_read: isRead }
      })

      if (response.success) {
        // Mettre à jour l'état local
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification) {
          notification.is_read = isRead
          // Recalculer le compteur
          unreadCount.value = notifications.value.filter(n => !n.is_read).length
        }
        return { success: true }
      }

      return { success: false }

    } catch (error) {
      console.error('Erreur toggle read:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  const markAllAsRead = async () => {
    try {
      const token = getToken()
      const response = await $fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      if (response.success) {
        // Mettre à jour l'état local
        notifications.value.forEach(n => n.is_read = true)
        unreadCount.value = 0
        return { success: true, message: response.message }
      }

      return { success: false }

    } catch (error) {
      console.error('Erreur mark all read:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Supprimer une notification
   */
  const deleteNotification = async (notificationId) => {
    try {
      const token = getToken()
      const response = await $fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      if (response.success) {
        // Retirer de l'état local
        const index = notifications.value.findIndex(n => n.id === notificationId)
        if (index > -1) {
          notifications.value.splice(index, 1)
          // Recalculer le compteur
          unreadCount.value = notifications.value.filter(n => !n.is_read).length
        }
        return { success: true }
      }

      return { success: false }

    } catch (error) {
      console.error('Erreur delete notification:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Supprimer toutes les notifications
   */
  const clearAll = async (readOnly = false) => {
    try {
      const token = getToken()
      const response = await $fetch('/api/notifications/clear-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: { read_only: readOnly }
      })

      if (response.success) {
        if (readOnly) {
          // Retirer uniquement les lues
          notifications.value = notifications.value.filter(n => !n.is_read)
        } else {
          // Tout vider
          notifications.value = []
          unreadCount.value = 0
        }
        return { success: true, message: response.message }
      }

      return { success: false }

    } catch (error) {
      console.error('Erreur clear all:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Générer automatiquement les notifications basées sur les devoirs
   */
  const generateNotifications = async () => {
    try {
      const token = getToken()
      const response = await $fetch('/api/notifications/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      if (response.success) {
        // Recharger les notifications
        await loadNotifications()
        return { success: true, data: response }
      }

      return { success: false }

    } catch (error) {
      console.error('Erreur génération notifications:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Obtenir le compteur de notifications non lues seulement
   */
  const getUnreadCount = async () => {
    try {
      const token = getToken()
      const response = await $fetch('/api/notifications?unread_only=true&limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      if (response.success) {
        unreadCount.value = response.unread_count
        return response.unread_count
      }

      return 0

    } catch (error) {
      console.error('Erreur get unread count:', error)
      return 0
    }
  }

  return {
    // État
    notifications,
    unreadCount,
    loading,

    // Méthodes
    loadNotifications,
    toggleRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    generateNotifications,
    getUnreadCount
  }
}

