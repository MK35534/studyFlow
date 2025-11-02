// =============================================
// POST /api/pronote/save-config
// Save or update Pronote configuration for user
// =============================================

import { executeQuery } from '~/lib/database.js';
import { encrypt, generateDeviceUUID } from '~/lib/pronote.js';
import { verifyToken } from '~/lib/auth.js';

export default defineEventHandler(async (event) => {
  try {
    // Verify JWT token (throws 401 error if invalid)
    const userId = verifyToken(event);

    const body = await readBody(event);
    const { 
      instanceUrl, 
      username, 
      password, 
      accountKind = 'STUDENT',
      casUrl = null,
      casToken = null,
      autoSync = false 
    } = body;

    // Validation
    if (!instanceUrl || !username || !password) {
      return {
        success: false,
        error: 'URL, identifiant et mot de passe requis'
      };
    }

    // Encrypt password
    const encryptedPassword = encrypt(password);
    
    // Generate device UUID
    const deviceUuid = generateDeviceUUID();

    // Check if config already exists
    const existingConfig = await executeQuery(
      'SELECT id FROM pronote_config WHERE user_id = ?',
      [userId]
    );

    let configId;

    if (existingConfig.length > 0) {
      // Update existing config
      await executeQuery(
        `UPDATE pronote_config 
         SET instance_url = ?, 
             username = ?, 
             encrypted_password = ?, 
             device_uuid = ?,
             cas_url = ?,
             cas_token = ?,
             account_kind = ?,
             auto_sync = ?,
             is_active = 1,
             updated_at = NOW()
         WHERE user_id = ?`,
        [instanceUrl, username, encryptedPassword, deviceUuid, casUrl, casToken, accountKind, autoSync, userId]
      );
      configId = existingConfig[0].id;
    } else {
      // Insert new config
      const result = await executeQuery(
        `INSERT INTO pronote_config 
         (user_id, instance_url, username, encrypted_password, device_uuid, cas_url, cas_token, account_kind, auto_sync) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, instanceUrl, username, encryptedPassword, deviceUuid, casUrl, casToken, accountKind, autoSync]
      );
      configId = result.insertId;
    }

    return {
      success: true,
      message: 'Configuration Pronote enregistrée',
      configId
    };

  } catch (error) {
    console.error('Error saving Pronote config:', error);
    return {
      success: false,
      error: 'Erreur lors de l\'enregistrement',
      technical: error.message
    };
  }
});
