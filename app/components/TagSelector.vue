<template>
  <div class="space-y-4">
    <!-- Titre et bouton créer -->
    <div class="flex items-center justify-between">
      <label class="flex text-sm font-bold text-gray-700 dark:text-gray-300 items-center gap-2 transition-colors duration-300">
        <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Tags
      </label>
      <button
        v-if="!showCreateForm"
        @click="showCreateForm = true"
        class="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors duration-300"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau tag
      </button>
    </div>

    <!-- Formulaire de création rapide -->
    <div
      v-if="showCreateForm"
      class="bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-pink-50 dark:to-pink-900/10 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700 transition-colors duration-300"
    >
      <input
        v-model="newTagName"
        type="text"
        placeholder="Nom du tag..."
        maxlength="100"
        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
        @keyup.enter="createTag"
      >
      
      <!-- Palette de couleurs moderne -->
      <div class="mt-3">
        <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Choisir une couleur :</p>
        <div class="grid grid-cols-8 gap-2">
          <button
            v-for="color in colorPalette"
            :key="color"
            @click="newTagColor = color"
            :class="[
              'w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110',
              newTagColor === color ? 'ring-2 ring-offset-2 ring-purple-500 dark:ring-offset-gray-800 scale-110' : ''
            ]"
            :style="{ backgroundColor: color }"
            :title="color"
          >
            <svg v-if="newTagColor === color" class="w-5 h-5 mx-auto text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button
          @click="createTag"
          :disabled="!newTagName.trim() || isCreating"
          :class="[
            'flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300',
            !newTagName.trim() || isCreating
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
          ]"
        >
          {{ isCreating ? 'Création...' : '✓ Créer' }}
        </button>
        <button
          @click="cancelCreate"
          class="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des tags disponibles -->
    <div v-if="availableTags.length > 0" class="space-y-2">
      <p class="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Sélectionnez un ou plusieurs tags :</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          @click="toggleTag(tag)"
          :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            isSelected(tag.id)
              ? 'ring-2 ring-purple-500 dark:ring-purple-400 shadow-lg scale-105'
              : 'hover:scale-105 hover:shadow-md opacity-80 hover:opacity-100'
          ]"
          :style="{
            backgroundColor: tag.color + (isSelected(tag.id) ? 'FF' : '40'),
            color: isSelected(tag.id) ? '#ffffff' : tag.color,
            borderColor: tag.color
          }"
        >
          <span>{{ tag.name }}</span>
          <svg
            v-if="isSelected(tag.id)"
            class="w-3.5 h-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tags sélectionnés (preview) -->
    <div v-if="selectedTags.length > 0" class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Tags sélectionnés ({{ selectedTags.length }}) :</p>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="tag in getSelectedTagObjects()"
          :key="tag.id"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white transition-all duration-200"
          :style="{ backgroundColor: tag.color }"
        >
          <span>{{ tag.name }}</span>
          <button
            @click="removeTag(tag.id)"
            class="hover:bg-white/20 rounded-full p-0.5 transition-colors"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div
      v-if="availableTags.length === 0 && !showCreateForm"
      class="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 transition-colors duration-300"
    >
      <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors duration-300">Aucun tag créé</p>
      <button
        @click="showCreateForm = true"
        class="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300"
      >
        + Créer votre premier tag
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'manage-tags'])

// Palette de couleurs moderne et harmonieuse
const colorPalette = [
  '#EF4444', // Rouge
  '#F59E0B', // Orange
  '#FBBF24', // Jaune
  '#84CC16', // Vert lime
  '#10B981', // Vert
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Bleu
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#64748B', // Slate
  '#6B7280', // Gray
]

// États
const availableTags = ref([])
const selectedTags = ref([...props.modelValue])
const showCreateForm = ref(false)
const newTagName = ref('')
const newTagColor = ref('#6366F1') // Indigo par défaut
const isCreating = ref(false)

// Charger les tags disponibles
const loadTags = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    
    const response = await $fetch('/api/tags', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.success) {
      availableTags.value = response.tags
    }
  } catch (error) {
    console.error('Erreur chargement tags:', error)
  }
}

// Créer un nouveau tag
const createTag = async () => {
  if (!newTagName.value.trim() || isCreating.value) return

  isCreating.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vous devez être connecté pour créer un tag')
      isCreating.value = false
      return
    }
    
    const response = await $fetch('/api/tags', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        name: newTagName.value.trim(),
        color: newTagColor.value
      }
    })

    if (response.success) {
      availableTags.value.push(response.tag)
      // Auto-sélectionner le tag créé
      selectedTags.value.push(response.tag.id)
      emit('update:modelValue', selectedTags.value)
      
      // Réinitialiser le formulaire
      cancelCreate()
    }
  } catch (error) {
    console.error('Erreur création tag:', error)
    alert(error.data?.message || 'Erreur lors de la création du tag')
  } finally {
    isCreating.value = false
  }
}

// Annuler la création
const cancelCreate = () => {
  showCreateForm.value = false
  newTagName.value = ''
  newTagColor.value = '#6B7280'
}

// Vérifier si un tag est sélectionné
const isSelected = (tagId) => {
  return selectedTags.value.includes(tagId)
}

// Toggle sélection tag
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag.id)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag.id)
  }
  emit('update:modelValue', selectedTags.value)
}

// Retirer un tag
const removeTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
    emit('update:modelValue', selectedTags.value)
  }
}

// Récupérer les objets tags sélectionnés
const getSelectedTagObjects = () => {
  return availableTags.value.filter(tag => selectedTags.value.includes(tag.id))
}

// Charger les tags au montage
onMounted(() => {
  loadTags()
})

// Watcher pour sync avec v-model
watch(() => props.modelValue, (newVal) => {
  selectedTags.value = [...newVal]
}, { deep: true })
</script>
