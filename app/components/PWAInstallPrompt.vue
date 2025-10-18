<template>
  <div v-if="showInstallPrompt" class="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 backdrop-blur-xl">
      <!-- En-tête -->
      <div class="flex items-start gap-4 mb-4">
        <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Installer StudyFlow
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Accédez rapidement à vos devoirs depuis votre écran d'accueil
          </p>
        </div>
        <button
          @click="dismissPrompt"
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Avantages -->
      <div class="space-y-2 mb-5 pl-1">
        <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Fonctionne hors ligne</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Notifications des devoirs</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Accès rapide depuis l'écran d'accueil</span>
        </div>
      </div>

      <!-- Boutons -->
      <div class="flex gap-3">
        <button
          @click="installApp"
          class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]"
        >
          Installer
        </button>
        <button
          @click="dismissPrompt"
          class="px-5 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Plus tard
        </button>
      </div>

      <!-- Instructions iOS -->
      <div v-if="isIOS && !isStandalone" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
          Sur Safari iOS :
        </p>
        <ol class="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4">
          <li>1. Appuyez sur <span class="inline-flex items-center"><svg class="w-3 h-3 mx-1" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg></span> en bas</li>
          <li>2. Choisissez "Ajouter à l'écran d'accueil"</li>
          <li>3. Appuyez sur "Ajouter"</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
const deferredPrompt = ref(null)
const isIOS = ref(false)
const isStandalone = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return

  // Détection iOS
  isIOS.value = /iPhone|iPad|iPod/.test(navigator.userAgent)
  
  // Détection standalone mode
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true

  // Ne pas afficher si déjà installé
  if (isStandalone.value) {
    return
  }

  // Vérifier si l'utilisateur a déjà refusé
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  const dismissedAt = dismissed ? parseInt(dismissed) : 0
  const now = Date.now()
  
  // Afficher à nouveau après 7 jours
  if (dismissedAt && (now - dismissedAt) < 7 * 24 * 60 * 60 * 1000) {
    return
  }

  // Pour iOS : afficher les instructions manuelles
  if (isIOS.value) {
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000) // Attendre 3 secondes
    return
  }

  // Pour Android/Chrome : utiliser l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    
    // Afficher le prompt après quelques secondes
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000)
  })

  // Écouter l'installation réussie
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    localStorage.removeItem('pwa-install-dismissed')
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) {
    // Sur iOS, ne rien faire (les instructions sont déjà affichées)
    return
  }

  // Afficher le prompt natif du navigateur
  deferredPrompt.value.prompt()
  
  // Attendre le choix de l'utilisateur
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    console.log('✅ PWA installée avec succès')
  }
  
  deferredPrompt.value = null
  showInstallPrompt.value = false
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}
</script>

<style scoped>
/* Animation d'entrée */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div[v-if] {
  animation: slideUp 0.4s ease-out;
}
</style>
