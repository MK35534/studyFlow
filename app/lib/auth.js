import jwt from 'jsonwebtoken'
import { getRequestHeader, parseCookies } from 'h3'

export function verifyToken(event) {
  let token = null
  
  // 🔥 PRIORITÉ 1: Essayer de récupérer depuis les cookies (méthode principale)
  try {
    const cookies = parseCookies(event)
    token = cookies.token
  } catch (e) {
    // Continue si les cookies ne fonctionnent pas
  }
  
  // PRIORITÉ 2: Récupérer l'en-tête Authorization si pas de cookie
  if (!token) {
    let authHeader = null
    
    // Méthode 1: Via getRequestHeader de h3 (méthode officielle)
    try {
      authHeader = getRequestHeader(event, 'authorization')
    } catch (e) {
      // Si ça échoue, on continue avec les méthodes alternatives
    }
    
    // Méthode 2: Via event.node.req.headers
    if (!authHeader && event?.node?.req?.headers) {
      authHeader = event.node.req.headers.authorization
    }
    
    // Méthode 3: Via headers directement
    if (!authHeader && event?.headers) {
      authHeader = event.headers.get?.('authorization') || event.headers.authorization
    }
    
    // Méthode 4: Via req.headers (fallback)
    if (!authHeader && event?.req?.headers) {
      authHeader = event.req.headers.authorization
    }
    
    if (authHeader) {
      token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7)
        : authHeader
    }
  }
  
  if (!token) {
    const error = new Error('Token d\'authentification requis')
    error.statusCode = 401
    throw error
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Vérifier que userId existe et est un nombre
    if (!decoded || !decoded.userId) {
      console.error('Token décodé invalide:', decoded)
      const error = new Error('Token malformé: userId manquant')
      error.statusCode = 401
      throw error
    }
    
    // S'assurer que userId est un nombre
    const userId = typeof decoded.userId === 'number' 
      ? decoded.userId 
      : parseInt(decoded.userId, 10)
    
    if (isNaN(userId)) {
      console.error('userId invalide:', decoded.userId)
      const error = new Error('Token malformé: userId invalide')
      error.statusCode = 401
      throw error
    }
    
    return userId // Return just the userId number
  } catch (error) {
    console.error('Erreur JWT:', error)
    const authError = new Error('Token invalide')
    authError.statusCode = 401
    throw authError
  }
}