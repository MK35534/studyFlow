import { getPool } from '~/lib/database'
import { verifyToken } from '~/lib/auth'

/**
 * PATCH /api/notifications/[id]/read
 * Marque une notification comme lue ou non-lue
 * Body: { is_read: boolean }
 */
export default defineEventHandler(async (event) => {
  let connection

  try {
    // 1. Vérifier l'authentification via cookies ou header (throws 401 if invalid)
    const userId = verifyToken(event)

    // 2. Récupérer l'ID de la notification
    const notificationId = event.context.params.id

    // 3. Récupérer le body
    const body = await readBody(event)
    const isRead = body.is_read !== undefined ? body.is_read : true

    // 4. Connexion à la base de données
    const pool = getPool()
    connection = await pool.getConnection()

    // 5. Vérifier que la notification appartient à l'utilisateur
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

    // 6. Mettre à jour le statut
    await connection.query(
      'UPDATE notifications SET is_read = ? WHERE id = ?',
      [isRead, notificationId]
    )

    return {
      success: true,
      message: isRead ? 'Notification marquée comme lue' : 'Notification marquée comme non-lue'
    }

  } catch (error) {
    console.error('❌ Erreur mise à jour notification:', error)

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      }
    }

    return {
      success: false,
      message: 'Erreur lors de la mise à jour de la notification'
    }

  } finally {
    if (connection) connection.release()
  }
})
