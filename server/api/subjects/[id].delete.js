import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(id)) {
      const error = new Error('ID de matière invalide')
      error.statusCode = 400
      throw error
    }
    
    // Vérifier que la matière appartient à l'utilisateur
    const existing = await executeQuery(
      'SELECT id FROM subjects WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    
    if (existing.length === 0) {
      const error = new Error('Matière non trouvée')
      error.statusCode = 404
      throw error
    }
    
    // Supprimer la matière
    await executeQuery(
      'DELETE FROM subjects WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    
    return {
      success: true,
      message: 'Matière supprimée avec succès'
    }
  } catch (error) {
    console.error('Erreur DELETE subjects:', error)
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
      message: 'Erreur serveur lors de la suppression de la matière'
    }
  }
})