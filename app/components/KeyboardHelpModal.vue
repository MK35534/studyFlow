<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <!-- Modal -->
    <div
      class="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Raccourcis clavier</h3>
              <p class="text-sm text-gray-600">Navigue plus rapidement dans StudyFlow</p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Body -->
      <div class="px-6 py-4 max-h-96 overflow-y-auto">
        <div class="space-y-6">
          <!-- Navigation -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 text-blue-600">
              Navigation
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Aller au dashboard</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">H</kbd>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Aller aux devoirs</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">D</kbd>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Aller aux matières</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">M</kbd>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Aller au calendrier</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">C</kbd>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 text-green-600">
              Actions rapides
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Nouveau devoir</span>
                <div class="flex space-x-1">
                  <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">N</kbd>
                  <span class="text-gray-400">ou</span>
                  <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Ctrl+N</kbd>
                </div>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Nouvelle matière</span>
                <div class="flex space-x-1">
                  <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">S</kbd>
                  <span class="text-gray-400">ou</span>
                  <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Ctrl+M</kbd>
                </div>
              </div>
            </div>
          </div>

          <!-- Utilitaires -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 text-purple-600">
              Utilitaires
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Palette de commandes</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Ctrl+K</kbd>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Afficher cette aide</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">?</kbd>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-gray-700">Fermer modal/dropdown</span>
                <kbd class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Échap</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Les raccourcis ne fonctionnent pas dans les champs de saisie
          </div>
          <button
            @click="closeModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm btn-animate"
          >
            Compris !
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  show: Boolean
})

// Emits
const emit = defineEmits(['close'])

// Methods
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
kbd {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}
</style>