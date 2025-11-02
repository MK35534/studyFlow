import { executeQuery } from '~/lib/database';
import { verifyToken } from '~/lib/auth';
import { decrypt } from '~/lib/pronote';
import { spawn } from 'child_process';
import path from 'path';

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const userId = verifyToken(event);

    // Get request body
    const body = await readBody(event);
    const { assignmentId, isCompleted } = body;

    if (!assignmentId) {
      throw createError({
        statusCode: 400,
        message: 'Assignment ID required'
      });
    }

    console.log(`[Mark Pronote] Assignment ${assignmentId}, completed: ${isCompleted}`);

    // Get assignment details and mapping
    const assignment = await executeQuery(
      `SELECT a.title, a.due_date, s.name as subject_name, pam.pronote_id, pam.pronote_subject_name
       FROM assignments a
       LEFT JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN pronote_assignment_mapping pam ON pam.local_assignment_id = a.id AND pam.user_id = a.user_id
       WHERE a.id = ? AND a.user_id = ?`,
      [assignmentId, userId]
    );

    if (assignment.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Assignment not found'
      });
    }

    const assignmentData = assignment[0];
    
    if (!assignmentData.pronote_id) {
      // Assignment not from Pronote, nothing to sync
      return { success: true, message: 'Assignment not linked to Pronote' };
    }

    // Get Pronote credentials
    const config = await executeQuery(
      `SELECT instance_url, username, encrypted_password 
       FROM pronote_config 
       WHERE user_id = ? AND is_active = 1`,
      [userId]
    );

    if (config.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Pronote configuration not found'
      });
    }

    const { instance_url, username, encrypted_password } = config[0];
    const pronote_url = instance_url;

    // Decrypt password using shared utility
    const password = decrypt(encrypted_password);

    // Call Python script to mark homework on Pronote
    const pythonScript = path.join(process.cwd(), 'server', 'python', 'pronote', 'mark_homework_done.py');
    
    return new Promise((resolve, reject) => {
      console.log('[Mark Pronote] Calling Python script...');
      
      // Format date as YYYY-MM-DD for Python
      const dueDate = assignmentData.due_date instanceof Date 
        ? assignmentData.due_date.toISOString().split('T')[0]
        : new Date(assignmentData.due_date).toISOString().split('T')[0];
      
      console.log('[Mark Pronote] Searching:', {
        subject: assignmentData.pronote_subject_name,
        title: assignmentData.title,
        dueDate: dueDate  // Now properly formatted as YYYY-MM-DD
      });
      
      const pythonProcess = spawn('python', [
        pythonScript,
        pronote_url,
        username,
        password,
        assignmentData.title,
        dueDate,
        assignmentData.pronote_subject_name,
        isCompleted ? 'true' : 'false'
      ]);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString('utf8');
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString('utf8');
        console.log('[Mark Pronote Python]', data.toString('utf8').trim());
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('[Mark Pronote] Python error:', stderr);
          return resolve({
            success: false,
            message: 'Failed to sync to Pronote (check logs)',
            pronoteError: stderr
          });
        }

        try {
          const result = JSON.parse(stdout);
          console.log('[Mark Pronote] Result:', result);
          resolve({
            success: true,
            message: `Devoir ${isCompleted ? 'coché' : 'décoché'} sur Pronote`,
            pronoteResult: result
          });
        } catch (parseError) {
          console.error('[Mark Pronote] Parse error:', parseError);
          resolve({
            success: false,
            message: 'Invalid response from Pronote script'
          });
        }
      });

      pythonProcess.on('error', (error) => {
        console.error('[Mark Pronote] Spawn error:', error);
        reject(createError({
          statusCode: 500,
          message: 'Failed to execute Python script'
        }));
      });
    });

  } catch (error) {
    console.error('[Mark Pronote] Error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal server error'
    });
  }
});
