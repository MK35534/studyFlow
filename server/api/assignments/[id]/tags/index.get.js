// GET /api/assignments/[id]/tags - Récupérer les tags d'un devoir
import { verifyToken } from '~/lib/auth'
import { executeQuery } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const payload = verifyToken(event)
    if (!payload) {
      throw createError({
        statusCode: 401,
        message: 'Token invalide'
      })
    }

    // Récupérer l'ID du devoir depuis l'URL
    const assignmentId = event.context.params.id

    if (!assignmentId || isNaN(assignmentId)) {
      throw createError({
        statusCode: 400,
        message: 'ID du devoir invalide'
      })
    }

    // Vérifier que le devoir appartient à l'utilisateur
    const assignment = await executeQuery(
      'SELECT id FROM assignments WHERE id = ? AND user_id = ?',
      [assignmentId, payload.userId]
    )

    if (assignment.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Devoir non trouvé'
      })
    }

    // Récupérer les tags associés au devoir
    const tags = await executeQuery(
      `SELECT t.id, t.name, t.color 
       FROM tags t
       INNER JOIN assignment_tags at ON t.id = at.tag_id
       WHERE at.assignment_id = ?
       ORDER BY t.name ASC`,
      [assignmentId]
    )

    return {
      success: true,
      tags
    }

  } catch (error) {
    console.error('Erreur récupération tags du devoir:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
