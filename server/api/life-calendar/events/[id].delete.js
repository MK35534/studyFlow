import jwt from 'jsonwebtoken'
import { getPool } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier le token
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({ statusCode: 401, message: 'Non autorisé' })
    }

    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    // Récupérer l'ID de l'événement
    const eventId = event.context.params.id

    if (!eventId) {
      throw createError({ statusCode: 400, message: 'ID requis' })
    }

    console.log('[Life Calendar DELETE] Deleting event:', eventId, 'for user:', userId)

    // Récupérer le pool
    const pool = getPool()

    // Vérifier que l'événement appartient à l'utilisateur
    const [events] = await pool.execute(
      'SELECT id FROM life_calendar_events WHERE id = ? AND user_id = ?',
      [eventId, userId]
    )

    if (events.length === 0) {
      throw createError({ statusCode: 404, message: 'Événement non trouvé' })
      }

    // Supprimer l'événement
    await pool.execute(
      'DELETE FROM life_calendar_events WHERE id = ? AND user_id = ?',
      [eventId, userId]
    )

    console.log('[Life Calendar DELETE] Event deleted successfully:', eventId)

    return {
      success: true,
      message: 'Événement supprimé'
    }

  } catch (error) {
    console.error('[Life Calendar DELETE] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la suppression de l\'événement'
    })
  }
})
