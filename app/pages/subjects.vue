<template>
  <title>StudyFlow - Mes matières</title>
  <div>
    <!-- Header avec bouton d'ajout -->
    <div class="flex justify-between items-center mb-8 slide-up-enter-active">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Mes matières</h1>
        <p class="text-gray-600 mt-2">Organise tes cours par matière</p>
      </div>
      <button 
        @click="showAddForm = true"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center btn-animate disabled:opacity-50"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une matière
      </button>
    </div>

    <!-- Formulaire d'ajout (conditionnel) -->
    <div v-if="showAddForm" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Nouvelle matière</h3>
      <form @submit.prevent="addSubject" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nom de la matière
          </label>
          <input
            type="text"
            id="name"
            v-model="newSubject.name"
            placeholder="Ex: Mathématiques, Histoire..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Couleur
          </label>
          <div class="flex space-x-2">
            <button
              v-for="color in availableColors"
              :key="color.value"
              type="button"
              @click="newSubject.color = color.value"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-all',
                newSubject.color === color.value 
                  ? 'border-gray-400 scale-110' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            />
          </div>
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Création...' : 'Créer la matière' }}
          </button>
          <button
            type="button"
            @click="cancelAdd"
            :disabled="loading"
            class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- Loading -->
    <div v-if="loading && subjects.length === 0" class="text-center py-8">
      <p class="text-gray-500">Chargement des matières...</p>
    </div>

    <!-- Liste des matières -->
    <div v-else-if="subjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(subject, index) in subjects" 
        :key="subject.id"
        :class="[
          'bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200',
          'hover-lift card-hover stagger-item',
          'hover:shadow-lg hover:border-blue-200'
        ]"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div 
              class="w-4 h-4 rounded-full mr-3"
              :style="{ backgroundColor: subject.color }"
            />
            <h3 class="text-lg font-semibold text-gray-900">{{ subject.name }}</h3>
          </div>
          <button
            @click="deleteSubject(subject.id)"
            :disabled="loading"
            class="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <div class="text-sm text-gray-600">
          <p>0 devoir en cours</p>
          <p class="text-xs mt-1">Créée le {{ formatDate(subject.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- État vide amélioré -->
    <EmptyState
      v-else
      title="Aucune matière"
      description="Commence par créer tes premières matières pour organiser tes cours et devoirs par discipline."
      emoji="📚"
      :primary-action="{
        text: 'Créer ma première matière',
        icon: 'M12 4v16m8-8H4'
      }"
      :tips="[
        'Utilise des couleurs différentes pour mieux identifier tes matières',
        'Raccourci clavier: appuie sur S pour créer rapidement',
        'Tu peux modifier le nom et la couleur à tout moment'
      ]"
      @primary-action="showAddForm = true"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

// Données réactives
const subjects = ref([])
const showAddForm = ref(false)
const loading = ref(false)
const newSubject = reactive({
  name: '',
  color: '#3B82F6'
})

// Couleurs disponibles
const availableColors = [
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Jaune', value: '#F59E0B' }
]

// Charger les matières depuis l'API
// Charger les matières depuis l'API
async function loadSubjects() {
  try {
    loading.value = true
    console.log('=== DEBUT loadSubjects ===')
    
    // Vérifier que localStorage est disponible (côté client)
    if (typeof window === 'undefined') {
      console.log('Côté serveur, skip loading')
      return
    }
    
    const token = localStorage.getItem('token')
    console.log('Token récupéré:', token ? 'OUI' : 'NON')
    console.log('Token value:', token)
    
    if (!token) {
      console.log('Pas de token, redirection vers login')
      await navigateTo('/login')
      return
    }
    
    const headers = { Authorization: `Bearer ${token}` }
    console.log('Headers à envoyer:', headers)
    
    console.log('Envoi de la requête...')
    const response = await $fetch('/api/subjects', {
      headers: headers
    })
    
    console.log('Réponse API:', response)
    subjects.value = response.data || []
  } catch (error) {
    console.error('=== ERREUR ===')
    console.error('Type:', typeof error)
    console.error('Error object:', error)
    console.error('Status:', error.status || error.statusCode)
    console.error('Message:', error.message)
    
    if (error.status === 401 || error.statusCode === 401) {
      console.log('Erreur 401, suppression du token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      await navigateTo('/login')
    } else {
      alert('Erreur lors du chargement des matières')
    }
  } finally {
    loading.value = false
    console.log('=== FIN loadSubjects ===')
  }
}

// Ajouter une matière via l'API
// Ajouter une matière via l'API
async function addSubject() {
  if (!newSubject.name.trim()) return
  
  try {
    loading.value = true
    console.log('Ajout matière:', { name: newSubject.name, color: newSubject.color })
    
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }
    
    const response = await $fetch('/api/subjects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        name: newSubject.name.trim(),
        color: newSubject.color
      }
    })
    
    console.log('Réponse POST:', response)
    
    if (response.success) {
      subjects.value.unshift(response.data)
      
      // Toast contextuel amélioré
      const { success } = useToast()
      success(
        `Matière "${newSubject.name.trim()}" créée !`,
        'Tu peux maintenant y ajouter des devoirs'
      )
      
      // Reset du formulaire
      newSubject.name = ''
      newSubject.color = '#3B82F6'
      showAddForm.value = false
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    if (error.status === 401 || error.statusCode === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      await navigateTo('/login')
    } else {
      alert('Erreur lors de la création de la matière')
    }
  } finally {
    loading.value = false
  }
}

// Supprimer une matière via l'API
async function deleteSubject(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return
  

  try {
    const token = localStorage.getItem('token')
    loading.value = true
    await $fetch(`/api/subjects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Retirer de la liste locale
    subjects.value = subjects.value.filter(subject => subject.id !== id)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    alert('Erreur lors de la suppression de la matière')
  } finally {
    loading.value = false
  }
}

function cancelAdd() {
  newSubject.name = ''
  newSubject.color = '#3B82F6'
  showAddForm.value = false
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString))
}

// Charger les matières au montage du composant
onMounted(() => {
  console.log('Composant monté côté client')
  nextTick(() => {
    loadSubjects()
  })
})
</script>