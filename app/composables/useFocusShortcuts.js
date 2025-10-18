// Composable pour les raccourcis spécifiques à la page Focus
import { onMounted, onUnmounted } from 'vue'

export const useFocusShortcuts = (callbacks = {}) => {
  const handleKeyPress = (event) => {
    // Ignorer si dans un input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return
    }

    // Espace : Start/Pause timer
    if (event.code === 'Space') {
      event.preventDefault()
      callbacks.toggleTimer?.()
    }

    // R : Reset timer
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault()
      callbacks.resetTimer?.()
    }

    // S : Skip session
    if (event.key === 's' || event.key === 'S') {
      event.preventDefault()
      callbacks.skipSession?.()
    }

    // N : Next tip
    if (event.key === 'n' || event.key === 'N') {
      event.preventDefault()
      callbacks.nextTip?.()
    }

    // M : Toggle master sound
    if (event.key === 'm' || event.key === 'M') {
      event.preventDefault()
      callbacks.toggleSound?.()
    }

    // 1-6 : Toggle specific ambient sound
    if (event.key >= '1' && event.key <= '6') {
      event.preventDefault()
      const soundIndex = parseInt(event.key) - 1
      callbacks.toggleAmbientSound?.(soundIndex)
    }

    // Échap : Désélectionner la tâche
    if (event.code === 'Escape') {
      event.preventDefault()
      callbacks.clearSelection?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })

  return {
    shortcuts: {
      'Space': 'Start/Pause timer',
      'R': 'Reset timer',
      'S': 'Skip session',
      'N': 'Next tip',
      'M': 'Toggle sound',
      '1-6': 'Toggle ambient sounds',
      'Esc': 'Clear selection'
    }
  }
}
