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

    // Récupérer les données de la session
    const body = await readBody(event)
    const { session_type, duration, assignment_id, completed_at } = body

    // Validation
    if (!session_type || !duration) {
      throw createError({
        statusCode: 400,
        message: 'Type de session et durée requis'
      })
    }

    // Insérer la session
    const result = await executeQuery(
      `INSERT INTO focus_sessions 
       (user_id, session_type, duration, assignment_id, completed_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, session_type, duration, assignment_id, completed_at || new Date()]
    )

    return {
      success: true,
      sessionId: result.insertId,
      message: 'Session enregistrée avec succès'
    }
  } catch (error) {
    console.error('Erreur création session focus:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la création de la session'
    })
  }
})
