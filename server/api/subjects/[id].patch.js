import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const { userId } = verifyToken(event)
    
    const id = event.context.params.id
    const body = await readBody(event)
    const { name, color, teacher, schedule, icon } = body
    
    // Vérifier que la matière existe et appartient à l'utilisateur
    const existing = await executeQuery(
      'SELECT * FROM subjects WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    
    if (!existing || existing.length === 0) {
      const error = new Error('Matière non trouvée')
      error.statusCode = 404
      throw error
    }
    
    // Validation
    if (name !== undefined && (!name || !name.trim())) {
      const error = new Error('Le nom de la matière est requis')
      error.statusCode = 400
      throw error
    }
    
    if (color !== undefined && !/^#[0-9A-F]{6}$/i.test(color)) {
      const error = new Error('Couleur invalide')
      error.statusCode = 400
      throw error
    }
    
    // Construire la requête de mise à jour
    const updates = []
    const values = []
    
    if (name !== undefined) {
      updates.push('name = ?')
      values.push(name.trim())
    }
    if (color !== undefined) {
      updates.push('color = ?')
      values.push(color)
    }
    if (teacher !== undefined) {
      updates.push('teacher = ?')
      values.push(teacher || null)
    }
    if (schedule !== undefined) {
      updates.push('schedule = ?')
      values.push(schedule || null)
    }
    if (icon !== undefined) {
      updates.push('icon = ?')
      values.push(icon || 'book')
    }
    
    if (updates.length === 0) {
      const error = new Error('Aucune donnée à mettre à jour')
      error.statusCode = 400
      throw error
    }
    
    // Ajouter updated_at
    updates.push('updated_at = NOW()')
    values.push(id, userId)
    
    await executeQuery(
      `UPDATE subjects SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    )
    
    // Récupérer la matière mise à jour
    const updatedSubject = await executeQuery(
      'SELECT * FROM subjects WHERE id = ?',
      [id]
    )
    
    return {
      success: true,
      data: updatedSubject[0]
    }
  } catch (error) {
    console.error('Erreur PATCH subject:', error)
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
      message: 'Erreur serveur lors de la mise à jour de la matière'
    }
  }
})
