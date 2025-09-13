import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    const subjects = await executeQuery(
      'SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    
    return {
      success: true,
      data: subjects
    }
  } catch (error) {
    console.error('Erreur GET subjects:', error)
    if (error.statusCode) {
      // Retourner une erreur HTTP avec le bon status
      setResponseStatus(event, error.statusCode)
      return {
        success: false,
        message: error.message
      }
    }
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Erreur serveur lors de la récupération des matières'
    }
  }
})