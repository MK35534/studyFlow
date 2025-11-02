<template>
  <!-- Panel coulissant (slide-in from right) -->
  <Teleport to="body">
    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[9998]"
        @click="closePanel"
      ></div>
    </Transition>

    <!-- Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-[9999] flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span class="text-xl">🔔</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ unreadCount }} non lue{{ unreadCount > 1 ? 's' : '' }}
              </p>
            </div>
          </div>
          
          <button
            @click="closePanel"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Actions rapides -->
        <div class="flex gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <button
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
            class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            ✓ Tout marquer lu
          </button>
          <button
            @click="clearAll"
            :disabled="notifications.length === 0"
            class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            🗑️ Tout supprimer
          </button>
        </div>

        <!-- Liste des notifications -->
        <div class="flex-1 overflow-y-auto">
          <!-- Chargement -->
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="flex flex-col items-center gap-3">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          </div>

          <!-- Aucune notification -->
          <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center h-64 px-6">
            <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <span class="text-4xl">📭</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune notification</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
              Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.
            </p>
          </div>

          <!-- Liste -->
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <TransitionGroup
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 -translate-x-4"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0 translate-x-4"
            >
              <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="[
                  'p-4 transition-all cursor-pointer',
                  !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                ]"
                @click="toggleRead(notification)"
              >
                <div class="flex gap-3">
                  <!-- Icône avec badge type -->
                  <div class="flex-shrink-0 relative">
                    <div :class="[
                      'w-12 h-12 rounded-xl flex items-center justify-center ring-2 ring-white dark:ring-gray-900',
                      getNotificationBg(notification.type)
                    ]">
                      <span class="text-xl">{{ getNotificationIcon(notification.type) }}</span>
                    </div>
                    <!-- Badge non-lu -->
                    <div
                      v-if="!notification.is_read"
                      class="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full ring-2 ring-white dark:ring-gray-900"
                    ></div>
                  </div>

                  <!-- Contenu -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <h4 :class="[
                        'font-semibold text-sm',
                        !notification.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      ]">
                        {{ notification.title }}
                      </h4>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ formatDate(notification.created_at) }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {{ notification.message }}
                    </p>

                    <!-- Info devoir associé -->
                    <div v-if="notification.assignment_title" class="flex items-center gap-2 text-xs">
                      <span
                        :style="{ backgroundColor: notification.subject_color }"
                        class="px-2 py-1 rounded-md text-white font-medium"
                      >
                        {{ notification.subject_name }}
                      </span>
                      <span class="text-gray-500 dark:text-gray-400">
                        {{ notification.assignment_title }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex-shrink-0 flex flex-col gap-1">
                    <button
                      @click.stop="deleteNotification(notification.id)"
                      class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '~/composables/useToats'

// Authentification
const { getToken } = useAuth()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update'])

const { success, error } = useToast()

// État
const notifications = ref([])
const loading = ref(false)
const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)

// Charger les notifications quand le panel s'ouvre
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadNotifications()
  }
})

// Charger les notifications
const loadNotifications = async () => {
  loading.value = true
  
  try {
    const token = getToken()
    const response = await $fetch('/api/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success) {
      notifications.value = response.notifications
      emit('update', response.unread_count)
    }
  } catch (err) {
    console.error('Erreur chargement notifications:', err)
    error('Erreur', 'Impossible de charger les notifications')
  } finally {
    loading.value = false
  }
}

// Fermer le panel
const closePanel = () => {
  emit('close')
}

// Marquer comme lu/non-lu
const toggleRead = async (notification) => {
  try {
    const token = getToken()
    const newReadState = !notification.is_read

    const response = await $fetch(`/api/notifications/${notification.id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        is_read: newReadState
      }
    })

    if (response.success) {
      notification.is_read = newReadState
      emit('update', unreadCount.value)
    }
  } catch (err) {
    console.error('Erreur toggle read:', err)
    error('Erreur', 'Impossible de mettre à jour la notification')
  }
}

// Marquer tout comme lu
const markAllAsRead = async () => {
  try {
    const token = getToken()
    const response = await $fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success) {
      notifications.value.forEach(n => n.is_read = true)
      emit('update', 0)
      success('✓ Succès', response.message)
    }
  } catch (err) {
    console.error('Erreur mark all read:', err)
    error('Erreur', 'Impossible de marquer toutes les notifications')
  }
}

// Tout supprimer
const clearAll = async () => {
  if (!confirm('Voulez-vous vraiment supprimer toutes les notifications ?')) {
    return
  }

  try {
    const token = getToken()
    const response = await $fetch('/api/notifications/clear-all', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {}
    })

    if (response.success) {
      notifications.value = []
      emit('update', 0)
      success('✓ Succès', response.message)
    }
  } catch (err) {
    console.error('Erreur clear all:', err)
    error('Erreur', 'Impossible de supprimer les notifications')
  }
}

// Supprimer une notification
const deleteNotification = async (id) => {
  try {
    const token = getToken()
    const response = await $fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success) {
      const index = notifications.value.findIndex(n => n.id === id)
      if (index > -1) {
        notifications.value.splice(index, 1)
        emit('update', unreadCount.value)
      }
      success('✓ Supprimée', 'Notification supprimée')
    }
  } catch (err) {
    console.error('Erreur delete notification:', err)
    error('Erreur', 'Impossible de supprimer la notification')
  }
}

// Helpers visuels
const getNotificationBg = (type) => {
  const styles = {
    urgent: 'bg-gradient-to-br from-red-500 to-red-600',
    warning: 'bg-gradient-to-br from-orange-500 to-orange-600',
    success: 'bg-gradient-to-br from-green-500 to-green-600',
    info: 'bg-gradient-to-br from-blue-500 to-blue-600'
  }
  return styles[type] || styles.info
}

const getNotificationIcon = (type) => {
  const icons = {
    urgent: '⚠️',
    warning: '⏰',
    success: '✅',
    info: 'ℹ️'
  }
  return icons[type] || icons.info
}

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// Exposer la méthode reload
defineExpose({
  loadNotifications
})
</script>

