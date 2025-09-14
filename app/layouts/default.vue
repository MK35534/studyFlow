<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm border-r border-gray-200">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">StudyFlow</h1>
        
        <!-- Navigation -->
        <nav class="space-y-2">
          <NuxtLink 
            to="/" 
            class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Dashboard
          </NuxtLink>
          
          <NuxtLink 
            to="/subjects" 
            class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Matières
          </NuxtLink>
          
          <NuxtLink 
            to="/assignments" 
            class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Devoirs
          </NuxtLink>

          <NuxtLink 
            to="/calendar" 
            class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendrier
          </NuxtLink>

          <NuxtLink 
            to="/focus" 
            class="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mode Focus
          </NuxtLink>
        </nav>
      </div>

      <!-- Indicateur raccourcis -->
      <div class="px-6 py-3 border-t border-gray-200">
        <button
          @click="showHelpModal = true"
          class="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors w-full"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Raccourcis clavier (?)
        </button>
      </div>
      
      <!-- User section en bas - FIX pour éviter le scroll -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1 min-w-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm font-medium">U</span>
            </div>
            <div class="ml-3 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">Utilisateur</p>
              <p class="text-xs text-gray-500">Lycéen</p>
            </div>
          </div>
          
          <!-- Notifications - positionnement fixe -->
          <div class="flex-shrink-0 ml-2">
            <NotificationBell :assignments="assignments" />
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto">
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
import NotificationBell from '~/components/NotificationBell.vue'
import Toast from '~/components/Toast.vue'
import KeyboardHelpModal from '~/components/KeyboardHelpModal.vue'
import CommandPalette from '~/components/CommandPalette.vue'

// Import du composable toast et raccourcis
const { toasts, removeToast } = useToast()
const { registerAction } = useKeyboardShortcuts()

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
      navigateTo('/assignments?new=true')
    }
  })
  
  registerAction('new-subject', () => {
    const route = useRoute()
    if (route.path === '/subjects') {
      // Si on est sur la page matières, déclencher l'ajout
    } else {
      navigateTo('/subjects?new=true')
    }
  })
})

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

// Actualiser les devoirs toutes les 5 minutes
onMounted(() => {
  // Action pour la palette de commandes
  registerAction('command-palette', () => {
    showCommandPalette.value = true
  })
  nextTick(() => {
    loadAssignments()
    
    // Actualisation périodique
    const interval = setInterval(loadAssignments, 5 * 60 * 1000)
    
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
})
</script>