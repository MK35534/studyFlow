// Système de thèmes pour StudyFlow
import { ref, computed } from 'vue'

// Thèmes disponibles avec variantes light et dark
const themes = {
  purple: {
    name: 'Violet',
    light: {
      primary: {
        50: 'purple-50',
        100: 'purple-100',
        500: 'purple-500',
        600: 'purple-600',
        700: 'purple-700',
      },
      secondary: {
        50: 'pink-50',
        100: 'pink-100',
        500: 'pink-500',
        600: 'pink-600',
        700: 'pink-700',
      },
      gradient: 'from-purple-600 to-pink-600',
      gradientHover: 'from-purple-700 to-pink-700',
      gradientBg: 'from-purple-50 to-pink-50',
      shadow: 'shadow-purple-500/30',
      shadowHover: 'shadow-purple-500/40',
      ring: 'ring-purple-100',
      focus: 'focus:ring-purple-500',
      text: 'text-purple-600',
      textHover: 'text-purple-700',
      bg: 'bg-purple-50',
      bgHover: 'bg-purple-100',
      border: 'border-purple-100',
      borderHover: 'border-purple-300',
    },
    dark: {
      primary: {
        50: 'purple-950',
        100: 'purple-900',
        500: 'purple-400',
        600: 'purple-500',
        700: 'purple-600',
      },
      secondary: {
        50: 'pink-950',
        100: 'pink-900',
        500: 'pink-400',
        600: 'pink-500',
        700: 'pink-600',
      },
      gradient: 'from-purple-500 to-pink-500',
      gradientHover: 'from-purple-600 to-pink-600',
      gradientBg: 'from-purple-950/30 to-pink-950/30',
      shadow: 'shadow-purple-500/20',
      shadowHover: 'shadow-purple-500/30',
      ring: 'ring-purple-900',
      focus: 'focus:ring-purple-400',
      text: 'text-purple-400',
      textHover: 'text-purple-300',
      bg: 'bg-purple-950/30',
      bgHover: 'bg-purple-900/40',
      border: 'border-purple-900/50',
      borderHover: 'border-purple-800',
    }
  },
  
  blue: {
    name: 'Bleu',
    light: {
      primary: {
        50: 'blue-50',
        100: 'blue-100',
        500: 'blue-500',
        600: 'blue-600',
        700: 'blue-700',
      },
      secondary: {
        50: 'indigo-50',
        100: 'indigo-100',
        500: 'indigo-500',
        600: 'indigo-600',
        700: 'indigo-700',
      },
      gradient: 'from-blue-600 to-indigo-600',
      gradientHover: 'from-blue-700 to-indigo-700',
      gradientBg: 'from-blue-50 to-indigo-50',
      shadow: 'shadow-blue-500/30',
      shadowHover: 'shadow-blue-500/40',
      ring: 'ring-blue-100',
      focus: 'focus:ring-blue-500',
      text: 'text-blue-600',
      textHover: 'text-blue-700',
      bg: 'bg-blue-50',
      bgHover: 'bg-blue-100',
      border: 'border-blue-100',
      borderHover: 'border-blue-300',
    },
    dark: {
      primary: {
        50: 'blue-950',
        100: 'blue-900',
        500: 'blue-400',
        600: 'blue-500',
        700: 'blue-600',
      },
      secondary: {
        50: 'indigo-950',
        100: 'indigo-900',
        500: 'indigo-400',
        600: 'indigo-500',
        700: 'indigo-600',
      },
      gradient: 'from-blue-500 to-indigo-500',
      gradientHover: 'from-blue-600 to-indigo-600',
      gradientBg: 'from-blue-950/30 to-indigo-950/30',
      shadow: 'shadow-blue-500/20',
      shadowHover: 'shadow-blue-500/30',
      ring: 'ring-blue-900',
      focus: 'focus:ring-blue-400',
      text: 'text-blue-400',
      textHover: 'text-blue-300',
      bg: 'bg-blue-950/30',
      bgHover: 'bg-blue-900/40',
      border: 'border-blue-900/50',
      borderHover: 'border-blue-800',
    }
  },
  
  green: {
    name: 'Vert',
    light: {
      primary: {
        50: 'green-50',
        100: 'green-100',
        500: 'green-500',
        600: 'green-600',
        700: 'green-700',
      },
      secondary: {
        50: 'emerald-50',
        100: 'emerald-100',
        500: 'emerald-500',
        600: 'emerald-600',
        700: 'emerald-700',
      },
      gradient: 'from-green-600 to-emerald-600',
      gradientHover: 'from-green-700 to-emerald-700',
      gradientBg: 'from-green-50 to-emerald-50',
      shadow: 'shadow-green-500/30',
      shadowHover: 'shadow-green-500/40',
      ring: 'ring-green-100',
      focus: 'focus:ring-green-500',
      text: 'text-green-600',
      textHover: 'text-green-700',
      bg: 'bg-green-50',
      bgHover: 'bg-green-100',
      border: 'border-green-100',
      borderHover: 'border-green-300',
    },
    dark: {
      primary: {
        50: 'green-950',
        100: 'green-900',
        500: 'green-400',
        600: 'green-500',
        700: 'green-600',
      },
      secondary: {
        50: 'emerald-950',
        100: 'emerald-900',
        500: 'emerald-400',
        600: 'emerald-500',
        700: 'emerald-600',
      },
      gradient: 'from-green-500 to-emerald-500',
      gradientHover: 'from-green-600 to-emerald-600',
      gradientBg: 'from-green-950/30 to-emerald-950/30',
      shadow: 'shadow-green-500/20',
      shadowHover: 'shadow-green-500/30',
      ring: 'ring-green-900',
      focus: 'focus:ring-green-400',
      text: 'text-green-400',
      textHover: 'text-green-300',
      bg: 'bg-green-950/30',
      bgHover: 'bg-green-900/40',
      border: 'border-green-900/50',
      borderHover: 'border-green-800',
    }
  },
  
  orange: {
    name: 'Orange',
    light: {
      primary: {
        50: 'orange-50',
        100: 'orange-100',
        500: 'orange-500',
        600: 'orange-600',
        700: 'orange-700',
      },
      secondary: {
        50: 'amber-50',
        100: 'amber-100',
        500: 'amber-500',
        600: 'amber-600',
        700: 'amber-700',
      },
      gradient: 'from-orange-600 to-amber-600',
      gradientHover: 'from-orange-700 to-amber-700',
      gradientBg: 'from-orange-50 to-amber-50',
      shadow: 'shadow-orange-500/30',
      shadowHover: 'shadow-orange-500/40',
      ring: 'ring-orange-100',
      focus: 'focus:ring-orange-500',
      text: 'text-orange-600',
      textHover: 'text-orange-700',
      bg: 'bg-orange-50',
      bgHover: 'bg-orange-100',
      border: 'border-orange-100',
      borderHover: 'border-orange-300',
    },
    dark: {
      primary: {
        50: 'orange-950',
        100: 'orange-900',
        500: 'orange-400',
        600: 'orange-500',
        700: 'orange-600',
      },
      secondary: {
        50: 'amber-950',
        100: 'amber-900',
        500: 'amber-400',
        600: 'amber-500',
        700: 'amber-600',
      },
      gradient: 'from-orange-500 to-amber-500',
      gradientHover: 'from-orange-600 to-amber-600',
      gradientBg: 'from-orange-950/30 to-amber-950/30',
      shadow: 'shadow-orange-500/20',
      shadowHover: 'shadow-orange-500/30',
      ring: 'ring-orange-900',
      focus: 'focus:ring-orange-400',
      text: 'text-orange-400',
      textHover: 'text-orange-300',
      bg: 'bg-orange-950/30',
      bgHover: 'bg-orange-900/40',
      border: 'border-orange-900/50',
      borderHover: 'border-orange-800',
    }
  },
  
  rose: {
    name: 'Rose',
    light: {
      primary: {
        50: 'rose-50',
        100: 'rose-100',
        500: 'rose-500',
        600: 'rose-600',
        700: 'rose-700',
      },
      secondary: {
        50: 'pink-50',
        100: 'pink-100',
        500: 'pink-500',
        600: 'pink-600',
        700: 'pink-700',
      },
      gradient: 'from-rose-600 to-pink-600',
      gradientHover: 'from-rose-700 to-pink-700',
      gradientBg: 'from-rose-50 to-pink-50',
      shadow: 'shadow-rose-500/30',
      shadowHover: 'shadow-rose-500/40',
      ring: 'ring-rose-100',
      focus: 'focus:ring-rose-500',
      text: 'text-rose-600',
      textHover: 'text-rose-700',
      bg: 'bg-rose-50',
      bgHover: 'bg-rose-100',
      border: 'border-rose-100',
      borderHover: 'border-rose-300',
    },
    dark: {
      primary: {
        50: 'rose-950',
        100: 'rose-900',
        500: 'rose-400',
        600: 'rose-500',
        700: 'rose-600',
      },
      secondary: {
        50: 'pink-950',
        100: 'pink-900',
        500: 'pink-400',
        600: 'pink-500',
        700: 'pink-600',
      },
      gradient: 'from-rose-500 to-pink-500',
      gradientHover: 'from-rose-600 to-pink-600',
      gradientBg: 'from-rose-950/30 to-pink-950/30',
      shadow: 'shadow-rose-500/20',
      shadowHover: 'shadow-rose-500/30',
      ring: 'ring-rose-900',
      focus: 'focus:ring-rose-400',
      text: 'text-rose-400',
      textHover: 'text-rose-300',
      bg: 'bg-rose-950/30',
      bgHover: 'bg-rose-900/40',
      border: 'border-rose-900/50',
      borderHover: 'border-rose-800',
    }
  },
}

