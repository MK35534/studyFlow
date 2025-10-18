import { getPool } from '~/lib/database'
import { getRequestHeader } from 'h3'
import jwt from 'jsonwebtoken'

/**
 * DELETE /api/notifications/[id]
 * Supprime une notification spécifique
 */
export default defineEventHandler(async (event) => {
  let connection

  try {
    // 1. Vérifier l'authentification
    const authHeader = getRequestHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        message: 'Token manquant'
      }
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_2024')
    const userId = decoded.userId // ✅ Changé de decoded.id à decoded.userId

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
