import { getPool } from '~/lib/database'
import { getRequestHeader } from 'h3'
import jwt from 'jsonwebtoken'

/**
 * POST /api/notifications/clear-all
 * Supprime toutes les notifications de l'utilisateur
 * Options via body:
 *  - read_only: true/false (supprimer uniquement les lues)
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

    // 2. Récupérer les options
    const body = await readBody(event)
    const readOnly = body.read_only === true

    // 3. Connexion à la base de données
    const pool = getPool()
    connection = await pool.getConnection()

    // 4. Construire la requête de suppression
    let sql = 'DELETE FROM notifications WHERE user_id = ?'
    const params = [userId]

    if (readOnly) {
      sql += ' AND is_read = TRUE'
    }

    // 5. Exécuter la suppression
    const [result] = await connection.query(sql, params)

    return {
      success: true,
      message: readOnly 
        ? `${result.affectedRows} notification(s) lue(s) supprimée(s)`
        : `${result.affectedRows} notification(s) supprimée(s)`,
      deleted_count: result.affectedRows
    }

  } catch (error) {
    console.error('❌ Erreur suppression notifications:', error)

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      }
    }

    return {
      success: false,
      message: 'Erreur lors de la suppression des notifications'
    }

  } finally {
    if (connection) connection.release()
  }
})
