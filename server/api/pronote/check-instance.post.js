// =============================================
// POST /api/pronote/check-instance
// Check if Pronote instance exists and detect ENT/CAS
// =============================================

import { instance } from 'pawnote';
import { sanitizePronoteURL } from '~/lib/pronote.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = body;

    if (!url) {
      return {
        success: false,
        error: 'URL Pronote requise'
      };
    }

    // Sanitize and validate URL
    const cleanUrl = sanitizePronoteURL(url);

    // Check if instance exists using Pawnote
    let instanceInfo;
    try {
      instanceInfo = await instance(cleanUrl);
    } catch (error) {
      // Try alternative URL format (toutatice.fr)
      const alternativeUrl = cleanUrl.replace('.index-education.net', '.pronote.toutatice.fr');
      try {
        instanceInfo = await instance(alternativeUrl);
      } catch (altError) {
        return {
          success: false,
          error: 'Instance Pronote introuvable ou invalide',
          technical: error.message
        };
      }
    }

    // Detect if ENT/CAS authentication is required
    const requiresENT = !!(instanceInfo.casToken && instanceInfo.casURL);

    return {
      success: true,
      data: {
        url: instanceInfo.url || cleanUrl,
        name: instanceInfo.name || 'Instance Pronote',
        requiresENT,
        casURL: instanceInfo.casURL || null,
        casToken: instanceInfo.casToken || null,
        accountKinds: instanceInfo.accountKinds || ['STUDENT']
      }
    };

  } catch (error) {
    console.error('Error checking Pronote instance:', error);
    return {
      success: false,
      error: 'Erreur lors de la vérification de l\'instance',
      technical: error.message
    };
  }
});
