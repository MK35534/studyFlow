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

    // Récupérer la date depuis la query
    const query = getQuery(event)
    const date = query.date // Format: YYYY-MM-DD

    if (!date) {
      throw createError({ statusCode: 400, message: 'Date requise' })
    }

    console.log('[Life Calendar GET] Fetching events for date:', date, 'user:', userId)

    // Récupérer le pool
    const pool = getPool()

    const startOfDay = `${date} 00:00:00`
    const endOfDay = `${date} 23:59:59`

    // 1. Récupérer les événements personnels
    const [personalEvents] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        category,
        start_time as startTime,
        end_time as endTime,
        color,
        'personal' as source
      FROM life_calendar_events
      WHERE user_id = ? 
        AND start_time >= ? 
        AND start_time <= ?
      ORDER BY start_time`,
      [userId, startOfDay, endOfDay]
    )

    // 2. Vérifier si l'utilisateur a activé la sync emploi du temps
    const [configRows] = await pool.execute(
      'SELECT sync_timetable FROM pronote_config WHERE user_id = ?',
      [userId]
    )
    const syncTimetable = configRows.length > 0 ? configRows[0].sync_timetable === 1 : false

    // 3. Récupérer les cours Pronote pour ce jour si activé
    let timetableEvents = []
    if (syncTimetable) {
      // Récupérer les cours depuis pronote_timetable (à créer) ou depuis le JSON stocké
      const [timetableRows] = await pool.execute(
        `SELECT 
          subject,
          teacher,
          classroom,
          start_time,
          end_time
        FROM pronote_timetable
        WHERE user_id = ? AND DATE(start_time) = ?
        ORDER BY start_time`,
        [userId, date]
      )

      console.log('[Life Calendar] Date demandée:', date, '| Cours trouvés:', timetableRows.length)
      if (timetableRows.length > 0) {
        console.log('[Life Calendar] Premier cours:', timetableRows[0])
      }

      timetableEvents = timetableRows.map(course => ({
        id: `course_${course.subject}_${course.start_time}`,
        title: course.subject,
        description: `${course.teacher ? course.teacher + ' - ' : ''}${course.classroom || ''}`,
        category: 'course',
        startTime: course.start_time,
        endTime: course.end_time,
        color: '#3B82F6', // Bleu pour les cours
        source: 'pronote_timetable',
        teacher: course.teacher,
        classroom: course.classroom
      }))
    }
    
    // 4. NE PLUS récupérer les devoirs
    // Le Life Calendar est un agenda de vie, pas une liste de devoirs

    // Combiner tous les événements
    const allEvents = [
      ...personalEvents,
      ...timetableEvents
    ]

    console.log('[Life Calendar GET] Found', allEvents.length, 'events', 
      `(${personalEvents.length} personal, ${timetableEvents.length} courses)`)

    return {
      success: true,
      date,
      events: allEvents
    }

  } catch (error) {
    console.error('[Life Calendar GET] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des événements'
    })
  }
})