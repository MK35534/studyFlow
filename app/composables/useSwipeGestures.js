import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 🎯 Composable pour gérer les gestes de swipe sur mobile
 * Permet la navigation entre pages par swipe horizontal
 * et d'autres actions par swipe vertical
 */
export const useSwipeGestures = (options = {}) => {
  let router = null
  
  // Configuration par défaut
  const {
    enabled = true,
    minSwipeDistance = 100, // Distance minimale en pixels pour déclencher le swipe (augmenté de 50 à 100)
    maxSwipeTime = 400, // Temps maximum en ms pour un swipe rapide (augmenté de 300 à 400)
    horizontalNavigation = true, // Activer la navigation horizontale
    verticalActions = false, // Activer les actions verticales (pull-to-refresh, etc.)
    onSwipeLeft = null,
    onSwipeRight = null,
    onSwipeUp = null,
    onSwipeDown = null,
  } = options

  // État du swipe
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchEndX = ref(0)
  const touchEndY = ref(0)
  const touchStartTime = ref(0)
  const lastTouchEndTime = ref(0) // Timestamp du dernier touchend pour détecter double-tap
  const isSwiping = ref(false)

  // Routes disponibles pour navigation horizontale
  const navigationRoutes = [
    '/',
    '/subjects',
    '/assignments',
    '/calendar',
    '/focus'
  ]

  /**
   * Détecte la direction du swipe
   */
  const detectSwipeDirection = () => {
    const deltaX = touchEndX.value - touchStartX.value
    const deltaY = touchEndY.value - touchStartY.value
    const deltaTime = Date.now() - touchStartTime.value
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Vérifier si le swipe est assez rapide et long
    if (distance < minSwipeDistance || deltaTime > maxSwipeTime) {
      return null
    }

    // Déterminer si c'est un swipe horizontal ou vertical
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

    if (isHorizontal) {
      return deltaX > 0 ? 'right' : 'left'
    } else {
      return deltaY > 0 ? 'down' : 'up'
    }
  }

  /**
   * Navigation entre pages par swipe horizontal
   */
  const handleHorizontalNavigation = (direction) => {
    if (!horizontalNavigation || !router) return

    try {
      const currentPath = router.currentRoute.value.path
      const currentIndex = navigationRoutes.indexOf(currentPath)

      if (currentIndex === -1) return

      let newIndex
      if (direction === 'right' && currentIndex > 0) {
        // Swipe vers la droite = page précédente
        newIndex = currentIndex - 1
      } else if (direction === 'left' && currentIndex < navigationRoutes.length - 1) {
        // Swipe vers la gauche = page suivante
        newIndex = currentIndex + 1
      }

      if (newIndex !== undefined) {
        router.push(navigationRoutes[newIndex])
      }
    } catch (error) {
      console.warn('Navigation swipe error:', error)
    }
  }

  /**
   * Gestion du début du touch
   */
  const handleTouchStart = (e) => {
    if (!enabled) return

    // Ne pas intercepter les swipes sur les éléments scrollables
    const target = e.target
    if (target.closest('.no-swipe') || target.closest('[data-no-swipe]')) {
      return
    }

    // Si l'utilisateur retouche l'écran < 300ms après le dernier touchend,
    // c'est un double-tap/tap rapide, on ignore le swipe
    const timeSinceLastTouch = Date.now() - lastTouchEndTime.value
    if (timeSinceLastTouch < 300) {
      return
    }

    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    touchStartTime.value = Date.now()
    isSwiping.value = true
  }

  /**
   * Gestion du mouvement du touch
   */
  const handleTouchMove = (e) => {
    if (!enabled || !isSwiping.value) return

    touchEndX.value = e.touches[0].clientX
    touchEndY.value = e.touches[0].clientY

    // Calculer le delta pour feedback visuel potentiel
    const deltaX = touchEndX.value - touchStartX.value
    const deltaY = touchEndY.value - touchStartY.value

    // Si swipe horizontal significatif, empêcher le scroll par défaut
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault()
    }
  }

  /**
   * Gestion de la fin du touch
   */
  const handleTouchEnd = () => {
    if (!enabled || !isSwiping.value) return

    // Ignorer les touches très courtes (probablement des clics)
    const touchDuration = Date.now() - touchStartTime.value
    if (touchDuration < 120) { // Moins de 120ms = clic rapide, pas un swipe
      isSwiping.value = false
      lastTouchEndTime.value = Date.now() // Mémoriser le moment du touchend
      return
    }

    const direction = detectSwipeDirection()

    if (direction) {
      // Callbacks personnalisés
      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft()
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight()
      } else if (direction === 'up' && onSwipeUp && verticalActions) {
        onSwipeUp()
      } else if (direction === 'down' && onSwipeDown && verticalActions) {
        onSwipeDown()
      }

      // Navigation horizontale par défaut
      if ((direction === 'left' || direction === 'right') && !onSwipeLeft && !onSwipeRight) {
        handleHorizontalNavigation(direction)
      }
    }

    // Reset
    isSwiping.value = false
    lastTouchEndTime.value = Date.now() // Mémoriser le moment du touchend
    touchStartX.value = 0
    touchStartY.value = 0
    touchEndX.value = 0
    touchEndY.value = 0
  }

  /**
   * Activer les listeners
   */
  const enableSwipeGestures = () => {
    if (typeof window === 'undefined') return

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  /**
   * Désactiver les listeners
   */
  const disableSwipeGestures = () => {
    if (typeof window === 'undefined') return

    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }

  // Auto-activation au montage si enabled
  onMounted(() => {
    // Initialiser le router seulement côté client
    try {
      router = useRouter()
    } catch (error) {
      console.warn('Router not available for swipe gestures:', error)
    }
    
    if (enabled) {
      enableSwipeGestures()
    }
  })

  // Nettoyage au démontage
  onUnmounted(() => {
    disableSwipeGestures()
  })

  return {
    isSwiping,
    enableSwipeGestures,
    disableSwipeGestures
  }
}
