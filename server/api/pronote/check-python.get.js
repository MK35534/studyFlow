// =============================================
// GET /api/pronote/check-python
// Check if Python and dependencies are installed
// =============================================

import { checkPythonDependencies } from '~/lib/pronoteService.js';

export default defineEventHandler(async (event) => {
  try {
    const status = await checkPythonDependencies();
    
    return {
      success: true,
      python: status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});
