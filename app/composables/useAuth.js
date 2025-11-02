/**
 * Composable pour gérer l'authentification
 * Lit le token JWT depuis localStorage (et non cookies)
 */
export const useAuth = () => {
  /**
   * Récupère le token JWT depuis localStorage
   * @returns {string|null} Le token JWT ou null si absent
   */
  const getToken = () => {
    if (process.server) return null
    
    // Lire depuis localStorage (consistant avec login.vue)
    const token = localStorage.getItem('jwt_token')
    
    if (!token) {
      console.warn('[useAuth] ❌ Aucun token trouvé dans localStorage')
      return null
    }
    
    console.log('[useAuth] ✅ Token trouvé:', token.substring(0, 20) + '...')
    return token
  }

  /**
   * Supprime le token (déconnexion)
   */
  const clearToken = () => {
    if (process.server) return
    
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user')
    console.log('[useAuth] 🗑️ Token et user supprimés')
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!getToken()
  }

  return {
    getToken,
    clearToken,
    isAuthenticated
  }
}
