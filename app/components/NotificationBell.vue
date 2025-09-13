<template>
  <div class="relative">
    <!-- Bouton de notification -->
    <!-- Dans NotificationBell.vue, remplace le bouton par -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <span class="text-xl">🔔</span>
      
      <!-- Badge de notification -->
      <span
        v-if="urgentCount > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px]"
      >
        {{ urgentCount > 99 ? '99+' : urgentCount }}
      </span>
    </button>

    <!-- Dropdown des notifications - FIXED positioning -->
    <div
      v-if="showDropdown"
      class="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      style="max-height: calc(100vh - 120px);"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            v-if="notifications.length > 0"
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-500"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <!-- Liste des notifications -->
      <div class="overflow-y-auto" style="max-height: calc(100vh - 200px);">
        <div v-if="notifications.length === 0" class="p-6 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-gray-500">Aucune notification</p>
          <p class="text-sm text-gray-400">Tous vos devoirs sont sous contrôle !</p>
        </div>

        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
            !notification.read ? 'bg-blue-50' : ''
          ]"
          @click="handleNotificationClick(notification)"
        >
          <!-- Contenu notification identique -->
          <div class="flex items-start space-x-3">
            <div
              :class="[
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                getNotificationStyle(notification.type).bg
              ]"
            >
              <div :class="[
                'w-4 h-4 rounded-full',
                getNotificationStyle(notification.type).text
              ]"></div>
            </div>

            <div class="flex-1 min-w-0">
              <p :class="[
                'text-sm font-medium',
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              ]">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-400 mt-2">
                {{ formatNotificationTime(notification.created_at) }}
              </p>
            </div>

            <div v-if="!notification.read" class="flex-shrink-0">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 0" class="p-4 border-t border-gray-200">
        <button
          @click="goToAssignments"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Voir tous les devoirs →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  assignments: {
    type: Array,
    default: () => []
  }
})

// États
const showDropdown = ref(false)
const notifications = ref([])

// Computed
const urgentCount = computed(() => {
  return notifications.value.filter(n => !n.read && n.type !== 'info').length
})

// Générer les notifications basées sur les devoirs
const generateNotifications = () => {
  const now = new Date()
  const newNotifications = []
  
  props.assignments.forEach(assignment => {
    if (assignment.is_completed) return
    
    const dueDate = new Date(assignment.due_date)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let notification = null
    
    if (diffDays < 0) {
      // En retard
      notification = {
        id: `overdue-${assignment.id}`,
        type: 'overdue',
        title: 'Devoir en retard !',
        message: `"${assignment.title}" était à rendre ${Math.abs(diffDays)} jour(s) plus tôt`,
        assignment_id: assignment.id,
        created_at: new Date(),
        read: false
      }
    } else if (diffDays === 0) {
      // Aujourd'hui
      notification = {
        id: `today-${assignment.id}`,
        type: 'urgent',
        title: 'Devoir à rendre aujourd\'hui !',
        message: `"${assignment.title}" est à rendre aujourd'hui`,
        assignment_id: assignment.id,
        created_at: new Date(),
        read: false
      }
    } else if (diffDays === 1) {
      // Demain
      notification = {
        id: `tomorrow-${assignment.id}`,
        type: 'warning',
        title: 'Devoir à rendre demain',
        message: `"${assignment.title}" est à rendre demain`,
        assignment_id: assignment.id,
        created_at: new Date(),
        read: false
      }
    } else if (diffDays <= 3) {
      // Cette semaine
      notification = {
        id: `soon-${assignment.id}`,
        type: 'info',
        title: 'Devoir à venir',
        message: `"${assignment.title}" est à rendre dans ${diffDays} jours`,
        assignment_id: assignment.id,
        created_at: new Date(),
        read: false
      }
    }
    
    if (notification) {
      // Vérifier si cette notification n'existe pas déjà
      const existing = notifications.value.find(n => n.id === notification.id)
      if (!existing) {
        newNotifications.push(notification)
      }
    }
  })
  
  // Ajouter les nouvelles notifications
  if (newNotifications.length > 0) {
    notifications.value = [...newNotifications, ...notifications.value]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 20) // Garder max 20 notifications
  }
}

// Styles par type de notification
const getNotificationStyle = (type) => {
  const styles = {
    overdue: { bg: 'bg-red-100', text: 'text-red-600' },
    urgent: { bg: 'bg-orange-100', text: 'text-orange-600' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    info: { bg: 'bg-blue-100', text: 'text-blue-600' }
  }
  return styles[type] || styles.info
}

// Icônes par type
const getNotificationIcon = (type) => {
  return 'svg' // Composant SVG simple
}

// Actions
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleNotificationClick = (notification) => {
  // Marquer comme lu
  notification.read = true
  
  // Rediriger vers les devoirs
  goToAssignments()
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const goToAssignments = () => {
  showDropdown.value = false
  navigateTo('/assignments')
}

const formatNotificationTime = (date) => {
  const now = new Date()
  const notifDate = new Date(date)
  const diffMinutes = Math.floor((now - notifDate) / (1000 * 60))
  
  if (diffMinutes < 1) return 'À l\'instant'
  if (diffMinutes < 60) return `Il y a ${diffMinutes}min`
  if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)}h`
  return `Il y a ${Math.floor(diffMinutes / 1440)}j`
}

// Fermer le dropdown en cliquant ailleurs
const handleClickOutside = (event) => {
  if (showDropdown.value && !event.target.closest('.relative')) {
    showDropdown.value = false
  }
}

// Watchers et lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Générer les notifications initiales
  generateNotifications()
  
  // Mettre à jour les notifications toutes les minutes
  const interval = setInterval(() => {
    generateNotifications()
  }, 60000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watcher pour regenerer les notifications quand les devoirs changent
watch(() => props.assignments, () => {
  generateNotifications()
}, { deep: true })
</script>