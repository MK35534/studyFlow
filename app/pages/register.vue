<template>
  <title>StudyFlow - Inscription</title>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-4xl font-bold text-blue-600 mb-2">StudyFlow</h1>
        <h2 class="text-center text-3xl font-bold text-gray-900">
          Crée ton compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            connecte-toi à ton compte existant
          </NuxtLink>
        </p>
      </div>
      
      <form @submit.prevent="register" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstname" class="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                v-model="form.firstname"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ton prénom"
              />
            </div>
            
            <div>
              <label for="lastname" class="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                v-model="form.lastname"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ton nom"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              v-model="form.email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="ton.email@exemple.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              v-model="form.password"
              required
              minlength="6"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Au moins 6 caractères"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              v-model="form.confirmPassword"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirme ton mot de passe"
            />
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Création du compte...' : 'Créer mon compte' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Cette page n'utilise pas le layout par défaut
definePageMeta({
  layout: false
})

import { ref, reactive } from 'vue'

const loading = ref(false)
const error = ref('')

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function register() {
  if (loading.value) return
  
  // Validation des mots de passe
  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (form.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    
    console.log('Tentative d\'inscription:', form.email)
    
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password
      }
    })
    
    console.log('Réponse register:', response)
    
    if (response.success) {
      // Stockage du token (temporairement en localStorage)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Redirection vers le dashboard
      await navigateTo('/dashboard')
    }
  } catch (err) {
    console.error('Erreur inscription:', err)
    error.value = err.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>