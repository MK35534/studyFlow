import { ref } from 'vue'

/**
 * 🎯 Composable pour les optimisations tactiles
 * Garantit que tous les éléments cliquables respectent les standards d'accessibilité mobile
 * - Taille minimale de 44x44px (iOS) / 48x48px (Android Material Design)
 * - Feedback visuel au touch
 * - Ripple effect
 */

/**
 * Classe Tailwind pour garantir une taille tactile optimale
 * min-w-[44px] min-h-[44px] = 44px minimum (standard iOS)
 */
export const TOUCH_TARGET_CLASS = 'min-w-[44px] min-h-[44px] touch-manipulation'

/**
 * Classe Tailwind pour les états actifs tactiles
 */
export const TOUCH_ACTIVE_CLASS = 'active:scale-95 active:opacity-80 transition-all duration-150'

/**
 * Classe complète pour un bouton tactile optimisé
 */
export const TOUCH_BUTTON_CLASS = `${TOUCH_TARGET_CLASS} ${TOUCH_ACTIVE_CLASS} cursor-pointer select-none`

/**
 * Hook pour créer un effet ripple au touch
 */
export const useTouchRipple = () => {
  const createRipple = (event, color = 'rgba(255, 255, 255, 0.5)') => {
    const button = event.currentTarget

    // Créer l'élément ripple
    const ripple = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2

    // Position du click
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left - radius
    const y = event.clientY - rect.top - radius

    // Style du ripple
    ripple.style.width = ripple.style.height = `${diameter}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.style.backgroundColor = color
    ripple.classList.add('ripple-effect')

    // Ajouter au bouton
    const existingRipple = button.getElementsByClassName('ripple-effect')[0]
    if (existingRipple) {
      existingRipple.remove()
    }

    button.appendChild(ripple)

    // Supprimer après l'animation
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  return {
    createRipple
  }
}

/**
 * Hook pour le feedback haptique (vibration)
 * Utilise l'API Vibration si disponible
 */
export const useHapticFeedback = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const light = () => {
    if (isSupported) {
      navigator.vibrate(10) // Vibration légère de 10ms
    }
  }

  const medium = () => {
    if (isSupported) {
      navigator.vibrate(20) // Vibration moyenne de 20ms
    }
  }

  const heavy = () => {
    if (isSupported) {
      navigator.vibrate(50) // Vibration forte de 50ms
    }
  }

  const success = () => {
    if (isSupported) {
      navigator.vibrate([10, 50, 10]) // Pattern success
    }
  }

  const error = () => {
    if (isSupported) {
      navigator.vibrate([50, 100, 50]) // Pattern error
    }
  }

  return {
    isSupported,
    light,
    medium,
    heavy,
    success,
    error
  }
}

/**
 * Hook pour gérer le swipe-to-delete sur les cartes
 */
export const useSwipeToDelete = (onDelete) => {
  const startX = ref(0)
  const currentX = ref(0)
  const isSwiping = ref(false)
  const translateX = ref(0)
  const deleteThreshold = 100 // Distance minimum pour déclencher la suppression

  const handleTouchStart = (e, item) => {
    startX.value = e.touches[0].clientX
    isSwiping.value = true
  }

  const handleTouchMove = (e, item) => {
    if (!isSwiping.value) return

    currentX.value = e.touches[0].clientX
    const diff = currentX.value - startX.value

    // Limiter le swipe vers la gauche uniquement
    if (diff < 0) {
      translateX.value = diff
    }
  }

  const handleTouchEnd = (item) => {
    if (!isSwiping.value) return

    // Si le swipe dépasse le seuil, déclencher la suppression
    if (Math.abs(translateX.value) > deleteThreshold) {
      if (onDelete) {
        onDelete(item)
      }
    }

    // Reset
    translateX.value = 0
    isSwiping.value = false
    startX.value = 0
    currentX.value = 0
  }

  return {
    translateX,
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}

/**
 * Hook pour le pull-to-refresh
 */
export const usePullToRefresh = (onRefresh) => {
  const startY = ref(0)
  const currentY = ref(0)
  const isPulling = ref(false)
  const isRefreshing = ref(false)
  const pullDistance = ref(0)
  const refreshThreshold = 80 // Distance minimum pour déclencher le refresh

  const handleTouchStart = (e) => {
    // Ne déclencher que si on est en haut de la page
    if (window.scrollY === 0) {
      startY.value = e.touches[0].clientY
      isPulling.value = true
    }
  }

  const handleTouchMove = (e) => {
    if (!isPulling.value || isRefreshing.value) return

    currentY.value = e.touches[0].clientY
    const diff = currentY.value - startY.value

    // Limiter le pull vers le bas uniquement
    if (diff > 0 && window.scrollY === 0) {
      pullDistance.value = Math.min(diff, refreshThreshold * 1.5)
      // Empêcher le scroll natif
      e.preventDefault()
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.value || isRefreshing.value) return

    // Si le pull dépasse le seuil, déclencher le refresh
    if (pullDistance.value >= refreshThreshold) {
      isRefreshing.value = true
      
      if (onRefresh) {
        await onRefresh()
      }

      // Attendre un peu pour l'animation
      setTimeout(() => {
        isRefreshing.value = false
        pullDistance.value = 0
      }, 500)
    } else {
      pullDistance.value = 0
    }

    // Reset
    isPulling.value = false
    startY.value = 0
    currentY.value = 0
  }

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    refreshThreshold,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
