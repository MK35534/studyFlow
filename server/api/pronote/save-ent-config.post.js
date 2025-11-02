import { createSessionHandle, loginCredentials } from 'pawnote';
import { verifyToken } from '~/lib/auth.js';
import { executeQuery } from '~/lib/database.js';
import { encrypt, generateDeviceUUID } from '~/lib/pronote.js';

export default defineEventHandler(async (event) => {
  try {
    // Vérification du token JWT
    const userId = verifyToken(event);

    // Récupération des données
    const body = await readBody(event);
    const {
      instanceUrl,
      username,
      casUrl,
      casToken,
      accountKind = 'STUDENT'
    } = body;

    // Validation
    if (!instanceUrl || !username || !casUrl || !casToken) {
      return {
        success: false,
        error: 'URL, identifiant, CAS URL et CAS token requis'
      };
    }

    console.log(`[ENT Auth] Attempting ENT authentication for user ${userId}`);
    console.log(`[ENT Auth] Instance: ${instanceUrl}`);
    console.log(`[ENT Auth] CAS URL: ${casUrl}`);

    // Génération du device UUID
    const deviceUUID = generateDeviceUUID(userId, instanceUrl);

    // Tentative de connexion via CAS avec Pawnote
    let session;
    try {
      session = createSessionHandle();
      
      // loginCredentials accepte casURL et casToken comme paramètres optionnels
      await loginCredentials(session, {
        url: instanceUrl,
        username,
        deviceUUID,
        kind: accountKind.toLowerCase(),
        casURL: casUrl,
        casToken: casToken
      });

      console.log('[ENT Auth] Successfully authenticated with CAS');
    } catch (error) {
      console.error('[ENT Auth] CAS authentication failed:', error);
      return {
        success: false,
        error: 'Échec de l\'authentification CAS. Veuillez réessayer.'
      };
    }

    // Extraction des tokens (si disponibles)
    const accessToken = session.accessToken || null;
    const refreshToken = session.refreshToken || null;

    // Chiffrement du token CAS pour stockage
    const encryptedCasToken = encrypt(casToken);

    // Vérification si une config existe déjà
    const existingConfigs = await executeQuery(
      'SELECT id FROM pronote_config WHERE user_id = ? AND is_active = 1',
      [userId]
    );

    if (existingConfigs.length > 0) {
      // Mise à jour de la config existante
      await executeQuery(
        `UPDATE pronote_config 
         SET instance_url = ?, 
             username = ?, 
             cas_url = ?,
             cas_token = ?,
             device_uuid = ?, 
             access_token = ?,
             refresh_token = ?,
             account_kind = ?, 
             updated_at = NOW()
         WHERE user_id = ? AND is_active = 1`,
        [
          instanceUrl,
          username,
          casUrl,
          encryptedCasToken,
          deviceUUID,
          accessToken,
          refreshToken,
          accountKind,
          userId
        ]
      );

      console.log(`[ENT Auth] Updated existing config for user ${userId}`);
    } else {
      // Création d'une nouvelle config
      await executeQuery(
        `INSERT INTO pronote_config 
         (user_id, instance_url, username, encrypted_password, cas_url, cas_token, device_uuid, access_token, refresh_token, account_kind)
         VALUES (?, ?, ?, '', ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          instanceUrl,
          username,
          casUrl,
          encryptedCasToken,
          deviceUUID,
          accessToken,
          refreshToken,
          accountKind
        ]
      );

      console.log(`[ENT Auth] Created new ENT config for user ${userId}`);
    }

    return {
      success: true,
      message: 'Configuration ENT enregistrée avec succès',
      data: {
        instanceUrl,
        username,
        accountKind,
        hasAccessToken: !!accessToken
      }
    };

  } catch (error) {
    console.error('[ENT Auth] Error:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'enregistrement de la configuration ENT'
    };
  }
});
