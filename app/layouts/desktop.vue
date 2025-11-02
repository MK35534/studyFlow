<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
    <!-- Sidebar moderne avec gradient -->
    <aside class="w-64 bg-white/80 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-r-2 border-gray-200 dark:border-gray-700 relative z-50 transition-colors duration-300">
      <div class="p-6">
        <!-- Logo avec gradient text -->
        <h1 class="text-2xl font-bold mb-8 bg-gradient-to-r" :class="theme.gradient + ' bg-clip-text text-transparent'">
          StudyFlow
        </h1>
        
        <!-- Navigation moderne -->
        <nav class="space-y-1.5">
          <NuxtLink 
            to="/dashboard" 
            :class="[
              'flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 group',
              isActive('/') 
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}` 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <span class="font-semibold">Dashboard</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/dashboard/subjects" 
            :class="[
              'flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 group',
              isActive('/dashboard/subjects') 
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}` 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="font-semibold">Matières</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/dashboard/assignments" 
            :class="[
              'flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 group',
              isActive('/dashboard/assignments') 
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}` 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span class="font-semibold">Devoirs</span>
          </NuxtLink>

          <div 
            class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative opacity-50 cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div class="flex-1">
              <span class="font-semibold text-gray-700 dark:text-gray-300">Life Calendar</span>
              <span class="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bientôt disponible</span>
            </div>
          </div>

          <NuxtLink 
            to="/dashboard/focus" 
            :class="[
              'flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 group',
              isActive('/dashboard/focus') 
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}` 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-semibold">Mode Focus</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Aide et Thème -->
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 space-y-2 transition-colors duration-300">
        <!-- Sélecteur de thème -->
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Thème</span>
          <ThemeSwitcher align="left" />
        </div>
        
        <!-- Raccourcis -->
        <button
          @click="showHelpModal = true"
          class="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors w-full py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Raccourcis (?)
        </button>
      </div>
      
      <!-- User section moderne en bas -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/95 backdrop-blur-sm transition-colors duration-300">
        <button 
          @click="navigateTo('/dashboard/profile')"
          class="flex items-center w-full p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 group"
        >
          <div class="flex items-center flex-1 min-w-0">
            <div :class="`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`">
              <span class="text-white text-sm font-bold">{{ userInitials }}</span>
            </div>
            <div class="ml-3 min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Voir le profil →</p>
            </div>
          </div>
        </button>
      </div>
    </aside>
    
    <!-- Contenu principal avec gradient bg -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative transition-colors duration-300">
      <!-- Header avec notifications -->
      <div class="sticky top-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-end shadow-sm transition-colors duration-300">
        <NotificationBell :assignments="assignments" />
      </div>
      
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>

  <!-- Command Palette -->
  <CommandPalette
    :show="showCommandPalette"
    :assignments="assignments"
    :subjects="subjects"
    @close="showCommandPalette = false"
    @execute="handlePaletteAction"
  />

  <!-- Modal d'aide raccourcis -->
  <KeyboardHelpModal
    :show="showHelpModal"
    @close="showHelpModal = false"
  />

  <!-- Toast Notifications -->
  <Toast :toasts="toasts" @remove="removeToast" />


</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import NotificationBell from '~/components/NotificationBell.vue'
import ThemeSwitcher from '~/components/ThemeSwitcher.vue'
import Toast from '~/components/Toast.vue'
import KeyboardHelpModal from '~/components/KeyboardHelpModal.vue'
import CommandPalette from '~/components/CommandPalette.vue'

// Import du composable toast, raccourcis, thème et notifications
const { toasts, removeToast } = useToast()
const { registerAction } = useKeyboardShortcuts()
const { theme } = useTheme()
const { generateNotifications } = useNotifications()

const route = useRoute()

// Fonction pour vérifier si une route est active
const isActive = (path) => {
  return route.path === path
}

