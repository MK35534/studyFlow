// DELETE /api/assignments/[id]/tags/[tagId] - Retirer un tag d'un devoir
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

    // Récupérer les IDs depuis l'URL
    const assignmentId = event.context.params.id
    const tagId = event.context.params.tagId

    if (!assignmentId || isNaN(assignmentId)) {
      throw createError({
        statusCode: 400,
        message: 'ID du devoir invalide'
      })
    }

    if (!tagId || isNaN(tagId)) {
      throw createError({
        statusCode: 400,
        message: 'ID du tag invalide'
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

    // Vérifier que le tag appartient à l'utilisateur
    const tag = await executeQuery(
      'SELECT id FROM tags WHERE id = ? AND user_id = ?',
      [tagId, payload.userId]
    )

    if (tag.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Tag non trouvé'
      })
    }

    // Supprimer l'association
    await executeQuery(
      'DELETE FROM assignment_tags WHERE assignment_id = ? AND tag_id = ?',
      [assignmentId, tagId]
    )

    return {
      success: true,
      message: 'Tag retiré du devoir avec succès'
    }

  } catch (error) {
    console.error('Erreur retrait tag du devoir:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
