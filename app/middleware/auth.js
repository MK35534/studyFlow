export default defineNuxtRouteMiddleware((to, from) => {
  // Ce middleware protège toutes les routes /dashboard/*
  
  if (import.meta.client) {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('jwt_token')
    const user = localStorage.getItem('user')
    
    // Si pas de token ou pas d'utilisateur, rediriger vers login
    if (!token || !user) {
      return navigateTo('/login')
    }
    
    // Optionnel : Vérifier si le token n'est pas expiré
    try {
      const userData = JSON.parse(user)
      // Tu peux ajouter une vérification d'expiration du token ici si nécessaire
      
      // Si tout est OK, laisser passer
      return
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
      return navigateTo('/login')
    }
  }
})
