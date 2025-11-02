// =============================================
// GET /api/pronote/sync-logs
// Get sync history for user
// =============================================

import { executeQuery } from '~/lib/database.js';
import { verifyToken } from '~/lib/auth.js';

export default defineEventHandler(async (event) => {
  try {
    // Verify JWT token (throws 401 error if invalid)
    const userId = verifyToken(event);
    
    console.log('[SYNC-LOGS] Getting logs for userId:', userId, typeof userId);

    // Get sync logs
    const query = getQuery(event);
    const limit = parseInt(query.limit) || 10;
    
    console.log('[SYNC-LOGS] Limit:', limit, typeof limit);

    // Get sync logs
    console.log('[SYNC-LOGS] Executing first query with userId:', userId, 'limit:', limit);
    const logs = await executeQuery(
      `SELECT 
        id,
        sync_started_at,
        sync_completed_at,
        status,
        COALESCE(assignments_imported, 0) as assignments_imported,
        COALESCE(assignments_updated, 0) as assignments_updated,
        COALESCE(assignments_skipped, 0) as assignments_skipped,
        COALESCE(subjects_created, 0) as subjects_created,
        error_message
       FROM pronote_sync_logs 
       WHERE user_id = ? 
       ORDER BY sync_started_at DESC 
       LIMIT ${limit}`,
      [userId]
    );
    
    console.log('[SYNC-LOGS] First query successful, got', logs.length, 'rows');
    
    // Convertir les dates en ISO UTC pour que le navigateur les affiche correctement dans le timezone local
    const logsWithDuration = logs.map(log => {
      const startDate = log.sync_started_at ? new Date(log.sync_started_at) : null
      const endDate = log.sync_completed_at ? new Date(log.sync_completed_at) : null
      
      return {
        ...log,
        // Renvoyer en ISO UTC, le navigateur convertira automatiquement
        sync_started_at: startDate ? startDate.toISOString() : null,
        sync_completed_at: endDate ? endDate.toISOString() : null,
        duration_seconds: endDate && startDate
          ? Math.floor((endDate - startDate) / 1000)
          : 0
      }
    });

    // Get total stats
    console.log('[SYNC-LOGS] Executing totalStats query with userId:', userId);
    const totalStats = await executeQuery(
      `SELECT 
        COALESCE(COUNT(*), 0) as total_syncs,
        COALESCE(SUM(assignments_imported), 0) as total_imported,
        COALESCE(SUM(assignments_updated), 0) as total_updated,
        COALESCE(SUM(subjects_created), 0) as total_subjects_created,
        MAX(sync_completed_at) as last_successful_sync
       FROM pronote_sync_logs 
       WHERE user_id = ? AND status = ?`,
      [userId, 'success']
    );
    
    console.log('[SYNC-LOGS] TotalStats query successful');

    return {
      success: true,
      logs: logsWithDuration || [],
      stats: totalStats[0] || {
        total_syncs: 0,
        total_imported: 0,
        total_updated: 0,
        total_subjects_created: 0,
        last_successful_sync: null
      }
    };

  } catch (error) {
    console.error('Error fetching sync logs:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération de l\'historique'
    };
  }
});
