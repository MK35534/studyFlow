// DELETE /api/tags/[id] - Supprimer un tag
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

    // Récupérer l'ID du tag depuis l'URL
    const tagId = event.context.params.id

    if (!tagId || isNaN(tagId)) {
      throw createError({
        statusCode: 400,
        message: 'ID du tag invalide'
      })
    }

    // Vérifier que le tag appartient bien à l'utilisateur
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

    // Supprimer le tag (les liaisons dans assignment_tags seront supprimées automatiquement via CASCADE)
    await executeQuery(
      'DELETE FROM tags WHERE id = ? AND user_id = ?',
      [tagId, payload.userId]
    )

    return {
      success: true,
      message: 'Tag supprimé avec succès'
    }

  } catch (error) {
    console.error('Erreur suppression tag:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
