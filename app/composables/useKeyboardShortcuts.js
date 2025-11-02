import { onMounted, onUnmounted } from 'vue'

export const useKeyboardShortcuts = () => {
  
  // Raccourcis globaux
  const globalShortcuts = {
    // Navigation
    'h': () => navigateTo('/dashboard'),              // Home/Dashboard  
    'd': () => navigateTo('/dashboard/assignments'),   // Devoirs
    'm': () => navigateTo('/dashboard/subjects'),      // Matières
    // 'c': () => navigateTo('/dashboard/life-calendar'),      // Calendrier (désactivé temporairement)
    
    // Actions rapides
    'n': () => triggerAction('new-assignment'), // Nouveau devoir
    's': () => triggerAction('new-subject'),     // Nouvelle matière
    
    // Utilitaires
    '?': () => triggerAction('show-help'),       // Aide
    'Escape': () => triggerAction('close-modal') // Fermer modal/dropdown
  }

  // Raccourcis avec modificateurs (Ctrl/Cmd)
  const modifierShortcuts = {
    'n': () => triggerAction('new-assignment'),
    'm': () => triggerAction('new-subject'),
    'k': () => triggerAction('command-palette'), // Palette de commandes
    '/': () => triggerAction('focus-search')      // Focus recherche
  }

  // Actions disponibles
  const actions = ref({
    'new-assignment': null,
    'new-subject': null,
    'show-help': null,
    'close-modal': null,
    'command-palette': null,
    'focus-search': null
  })

  // État des raccourcis
  const shortcutsEnabled = ref(true)

  // Gérer les événements clavier
  const handleKeydown = (event) => {
    // Désactiver si on tape dans un input/textarea
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true') {
      return
    }

    // Désactiver si les raccourcis sont désactivés
    if (!shortcutsEnabled.value) return

    const key = event.key.toLowerCase()
    const isCtrlOrCmd = event.ctrlKey || event.metaKey

    // Raccourcis avec modificateurs
    if (isCtrlOrCmd && modifierShortcuts[key]) {
      event.preventDefault()
      modifierShortcuts[key]()
      return
    }

    // Raccourcis simples
    if (!isCtrlOrCmd && globalShortcuts[key]) {
      event.preventDefault()
      globalShortcuts[key]()
      return
    }
  }

  // Enregistrer une action
  const registerAction = (actionName, callback) => {
    actions.value[actionName] = callback
  }

  // Déclencher une action
  const triggerAction = (actionName) => {
    const action = actions.value[actionName]
    if (action && typeof action === 'function') {
      action()
    }
  }

  // Activer/désactiver les raccourcis
  const enableShortcuts = () => {
    shortcutsEnabled.value = true
  }

  const disableShortcuts = () => {
    shortcutsEnabled.value = false
  }

  // Liste des raccourcis pour l'aide
  const getShortcutsList = () => {
    return [
      { key: 'H', description: 'Aller au dashboard' },
      { key: 'D', description: 'Aller aux devoirs' },
      { key: 'M', description: 'Aller aux matières' },
      { key: 'C', description: 'Aller au calendrier' },
      { key: 'N', description: 'Nouveau devoir' },
      { key: 'S', description: 'Nouvelle matière' },
      { key: 'Ctrl + N', description: 'Nouveau devoir' },
      { key: 'Ctrl + M', description: 'Nouvelle matière' },
      { key: 'Ctrl + K', description: 'Palette de commandes' },
      { key: '?', description: 'Afficher cette aide' },
      { key: 'Échap', description: 'Fermer modal/dropdown' }
    ]
  }

  // Installation des event listeners
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    registerAction,
    enableShortcuts,
    disableShortcuts,
    getShortcutsList,
    shortcutsEnabled: readonly(shortcutsEnabled)
  }
}