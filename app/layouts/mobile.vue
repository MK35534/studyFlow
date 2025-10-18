<template>
  <SafeArea>
    <div class="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <!-- Header mobile moderne avec gradient -->
      <header class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <h1 class="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="theme.gradient">
          StudyFlow
        </h1>
        
        <div class="flex items-center gap-2">
          <!-- Sélecteur de thème -->
          <ThemeSwitcher align="right" />
          
          <!-- Bouton aide/raccourcis -->
          <button
            @click="showHelpModal = true"
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <!-- Notifications -->
          <NotificationBell />
          
          <!-- Avatar utilisateur avec gradient - cliquable -->
          <button 
            @click="navigateTo('/profile')"
            :class="`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95`"
          >
            <span class="text-white text-sm font-bold">{{ userInitials }}</span>
          </button>
        </div>
      </header>
      
      <!-- Contenu principal avec scroll -->
      <main class="flex-1 overflow-y-auto pb-20">
        <div class="p-4">
          <slot />
        </div>
      </main>
      
      <!-- Bottom Navigation moderne -->
      <BottomNavigation :urgent-count="urgentCount" />
    </div>
  </SafeArea>
  
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

const route = useRoute()

// Import du composable toast, raccourcis et thème
const { toasts, removeToast } = useToast()
const { registerAction } = useKeyboardShortcuts()
const { theme } = useTheme()

// Activer les gestes de swipe pour la navigation
const { isSwiping } = useSwipeGestures({
  enabled: true,
  horizontalNavigation: true,
  minSwipeDistance: 50,
  maxSwipeTime: 300
})

// États
const showHelpModal = ref(false)
const showCommandPalette = ref(false)
const assignments = ref([])
const subjects = ref([])
const urgentCount = ref(0)

// Données utilisateur
const userInitials = ref('U')

// Fonction pour vérifier si une route est active
const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

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
    console.error('Erreur chargement devoirs:', error)
  }
}

// Charger les infos utilisateur
function loadUserData() {
  if (typeof window === 'undefined') return
  
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Calculer les initiales
    const first = user.firstname?.[0] || ''
    const last = user.lastname?.[0] || ''
    userInitials.value = (first + last).toUpperCase() || 'U'
  } catch (error) {
    console.error('Erreur chargement user:', error)
  }
}

// Gérer les actions de la palette de commandes
const handlePaletteAction = (action, data = null) => {
  switch (action) {
    case 'new-assignment':
      navigateTo('/assignments?new=true')
      break
    case 'new-subject':
      navigateTo('/subjects?new=true')
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

// Enregistrer les actions des raccourcis
onMounted(() => {
  registerAction('show-help', () => {
    showHelpModal.value = true
  })
  
  registerAction('close-modal', () => {
    showHelpModal.value = false
  })
  
  registerAction('command-palette', () => {
    showCommandPalette.value = true
  })
  
  registerAction('new-assignment', () => {
    if (route.path === '/assignments') {
      // Déclencher l'ajout depuis la page
    } else {
      navigateTo('/assignments?new=true')
    }
  })
  
  registerAction('new-subject', () => {
    if (route.path === '/subjects') {
      // Déclencher l'ajout depuis la page
    } else {
      navigateTo('/subjects?new=true')
    }
  })
  
  // Charger les devoirs
  nextTick(() => {
    loadUserData()
    loadAssignments()
    
    // Actualisation périodique
    const interval = setInterval(loadAssignments, 5 * 60 * 1000)
    
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
})
</script>

<style scoped>
/* Support pour les safe areas (iPhone notch, etc.) */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Animation smooth pour les transitions */
a {
  -webkit-tap-highlight-color: transparent;
}
</style>