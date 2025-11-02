// =============================================
// DELETE /api/pronote/config
// Delete Pronote configuration
// =============================================

import { executeQuery } from '~/lib/database.js';
import { verifyToken } from '~/lib/auth.js';

export default defineEventHandler(async (event) => {
  try {
    // Verify JWT token (throws 401 error if invalid)
    const userId = verifyToken(event);

    // Soft delete (mark as inactive)
    await executeQuery(
      `UPDATE pronote_config SET is_active = 0, updated_at = NOW() WHERE user_id = ?`,
      [userId]
    );

    return {
      success: true,
      message: 'Configuration Pronote supprimée'
    };

  } catch (error) {
    console.error('Error deleting Pronote config:', error);
    return {
      success: false,
      error: 'Erreur lors de la suppression'
    };
  }
});
