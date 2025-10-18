<template>
  <div class="min-h-screen">
    <title>StudyFlow - Profil</title>
    
    <!-- Header -->
    <div class="mb-8">
      <div class="relative">
        <div :class="`absolute inset-0 bg-gradient-to-r ${theme.gradientBg} rounded-2xl opacity-50 blur-3xl`"></div>
        <div class="relative">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
            Mon profil
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
      </div>
    </div>

    <!-- Grille principale -->
    <div class="grid md:grid-cols-3 gap-6">
      <!-- Colonne gauche : Avatar + Stats rapides -->
      <div class="space-y-6">
        <!-- Carte avatar -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div class="text-center">
            <!-- Avatar -->
            <div :class="`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4`">
              {{ userInitials }}
            </div>
            
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">{{ user.firstname }} {{ user.lastname }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">@{{ user.username }}</p>
            
            <div :class="`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.gradientBg} rounded-xl border ${theme.border}`">
              <svg class="w-4 h-4" :class="theme.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span :class="`text-sm font-semibold ${theme.text}`">Compte actif</span>
            </div>
          </div>
        </div>

        <!-- Stats personnelles -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
            <svg class="w-5 h-5" :class="theme.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiques
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 dark:from-green-900/20 to-transparent rounded-xl border border-green-100 dark:border-green-800">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-500 rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Devoirs terminés</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ stats.completed }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 dark:from-orange-900/20 to-transparent rounded-xl border border-orange-100 dark:border-orange-800">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-500 rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">En cours</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ stats.pending }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-transparent rounded-xl border border-blue-100 dark:border-blue-800">
              <div class="flex items-center gap-3">
                <div :class="`p-2 bg-gradient-to-br ${theme.gradient} rounded-lg`">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Matières</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ stats.subjects }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-transparent rounded-xl border border-purple-100 dark:border-purple-800">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-500 rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Taux de réussite</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ stats.completionRate }}%</span>
            </div>
          </div>
        </div>

        <!-- Membre depuis -->
        <div class="bg-gradient-to-br from-gray-50 dark:from-gray-800/50 to-white dark:to-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div class="flex items-center gap-3 mb-2">
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-300">Membre depuis</span>
          </div>
          <p class="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">{{ formatDate(user.created_at) }}</p>
        </div>
      </div>

      <!-- Colonne droite : Formulaires -->
      <div class="md:col-span-2 space-y-6">
        <!-- Informations personnelles -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 transition-colors duration-300">
              <svg class="w-6 h-6" :class="theme.text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations personnelles
            </h3>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Prénom</label>
                <input
                  v-model="form.firstname"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Nom</label>
                <input
                  v-model="form.lastname"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Nom d'utilisateur</label>
              <input
                v-model="form.username"
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Votre pseudo"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="resetForm"
                class="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="savingProfile"
                :class="`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50`"
              >
                {{ savingProfile ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Changer le mot de passe -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2 transition-colors duration-300">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Sécurité
          </h3>

          <form @submit.prevent="updatePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Mot de passe actuel</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-colors duration-300"
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Nouveau mot de passe</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-colors duration-300"
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Confirmer le mot de passe</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-colors duration-300"
                placeholder="Confirmer le nouveau mot de passe"
              />
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="submit"
                :disabled="savingPassword"
                class="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {{ savingPassword ? 'Modification...' : 'Changer le mot de passe' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Zone de danger -->
        <div class="bg-gradient-to-br from-red-50 dark:from-red-900/20 to-white dark:to-gray-800 rounded-2xl border-2 border-red-200 dark:border-red-800 p-6 transition-colors duration-300">
          <h3 class="text-xl font-bold text-red-900 dark:text-red-400 mb-2 flex items-center gap-2 transition-colors duration-300">
            <svg class="w-6 h-6 text-red-600 dark:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Zone de danger
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300 mb-4 transition-colors duration-300">
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </p>
          
          <button
            @click="showDeleteModal = true"
            class="px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transition-colors duration-300">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2 transition-colors duration-300">Supprimer votre compte ?</h3>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-6 transition-colors duration-300">
          Cette action est définitive. Toutes vos données (devoirs, matières, statistiques) seront perdues.
        </p>
        
        <div class="space-y-3">
          <button
            @click="deleteAccount"
            :disabled="deleting"
            class="w-full px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {{ deleting ? 'Suppression...' : 'Oui, supprimer définitivement' }}
          </button>
          <button
            @click="showDeleteModal = false"
            :disabled="deleting"
            class="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Thème
const { theme } = useTheme()
const { success, error } = useToast()

// État
const user = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  created_at: new Date()
})

const stats = ref({
  completed: 0,
  pending: 0,
  subjects: 0,
  completionRate: 0
})

const form = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const savingProfile = ref(false)
const savingPassword = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)

// Computed
const userInitials = computed(() => {
  const first = user.value.firstname?.[0] || ''
  const last = user.value.lastname?.[0] || ''
  return (first + last).toUpperCase() || 'U'
})

// Fonctions
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function resetForm() {
  form.value = {
    firstname: user.value.firstname,
    lastname: user.value.lastname,
    username: user.value.username,
    email: user.value.email
  }
}

async function loadUserData() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }

    // Charger depuis localStorage (temporaire)
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    user.value = {
      ...userData,
      created_at: userData.created_at || new Date()
    }

    // Initialiser le formulaire
    resetForm()

    // Charger les stats
    await loadStats()
  } catch (err) {
    console.error('Erreur chargement profil:', err)
    error('Erreur lors du chargement du profil')
  }
}

async function loadStats() {
  try {
    const token = localStorage.getItem('token')
    
    // Charger les devoirs
    const assignmentsRes = await $fetch('/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const assignments = assignmentsRes.data || []

    // Charger les matières
    const subjectsRes = await $fetch('/api/subjects', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const subjects = subjectsRes.data || []

    const completed = assignments.filter(a => a.is_completed).length
    const total = assignments.length

    stats.value = {
      completed,
      pending: total - completed,
      subjects: subjects.length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  } catch (error) {
    console.error('Erreur chargement stats:', error)
  }
}

async function updateProfile() {
  try {
    savingProfile.value = true

    // Validation
    if (!form.value.firstname || !form.value.lastname || !form.value.username || !form.value.email) {
      error('Veuillez remplir tous les champs')
      return
    }

    // TODO: Appel API pour mettre à jour le profil
    // Pour l'instant, on met à jour localStorage
    user.value = {
      ...user.value,
      ...form.value
    }
    localStorage.setItem('user', JSON.stringify(user.value))

    success('Profil mis à jour avec succès !')
  } catch (err) {
    console.error('Erreur mise à jour profil:', err)
    error('Erreur lors de la mise à jour')
  } finally {
    savingProfile.value = false
  }
}

async function updatePassword() {
  try {
    savingPassword.value = true

    // Validation
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordForm.value.newPassword.length < 6) {
      error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    // TODO: Appel API pour changer le mot de passe
    
    success('Mot de passe modifié avec succès !')
    
    // Réinitialiser le formulaire
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (err) {
    console.error('Erreur changement mot de passe:', err)
    error('Erreur lors du changement de mot de passe')
  } finally {
    savingPassword.value = false
  }
}

async function deleteAccount() {
  try {
    deleting.value = true

    // TODO: Appel API pour supprimer le compte
    
    success('Compte supprimé')
    
    // Déconnexion
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    await navigateTo('/login')
  } catch (err) {
    console.error('Erreur suppression compte:', err)
    error('Erreur lors de la suppression')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>
