// GET /api/tags - Récupère tous les tags de l'utilisateur connecté
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

    // Récupérer tous les tags de l'utilisateur avec le nombre de devoirs associés
    const tags = await executeQuery(
      `SELECT 
        id,
        name,
        color,
        created_at,
        (SELECT COUNT(*) FROM assignment_tags WHERE tag_id = tags.id) as assignment_count
      FROM tags 
      WHERE user_id = ?
      ORDER BY name ASC`,
      [payload.userId]
    )

    return {
      success: true,
      tags
    }

  } catch (error) {
    console.error('Erreur récupération tags:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
