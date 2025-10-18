<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="close"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Guide du Mode Focus
              </h2>
              <button
                @click="close"
                class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Qu'est-ce que la technique Pomodoro ? -->
            <section>
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span class="text-2xl mr-2">🍅</span>
                Qu'est-ce que la technique Pomodoro ?
              </h3>
              <p class="text-gray-700 leading-relaxed">
                La technique Pomodoro est une méthode de gestion du temps qui consiste à travailler par intervalles de 25 minutes (appelés "pomodoros"), séparés par de courtes pauses. Cette approche aide à maintenir la concentration et à éviter la fatigue mentale.
              </p>
            </section>

            <!-- Comment ça marche ? -->
            <section>
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span class="text-2xl mr-2">⚙️</span>
                Comment ça marche ?
              </h3>
              <ol class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="bg-blue-100 text-blue-600 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm">1</span>
                  <span><strong>Choisis une tâche</strong> sur laquelle te concentrer (ou session libre)</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-blue-100 text-blue-600 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm">2</span>
                  <span><strong>Lance le timer</strong> pour 25 minutes de focus intense</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-blue-100 text-blue-600 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm">3</span>
                  <span><strong>Travaille sans interruption</strong> jusqu'à la fin du timer</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-blue-100 text-blue-600 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm">4</span>
                  <span><strong>Prends une pause</strong> de 5 minutes pour te ressourcer</span>
                </li>
                <li class="flex items-start">
                  <span class="bg-blue-100 text-blue-600 font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-sm">5</span>
                  <span><strong>Répète le cycle</strong> 4 fois, puis prends une pause longue (15 min)</span>
                </li>
              </ol>
            </section>

            <!-- Raccourcis clavier -->
            <section>
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span class="text-2xl mr-2">⌨️</span>
                Raccourcis clavier
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-700">Démarrer/Pause</span>
                  <kbd class="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">Espace</kbd>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-700">Réinitialiser</span>
                  <kbd class="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">R</kbd>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-700">Passer la session</span>
                  <kbd class="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">S</kbd>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-700">Sons ambiance</span>
                  <kbd class="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">M</kbd>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-700">Conseil suivant</span>
                  <kbd class="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">N</kbd>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-700">Sons 1-6</span>
                  <kbd class="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">1-6</kbd>
                </div>
              </div>
            </section>

            <!-- Conseils pour réussir -->
            <section>
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span class="text-2xl mr-2">💡</span>
                Conseils pour réussir
              </h3>
              <div class="space-y-2">
                <div class="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-green-800">Élimine toutes les distractions (téléphone en silencieux, notifications désactivées)</span>
                </div>
                <div class="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-green-800">Prépare ton espace de travail avant de commencer</span>
                </div>
                <div class="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-green-800">Respecte les pauses, elles sont essentielles pour maintenir ta concentration</span>
                </div>
                <div class="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-green-800">Utilise les sons d'ambiance pour masquer les bruits perturbants</span>
                </div>
              </div>
            </section>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                Tu peux rouvrir ce guide à tout moment
              </div>
              <button
                @click="close"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .bg-white {
  transform: scale(0.9) translateY(20px);
}

kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
</style>