// État global du thème et du mode (stockés dans localStorage)
const currentTheme = ref(null)
const isDarkMode = ref(false)

// Initialiser le thème et le mode
const initTheme = () => {
  if (process.client) {
    const savedTheme = localStorage.getItem('studyflow-theme')
    const savedMode = localStorage.getItem('studyflow-theme-mode')
    currentTheme.value = savedTheme || 'blue' // Thème par défaut: bleu
    isDarkMode.value = savedMode === 'dark'
    
    // Appliquer la classe dark sur le HTML
    applyDarkClass()
  }
}

// Appliquer/retirer la classe 'dark' sur <html>
const applyDarkClass = () => {
  if (process.client) {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// Changer le thème
const setTheme = (themeName) => {
  if (themes[themeName]) {
    currentTheme.value = themeName
    if (process.client) {
      localStorage.setItem('studyflow-theme', themeName)
    }
  }
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (process.client) {
    localStorage.setItem('studyflow-theme-mode', isDarkMode.value ? 'dark' : 'light')
    applyDarkClass()
  }
}

// Composable principal
export const useTheme = () => {
  // Initialiser si pas encore fait
  if (!currentTheme.value) {
    initTheme()
  }
  
  // Thème actuel avec mode light/dark
  const theme = computed(() => {
    const themeName = currentTheme.value || 'blue'
    const mode = isDarkMode.value ? 'dark' : 'light'
    return {
      name: themes[themeName].name,
      ...themes[themeName][mode]
    }
  })
  
  // Liste des thèmes disponibles
  const availableThemes = computed(() => Object.entries(themes).map(([key, value]) => ({
    key,
    name: value.name
  })))
  
  return {
    theme,
    currentTheme,
    isDarkMode,
    setTheme,
    toggleDarkMode,
    availableThemes,
    themes
  }
}