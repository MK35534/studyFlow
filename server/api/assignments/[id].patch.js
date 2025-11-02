import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    console.log('=== PATCH ASSIGNMENT ===')
    
    // Vérifier l'authentification (throws 401 if invalid)
    const userId = verifyToken(event)
    
    // Récupérer l'ID depuis l'URL
    const url = getRequestURL(event)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    
    const body = await readBody(event)
    console.log('Body reçu:', body)
    
    if (!id || isNaN(id)) {
      const error = new Error('ID de devoir invalide')
      error.statusCode = 400
      throw error
    }
    
    // Vérifier que le devoir appartient à l'utilisateur
    const existing = await executeQuery(
      'SELECT id FROM assignments WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    
    if (existing.length === 0) {
      const error = new Error('Devoir non trouvé')
      error.statusCode = 404
      throw error
    }
    
    // Mise à jour selon ce qui est envoyé
    if (body.hasOwnProperty('is_completed')) {
      // Changement de statut
      console.log('Mise à jour statut:', body.is_completed)
      await executeQuery(
        'UPDATE assignments SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [body.is_completed, id, userId]
      )
      
      // Queue action for next Pronote sync
      try {
        // Check if this assignment is from Pronote
        const mapping = await executeQuery(
          'SELECT pronote_id FROM pronote_assignment_mapping WHERE local_assignment_id = ? AND user_id = ?',
          [id, userId]
        );
        
        if (mapping.length > 0) {
          const actionType = body.is_completed ? 'mark_done' : 'mark_undone';
          
          // Delete any existing pending action for this assignment
          await executeQuery(
            'DELETE FROM pronote_pending_actions WHERE assignment_id = ? AND user_id = ? AND processed_at IS NULL',
            [id, userId]
          );
          
          // Add new pending action
          await executeQuery(
            'INSERT INTO pronote_pending_actions (user_id, assignment_id, action_type, pronote_id) VALUES (?, ?, ?, ?)',
            [userId, id, actionType, mapping[0].pronote_id]
          );
          
          console.log(`[Pronote Queue] Added action: ${actionType} for assignment ${id}`);
        }
      } catch (error) {
        console.warn('[Pronote Queue] Failed to queue action:', error);
        // Don't fail the whole request if queueing fails
      }
    } 
    
    if (body.hasOwnProperty('due_date')) {
      // Changement de date
      console.log('Mise à jour date:', body.due_date)
      
      // Validation format date
      if (!body.due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const error = new Error('Format de date invalide (YYYY-MM-DD requis)')
        error.statusCode = 400
        throw error
      }
      
      await executeQuery(
        'UPDATE assignments SET due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [body.due_date, id, userId]
      )
    }
    
    // Vérifier qu'au moins une mise à jour a été faite
    if (!body.hasOwnProperty('is_completed') && !body.hasOwnProperty('due_date')) {
      const error = new Error('Aucune donnée à mettre à jour')
      error.statusCode = 400
      throw error
    }
    
    console.log('Mise à jour réussie')
    
    return {
      success: true,
      message: body.hasOwnProperty('due_date') 
        ? 'Date mise à jour avec succès' 
        : 'Statut mis à jour avec succès'
    }
  } catch (error) {
    console.error('Erreur PATCH assignments:', error)
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
      message: 'Erreur serveur lors de la mise à jour du devoir'
    }
  }
})