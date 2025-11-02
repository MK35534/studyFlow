import { getPool } from '~/lib/database'

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du body (userId passé directement depuis sync.post.js)
    const body = await readBody(event)
    const { lessons, userId } = body

    if (!userId) {
      throw createError({ statusCode: 400, message: 'User ID required' })
    }

    if (!lessons || !Array.isArray(lessons)) {
      throw createError({ statusCode: 400, message: 'Lessons array required' })
    }

    console.log('[Pronote Timetable] Syncing', lessons.length, 'lessons for user:', userId)

    const pool = getPool()

    // Supprimer l'ancien emploi du temps (on va tout réimporter)
    await pool.execute(
      'DELETE FROM pronote_timetable WHERE user_id = ?',
      [userId]
    )

    let imported = 0
    let skipped = 0

    // Insérer chaque leçon
    for (const lesson of lessons) {
      try {
        // Extraire les données
        const subject = lesson.subject?.name || lesson.subject || 'Cours'
        const teacher = lesson.teacher_name || (lesson.teachers && lesson.teachers[0]?.name) || null
        const classroom = lesson.classroom || lesson.room || null
        
        // Dates - on garde l'heure locale sans conversion UTC
        let startTime = null
        let endTime = null
        
        if (lesson.start) {
          // Utiliser directement la chaîne ISO sans conversion timezone
          startTime = lesson.start.replace('T', ' ').slice(0, 19)
        }
        if (lesson.end) {
          endTime = lesson.end.replace('T', ' ').slice(0, 19)
        }

        if (!startTime || !endTime) {
          skipped++
          continue
        }

        // Numéro de semaine - utiliser l'heure locale
        const startDate = lesson.start ? new Date(lesson.start) : new Date()
        const weekNumber = getWeekNumber(startDate)

        // Cours annulé
        const isCancelled = lesson.canceled || lesson.cancelled || false

        // Insérer dans la base
        await pool.execute(
          `INSERT INTO pronote_timetable 
           (user_id, subject, teacher, classroom, start_time, end_time, week_number, is_cancelled)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, subject, teacher, classroom, startTime, endTime, weekNumber, isCancelled ? 1 : 0]
        )

        imported++

      } catch (error) {
        console.error('[Pronote Timetable] Error inserting lesson:', error.message)
        skipped++
      }
    }

    console.log('[Pronote Timetable] Imported:', imported, 'Skipped:', skipped)

    return {
      success: true,
      imported,
      skipped,
      total: lessons.length
    }

  } catch (error) {
    console.error('[Pronote Timetable] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la synchronisation de l\'emploi du temps'
    })
  }
})

// Fonction pour calculer le numéro de semaine (heure locale)
function getWeekNumber(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNum = d.getDay() || 7
  d.setDate(d.getDate() + 4 - dayNum)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
