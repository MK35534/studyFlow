// =============================================
// GET /api/pronote/config
// Get user's Pronote configuration (without password)
// =============================================

import { executeQuery } from '~/lib/database.js';
import { verifyToken } from '~/lib/auth.js';

export default defineEventHandler(async (event) => {
  try {
    // Verify JWT token (throws 401 error if invalid)
    const userId = verifyToken(event);

    // Get config (excluding encrypted password)
    const configs = await executeQuery(
      `SELECT 
        id,
        instance_url,
        username,
        device_uuid,
        account_kind,
        last_sync,
        sync_homework,
        sync_timetable,
        sync_grades,
        auto_sync,
        sync_frequency,
        is_active,
        created_at,
        updated_at
       FROM pronote_config 
       WHERE user_id = ? AND is_active = 1`,
      [userId]
    );

    if (configs.length === 0) {
      return {
        success: true,
        configured: false,
        config: {
          syncHomework: true,
          syncTimetable: true,
          syncGrades: false,
          autoSync: true,
          syncFrequency: 'daily'
        }
      };
    }

    const row = configs[0];
    return {
      success: true,
      configured: true,
      data: {
        instanceUrl: row.instance_url,
        username: row.username,
        lastSync: row.last_sync,
        accountKind: row.account_kind,
        autoSync: row.auto_sync === 1
      },
      config: {
        syncHomework: row.sync_homework === 1,
        syncTimetable: row.sync_timetable === 1,
        syncGrades: row.sync_grades === 1,
        autoSync: row.auto_sync === 1,
        syncFrequency: row.sync_frequency || 'daily'
      }
    };

  } catch (error) {
    console.error('Error fetching Pronote config:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération de la configuration'
    };
  }
});
