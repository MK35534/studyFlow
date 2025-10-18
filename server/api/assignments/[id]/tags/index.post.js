// POST /api/assignments/[id]/tags - Ajouter un tag à un devoir
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

    // Récupérer le tag_id du body
    const body = await readBody(event)
    const { tag_id } = body

    if (!tag_id || isNaN(tag_id)) {
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
      [tag_id, payload.userId]
    )

    if (tag.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Tag non trouvé'
      })
    }

    // Vérifier si l'association existe déjà
    const existing = await executeQuery(
      'SELECT * FROM assignment_tags WHERE assignment_id = ? AND tag_id = ?',
      [assignmentId, tag_id]
    )

    if (existing.length > 0) {
      return {
        success: true,
        message: 'Tag déjà associé au devoir'
      }
    }

    // Ajouter l'association
    await executeQuery(
      'INSERT INTO assignment_tags (assignment_id, tag_id) VALUES (?, ?)',
      [assignmentId, tag_id]
    )

    return {
      success: true,
      message: 'Tag ajouté au devoir avec succès'
    }

  } catch (error) {
    console.error('Erreur ajout tag au devoir:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
