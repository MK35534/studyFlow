import { getPool } from '~/lib/database'
import { verifyToken } from '~/lib/auth'

/**
 * POST /api/notifications/generate
 * Génère automatiquement des notifications basées sur les devoirs de l'utilisateur
 * Vérifie les deadlines et crée les notifications appropriées
 */
export default defineEventHandler(async (event) => {
  let connection

  try {
    // 1. Vérifier l'authentification via cookies ou header (throws 401 if invalid)
    const userId = verifyToken(event)

    console.log('🔑 Token validé - userId:', userId)

    // 2. Connexion à la base de données
    const pool = getPool()
    connection = await pool.getConnection()

    // 3. Récupérer tous les devoirs non complétés de l'utilisateur
    const [assignments] = await connection.query(
      `SELECT 
        a.id, 
        a.title, 
        a.due_date, 
        a.is_completed,
        a.user_id,
        s.name as subject_name,
        s.color as subject_color
      FROM assignments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      WHERE a.user_id = ? AND (a.is_completed = 0 OR a.is_completed = FALSE OR a.is_completed IS NULL)
      ORDER BY a.due_date ASC`,
      [userId]
    )

    const now = new Date()
    const notifications = []

    // 4. Générer les notifications selon la deadline
    for (const assignment of assignments) {
      const dueDate = new Date(assignment.due_date)
      const diffMs = dueDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      let notificationType = null
      let title = ''
      let message = ''

      if (diffDays < 0) {
        // En retard - URGENT
        notificationType = 'urgent'
        title = '⚠️ Devoir en retard !'
        message = `"${assignment.title}" devait être rendu il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
      } else if (diffDays === 0) {
        // Aujourd'hui - URGENT
        notificationType = 'urgent'
        title = '🔥 À rendre aujourd\'hui !'
        message = `"${assignment.title}" est à rendre aujourd'hui`
      } else if (diffDays === 1) {
        // Demain - WARNING
        notificationType = 'warning'
        title = '⏰ À rendre demain'
        message = `"${assignment.title}" est à rendre demain`
      } else if (diffDays <= 3) {
        // Dans les 3 jours - INFO
        notificationType = 'info'
        title = '📅 Devoir à venir'
        message = `"${assignment.title}" est à rendre dans ${diffDays} jours`
      }

      // 5. Vérifier si une notification similaire n'existe pas déjà
      if (notificationType) {
        const [existing] = await connection.query(
          `SELECT id FROM notifications 
           WHERE user_id = ? 
           AND assignment_id = ? 
           AND type = ?
           AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
          [userId, assignment.id, notificationType]
        )

        // Créer la notification si elle n'existe pas déjà
        if (existing.length === 0) {
          await connection.query(
            `INSERT INTO notifications (user_id, type, title, message, assignment_id)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, notificationType, title, message, assignment.id]
          )
          
          notifications.push({
            type: notificationType,
            title,
            message,
            assignment: assignment.title
          })
        }
      }
    }

    // 6. Nettoyer les anciennes notifications (> 30 jours)
    await connection.query(
      'DELETE FROM notifications WHERE user_id = ? AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)',
      [userId]
    )

    return {
      success: true,
      message: `${notifications.length} notification(s) générée(s)`,
      notifications,
      checked_assignments: assignments.length
    }

  } catch (error) {
    console.error('❌ Erreur génération notifications:', error)

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      }
    }

    return {
      success: false,
      message: 'Erreur lors de la génération des notifications'
    }

  } finally {
    if (connection) connection.release()
  }
})
