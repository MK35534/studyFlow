import jwt from 'jsonwebtoken'

export function verifyToken(event) {
  // Récupérer l'en-tête Authorization de façon plus directe
  const authHeader = event.node.req.headers.authorization
  
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