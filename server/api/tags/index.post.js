// POST /api/tags - Créer un nouveau tag
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

    // Récupérer les données du body
    const body = await readBody(event)
    const { name, color } = body

    // Validation
    if (!name || name.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'Le nom du tag est requis'
      })
    }

    if (name.length > 100) {
      throw createError({
        statusCode: 400,
        message: 'Le nom du tag est trop long (max 100 caractères)'
      })
    }

    // Validation couleur (format hex)
    const colorValue = color || '#6B7280'
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
    if (!hexColorRegex.test(colorValue)) {
      throw createError({
        statusCode: 400,
        message: 'Format de couleur invalide (utilisez #RRGGBB)'
      })
    }

    // Vérifier si le tag existe déjà pour cet utilisateur
    const existing = await executeQuery(
      'SELECT id FROM tags WHERE user_id = ? AND name = ?',
      [payload.userId, name.trim()]
    )

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Ce tag existe déjà'
      })
    }

    // Insérer le nouveau tag
    const result = await executeQuery(
      'INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)',
      [payload.userId, name.trim(), colorValue]
    )

    // Récupérer le tag créé
    const newTag = await executeQuery(
      'SELECT id, name, color, created_at FROM tags WHERE id = ?',
      [result.insertId]
    )

    return {
      success: true,
      message: 'Tag créé avec succès',
      tag: newTag[0]
    }

  } catch (error) {
    console.error('Erreur création tag:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur serveur'
    })
  }
})
