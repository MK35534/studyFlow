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

    // Récupérer les données
    const body = await readBody(event)
    const { title, description, category, startTime, endTime, color, isRecurring, recurrencePattern, recurrenceEndDate } = body

    // Validation
    if (!title || !category || !startTime || !endTime) {
      throw createError({ statusCode: 400, message: 'Données incomplètes' })
    }

    console.log('[Life Calendar POST] Creating event:', title, 'for user:', userId)

    // Récupérer le pool
    const pool = getPool()

    const [result] = await pool.execute(
        `INSERT INTO life_calendar_events 
          (user_id, title, description, category, start_time, end_time, color, is_recurring, recurrence_pattern, recurrence_end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          title,
          description || null,
          category,
          startTime,
          endTime,
          color || '#6B7280',
          isRecurring || false,
          recurrencePattern || 'none',
          recurrenceEndDate || null
        ]
      )

    // Récupérer l'événement créé
    const [events] = await pool.execute(
      `SELECT 
        id,
        title,
        description,
        category,
        start_time as startTime,
        end_time as endTime,
        color,
        is_recurring as isRecurring,
        recurrence_pattern as recurrencePattern,
        recurrence_end_date as recurrenceEndDate
      FROM life_calendar_events
      WHERE id = ?`,
      [result.insertId]
    )

    console.log('[Life Calendar POST] Event created with ID:', result.insertId)

    return {
      success: true,
      event: events[0]
    }

  } catch (error) {
    console.error('[Life Calendar POST] Erreur:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la création de l\'événement'
    })
  }
})
