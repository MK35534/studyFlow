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
        </nav>
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
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import NotificationBell from '~/components/NotificationBell.vue'

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