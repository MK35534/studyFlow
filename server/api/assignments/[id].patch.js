import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    console.log('=== PATCH ASSIGNMENT ===')
    
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    // Récupérer l'ID depuis l'URL
    const url = getRequestURL(event)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    
    const body = await readBody(event)
    const { is_completed } = body
    
    console.log('Assignment ID:', id, 'New status:', is_completed)
    
    if (!id || isNaN(id)) {
      const error = new Error('ID de devoir invalide')
      error.statusCode = 400
      throw error
    }
    
    if (typeof is_completed !== 'boolean') {
      const error = new Error('Statut invalide')
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
    
    // Mettre à jour le statut
    await executeQuery(
      'UPDATE assignments SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [is_completed, id, userId]
    )
    
    console.log('Statut mis à jour avec succès')
    
    return {
      success: true,
      message: is_completed ? 'Devoir marqué comme terminé' : 'Devoir marqué comme à faire'
    }
  } catch (error) {
    console.error('Erreur PATCH assignments:', error)
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
      message: 'Erreur serveur lors de la mise à jour du devoir'
    }
  }
})