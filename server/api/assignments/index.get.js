import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    const assignments = await executeQuery(
      `SELECT a.*, s.name as subject_name, s.color as subject_color 
       FROM assignments a 
       LEFT JOIN subjects s ON a.subject_id = s.id 
       WHERE a.user_id = ? 
       ORDER BY a.due_date ASC, a.created_at DESC`,
      [userId]
    )
    
    return {
      success: true,
      data: assignments
    }
  } catch (error) {
    console.error('Erreur GET assignments:', error)
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
      message: 'Erreur serveur lors de la récupération des devoirs'
    }
  }
})