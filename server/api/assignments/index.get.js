import { executeQuery } from '~/lib/database.js'
import { verifyToken } from '~/lib/auth.js'

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification (throws 401 if invalid)
    const userId = verifyToken(event)
    
    // Récupérer les devoirs avec leurs matières
    const assignments = await executeQuery(
      `SELECT a.*, s.name as subject_name, s.color as subject_color 
       FROM assignments a 
       LEFT JOIN subjects s ON a.subject_id = s.id 
       WHERE a.user_id = ? 
       ORDER BY a.due_date ASC, a.created_at DESC`,
      [userId]
    )
    
    // Récupérer tous les tags pour ces devoirs en une seule requête
    if (assignments.length > 0) {
      const assignmentIds = assignments.map(a => a.id)
      const placeholders = assignmentIds.map(() => '?').join(',')
      
      const tagsData = await executeQuery(
        `SELECT at.assignment_id, t.id, t.name, t.color
         FROM assignment_tags at
         INNER JOIN tags t ON at.tag_id = t.id
         WHERE at.assignment_id IN (${placeholders})
         ORDER BY t.name ASC`,
        assignmentIds
      )
      
      // Grouper les tags par assignment_id
      const tagsByAssignment = {}
      tagsData.forEach(tag => {
        if (!tagsByAssignment[tag.assignment_id]) {
          tagsByAssignment[tag.assignment_id] = []
        }
        tagsByAssignment[tag.assignment_id].push({
          id: tag.id,
          name: tag.name,
          color: tag.color
        })
      })
      
      // Ajouter les tags à chaque devoir
      assignments.forEach(assignment => {
        assignment.tags = tagsByAssignment[assignment.id] || []
      })
    }
    
    return {
      success: true,
      data: assignments
    }
  } catch (error) {
    console.error('Erreur GET assignments:', error)
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
      message: 'Erreur serveur lors de la récupération des devoirs'
    }
  }
})