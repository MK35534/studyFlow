// GET /api/assignments/[id] - Récupérer un devoir spécifique avec ses tags
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

    // Récupérer le devoir avec sa matière
    const assignments = await executeQuery(
      `SELECT a.*, s.name as subject_name, s.color as subject_color 
       FROM assignments a 
       LEFT JOIN subjects s ON a.subject_id = s.id 
       WHERE a.id = ? AND a.user_id = ?`,
      [assignmentId, payload.userId]
    )

    if (assignments.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Devoir non trouvé'
      })
    }

    const assignment = assignments[0]

    // Récupérer les tags du devoir
    const tags = await executeQuery(
      `SELECT t.id, t.name, t.color 
       FROM tags t
       INNER JOIN assignment_tags at ON t.id = at.tag_id
       WHERE at.assignment_id = ?
       ORDER BY t.name ASC`,
      [assignmentId]
    )

    assignment.tags = tags

    return {
      success: true,
      data: assignment
    }

  } catch (error) {
    console.error('Erreur récupération devoir:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
