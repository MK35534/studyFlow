// =============================================
// Pronote Python Service Utilities
// Spawn Python process and fetch Pronote data
// =============================================

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Execute Python script to fetch Pronote data via ENT authentication
 * @param {string} pronoteUrl - Pronote instance URL
 * @param {string} username - ENT username
 * @param {string} password - ENT password
 * @param {Array} pendingActions - Optional array of pending actions to execute
 * @returns {Promise<Object>} - Pronote data (lessons, homework, grades, processed_actions)
 */
export async function fetchPronoteDataViaPython(pronoteUrl, username, password, pendingActions = null) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = join(__dirname, '..', 'python', 'pronote', 'pronote_sync.py');
    
    // Determine Python executable
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    console.log('[Pronote Service] Spawning Python process...');
    console.log('[Pronote Service] Script:', pythonScriptPath);
    if (pendingActions && pendingActions.length > 0) {
      console.log('[Pronote Service] Pending actions:', pendingActions.length);
    }
    
    const args = [
      pythonScriptPath,
      pronoteUrl,
      username,
      password
    ];
    
    // Add pending actions as JSON string if provided
    if (pendingActions && pendingActions.length > 0) {
      args.push(JSON.stringify(pendingActions));
    }
    
    const pythonProcess = spawn(pythonCmd, args);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      const message = data.toString();
      stderrData += message;
      // Log Python stderr for debugging (but don't fail)
      console.log('[Pronote Python]', message.trim());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('[Pronote Service] Python process exited with code', code);
        console.error('[Pronote Service] stderr:', stderrData);
        
        // Try to parse error from stdout
        try {
          const errorResult = JSON.parse(stdoutData);
          if (!errorResult.success) {
            return reject(new Error(errorResult.error || 'Python script failed'));
          }
        } catch (parseError) {
          return reject(new Error(`Python process failed with code ${code}: ${stderrData}`));
        }
      }

      try {
        const result = JSON.parse(stdoutData);
        
        if (!result.success) {
          return reject(new Error(result.error || 'Unknown error from Python script'));
        }
        
        console.log('[Pronote Service] Python fetch successful');
        console.log('[Pronote Service] Homework count:', result.data?.homework?.length || 0);
        console.log('[Pronote Service] Lessons count:', result.data?.lessons?.length || 0);
        
        resolve(result.data);
      } catch (parseError) {
        console.error('[Pronote Service] Failed to parse Python output:', parseError);
        console.error('[Pronote Service] stdout:', stdoutData);
        reject(new Error('Failed to parse Python script output: ' + parseError.message));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('[Pronote Service] Failed to spawn Python process:', error);
      reject(new Error('Failed to start Python process. Ensure Python is installed: ' + error.message));
    });
  });
}

/**
 * Check if Python and required dependencies are installed
 * @returns {Promise<Object>} - Status object with 'installed' boolean and 'message'
 */
export async function checkPythonDependencies() {
  return new Promise((resolve) => {
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    const checkProcess = spawn(pythonCmd, ['-c', 'import pronotepy, bs4, requests; print("OK")']);
    
    let output = '';
    
    checkProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    checkProcess.on('close', (code) => {
      if (code === 0 && output.includes('OK')) {
        resolve({
          installed: true,
          message: 'Python dependencies are installed'
        });
      } else {
        resolve({
          installed: false,
          message: 'Python dependencies missing. Run: pip install -r server/python/requirements.txt'
        });
      }
    });
    
    checkProcess.on('error', () => {
      resolve({
        installed: false,
        message: 'Python is not installed or not in PATH'
      });
    });
  });
}
