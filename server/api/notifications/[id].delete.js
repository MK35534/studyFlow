import { getPool } from '~/lib/database'
import { verifyToken } from '~/lib/auth'

/**
 * DELETE /api/notifications/[id]
 * Supprime une notification spécifique
 */
export default defineEventHandler(async (event) => {
  let connection

  try {
    // 1. Vérifier l'authentification via cookies ou header (throws 401 if invalid)
    const userId = verifyToken(event)

    // 2. Récupérer l'ID de la notification
    const notificationId = event.context.params.id

    // 3. Connexion à la base de données
    const pool = getPool()
    connection = await pool.getConnection()

    // 4. Vérifier que la notification appartient à l'utilisateur
    const [notifications] = await connection.query(
      'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    )

    if (notifications.length === 0) {
      return {
        success: false,
        message: 'Notification non trouvée'
      }
    }

    // 5. Supprimer la notification
    await connection.query(
      'DELETE FROM notifications WHERE id = ?',
      [notificationId]
    )

    return {
      success: true,
      message: 'Notification supprimée'
    }

  } catch (error) {
    console.error('❌ Erreur suppression notification:', error)

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      }
    }

    return {
      success: false,
      message: 'Erreur lors de la suppression de la notification'
    }

  } finally {
    if (connection) connection.release()
  }
})
