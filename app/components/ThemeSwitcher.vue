<template>
  <div class="relative z-[9999] flex items-center gap-2">
    <!-- Toggle Dark Mode -->
    <button
      @click="toggleMode"
      class="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
      title="Changer de mode"
    >
      <!-- Icône Soleil (mode light) -->
      <svg 
        v-if="!isDarkMode" 
        class="w-5 h-5 text-amber-500 group-hover:rotate-90 transition-transform duration-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <!-- Icône Lune (mode dark) -->
      <svg 
        v-else 
        class="w-5 h-5 text-blue-400 group-hover:-rotate-12 transition-transform duration-500" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <!-- Bouton Thème -->
    <button
      @click="togglePanel"
      ref="buttonRef"
      class="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md group"
      title="Changer de thème"
    >
      <svg class="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    </button>

    <!-- Panel de sélection de thème -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95 translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-2"
      >
        <div
          v-if="showPanel"
          v-click-outside="closePanel"
          ref="panelRef"
          :style="panelStyle"
          class="fixed w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-4 z-[99999]"
        >
        <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Choisir un thème
        </h3>

        <!-- Grille des thèmes -->
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="themeOption in availableThemes"
            :key="themeOption.key"
            @click="selectTheme(themeOption.key)"
            :class="[
              'relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105',
              currentTheme === themeOption.key
                ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-700'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            ]"
          >
            <!-- Aperçu du gradient -->
            <div :class="[
              'h-8 rounded-lg mb-2 bg-gradient-to-r',
              isDarkMode ? themes[themeOption.key].dark.gradient : themes[themeOption.key].light.gradient
            ]"></div>
            
            <!-- Nom du thème -->
            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ themeOption.name }}
            </p>
            
            <!-- Indicateur sélectionné -->
            <div
              v-if="currentTheme === themeOption.key"
              class="absolute top-2 right-2 w-5 h-5 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg class="w-3 h-3 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Info -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Le thème sera appliqué sur toute l'application
        </p>
      </div>
    </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '~/composables/useTheme'

// Props
const props = defineProps({
  align: {
    type: String,
    default: 'left', // 'left' ou 'right'
    validator: (value) => ['left', 'right'].includes(value)
  }
})

const { theme, currentTheme, isDarkMode, setTheme, toggleDarkMode, availableThemes, themes } = useTheme()
const showPanel = ref(false)
const buttonRef = ref(null)
const panelRef = ref(null)
const panelStyle = ref({})

const toggleMode = () => {
  toggleDarkMode()
}

const togglePanel = () => {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    nextTick(() => {
      updatePanelPosition()
    })
  }
}

const updatePanelPosition = () => {
  if (!buttonRef.value) return
  
  const rect = buttonRef.value.getBoundingClientRect()
  const panelWidth = 288 // 72 * 4 (w-72 en pixels)
  
  if (props.align === 'left') {
    panelStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      transformOrigin: 'top left'
    }
  } else {
    panelStyle.value = {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
      transformOrigin: 'top right'
    }
  }
}

const selectTheme = (themeName) => {
  setTheme(themeName)
  showPanel.value = false
}

const closePanel = () => {
  showPanel.value = false
}

// Mettre à jour la position au scroll/resize
onMounted(() => {
  window.addEventListener('scroll', updatePanelPosition, true)
  window.addEventListener('resize', updatePanelPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePanelPosition, true)
  window.removeEventListener('resize', updatePanelPosition)
})

// Directive v-click-outside améliorée
const vClickOutside = {
  mounted(el, binding) {
    // Attendre le prochain tick pour éviter le déclenchement immédiat
    nextTick(() => {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value()
        }
      }
      // Utiliser setTimeout pour éviter que le click d'ouverture déclenche la fermeture
      setTimeout(() => {
        document.addEventListener('click', el.clickOutsideEvent)
      }, 0)
    })
  },
  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>
