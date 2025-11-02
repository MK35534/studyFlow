import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    console.log('=== DELETE ASSIGNMENT ===')
    
    // Vérifier l'authentification (throws 401 if invalid)
    const userId = verifyToken(event)
    console.log('User ID:', userId)
    
    // Récupérer l'ID depuis l'URL de façon alternative
    const url = getRequestURL(event)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    
    console.log('Assignment ID:', id)
    
    if (!id || isNaN(id)) {
      const error = new Error('ID de devoir invalide')
      error.statusCode = 400
      throw error
    }
    
    // Vérifier que le devoir appartient à l'utilisateur
    const existing = await executeQuery(
      'SELECT id FROM assignments WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    
    if (existing.length === 0) {
      const error = new Error('Devoir non trouvé')
      error.statusCode = 404
      throw error
    }
    
    // Supprimer le devoir
    await executeQuery(
      'DELETE FROM assignments WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    
    console.log('Devoir supprimé avec succès')
    
    return {
      success: true,
      message: 'Devoir supprimé avec succès'
    }
  } catch (error) {
    console.error('Erreur DELETE assignments:', error)
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode)
      return {
        success: false,
        message: error.message
      }
    }
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Erreur serveur lors de la suppression du devoir'
    }
  }
})