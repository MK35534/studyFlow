import jwt from 'jsonwebtoken'
import { executeQuery } from '~/lib/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_super_securise'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    const token = authHeader.substring(7)
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: 'Token invalide'
      })
    }

    const userId = decoded.userId
    
    // Récupérer les paramètres de requête
    const queryParams = getQuery(event)
    const period = queryParams.period || 'today' // today, week, month, all

    let dateFilter = ''
    const today = new Date()
    
    switch (period) {
      case 'today':
        const todayStart = new Date(today.setHours(0, 0, 0, 0))
        dateFilter = `AND fs.completed_at >= '${todayStart.toISOString()}'`
        break
      case 'week':
        const weekStart = new Date(today.setDate(today.getDate() - 7))
        dateFilter = `AND fs.completed_at >= '${weekStart.toISOString()}'`
        break
      case 'month':
        const monthStart = new Date(today.setDate(today.getDate() - 30))
        dateFilter = `AND fs.completed_at >= '${monthStart.toISOString()}'`
        break
      case 'all':
      default:
        dateFilter = ''
    }

    // Récupérer les sessions avec les informations des devoirs
    const sessions = await executeQuery(
      `SELECT 
        fs.id,
        fs.session_type,
        fs.duration,
        fs.completed_at,
        fs.assignment_id,
        a.title as assignment_title,
        s.name as subject_name,
        s.color as subject_color
       FROM focus_sessions fs
       LEFT JOIN assignments a ON fs.assignment_id = a.id
       LEFT JOIN subjects s ON a.subject_id = s.id
       WHERE fs.user_id = ? ${dateFilter}
       ORDER BY fs.completed_at DESC`,
      [userId]
    )

    // Calculer les statistiques
    const focusSessions = sessions.filter(s => s.session_type === 'focus')
    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.duration, 0)
    const totalSessions = sessions.length

    // Statistiques par jour
    const sessionsByDay = {}
    sessions.forEach(session => {
      const day = new Date(session.completed_at).toDateString()
      if (!sessionsByDay[day]) {
        sessionsByDay[day] = {
          date: day,
          sessions: 0,
          focusMinutes: 0
        }
      }
      sessionsByDay[day].sessions++
      if (session.session_type === 'focus') {
        sessionsByDay[day].focusMinutes += session.duration
      }
    })

    return {
      sessions,
      stats: {
        totalSessions,
        totalFocusMinutes,
        averageSessionsPerDay: Object.keys(sessionsByDay).length > 0 
          ? (totalSessions / Object.keys(sessionsByDay).length).toFixed(1)
          : 0,
        sessionsByDay: Object.values(sessionsByDay)
      }
    }
  } catch (error) {
    console.error('Erreur récupération sessions focus:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération des sessions'
    })
  }
})
