import { getPool } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { verifyToken } = useAuth()
    const userId = await verifyToken(event)
    
    if (!userId) {
      throw createError({ statusCode: 401, message: 'Non autorisé' })
    }

    // Récupérer les données du body
    const body = await readBody(event)
    const {
      syncHomework = true,
      syncTimetable = true,
      syncGrades = false,
      autoSync = false,
      syncFrequency = 'manual'
    } = body

    console.log('[Pronote Config POST] Saving config for user:', userId, body)

    const pool = getPool()

    // Vérifier si une config existe déjà
    const [existing] = await pool.execute(
      'SELECT id FROM pronote_config WHERE user_id = ?',
      [userId]
    )

    if (existing.length > 0) {
      // UPDATE
      await pool.execute(
        `UPDATE pronote_config 
         SET sync_homework = ?, 
             sync_timetable = ?, 
             sync_grades = ?, 
             auto_sync = ?, 
             sync_frequency = ?,
             updated_at = NOW()
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
      console.log('[Pronote Config POST] Updated existing config')
    } else {
      // INSERT
      await pool.execute(
        `INSERT INTO pronote_config 
         (user_id, sync_homework, sync_timetable, sync_grades, auto_sync, sync_frequency, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          syncHomework ? 1 : 0,
          syncTimetable ? 1 : 0,
          syncGrades ? 1 : 0,
          autoSync ? 1 : 0,
          syncFrequency
        ]
      )
      console.log('[Pronote Config POST] Created new config')
    }

    return {
      success: true,
      message: 'Configuration sauvegardée'
    }

  } catch (error) {
    console.error('[Pronote Config POST] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la sauvegarde de la configuration'
    })
  }
})
