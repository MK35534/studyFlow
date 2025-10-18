import jwt from 'jsonwebtoken'
import { getRequestHeader } from 'h3'

export function verifyToken(event) {
  // Récupérer l'en-tête Authorization de façon robuste
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
  
  if (!authHeader) {
    const error = new Error('Token d\'authentification requis')
    error.statusCode = 401
    throw error
  }
  
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7)
    : authHeader
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded // { userId, email, iat, exp }
  } catch (error) {
    console.error('Erreur JWT:', error)
    const authError = new Error('Token invalide')
    authError.statusCode = 401
    throw authError
  }
}