import { getPool } from '~/lib/database'
import { getRequestHeader } from 'h3'
import jwt from 'jsonwebtoken'

/**
 * POST /api/notifications/mark-all-read
 * Marque toutes les notifications comme lues
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

    // 2. Connexion à la base de données
    const pool = getPool()
    connection = await pool.getConnection()

    // 3. Marquer toutes les notifications comme lues
    const [result] = await connection.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    )

    return {
      success: true,
      message: `${result.affectedRows} notification(s) marquée(s) comme lue(s)`,
      updated_count: result.affectedRows
    }

  } catch (error) {
    console.error('❌ Erreur marquage notifications:', error)

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      }
    }

    return {
      success: false,
      message: 'Erreur lors du marquage des notifications'
    }

  } finally {
    if (connection) connection.release()
  }
})
