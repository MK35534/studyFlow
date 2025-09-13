import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    const body = await readBody(event)
    const { title, subject_id, due_date, description } = body
    
    // Validation
    if (!title || !title.trim()) {
      const error = new Error('Le titre du devoir est requis')
      error.statusCode = 400
      throw error
    }
    
    if (!subject_id || isNaN(subject_id)) {
      const error = new Error('Matière invalide')
      error.statusCode = 400
      throw error
    }
    
    if (!due_date) {
      const error = new Error('Date d\'échéance requise')
      error.statusCode = 400
      throw error
    }
    
    // Vérifier que la matière appartient à l'utilisateur
    const subjectExists = await executeQuery(
      'SELECT id FROM subjects WHERE id = ? AND user_id = ?',
      [subject_id, userId]
    )
    
    if (subjectExists.length === 0) {
      const error = new Error('Matière non trouvée')
      error.statusCode = 404
      throw error
    }
    
    // Créer le devoir
    const result = await executeQuery(
      'INSERT INTO assignments (user_id, subject_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)',
      [userId, subject_id, title.trim(), description?.trim() || '', due_date]
    )
    
    // Récupérer le devoir créé avec les infos de la matière
    const newAssignment = await executeQuery(
      `SELECT a.*, s.name as subject_name, s.color as subject_color 
       FROM assignments a 
       LEFT JOIN subjects s ON a.subject_id = s.id 
       WHERE a.id = ?`,
      [result.insertId]
    )
    
    return {
      success: true,
      data: newAssignment[0]
    }
  } catch (error) {
    console.error('Erreur POST assignments:', error)
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
      message: 'Erreur serveur lors de la création du devoir'
    }
  }
})