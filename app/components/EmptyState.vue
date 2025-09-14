<template>
  <div class="text-center py-12">
    <!-- Icône ou illustration -->
    <div class="mx-auto mb-6">
      <!-- Icône SVG -->
      <div v-if="iconType === 'svg'" :class="[
        'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
        iconBg
      ]">
        <svg :class="['w-8 h-8', iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
        </svg>
      </div>
      
      <!-- Emoji -->
      <div v-else-if="iconType === 'emoji'" class="text-6xl mb-4">
        {{ emoji }}
      </div>
      
      <!-- Illustration (placeholder) -->
      <div v-else class="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
        <span class="text-4xl">{{ emoji || '📋' }}</span>
      </div>
    </div>
    
    <!-- Titre -->
    <h3 class="text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>
    
    <!-- Description -->
    <p class="text-gray-600 mb-6 max-w-md mx-auto">
      {{ description }}
    </p>
    
    <!-- Actions -->
    <div v-if="$slots.actions || primaryAction" class="space-y-3">
      <slot name="actions">
        <button
          v-if="primaryAction"
          @click="$emit('primary-action')"
          :class="[
            'inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-all btn-animate',
            primaryAction.style || 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          <svg v-if="primaryAction.icon" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="primaryAction.icon" />
          </svg>
          {{ primaryAction.text }}
        </button>
      </slot>
      
      <!-- Action secondaire -->
      <div v-if="secondaryAction">
        <button
          @click="$emit('secondary-action')"
          class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {{ secondaryAction.text }}
        </button>
      </div>
    </div>
    
    <!-- Tips optionnels -->
    <div v-if="tips && tips.length > 0" class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-left">
          <h4 class="text-sm font-medium text-blue-900 mb-2">💡 Conseils</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li v-for="tip in tips" :key="tip">• {{ tip }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  // Contenu
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Icône
  iconType: {
    type: String,
    default: 'emoji',
    validator: (value) => ['svg', 'emoji', 'illustration'].includes(value)
  },
  iconPath: String,
  iconBg: {
    type: String,
    default: 'bg-gray-100'
  },
  iconColor: {
    type: String,
    default: 'text-gray-400'
  },
  emoji: {
    type: String,
    default: '📋'
  },
  
  // Actions
  primaryAction: {
    type: Object,
    default: null
  },
  secondaryAction: {
    type: Object,
    default: null
  },
  
  // Tips
  tips: {
    type: Array,
    default: () => []
  }
})

// Emits
defineEmits(['primary-action', 'secondary-action'])




</script>
