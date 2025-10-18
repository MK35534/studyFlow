<template>
  <div class="relative z-[9999]">
    <!-- Bouton de notification moderne -->
    <button
      @click="openPanel"
      class="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gradient-to-br hover:from-gray-50 dark:hover:from-gray-800 hover:to-gray-100 dark:hover:to-gray-700 rounded-xl transition-all duration-200 group"
    >
      <svg class="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      
      <!-- Badge de notification moderne avec animation pulse -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-full min-w-[18px] shadow-lg shadow-blue-500/50 ring-2 ring-white dark:ring-gray-900"
        :class="{ 'animate-pulse bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50': hasUrgent }"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- NotificationCenter Panel -->
    <NotificationCenter
      :is-open="isPanelOpen"
      @close="closePanel"
      @update="handleUpdate"
      ref="notificationCenter"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// État
const isPanelOpen = ref(false)
const unreadCount = ref(0)
const hasUrgent = ref(false)
const notificationCenter = ref(null)

// Actions
const openPanel = () => {
  isPanelOpen.value = true
}

const closePanel = () => {
  isPanelOpen.value = false
}

const handleUpdate = (newUnreadCount) => {
  unreadCount.value = newUnreadCount
  checkForUrgent()
}

// Charger le compteur initial
const loadUnreadCount = async () => {
  try {
    // Vérifier si on est côté client
    if (process.server) return
    
    const token = localStorage.getItem('token')
    
    // Si pas de token, pas de requête
    if (!token || token === 'null' || token === 'undefined') {
      console.warn('⚠️ Pas de token JWT trouvé pour les notifications')
      return
    }

    const response = await $fetch('/api/notifications?unread_only=true&limit=100', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.success) {
      unreadCount.value = response.unread_count
      checkForUrgent(response.notifications)
    }
  } catch (error) {
    console.error('Erreur chargement compteur notifications:', error)
    
    // Si erreur JWT, vider le token corrompu
    if (error.message?.includes('jwt') || error.message?.includes('malformed')) {
      console.warn('⚠️ Token JWT invalide, nettoyage...')
      localStorage.removeItem('token')
    }
  }
}

// Vérifier s'il y a des notifications urgentes
const checkForUrgent = (notifications = null) => {
  if (notifications) {
    hasUrgent.value = notifications.some(n => !n.is_read && (n.type === 'urgent' || n.type === 'warning'))
  }
}

// Rafraîchir toutes les 30 secondes
let refreshInterval = null

onMounted(() => {
  // Attendre un peu avant le premier chargement (laisser le temps au token de se charger)
  setTimeout(() => {
    loadUnreadCount()
  }, 500)
  
  // Rafraîchir le compteur régulièrement (seulement si connecté)
  refreshInterval = setInterval(() => {
    const token = localStorage.getItem('token')
    if (token && token !== 'null' && token !== 'undefined') {
      loadUnreadCount()
    }
  }, 30000) // 30 secondes
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Exposer une méthode pour recharger depuis l'extérieur
defineExpose({
  reload: loadUnreadCount
})
</script>
