s// =============================================
// POST /api/pronote/sync
// Synchronize assignments from Pronote to local database
// Using Python pronotepy service for ENT authentication
// =============================================

import { executeQuery } from '~/lib/database.js';
import { verifyToken } from '~/lib/auth.js';
import { 
  decrypt, 
  findDuplicateAssignment, 
  mapPronoteSubject, 
  generateSubjectColor,
  stripHTML 
} from '~/lib/pronote.js';
import { fetchPronoteDataViaPython } from '~/lib/pronoteService.js';
import { getHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  let userId;

  try {
    // Verify JWT token (throws 401 error if invalid)
    userId = verifyToken(event);

    // Create sync log
    const logResult = await executeQuery(
      `INSERT INTO pronote_sync_logs (user_id, status) VALUES (?, 'in_progress')`,
      [userId]
    );
    const syncLogId = logResult.insertId;

    // Get user's Pronote config
    const configs = await executeQuery(
      `SELECT * FROM pronote_config WHERE user_id = ? AND is_active = 1`,
      [userId]
    );

    if (configs.length === 0) {
      await updateSyncLog(syncLogId, 'error', 'Configuration Pronote non trouvée', {});
      return {
        success: false,
        error: 'Aucune configuration Pronote trouvée'
      };
    }

    const config = configs[0];

    // Decrypt password
    const password = decrypt(config.encrypted_password);
    
    // Get pending actions to execute on Pronote
    let pendingActions = [];
    try {
      pendingActions = await executeQuery(
        `SELECT id, assignment_id, action_type, pronote_id 
         FROM pronote_pending_actions 
         WHERE user_id = ? AND processed_at IS NULL
         ORDER BY created_at ASC`,
        [userId]
      );
      if (pendingActions.length > 0) {
        console.log(`[Sync] Found ${pendingActions.length} pending actions to process`);
      }
    } catch (error) {
      console.warn('[Sync] Failed to fetch pending actions:', error);
      pendingActions = [];
    }
    
    // Fetch Pronote data using Python service (ENT authentication)
    let pronoteData;
    try {
      console.log('[Sync] Calling Python service for Pronote data...');
      pronoteData = await fetchPronoteDataViaPython(
        config.instance_url,
        config.username,
        password,
        pendingActions
      );
      console.log('[Sync] Successfully retrieved Pronote data');
    } catch (error) {
      console.error('[Sync] Python service error:', error);
      await updateSyncLog(syncLogId, 'error', 'Échec de connexion à Pronote', { error: error.message });
      return {
        success: false,
        error: 'Impossible de se connecter à Pronote. Vérifiez vos identifiants.',
        technical: error.message
      };
    }

    // Map Python response to homework format
    let pronoteHomeworks = [];
    
    try {
      if (pronoteData.homework && Array.isArray(pronoteData.homework)) {
        pronoteHomeworks = pronoteData.homework.map(hw => {
          // Parse deadline if it's a string
          let deadline;
          if (hw.date) {
            deadline = typeof hw.date === 'string' ? new Date(hw.date) : hw.date;
          } else if (hw.deadline) {
            deadline = typeof hw.deadline === 'string' ? new Date(hw.deadline) : hw.deadline;
          } else {
            deadline = new Date();
          }

          // Extract subject name from object or use string
          let subjectName = 'Sans matière';
          if (hw.subject) {
            if (typeof hw.subject === 'object' && hw.subject.name) {
              subjectName = hw.subject.name;
            } else if (typeof hw.subject === 'string') {
              subjectName = hw.subject;
            }
          }

          // Extract teacher name if available
          let teacherName = null;
          if (hw.teacher) {
            if (typeof hw.teacher === 'object' && hw.teacher.name) {
              teacherName = hw.teacher.name;
            } else if (typeof hw.teacher === 'string') {
              teacherName = hw.teacher;
            }
          }

          // Create stable ID based on content (description + date + subject) to avoid duplicates
          const descForId = (hw.description || subjectName || '').substring(0, 50);
          const dateForId = deadline.toISOString().split('T')[0]; // YYYY-MM-DD
          const stableId = `${subjectName}_${dateForId}_${descForId}`.replace(/[^a-zA-Z0-9]/g, '_');

          return {
            id: stableId,
            originalId: hw.id, // Keep original Pronote ID for sync back
            description: hw.description || subjectName || '',
            content: hw.content || '',
            subject: subjectName,
            subjectName: subjectName,
            teacherName: teacherName,
            deadline: deadline,
            done: hw.done === true || hw.done === 'true' || hw.done === 1
          };
        });
      }
      
      console.log(`[Sync] Processed ${pronoteHomeworks.length} homeworks from Pronote`);
    } catch (error) {
      console.error('[Sync] Error processing Pronote homeworks:', error);
      // Continue with empty array if error
    }

    // Update teachers from timetable/lessons data
    try {
      if (pronoteData.lessons && Array.isArray(pronoteData.lessons)) {
        const teachersBySubject = new Map();
        
        // Extract teachers from lessons
        for (const lesson of pronoteData.lessons) {
          let subjectName = null;
          let teacherName = null;
          
          // Extract subject
          if (lesson.subject) {
            if (typeof lesson.subject === 'object' && lesson.subject.name) {
              subjectName = lesson.subject.name;
            } else if (typeof lesson.subject === 'string') {
              subjectName = lesson.subject;
            }
          }
          
          // Extract teacher
          if (lesson.teacher) {
            if (typeof lesson.teacher === 'object' && lesson.teacher.name) {
              teacherName = lesson.teacher.name;
            } else if (typeof lesson.teacher === 'string') {
              teacherName = lesson.teacher;
            }
          }
          
          // Map teacher to subject
          if (subjectName && teacherName) {
            teachersBySubject.set(subjectName, teacherName);
          }
        }
        
        console.log(`[Sync] Found ${teachersBySubject.size} subject-teacher mappings from timetable`);
        
        // Update existing subjects with teacher info
        for (const [subjectName, teacherName] of teachersBySubject) {
          const matchedSubject = existingSubjects.find(s => 
            s.name.toLowerCase() === subjectName.toLowerCase()
          );
          
          if (matchedSubject && !matchedSubject.teacher) {
            await executeQuery(
              `UPDATE subjects SET teacher = ? WHERE id = ? AND user_id = ?`,
              [teacherName, matchedSubject.id, userId]
            );
            matchedSubject.teacher = teacherName; // Update local cache
            console.log(`[Sync] Updated teacher for ${subjectName}: ${teacherName}`);
          }
        }
      }
    } catch (error) {
      console.error('[Sync] Error updating teachers from timetable:', error);
    }

    // Get user's existing assignments and subjects
    const existingAssignments = await executeQuery(
      `SELECT * FROM assignments WHERE user_id = ?`,
      [userId]
    );

    const existingSubjects = await executeQuery(
      `SELECT * FROM subjects WHERE user_id = ?`,
      [userId]
    );

    // Sync statistics
    const stats = {
      imported: 0,
      updated: 0,
      skipped: 0,
      subjectsCreated: 0,
      syncedToPronote: 0
    };

    // Process each Pronote homework
    for (const pronoteHw of pronoteHomeworks) {
      try {
        // Check if already mapped (primary check to avoid duplicates)
        const mapping = await executeQuery(
          `SELECT pam.*, a.is_completed 
           FROM pronote_assignment_mapping pam
           LEFT JOIN assignments a ON a.id = pam.local_assignment_id
           WHERE pam.user_id = ? AND pam.pronote_id = ?`,
          [userId, pronoteHw.id]
        );

        if (mapping.length > 0) {
          // Check if status changed
          const localIsCompleted = mapping[0].is_completed === 1;
          const pronoteIsDone = pronoteHw.done;
          
          if (localIsCompleted !== pronoteIsDone) {
            console.log(`[Sync] Status mismatch for "${pronoteHw.description}": Local=${localIsCompleted}, Pronote=${pronoteIsDone}`);
            
            // Keep local state if marked as completed locally (user did the work)
            // Only update to Pronote state if user unchecked locally but it's still done on Pronote
            if (!localIsCompleted && pronoteIsDone) {
              // Pronote says done, but user unchecked locally -> update to done
              await executeQuery(
                `UPDATE assignments SET is_completed = 1 WHERE id = ?`,
                [mapping[0].local_assignment_id]
              );
              stats.updated++;
              console.log(`[Sync] Updated "${pronoteHw.description}" to completed (from Pronote)`);
            } else {
              // Local says done, Pronote says not done -> keep local state
              console.log(`[Sync] Keeping local completed state for "${pronoteHw.description}"`);
              stats.skipped++;
            }
          } else {
            stats.skipped++;
          }
          continue;
        }

        // Check for duplicates by title/date (secondary check)
        const duplicate = findDuplicateAssignment({
          title: pronoteHw.description || pronoteHw.subject,
          deadline: pronoteHw.deadline
        }, existingAssignments);

        if (duplicate) {
          stats.skipped++;
          continue;
        }

        // Find or create subject
        let subjectId;
        const matchedSubject = mapPronoteSubject(pronoteHw.subjectName, existingSubjects);

        if (matchedSubject) {
          subjectId = matchedSubject.id;
          
          // Update teacher if provided and not already set
          if (pronoteHw.teacherName && !matchedSubject.teacher) {
            await executeQuery(
              `UPDATE subjects SET teacher = ? WHERE id = ?`,
              [pronoteHw.teacherName, subjectId]
            );
          }
        } else {
          // Create new subject with teacher
          const color = generateSubjectColor(pronoteHw.subjectName);
          const newSubject = await executeQuery(
            `INSERT INTO subjects (user_id, name, color, teacher, created_at) VALUES (?, ?, ?, ?, NOW())`,
            [userId, pronoteHw.subjectName, color, pronoteHw.teacherName]
          );
          subjectId = newSubject.insertId;
          existingSubjects.push({ id: subjectId, name: pronoteHw.subjectName, color, teacher: pronoteHw.teacherName });
          stats.subjectsCreated++;
        }

        // Create assignment
        let title = stripHTML(pronoteHw.description || pronoteHw.subject || 'Devoir Pronote');
        let description = stripHTML(pronoteHw.content || '');
        
        // Truncate to fit database columns (VARCHAR 255 in BYTES, not chars - UTF-8 chars can be 2-3 bytes)
        // Safe limit: 200 chars to account for multi-byte characters
        if (title.length > 200) {
          console.log(`[Sync] ⚠️ Title too long (${title.length} chars), truncating...`);
          title = title.substring(0, 197) + '...';
        }
        if (description.length > 4000) {
          description = description.substring(0, 3997) + '...';
        }
        
        const dueDate = new Date(pronoteHw.deadline);
        const isCompleted = pronoteHw.done ? 1 : 0;

        const newAssignment = await executeQuery(
          `INSERT INTO assignments 
           (user_id, subject_id, title, description, due_date, is_completed, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [userId, subjectId, title, description, dueDate, isCompleted]
        );

        // Create mapping (use originalId from Pronote for sync back)
        await executeQuery(
          `INSERT INTO pronote_assignment_mapping 
           (user_id, local_assignment_id, pronote_id, pronote_subject_name) 
           VALUES (?, ?, ?, ?)`,
          [userId, newAssignment.insertId, pronoteHw.originalId || pronoteHw.id, pronoteHw.subjectName]
        );

        stats.imported++;

      } catch (error) {
        console.error('Error processing Pronote homework:', error);
      }
    }

    // Update sync log
    await updateSyncLog(syncLogId, 'success', null, stats);

    // Update last_sync in config
    await executeQuery(
      `UPDATE pronote_config SET last_sync = NOW() WHERE id = ?`,
      [config.id]
    );
    
    // Sync timetable if enabled
    try {
      const syncConfig = await executeQuery(
        'SELECT sync_timetable FROM pronote_config WHERE user_id = ?',
        [userId]
      );
      
      const shouldSyncTimetable = syncConfig.length > 0 && syncConfig[0].sync_timetable === 1;
      
      if (shouldSyncTimetable && pronoteData.lessons && pronoteData.lessons.length > 0) {
        console.log(`[Sync] Syncing ${pronoteData.lessons.length} lessons to timetable...`);
        
        // Appel interne à l'API sync-timetable - passer userId directement
        const timetableResult = await $fetch('/api/pronote/sync-timetable', {
          method: 'POST',
          body: {
            lessons: pronoteData.lessons,
            userId: userId  // On passe directement le userId vérifié
          }
        });
        
        stats.timetableImported = timetableResult.imported;
        console.log(`[Sync] Timetable sync: ${timetableResult.imported} imported, ${timetableResult.skipped} skipped`);
      }
    } catch (error) {
      console.error('[Sync] Timetable sync failed:', error);
      // Ne pas faire échouer toute la sync si l'emploi du temps échoue
    }
    
    // Mark processed actions as completed
    if (pronoteData.processed_actions && pronoteData.processed_actions.length > 0) {
      const successfulActions = pronoteData.processed_actions.filter(a => a.success);
      if (successfulActions.length > 0) {
        const actionIds = successfulActions.map(a => a.id);
        await executeQuery(
          `UPDATE pronote_pending_actions 
           SET processed_at = NOW() 
           WHERE id IN (${actionIds.map(() => '?').join(',')})`,
          actionIds
        );
        console.log(`[Sync] Marked ${successfulActions.length} actions as processed`);
        stats.syncedToPronote = successfulActions.length;
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000);

    return {
      success: true,
      message: 'Synchronisation terminée',
      stats,
      duration: `${duration}s`
    };

  } catch (error) {
    console.error('Error during Pronote sync:', error);
    
    if (userId) {
      const logResult = await executeQuery(
        `SELECT id FROM pronote_sync_logs WHERE user_id = ? ORDER BY sync_started_at DESC LIMIT 1`,
        [userId]
      );
      if (logResult.length > 0) {
        await updateSyncLog(logResult[0].id, 'error', error.message, {});
      }
    }

    return {
      success: false,
      error: 'Erreur lors de la synchronisation',
      technical: error.message
    };
  }
});

// Helper function to update sync log
async function updateSyncLog(logId, status, errorMessage, stats) {
  await executeQuery(
    `UPDATE pronote_sync_logs 
     SET status = ?, 
         sync_completed_at = NOW(),
         assignments_imported = ?,
         assignments_updated = ?,
         assignments_skipped = ?,
         subjects_created = ?,
         error_message = ?
     WHERE id = ?`,
    [
      status,
      stats.imported || 0,
      stats.updated || 0,
      stats.skipped || 0,
      stats.subjectsCreated || 0,
      errorMessage,
      logId
    ]
  );
}
