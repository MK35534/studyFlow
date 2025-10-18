import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    const body = await readBody(event)
    const { name, color, teacher, schedule, icon } = body
    
    // Validation
    if (!name || !name.trim()) {
      const error = new Error('Le nom de la matière est requis')
      error.statusCode = 400
      throw error
    }
    
    if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
      const error = new Error('Couleur invalide')
      error.statusCode = 400
      throw error
    }
    
    const result = await executeQuery(
      'INSERT INTO subjects (user_id, name, color, teacher, schedule, icon) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), color, teacher || null, schedule || null, icon || 'book']
    )
    
    // Récupérer la matière créée
    const newSubject = await executeQuery(
      'SELECT * FROM subjects WHERE id = ?',
      [result.insertId]
    )
    
    return {
      success: true,
      data: newSubject[0]
    }
  } catch (error) {
    console.error('Erreur POST subjects:', error)
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode)
      return {
        success: false,
        message: error.message
      }
    }
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Erreur serveur lors de la création de la matière'
    }
  }
})