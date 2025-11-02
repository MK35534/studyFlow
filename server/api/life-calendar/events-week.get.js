import { getPool } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier le token
    const userId = verifyToken(event)

    // Récupérer la date de début de semaine depuis les query params
    const query = getQuery(event)
    const weekStart = query.weekStart // Format: YYYY-MM-DD (lundi de la semaine)

    if (!weekStart) {
      throw createError({ statusCode: 400, message: 'Week start date required' })
    }

    console.log('[Life Calendar Week] Loading week starting:', weekStart, 'for user:', userId)

    const pool = getPool()

    // Calculer la date de fin (dimanche)
    const startDate = new Date(weekStart)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)
    const weekEnd = endDate.toISOString().split('T')[0]

    // 1. Récupérer tous les événements personnels de la semaine
    const [personalEvents] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        category,
        start_time as startTime,
        end_time as endTime,
        color
      FROM life_calendar_events
      WHERE user_id = ? 
        AND DATE(start_time) BETWEEN ? AND ?
      ORDER BY start_time`,
      [userId, weekStart, weekEnd]
    )

    // 2. Vérifier si l'utilisateur a activé la sync emploi du temps
    const [configRows] = await pool.execute(
      'SELECT sync_timetable FROM pronote_config WHERE user_id = ?',
      [userId]
    )
    const syncTimetable = configRows.length > 0 ? configRows[0].sync_timetable === 1 : false

    // 3. Récupérer les cours Pronote pour la semaine si activé
    let timetableEvents = []
    if (syncTimetable) {
      const [timetableRows] = await pool.execute(
        `SELECT 
          subject,
          teacher,
          classroom,
          start_time,
          end_time
        FROM pronote_timetable
        WHERE user_id = ? AND DATE(start_time) BETWEEN ? AND ?
        ORDER BY start_time`,
        [userId, weekStart, weekEnd]
      )

      console.log('[Life Calendar Week] Courses found:', timetableRows.length)

      timetableEvents = timetableRows.map(course => ({
        id: `course_${course.subject}_${course.start_time}`,
        title: course.subject,
        description: `${course.teacher ? course.teacher + ' - ' : ''}${course.classroom || ''}`,
        category: 'course',
        startTime: course.start_time,
        endTime: course.end_time,
        color: '#3B82F6',
        source: 'pronote_timetable',
        teacher: course.teacher,
        classroom: course.classroom
      }))
    }
    
    // 4. NE PLUS récupérer les devoirs - ils restent dans Assignments
    // Le Life Calendar est pour organiser sa vie, pas pour les devoirs

    // Combiner tous les événements
    const allEvents = [
      ...personalEvents,
      ...timetableEvents
      // ...homeworkAsEvents  <- RETIRÉ
    ]

    // Organiser par jour
    const eventsByDay = {}
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      
      eventsByDay[dateStr] = allEvents.filter(event => {
        if (event.dueDate) {
          const dueDateStr = new Date(event.dueDate).toISOString().split('T')[0]
          return dueDateStr === dateStr
        }
        if (event.startTime) {
          const eventDateStr = new Date(event.startTime).toISOString().split('T')[0]
          return eventDateStr === dateStr
        }
        return false
      })
    }

    console.log('[Life Calendar Week] Total events:', allEvents.length,
      `(${personalEvents.length} personal, ${timetableEvents.length} courses)`)

    return {
      success: true,
      weekStart,
      weekEnd,
      events: allEvents,
      eventsByDay
    }

  } catch (error) {
    console.error('[Life Calendar Week] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des événements de la semaine'
    })
  }
})
