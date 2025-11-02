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

    const pool = getPool()

    if (event.method === 'GET') {
      // Récupérer la configuration
      console.log('[Config GET] userId:', userId)
      const [rows] = await pool.execute(
        'SELECT sync_homework, sync_timetable, sync_grades, auto_sync, sync_frequency FROM pronote_config WHERE user_id = ?',
        [userId]
      )
      console.log('[Config GET] rows.length:', rows.length)
      console.log('[Config GET] rows:', rows)

      if (rows.length === 0) {
        // Configuration par défaut
        console.log('[Config GET] Aucune config trouvée, retour valeurs par défaut')
        return {
          config: {
            syncHomework: true,
            syncTimetable: true,
            syncGrades: false,
            autoSync: true,
            syncFrequency: 'daily'
          }
        }
      }

      const row = rows[0]
      console.log('[Config GET] Config trouvée:', row)
      return {
        config: {
          syncHomework: row.sync_homework === 1,
          syncTimetable: row.sync_timetable === 1,
          syncGrades: row.sync_grades === 1,
          autoSync: row.auto_sync === 1,
          syncFrequency: row.sync_frequency || 'daily'
        }
      }
    }

    if (event.method === 'POST') {
      // Sauvegarder la configuration
      const body = await readBody(event)
      const { syncHomework, syncTimetable, syncGrades, autoSync, syncFrequency } = body

      await pool.execute(
        `UPDATE pronote_config 
         SET sync_homework = ?, 
             sync_timetable = ?, 
             sync_grades = ?, 
             auto_sync = ?, 
             sync_frequency = ?
         WHERE user_id = ?`,
        [
          syncHomework ? 1 : 0,
          syncTimetable ? 1 : 0,
          syncGrades ? 1 : 0,
          autoSync ? 1 : 0,
          syncFrequency,
          userId
        ]
      )

      console.log('[Pronote Config] Updated for user:', userId)

      return {
        success: true,
        message: 'Configuration sauvegardée'
      }
    }

  } catch (error) {
    console.error('[Pronote Config] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la gestion de la configuration'
    })
  }
})
