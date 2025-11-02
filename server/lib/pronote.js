// =============================================
// Pronote Utilities - Encryption & Helper Functions
// =============================================

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.PRONOTE_ENCRYPTION_KEY || 'your-32-char-secret-key-change-this-in-production!!'; // Must be 32 chars
const IV_LENGTH = 16; // AES block size

/**
 * Encrypt sensitive data (passwords)
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted text in format: iv:encryptedData
 */
export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 * @param {string} text - Encrypted text in format: iv:encryptedData
 * @returns {string} Decrypted plain text
 */
export function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    iv
  );
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate a unique device UUID for Pronote authentication
 * @returns {string} UUID v4
 */
export function generateDeviceUUID() {
  return crypto.randomUUID();
}

/**
 * Sanitize Pronote URL
 * @param {string} url - Raw URL input
 * @returns {string} Cleaned URL
 */
export function sanitizePronoteURL(url) {
  let cleanUrl = url.trim();
  
  // Remove trailing slashes
  cleanUrl = cleanUrl.replace(/\/+$/, '');
  
  // Ensure https://
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  
  // Handle common Pronote URL patterns
  if (!cleanUrl.includes('/pronote/') && !cleanUrl.includes('index-education.net')) {
    // Try to append /pronote/eleve.html if it's a base domain
    if (!cleanUrl.endsWith('.html')) {
      cleanUrl += '/pronote/eleve.html';
    }
  }
  
  return cleanUrl;
}

/**
 * Detect duplicate assignments based on title, subject, and deadline
 * @param {Object} pronoteAssignment - Assignment from Pronote
 * @param {Array} existingAssignments - User's existing assignments
 * @returns {Object|null} Matching local assignment or null
 */
export function findDuplicateAssignment(pronoteAssignment, existingAssignments) {
  const pronoteTitle = pronoteAssignment.title.toLowerCase().trim();
  const pronoteDeadline = new Date(pronoteAssignment.deadline).toDateString();
  
  return existingAssignments.find(local => {
    const localTitle = local.title.toLowerCase().trim();
    const localDeadline = new Date(local.deadline).toDateString();
    
    // Same title + same deadline = duplicate
    const titleMatch = localTitle === pronoteTitle || 
                      localTitle.includes(pronoteTitle) || 
                      pronoteTitle.includes(localTitle);
    
    const deadlineMatch = localDeadline === pronoteDeadline;
    
    return titleMatch && deadlineMatch;
  });
}

/**
 * Map Pronote subject name to local subject
 * @param {string} pronoteSubject - Subject name from Pronote
 * @param {Array} localSubjects - User's local subjects
 * @returns {Object|null} Matching local subject or null
 */
export function mapPronoteSubject(pronoteSubject, localSubjects) {
  const cleanPronote = pronoteSubject.toLowerCase().trim();
  
  return localSubjects.find(subject => {
    const cleanLocal = subject.name.toLowerCase().trim();
    return cleanLocal === cleanPronote || 
           cleanLocal.includes(cleanPronote) || 
           cleanPronote.includes(cleanLocal);
  });
}

/**
 * Generate color for new subject based on name
 * @param {string} subjectName - Name of the subject
 * @returns {string} Color from predefined palette
 */
export function generateSubjectColor(subjectName) {
  const colors = [
    'blue', 'green', 'purple', 'red', 'orange', 'pink', 
    'cyan', 'indigo', 'teal', 'lime', 'amber', 'rose'
  ];
  
  // Generate consistent color based on subject name hash
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Parse Pronote HTML content to plain text
 * @param {string} html - HTML content from Pronote
 * @returns {string} Plain text
 */
export function stripHTML(html) {
  if (!html) return '';
  
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Format sync result for logging
 * @param {Object} result - Sync result object
 * @returns {string} Formatted message
 */
export function formatSyncResult(result) {
  const parts = [];
  
  if (result.imported > 0) parts.push(`${result.imported} importés`);
  if (result.updated > 0) parts.push(`${result.updated} mis à jour`);
  if (result.skipped > 0) parts.push(`${result.skipped} ignorés`);
  if (result.subjectsCreated > 0) parts.push(`${result.subjectsCreated} matières créées`);
  
  return parts.length > 0 ? parts.join(', ') : 'Aucun changement';
}
