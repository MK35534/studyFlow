<template>
  <title>StudyFlow - Calendrier</title>
  <div class="min-h-screen">
    <!-- Header moderne avec dégradé -->
    <div class="mb-8 md:mb-12">
      <div class="relative">
        <div :class="`absolute inset-0 bg-gradient-to-r ${theme.gradientBg} rounded-2xl opacity-50 blur-3xl`"></div>
        <div class="relative">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <!-- Titre -->
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">Calendrier</h1>
              <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">Vue d'ensemble de tes devoirs</p>
            </div>
            
            <!-- Actions desktop -->
            <div class="hidden md:flex items-center gap-4 no-swipe">
              <!-- Sélecteur de vue -->
              <div class="flex bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <button
                  @click="currentView = 'month'"
                  :class="[
                    'px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                    currentView === 'month'
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  Mois
                </button>
                <button
                  @click="currentView = 'week'"
                  :class="[
                    'px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                    currentView === 'week'
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  Semaine
                </button>
              </div>
              
              <!-- Navigation -->
              <div class="flex items-center gap-2">
                <button
                  @click="navigatePrevious"
                  class="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-700 hover:shadow-md"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 min-w-[200px] text-center transition-colors duration-300">
                  {{ currentPeriodTitle }}
                </h2>
                
                <button
                  @click="navigateNext"
                  class="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-700 hover:shadow-md"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <button
                @click="goToToday"
                :class="`bg-gradient-to-r ${theme.gradient} text-white px-6 py-3 rounded-xl hover:${theme.gradientHover} transition-all duration-300 font-semibold shadow-lg ${theme.shadow} hover:shadow-xl ${theme.shadowHover} hover:-translate-y-0.5`"
              >
                Aujourd'hui
              </button>
            </div>
          </div>
          
          <!-- Navigation mobile compacte -->
          <div class="md:hidden flex items-center justify-between gap-2 mt-4">
            <button
              @click="navigatePrevious"
              class="p-2.5 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:shadow-md"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 class="text-base font-bold text-gray-900 dark:text-gray-100 text-center flex-1 truncate transition-colors duration-300">
              {{ currentPeriodTitle }}
            </h2>
            
            <button
              @click="navigateNext"
              class="p-2.5 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:shadow-md"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              @click="goToToday"
              :class="`bg-gradient-to-r ${theme.gradient} text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg ${theme.shadow}`"
            >
              Auj.
            </button>
          </div>

          <!-- Sélecteur vue mobile -->
          <div class="md:hidden flex bg-white dark:bg-gray-800 rounded-xl p-1.5 mt-3 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300 no-swipe">
            <button
              @click="currentView = 'month'"
              :class="[
                'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all',
                currentView === 'month'
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                  : 'text-gray-600 dark:text-gray-400'
              ]"
            >
              Mois
            </button>
            <button
              @click="currentView = 'week'"
              :class="[
                'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all',
                currentView === 'week'
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                  : 'text-gray-600 dark:text-gray-400'
              ]"
            >
              Semaine
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading && assignments.length === 0" 
      type="skeleton" 
      message="Chargement du calendrier..." 
      size="large" 
    />

    <!-- Vue mensuelle moderne -->
    <div v-else-if="currentView === 'month'" class="relative overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 to-purple-50/30 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 dark:from-purple-900/30 to-transparent rounded-full blur-3xl opacity-20"></div>
      
      <!-- En-têtes des jours -->
      <div class="relative grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
        <div
          v-for="day in weekDaysShort"
          :key="day"
          class="p-3 md:p-4 text-center text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 bg-gradient-to-b from-gray-50 dark:from-gray-800/50 to-white dark:to-gray-800 transition-colors duration-300"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Grille du calendrier -->
      <div class="relative grid grid-cols-7 no-swipe">
        <div
          v-for="day in calendarDays"
          :key="day.dateKey"
          :class="[
            'group min-h-[70px] md:min-h-[140px] border-r border-b border-gray-100 dark:border-gray-700 p-1.5 md:p-3 transition-all duration-200',
            !day.isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50' : 'bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-br hover:from-purple-50/30 dark:hover:from-purple-900/20 hover:to-white dark:hover:to-gray-800',
            day.isToday ? 'bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-50 dark:to-pink-900/20 ring-2 ring-purple-300 dark:ring-purple-600 ring-inset' : '',
            'cursor-pointer',
            dragOverDate === day.dateKey ? 'bg-gradient-to-br from-purple-200 dark:from-purple-800/50 to-pink-100 dark:to-pink-800/30 ring-2 ring-purple-400 dark:ring-purple-500 ring-inset scale-95' : ''
          ]"
          @dragover="allowDrop"
          @dragenter="setDragOver(day.dateKey)"
          @dragleave="clearDragOver"
          @drop="handleDrop(day.date, $event)"
          @click="openDayModal(day.date)"
        >
          <!-- Numéro du jour moderne -->
          <div class="flex justify-between items-start mb-2">
            <div :class="[
              'flex items-center justify-center transition-all duration-200',
              day.isToday 
                ? `w-7 h-7 md:w-9 md:h-9 bg-gradient-to-br ${theme.gradient} text-white rounded-xl shadow-lg ${theme.shadowHover} font-bold` 
                : !day.isCurrentMonth
                  ? 'text-gray-400 dark:text-gray-600 font-medium'
                  : `text-gray-900 dark:text-gray-100 font-semibold group-hover:${theme.text}`
            ]">
              {{ day.date.getDate() }}
            </div>
            
            <!-- Badge nombre de devoirs -->
            <div 
              v-if="getAssignmentsForDay(day.date).length > 0"
              :class="[
                'px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-200',
                day.isToday 
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'bg-purple-100 text-purple-700 group-hover:bg-purple-200'
              ]"
            >
              {{ getAssignmentsForDay(day.date).length }}
            </div>
          </div>
          
          <!-- Devoirs du jour - affichage moderne -->
          <div class="space-y-1 md:space-y-1.5">
            <!-- Mobile: badges colorés avec icônes -->
            <div class="md:hidden flex flex-wrap gap-1">
              <div
                v-for="assignment in getAssignmentsForDay(day.date).slice(0, 3)"
                :key="assignment.id"
                class="group/badge relative"
              >
                <div
                  class="w-2 h-2 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover/badge:scale-125"
                  :style="{ backgroundColor: assignment.subject_color }"
                  :title="assignment.title"
                />
              </div>
              <span 
                v-if="getAssignmentsForDay(day.date).length > 3"
                class="text-[9px] font-semibold text-purple-600 bg-purple-100 px-1.5 rounded-full"
              >
                +{{ getAssignmentsForDay(day.date).length - 3 }}
              </span>
            </div>
            
            <!-- Desktop: mini-cartes modernes -->
            <div class="hidden md:block space-y-1.5">
              <div
                v-for="assignment in getAssignmentsForDay(day.date).slice(0, 3)"
                :key="assignment.id"
                :class="[
                  'group/card relative overflow-hidden rounded-lg text-xs p-2 cursor-grab transition-all duration-200',
                  assignment.is_completed 
                    ? 'bg-gradient-to-r from-green-100 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/20 text-green-700 dark:text-green-400 line-through opacity-75' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md hover:-translate-y-0.5',
                  draggedAssignment?.id === assignment.id ? 'opacity-50 scale-95' : ''
                ]"
                :draggable="!assignment.is_completed"
                @dragstart="startDrag(assignment, $event)"
                @dragend="endDrag"
                @click.stop="openAssignmentModal(assignment)"
              >
                <!-- Barre de couleur -->
                <div 
                  class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover/card:w-1.5"
                  :style="{ backgroundColor: assignment.subject_color }"
                ></div>
                
                <!-- Contenu -->
                <div class="pl-2">
                  <div class="font-semibold truncate text-gray-900 dark:text-gray-100 group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400 transition-colors">
                    {{ assignment.title }}
                  </div>
                  <div class="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5 flex items-center gap-1 transition-colors duration-300">
                    <div 
                      class="w-1.5 h-1.5 rounded-full"
                      :style="{ backgroundColor: assignment.subject_color }"
                    ></div>
                    {{ assignment.subject_name }}
                  </div>
                </div>

                <!-- Hover effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover/card:from-purple-500/5 group-hover/card:to-pink-500/5 transition-all duration-200"></div>
              </div>
              
              <div
                v-if="getAssignmentsForDay(day.date).length > 3"
                class="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg inline-flex items-center gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ getAssignmentsForDay(day.date).length - 3 }} autres
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue hebdomadaire améliorée -->
    <div v-else class="space-y-4 no-swipe">
      <!-- Desktop: Cards par jour -->
      <div class="hidden md:grid md:grid-cols-7 gap-4">
        <div
          v-for="(day, index) in getCurrentWeekDays()"
          :key="day.toISOString()"
          :class="[
            'relative overflow-hidden rounded-2xl border-2 transition-all duration-300',
            isToday(day) 
              ? `border-purple-400 dark:border-purple-600 bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-pink-50 dark:to-pink-900/10 shadow-xl ring-2 ring-purple-200 dark:ring-purple-800` 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg'
          ]"
        >
          <!-- Header du jour -->
          <div :class="[
            'p-4 border-b transition-colors duration-300',
            isToday(day) 
              ? 'bg-gradient-to-r from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/30 border-purple-200 dark:border-purple-700' 
              : 'bg-gradient-to-b from-gray-50 dark:from-gray-800/50 to-white dark:to-gray-800 border-gray-200 dark:border-gray-700'
          ]">
            <div class="text-sm font-bold text-gray-600 dark:text-gray-400 transition-colors duration-300">{{ weekDays[index] }}</div>
            <div :class="[
              'text-2xl font-bold mt-1 transition-colors duration-300',
              isToday(day) ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'
            ]">
              {{ day.getDate() }}
            </div>
            <div v-if="getAssignmentsForDay(day).length > 0" :class="[
              'mt-2 text-xs font-bold px-2 py-1 rounded-full inline-block transition-colors duration-300',
              isToday(day) 
                ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400' 
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            ]">
              {{ getAssignmentsForDay(day).length }} devoir{{ getAssignmentsForDay(day).length > 1 ? 's' : '' }}
            </div>
          </div>

          <!-- Liste des devoirs -->
          <div class="p-3 space-y-2 min-h-[200px] max-h-[500px] overflow-y-auto">
            <div
              v-for="assignment in getAssignmentsForDay(day)"
              :key="assignment.id"
              :class="[
                'group/card relative overflow-hidden rounded-xl p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                assignment.is_completed 
                  ? 'bg-gradient-to-r from-green-100 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 opacity-75' 
                  : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              ]"
              @click="openAssignmentModal(assignment)"
            >
              <!-- Barre de couleur -->
              <div 
                class="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-200 group-hover/card:w-2"
                :style="{ backgroundColor: assignment.subject_color }"
              ></div>
              
              <div class="pl-3">
                <div :class="[
                  'font-bold text-sm mb-1 truncate transition-colors duration-300',
                  assignment.is_completed 
                    ? 'text-green-700 dark:text-green-400 line-through' 
                    : 'text-gray-900 dark:text-gray-100 group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400'
                ]">
                  {{ assignment.title }}
                </div>
                <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: assignment.subject_color }"
                  ></div>
                  {{ assignment.subject_name }}
                </div>
              </div>
            </div>
            
            <!-- État vide -->
            <div v-if="getAssignmentsForDay(day).length === 0" class="flex flex-col items-center justify-center py-8 text-center">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300">
                <svg class="w-6 h-6 text-gray-400 dark:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Aucun devoir</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Version mobile moderne (liste simple) -->
      <div class="md:hidden relative divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div
          v-for="day in getCurrentWeekDays()"
          :key="day.toISOString()"
        >
          <div 
            :class="[
              'p-4 font-bold text-sm transition-all duration-300',
              isToday(day) 
                ? 'bg-gradient-to-r from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/30 text-purple-900 dark:text-purple-300' 
                : 'bg-gradient-to-b from-gray-50 dark:from-gray-800/50 to-white dark:to-gray-800 text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ formatDayHeader(day) }}
          </div>
          <div v-if="getAssignmentsForDay(day).length > 0" class="p-3 space-y-2 bg-white/80 dark:bg-gray-900/50 transition-colors duration-300">
            <div
              v-for="assignment in getAssignmentsForDay(day)"
              :key="assignment.id"
              :class="[
                'group relative overflow-hidden rounded-xl p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                assignment.is_completed 
                  ? 'bg-gradient-to-r from-green-50 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              ]"
              @click="openAssignmentModal(assignment)"
            >
              <div class="flex items-start gap-3">
                <div 
                  class="w-3 h-3 rounded-full mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-800 shadow-sm transition-colors duration-300"
                  :style="{ backgroundColor: assignment.subject_color }"
                />
                <div class="flex-1 min-w-0">
                  <p :class="[
                    'text-sm font-bold mb-1 transition-colors duration-300',
                    assignment.is_completed 
                      ? 'text-gray-500 dark:text-gray-400 line-through' 
                      : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                  ]">
                    {{ assignment.title }}
                  </p>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">{{ assignment.subject_name }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Barre de couleur -->
              <div 
                class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover:w-1.5"
                :style="{ backgroundColor: assignment.subject_color }"
              ></div>
            </div>
          </div>
          <div v-else class="p-6 text-sm text-gray-500 dark:text-gray-400 text-center bg-white/50 dark:bg-gray-900/30 transition-colors duration-300">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl mb-2 transition-colors duration-300">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p class="font-medium">Aucun devoir</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détail moderne -->
    <div
      v-if="selectedAssignment"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      @click="closeAssignmentModal"
    >
      <div
        class="relative overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300 transition-colors"
        @click.stop
      >
        <!-- Blur background -->
        <div class="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-100 dark:from-purple-900/40 to-pink-100 dark:to-pink-900/30 rounded-full blur-3xl opacity-30 transition-colors duration-300"></div>
        
        <div class="relative p-6">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800 transition-colors duration-300"
                :style="{ backgroundColor: selectedAssignment.subject_color }"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 truncate mb-1 transition-colors duration-300">{{ selectedAssignment.title }}</h3>
                <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate flex items-center gap-1.5 transition-colors duration-300">
                  <span class="w-2 h-2 rounded-full inline-block" :style="{ backgroundColor: selectedAssignment.subject_color }"></span>
                  {{ selectedAssignment.subject_name }}
                </div>
              </div>
            </div>
            <button
              @click="closeAssignmentModal"
              class="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Contenu -->
          <div class="space-y-5">
            <!-- Date d'échéance -->
            <div class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <label class="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2 transition-colors duration-300">
                <svg class="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date d'échéance
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ formatFullDate(selectedAssignment.due_date) }}</p>
            </div>
            
            <!-- Description -->
            <div v-if="selectedAssignment.description" class="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <label class="flex text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 items-center gap-2 transition-colors duration-300">
                <svg class="w-4 h-4 text-purple-600 dark:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </label>
              <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">{{ selectedAssignment.description }}</p>
            </div>
            
            <!-- Statut -->
            <div class="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div class="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  :checked="selectedAssignment.is_completed"
                  @change="toggleAssignmentFromModal"
                  class="h-5 w-5 text-purple-600 dark:text-purple-500 rounded-lg focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer transition-all duration-300"
                >
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer transition-colors duration-300" @click="toggleAssignmentFromModal">
                  Marquer comme terminé
                </label>
              </div>
              <div 
                v-if="selectedAssignment.is_completed"
                class="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-green-500/30 dark:shadow-green-500/20"
              >
                ✓ Terminé
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <button
              @click="closeAssignmentModal"
              class="flex-1 px-5 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold"
            >
              Fermer
            </button>
            <NuxtLink
              :to="`/assignments`"
              :class="`flex-1 px-5 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl hover:${theme.gradientHover} transition-all text-center font-semibold shadow-lg ${theme.shadow} hover:shadow-xl ${theme.shadowHover}`"
              @click="closeAssignmentModal"
            >
              Voir tous
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal jour mobile -->
    <div
      v-if="selectedDay"
      class="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end z-50 pb-16 transition-colors duration-300"
      @click="closeDayModal"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl w-full max-h-[70vh] overflow-y-auto transition-colors duration-300"
        @click.stop
      >
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              {{ formatDayHeader(selectedDay) }}
            </h3>
            <button
              @click="closeDayModal"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <div v-if="getAssignmentsForDay(selectedDay).length > 0" class="space-y-3">
            <div
              v-for="assignment in getAssignmentsForDay(selectedDay)"
              :key="assignment.id"
              :class="[
                'flex items-start space-x-3 p-3 rounded-lg border transition-colors duration-300',
                assignment.is_completed 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
              ]"
              @click="openAssignmentModal(assignment)"
            >
              <div 
                class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                :style="{ backgroundColor: assignment.subject_color }"
              />
              <div class="flex-1 min-w-0">
                <p :class="[
                  'font-medium transition-colors duration-300',
                  assignment.is_completed 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-900 dark:text-gray-100'
                ]">
                  {{ assignment.title }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">{{ assignment.subject_name }}</p>
                <p v-if="assignment.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                  {{ assignment.description }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <p class="mb-2">Aucun devoir ce jour</p>
            <button
              @click="openQuickCreateModal(selectedDay)"
              class="text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors duration-300"
            >
              + Ajouter un devoir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <QuickAssignmentModal
    :show="showQuickModal"
    :selected-date="quickModalDate"
    :subjects="subjects"
    @close="closeQuickModal"
    @created="handleQuickAssignmentCreated"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import QuickAssignmentModal from '~/components/QuickAssignmentModal.vue'

// États
const showQuickModal = ref(false)
const quickModalDate = ref(null)
const assignments = ref([])
const subjects = ref([])
const loading = ref(false)
const currentView = ref('month')
const currentDate = ref(new Date())
const selectedAssignment = ref(null)
const selectedDay = ref(null)
const draggedAssignment = ref(null)
const dragOverDate = ref(null)
const isDragging = ref(false)

// Constantes
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const weekDaysShort = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const timeSlots = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h']

// Computed
const isModalOpen = computed(() => selectedAssignment.value || selectedDay.value)

const currentPeriodTitle = computed(() => {
  if (currentView.value === 'month') {
    return new Intl.DateTimeFormat('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    }).format(currentDate.value)
  } else {
    const weekStart = getWeekStart(currentDate.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(weekStart)}`
  }
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  const dayOfWeek = firstDay.getDay()
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startDate.setDate(firstDay.getDate() - daysToSubtract)
  
  const days = []
  const current = new Date(startDate)
  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(current),
      dateKey: current.toISOString().split('T')[0],
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === today.toDateString()
    })
    current.setDate(current.getDate() + 1)
  }
  return days
})

// Fonctions utilitaires
function getWeekStart(date) {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1)
  result.setDate(diff)
  result.setHours(0, 0, 0, 0)
  return result
}

function getCurrentWeekDays() {
  const weekStart = getWeekStart(currentDate.value)
  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push(day)
  }
  return days
}

function getAssignmentsForDay(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  return assignments.value.filter(a => (a.due_date.split('T')[0] || a.due_date) === dateStr)
}

function getDayAssignmentClass(assignment) {
  const today = new Date()
  const dueDate = new Date(assignment.due_date)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'bg-red-100 text-red-700'
  else if (diffDays === 0) return 'bg-orange-100 text-orange-700'
  else if (diffDays === 1) return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-700'
}

function isToday(date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function formatFullDate(dateString) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

function formatDayHeader(date) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
  else if (date.toDateString() === tomorrow.toDateString()) return "Demain"
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}

// Navigation
function navigatePrevious() {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() - 7)
    currentDate.value = newDate
  }
}

function navigateNext() {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  } else {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + 7)
    currentDate.value = newDate
  }
}

function goToToday() {
  currentDate.value = new Date()
}

// Modals
function openAssignmentModal(assignment) {
  selectedAssignment.value = assignment
  selectedDay.value = null
}

function closeAssignmentModal() {
  selectedAssignment.value = null
}

function openDayModal(date) {
  if (window.innerWidth < 768) {
    selectedDay.value = date
  }
}

function closeDayModal() {
  selectedDay.value = null
}

async function toggleAssignmentFromModal() {
  if (!selectedAssignment.value) return
  try {
    const token = localStorage.getItem('token')
    await $fetch(`/api/assignments/${selectedAssignment.value.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { is_completed: !selectedAssignment.value.is_completed }
    })
    selectedAssignment.value.is_completed = !selectedAssignment.value.is_completed
    const assignment = assignments.value.find(a => a.id === selectedAssignment.value.id)
    if (assignment) assignment.is_completed = selectedAssignment.value.is_completed
  } catch (error) {
    console.error('Erreur toggle:', error)
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de mettre à jour')
  }
}

// Drag & Drop
function startDrag(assignment, event) {
  if (assignment.is_completed) return
  draggedAssignment.value = assignment
  isDragging.value = true
  event.dataTransfer.setData('text/plain', assignment.id.toString())
  event.dataTransfer.effectAllowed = 'move'
}

function endDrag() {
  setTimeout(() => {
    draggedAssignment.value = null
    dragOverDate.value = null
    isDragging.value = false
  }, 100)
}

function allowDrop(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function setDragOver(dateKey) {
  if (isDragging.value && draggedAssignment.value) dragOverDate.value = dateKey
}

function clearDragOver(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) dragOverDate.value = null
}

async function handleDrop(targetDate, event) {
  event.preventDefault()
  if (!draggedAssignment.value) return
  
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const newDateStr = `${year}-${month}-${day}`
  const assignment = draggedAssignment.value
  
  if (assignment.due_date === newDateStr) {
    endDrag()
    return
  }
  
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    const response = await $fetch(`/api/assignments/${assignment.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { due_date: newDateStr }
    })
    if (response.success) {
      const idx = assignments.value.findIndex(a => a.id === assignment.id)
      if (idx !== -1) assignments.value[idx].due_date = newDateStr
      const { success: successToast } = useToast()
      successToast('Devoir déplacé !', `Prévu le ${formatFullDate(newDateStr)}`)
    }
  } catch (err) {
    console.error('Erreur déplacement:', err)
    const { error: errorToast } = useToast()
    errorToast('Erreur', 'Impossible de déplacer le devoir')
  } finally {
    loading.value = false
    endDrag()
  }
}

// Quick modal
function openQuickCreateModal(date) {
  if (subjects.value.length === 0) {
    const { warning } = useToast()
    warning('Aucune matière', 'Créez d\'abord des matières')
    return
  }
  quickModalDate.value = new Date(date)
  showQuickModal.value = true
}

function closeQuickModal() {
  showQuickModal.value = false
  quickModalDate.value = null
}

function handleQuickAssignmentCreated(newAssignment) {
  assignments.value.unshift(newAssignment)
  selectedDay.value = null
}

// API
async function loadData() {
  if (typeof window === 'undefined') return
  const token = localStorage.getItem('token')
  if (!token) {
    await navigateTo('/login')
    return
  }
  await Promise.all([loadSubjects(), loadAssignments()])
}

async function loadSubjects() {
  try {
    const token = localStorage.getItem('token')
    const response = await $fetch('/api/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    subjects.value = response.data || []
  } catch (error) {
    console.error('Erreur matières:', error)
  }
}

async function loadAssignments() {
  try {
    loading.value = true
    const token = localStorage.getItem('token')
    const response = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    assignments.value = response.data || []
  } catch (error) {
    console.error('Erreur devoirs:', error)
    if (error.status === 401) {
      localStorage.removeItem('token')
      await navigateTo('/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  nextTick(() => loadData())
})

// Thème
const { theme } = useTheme()
</script>