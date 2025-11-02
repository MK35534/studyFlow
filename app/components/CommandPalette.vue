<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-[20vh]"
      @click="closeModal"
    >
    <!-- Palette -->
    <div
      class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden transform transition-all"
      @click.stop
    >
      <!-- Barre de recherche -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une action, une page, un devoir..."
          class="w-full pl-12 pr-4 py-4 text-lg bg-transparent border-0 outline-none placeholder-gray-400"
          @keydown="handleKeydown"
        />
        <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
          <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Échap pour fermer</span>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="h-px bg-gray-200"></div>
      
      <!-- Résultats -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Aucun résultat -->
        <div v-if="filteredCommands.length === 0 && searchQuery" class="py-12 text-center">
          <svg class="w-8 h-8 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12M6 20.291A7.962 7.962 0 016 12m0 8.291A7.962 7.962 0 016 12m12 8.291A7.962 7.962 0 0118 12" />
          </svg>
          <p class="text-gray-500">Aucun résultat pour "{{ searchQuery }}"</p>
        </div>
        
        <!-- Liste des commandes -->
        <div v-else class="py-2">
          <div
            v-for="(group, groupName) in groupedCommands"
            :key="groupName"
            class="mb-4 last:mb-0"
          >
            <!-- En-tête de groupe -->
            <div v-if="Object.keys(groupedCommands).length > 1" class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {{ groupName }}
            </div>
            
            <!-- Commandes du groupe -->
            <div
              v-for="(command, index) in group"
              :key="command.id"
              :class="[
                'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors',
                selectedIndex === getCommandIndex(command) 
                  ? 'bg-blue-50 border-r-2 border-blue-500' 
                  : 'hover:bg-gray-50'
              ]"
              @click="executeCommand(command)"
              @mouseenter="selectedIndex = getCommandIndex(command)"
            >
              <div class="flex items-center space-x-3">
                <!-- Icône -->
                <div :class="[
                  'p-2 rounded-lg flex-shrink-0',
                  command.iconBg || 'bg-gray-100'
                ]">
                  <component :is="command.icon" :class="[
                    'w-4 h-4',
                    command.iconColor || 'text-gray-600'
                  ]" />
                </div>
                
                <!-- Contenu -->
                <div>
                  <p class="font-medium text-gray-900">{{ command.title }}</p>
                  <p class="text-sm text-gray-500">{{ command.description }}</p>
                </div>
              </div>
              
              <!-- Raccourci -->
              <div v-if="command.shortcut" class="flex space-x-1">
                <kbd
                  v-for="key in command.shortcut.split('+')"
                  :key="key"
                  class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
                >
                  {{ key }}
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  show: Boolean,
  assignments: Array,
  subjects: Array
})

// Emits
const emit = defineEmits(['close', 'execute'])

// Refs
const searchInput = ref(null)
const searchQuery = ref('')
const selectedIndex = ref(0)

// Commandes disponibles
const commands = computed(() => {
  const baseCommands = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Tableau de bord',
      description: 'Voir les statistiques et devoirs urgents',
      category: 'Navigation',
      icon: 'svg',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      shortcut: 'H',
      action: () => navigateTo('/dashboard')
    },
    {
      id: 'nav-assignments',
      title: 'Mes devoirs',
      description: 'Gérer tous mes devoirs',
      category: 'Navigation',
      icon: 'svg',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      shortcut: 'D',
      action: () => navigateTo('/dashboard/assignments')
    },
    {
      id: 'nav-subjects',
      title: 'Mes matières',
      description: 'Gérer mes matières',
      category: 'Navigation',
      icon: 'svg',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      shortcut: 'M',
      action: () => navigateTo('/dashboard/subjects')
    },
    {
      id: 'nav-calendar',
      title: 'Calendrier',
      description: 'Vue calendrier de mes devoirs',
      category: 'Navigation',
      icon: 'svg',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      shortcut: 'C',
      action: () => navigateTo('/dashboard/life-calendar')
    },
    
    // Actions
    {
      id: 'new-assignment',
      title: 'Nouveau devoir',
      description: 'Créer un nouveau devoir',
      category: 'Actions',
      icon: 'svg',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      shortcut: 'Ctrl+N',
      action: () => {
        emit('execute', 'new-assignment')
        closeModal()
      }
    },
    {
      id: 'new-subject',
      title: 'Nouvelle matière',
      description: 'Créer une nouvelle matière',
      category: 'Actions',
      icon: 'svg',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      shortcut: 'Ctrl+M',
      action: () => {
        emit('execute', 'new-subject')
        closeModal()
      }
    },
    
    // Utilitaires
    {
      id: 'help',
      title: 'Raccourcis clavier',
      description: 'Voir tous les raccourcis disponibles',
      category: 'Aide',
      icon: 'svg',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      shortcut: '?',
      action: () => {
        emit('execute', 'show-help')
        closeModal()
      }
    }
  ]

  // Ajouter les devoirs récents comme commandes
  const recentAssignments = (props.assignments || [])
    .filter(a => !a.is_completed)
    .slice(0, 5)
    .map(assignment => ({
      id: `assignment-${assignment.id}`,
      title: `Marquer "${assignment.title}" comme terminé`,
      description: `${assignment.subject_name} • Échéance: ${formatDate(assignment.due_date)}`,
      category: 'Devoirs récents',
      icon: 'svg',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      action: () => {
        emit('execute', 'toggle-assignment', assignment)
        closeModal()
      }
    }))

  return [...baseCommands, ...recentAssignments]
})

// Filtrer les commandes selon la recherche
const filteredCommands = computed(() => {
  if (!searchQuery.value) return commands.value
  
  const query = searchQuery.value.toLowerCase()
  return commands.value.filter(command => 
    command.title.toLowerCase().includes(query) ||
    command.description.toLowerCase().includes(query) ||
    command.category.toLowerCase().includes(query)
  )
})

// Grouper les commandes par catégorie
const groupedCommands = computed(() => {
  const groups = {}
  filteredCommands.value.forEach(command => {
    const category = command.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(command)
  })
  return groups
})

// Obtenir l'index d'une commande dans la liste filtrée
const getCommandIndex = (command) => {
  return filteredCommands.value.findIndex(c => c.id === command.id)
}

// Gestion du clavier
const handleKeydown = (event) => {
  const maxIndex = filteredCommands.value.length - 1
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = selectedIndex.value < maxIndex ? selectedIndex.value + 1 : 0
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : maxIndex
      break
    case 'Enter':
      event.preventDefault()
      if (filteredCommands.value[selectedIndex.value]) {
        executeCommand(filteredCommands.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      closeModal()
      break
  }
}

// Exécuter une commande
const executeCommand = (command) => {
  if (command.action) {
    command.action()
  } else {
    closeModal()
  }
}

// Fermer la modal
const closeModal = () => {
  emit('close')
}

// Format date
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(dateString))
}

// Focus sur l'input quand la modal s'ouvre
watch(() => props.show, async (show) => {
  if (show) {
    await nextTick()
    searchInput.value?.focus()
    searchQuery.value = ''
    selectedIndex.value = 0
  }
})

// Réinitialiser la sélection quand la recherche change
watch(searchQuery, () => {
  selectedIndex.value = 0
})
</script>

<style scoped>
kbd {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}
</style>