// État pour la modal d'aide
const showHelpModal = ref(false)

// État pour la command palette
const showCommandPalette = ref(false)

// Enregistrer les actions des raccourcis
onMounted(() => {
  // Action pour afficher l'aide
  registerAction('show-help', () => {
    showHelpModal.value = true
  })
  
  // Action pour fermer les modals
  registerAction('close-modal', () => {
    showHelpModal.value = false
    // Ici tu peux ajouter d'autres modals à fermer
  })
  
  // Actions pour créer (seront implémentées par les pages)
  registerAction('new-assignment', () => {
    const route = useRoute()
    if (route.path === '/assignments') {
      // Si on est sur la page devoirs, déclencher l'ajout
      // Cette logique sera implémentée dans la page
    } else {
      // Sinon, rediriger vers la page devoirs
      navigateTo('/dashboard/assignments?new=true')
    }
  })
  
  registerAction('new-subject', () => {
    const route = useRoute()
    if (route.path === '/dashboard/subjects') {
      // Si on est sur la page matières, déclencher l'ajout
    } else {
      navigateTo('/dashboard/subjects?new=true')
    }
  })
})

// Gérer les actions de la palette de commandes
const handlePaletteAction = (action, data = null) => {
  switch (action) {
    case 'new-assignment':
      navigateTo('/dashboard/assignments?new=true')
      break
    case 'new-subject':
      navigateTo('/dashboard/subjects?new=true')
      break
    case 'show-help':
      showHelpModal.value = true
      break
    case 'toggle-assignment':
      if (data) {
        toggleAssignmentFromPalette(data)
      }
      break
  }
}

// Toggle assignment depuis la palette
const toggleAssignmentFromPalette = async (assignment) => {
  try {
    const token = localStorage.getItem('token')
    await $fetch(`/api/assignments/${assignment.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { is_completed: !assignment.is_completed }
    })
    
    // Mettre à jour localement
    const assignmentIndex = assignments.value.findIndex(a => a.id === assignment.id)
    if (assignmentIndex !== -1) {
      assignments.value[assignmentIndex].is_completed = !assignment.is_completed
    }
    
    const { success } = useToast()
    success('Devoir mis à jour !', `"${assignment.title}" marqué comme terminé`)
  } catch (error) {
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de mettre à jour le devoir')
  }
}

// Données des devoirs pour les notifications
const assignments = ref([])
const subjects = ref([])

// Données utilisateur
const userName = ref('Utilisateur')
const userInitials = ref('U')

// Charger les devoirs pour les notifications
async function loadAssignments() {
  if (typeof window === 'undefined') return
  
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    assignments.value = response.data || []
  } catch (error) {
    console.error('Erreur chargement devoirs layout:', error)
  }
}

// Charger les infos utilisateur
function loadUserData() {
  if (typeof window === 'undefined') return
  
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    userName.value = user.firstname || user.username || 'Utilisateur'
    
    // Calculer les initiales
    const first = user.firstname?.[0] || ''
    const last = user.lastname?.[0] || ''
    userInitials.value = (first + last).toUpperCase() || 'U'
  } catch (error) {
    console.error('Erreur chargement user:', error)
  }
}

// Actualiser les devoirs toutes les 5 minutes
onMounted(() => {
  // Action pour la palette de commandes
  registerAction('command-palette', () => {
    showCommandPalette.value = true
  })
  nextTick(async () => {
    loadUserData()
    await loadAssignments()
    
    // Générer les notifications automatiquement au chargement
    try {
      await generateNotifications()
      console.log('✅ Notifications générées automatiquement')
    } catch (error) {
      console.error('❌ Erreur génération notifications:', error)
    }
    
    // Actualisation périodique (devoirs + notifications)
    const interval = setInterval(async () => {
      await loadAssignments()
      await generateNotifications()
    }, 5 * 60 * 1000) // Toutes les 5 minutes
    
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
})
</script>