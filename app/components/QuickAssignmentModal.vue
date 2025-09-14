<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
    @click="closeModal"
  >
    <!-- Modal -->
    <div
      class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all modal-content"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            Nouveau devoir
          </h3>
          <div class="text-sm text-gray-500">
            {{ formatSelectedDate }}
          </div>
        </div>
      </div>
      
      <!-- Body -->
      <div class="px-6 py-4">
        <form @submit.prevent="createAssignment" class="space-y-4">
          <!-- Titre -->
          <div>
            <label for="quick-title" class="block text-sm font-medium text-gray-700 mb-2">
              Titre du devoir
            </label>
            <input
              ref="titleInput"
              id="quick-title"
              type="text"
              v-model="form.title"
              placeholder="Ex: Exercices page 42, Dissertation..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              @keydown.esc="closeModal"
            />
          </div>
          
          <!-- Matière -->
          <div>
            <label for="quick-subject" class="block text-sm font-medium text-gray-700 mb-2">
              Matière
            </label>
            <select
              id="quick-subject"
              v-model="form.subject_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Choisir une matière</option>
              <option 
                v-for="subject in subjects" 
                :key="subject.id" 
                :value="subject.id"
              >
                {{ subject.name }}
              </option>
            </select>
          </div>
          
          <!-- Description rapide -->
          <div>
            <label for="quick-description" class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              id="quick-description"
              v-model="form.description"
              rows="2"
              placeholder="Détails, consignes..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>
        </form>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          @click="createAssignment"
          :disabled="!form.title.trim() || !form.subject_id || loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 btn-animate"
        >
          {{ loading ? 'Création...' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  show: Boolean,
  selectedDate: Date,
  subjects: Array
})

// Emits
const emit = defineEmits(['close', 'created'])

// Refs
const titleInput = ref(null)
const loading = ref(false)

// Form data
const form = reactive({
  title: '',
  subject_id: '',
  description: ''
})

// Computed
const formatSelectedDate = computed(() => {
  if (!props.selectedDate) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(props.selectedDate)
})

// Watchers
watch(() => props.show, async (newShow) => {
  if (newShow) {
    // Focus sur le champ titre quand la modal s'ouvre
    await nextTick()
    titleInput.value?.focus()
  } else {
    // Reset du formulaire quand la modal se ferme
    resetForm()
  }
})

// Methods
function resetForm() {
  form.title = ''
  form.subject_id = ''
  form.description = ''
}

function closeModal() {
  emit('close')
}

async function createAssignment() {
  if (!form.title.trim() || !form.subject_id) return
  
  try {
    loading.value = true
    
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Non authentifié')
    }
    
    // Format de la date
    const year = props.selectedDate.getFullYear()
    const month = String(props.selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(props.selectedDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    const response = await $fetch('/api/assignments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: form.title.trim(),
        subject_id: parseInt(form.subject_id),
        due_date: dateStr,
        description: form.description.trim()
      }
    })
    
    if (response.success) {
      // Toast de succès
      const { success } = useToast()
      success('Devoir créé !', `"${form.title.trim()}" ajouté pour le ${formatSelectedDate.value}`)
      
      // Émettre l'événement avec le nouveau devoir
      emit('created', response.data)
      
      // Fermer la modal
      closeModal()
    }
  } catch (error) {
    console.error('Erreur création devoir:', error)
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de créer le devoir')
  } finally {
    loading.value = false
  }
}

// Keyboard shortcuts
function handleKeydown(event) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    createAssignment()
  }
}

// Écouter les événements clavier quand la modal est ouverte
watch(() => props.show, (show) => {
  if (show) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Animations de la modal */
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>