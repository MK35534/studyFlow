import { getPool } from '~/lib/database'
import { verifyToken } from '~/lib/auth'

/**
 * GET /api/notifications
 * Récupère toutes les notifications de l'utilisateur connecté
 * Query params optionnels:
 *  - unread_only: true/false (ne récupérer que les non-lues)
 *  - limit: nombre max de résultats (défaut: 50)
 */
export default defineEventHandler(async (event) => {
  let connection

  try {
    // 1. Vérifier l'authentification via cookies ou header (throws 401 if invalid)
    const userId = verifyToken(event)

    // 2. Récupérer les query params
    const query = getQuery(event)
    const unreadOnly = query.unread_only === 'true'
    const limit = parseInt(query.limit) || 50

    // 3. Connexion à la base de données
    const pool = getPool()
    connection = await pool.getConnection()

    // 4. Construire la requête SQL
    let sql = `
      SELECT 
        n.*,
        a.title as assignment_title,
        a.due_date as assignment_due_date,
        s.name as subject_name,
        s.color as subject_color
      FROM notifications n
      LEFT JOIN assignments a ON n.assignment_id = a.id
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE n.user_id = ?
    `

    const params = [userId]

    if (unreadOnly) {
      sql += ' AND n.is_read = FALSE'
    }

    sql += ' ORDER BY n.created_at DESC LIMIT ?'
    params.push(limit)

    // 5. Exécuter la requête
    const [notifications] = await connection.query(sql, params)

    // 6. Compter les non-lues
    const [countResult] = await connection.query(
      'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    )
    const unreadCount = countResult[0].unread_count

    return {
      success: true,
      notifications,
      unread_count: unreadCount,
      total: notifications.length
    }

  } catch (error) {
    console.error('❌ Erreur récupération notifications:', error)

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      }
    }

    return {
      success: false,
      message: 'Erreur lors de la récupération des notifications'
    }

  } finally {
    if (connection) connection.release()
  }
})
