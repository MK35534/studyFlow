<template>
  <!-- Navigation mobile moderne avec design floating et glass effect -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none" style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);">
    <div class="pointer-events-auto max-w-md mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all duration-300">
      <div class="flex items-center justify-around px-3 py-3">
        <!-- Home / Dashboard -->
        <NuxtLink 
          to="/dashboard"
          class="flex flex-col items-center justify-center flex-1 min-w-[60px] group relative touch-manipulation"
        >
          <!-- Floating indicator -->
          <div 
            v-if="isActive('/dashboard')"
            :class="`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r ${theme.gradient} shadow-lg transition-all duration-300`"
          ></div>
          
          <div 
            class="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 mb-1.5"
            :class="isActive('/dashboard') 
              ? `bg-gradient-to-br ${theme.gradient} shadow-lg shadow-purple-500/30 scale-105` 
              : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 group-hover:scale-105 group-active:scale-95'"
          >
            <svg 
              class="w-6 h-6 transition-all duration-300" 
              :class="isActive('/dashboard') ? 'text-white drop-shadow-md' : 'text-gray-600 dark:text-gray-400'" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
          </div>
          <span 
            class="text-[11px] font-bold transition-all duration-300 tracking-tight" 
            :class="isActive('/dashboard') 
              ? `bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent` 
              : 'text-gray-600 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300'"
          >
            Home
          </span>
        </NuxtLink>

        <!-- Matières -->
        <NuxtLink 
          to="/dashboard/subjects"
          class="flex flex-col items-center justify-center flex-1 min-w-[60px] group relative touch-manipulation"
        >
          <div 
            v-if="isActive('/dashboard/subjects')"
            :class="`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r ${theme.gradient} shadow-lg transition-all duration-300`"
          ></div>
          
          <div 
            class="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 mb-1.5"
            :class="isActive('/dashboard/subjects') 
              ? `bg-gradient-to-br ${theme.gradient} shadow-lg shadow-blue-500/30 scale-105` 
              : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 group-hover:scale-105 group-active:scale-95'"
          >
            <svg 
              class="w-6 h-6 transition-all duration-300" 
              :class="isActive('/dashboard/subjects') ? 'text-white drop-shadow-md' : 'text-gray-600 dark:text-gray-400'" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>
          <span 
            class="text-[11px] font-bold transition-all duration-300 tracking-tight" 
            :class="isActive('/dashboard/subjects') 
              ? `bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent` 
              : 'text-gray-600 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300'"
          >
            Matières
          </span>
        </NuxtLink>

        <!-- Devoirs (centre avec badge) -->
        <NuxtLink 
          to="/dashboard/assignments"
          class="flex flex-col items-center justify-center flex-1 min-w-[60px] group relative touch-manipulation"
        >
          <!-- Badge compteur urgents - design amélioré -->
          <div 
            v-if="urgentCount > 0" 
            class="absolute -top-1 -right-1 z-10 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[10px] font-bold text-white bg-gradient-to-br from-red-500 to-pink-500 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-lg animate-pulse"
          >
            {{ urgentCount > 9 ? '9+' : urgentCount }}
          </div>
          
          <div 
            v-if="isActive('/dashboard/assignments')"
            :class="`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r ${theme.gradient} shadow-lg transition-all duration-300`"
          ></div>
          
          <div 
            class="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 mb-1.5"
            :class="isActive('/dashboard/assignments') 
              ? `bg-gradient-to-br ${theme.gradient} shadow-lg shadow-indigo-500/30 scale-105` 
              : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 group-hover:scale-105 group-active:scale-95'"
          >
            <svg 
              class="w-6 h-6 transition-all duration-300" 
              :class="isActive('/dashboard/assignments') ? 'text-white drop-shadow-md' : 'text-gray-600 dark:text-gray-400'" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
          </div>
          <span 
            class="text-[11px] font-bold transition-all duration-300 tracking-tight" 
            :class="isActive('/dashboard/assignments') 
              ? `bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent` 
              : 'text-gray-600 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300'"
          >
            Devoirs
          </span>
        </NuxtLink>

        <!-- Calendrier - Bientôt disponible -->
        <div 
          class="flex flex-col items-center justify-center flex-1 min-w-[60px] group relative touch-manipulation opacity-50 cursor-not-allowed"
        >
          <div 
            class="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 mb-1.5 bg-gray-100/50 dark:bg-gray-800/50"
          >
            <svg 
              class="w-6 h-6 transition-all duration-300 text-gray-600 dark:text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <span 
            class="text-[11px] font-bold transition-all duration-300 tracking-tight text-gray-600 dark:text-gray-500"
          >
            Bientôt
          </span>
        </div>

        <!-- Focus -->
        <NuxtLink 
          to="/dashboard/focus"
          class="flex flex-col items-center justify-center flex-1 min-w-[60px] group relative touch-manipulation"
        >
          <div 
            v-if="isActive('/dashboard/focus')"
            :class="`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r ${theme.gradient} shadow-lg transition-all duration-300`"
          ></div>
          
          <div 
            class="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 mb-1.5"
            :class="isActive('/dashboard/focus') 
              ? `bg-gradient-to-br ${theme.gradient} shadow-lg shadow-emerald-500/30 scale-105` 
              : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 group-hover:scale-105 group-active:scale-95'"
          >
            <svg 
              class="w-6 h-6 transition-all duration-300" 
              :class="isActive('/dashboard/focus') ? 'text-white drop-shadow-md' : 'text-gray-600 dark:text-gray-400'" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <span 
            class="text-[11px] font-bold transition-all duration-300 tracking-tight" 
            :class="isActive('/focus') 
              ? `bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent` 
              : 'text-gray-600 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300'"
          >
            Focus
          </span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '~/composables/useTheme'

const route = useRoute()
const { theme } = useTheme()

// Props
const props = defineProps({
  urgentCount: {
    type: Number,
    default: 0
  }
})

// Fonction pour vérifier si une route est active
const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
/* Support des safe areas pour iPhone X et supérieur */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
