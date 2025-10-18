<template>
  <div class="relative">
    <!-- Bouton pour ouvrir le picker -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full px-4 py-2.5 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ formattedDate || 'Choisir une date' }}
          </span>
        </div>
        <svg 
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Calendrier dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full min-w-[320px]"
      >
        <!-- Header avec navigation mois/année -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="previousMonth"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="text-center">
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">
              {{ monthNames[currentMonth] }} {{ currentYear }}
            </h3>
          </div>

          <button
            @click="nextMonth"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Jours de la semaine -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in dayNames"
            :key="day"
            class="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Grille des jours -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            @click="selectDate(day)"
            :disabled="!day.isCurrentMonth"
            :class="[
              'p-2 text-sm rounded-lg transition-all duration-200',
              !day.isCurrentMonth 
                ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                : day.isToday
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold'
                  : day.isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
            ]"
          >
            {{ day.date }}
          </button>
        </div>

        <!-- Boutons rapides -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            @click="setToday"
            class="flex-1 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            Aujourd'hui
          </button>
          <button
            @click="setTomorrow"
            class="flex-1 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            Demain
          </button>
          <button
            @click="clear"
            class="flex-1 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Effacer
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop pour fermer en cliquant à l'extérieur -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Date formatée pour l'affichage
const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue + 'T00:00:00')
  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
})

// Générer les jours du calendrier
const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  
  // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
  let firstDayOfWeek = firstDay.getDay()
  // Ajuster pour que lundi soit 0
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  // Ajouter les jours du mois précédent
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }
  
  // Ajouter les jours du mois actuel
  const today = new Date()
  const selectedDate = props.modelValue ? new Date(props.modelValue + 'T00:00:00') : null
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i)
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    
    const isSelected = selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      isSelected,
      fullDate: date
    })
  }
  
  // Compléter avec les jours du mois suivant
  const remainingDays = 42 - days.length // 6 semaines * 7 jours
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }
  
  return days
})

// Navigation
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Sélection de date
const selectDate = (day) => {
  if (!day.isCurrentMonth) return
  
  const selected = new Date(currentYear.value, currentMonth.value, day.date)
  const formatted = selected.toISOString().split('T')[0]
  emit('update:modelValue', formatted)
  isOpen.value = false
}

const setToday = () => {
  const today = new Date()
  const formatted = today.toISOString().split('T')[0]
  emit('update:modelValue', formatted)
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  isOpen.value = false
}

const setTomorrow = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const formatted = tomorrow.toISOString().split('T')[0]
  emit('update:modelValue', formatted)
  currentMonth.value = tomorrow.getMonth()
  currentYear.value = tomorrow.getFullYear()
  isOpen.value = false
}

const clear = () => {
  emit('update:modelValue', '')
  isOpen.value = false
}

// Mettre à jour le calendrier quand la date change
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const date = new Date(newValue + 'T00:00:00')
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
})
</script>
