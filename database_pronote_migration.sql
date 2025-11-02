-- =============================================
-- Migration: Pronote Synchronization System
-- Date: 2025-10-18
-- Description: Tables for storing Pronote credentials and sync logs
-- =============================================

-- Table: pronote_config
-- Stores encrypted Pronote credentials per user
CREATE TABLE IF NOT EXISTS pronote_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    instance_url VARCHAR(500) NOT NULL COMMENT 'URL of Pronote instance',
    username VARCHAR(255) NOT NULL COMMENT 'Pronote username',
    encrypted_password TEXT NOT NULL COMMENT 'Encrypted password (AES-256)',
    device_uuid VARCHAR(255) NOT NULL COMMENT 'Device UUID for Pronote mobile auth',
    access_token TEXT COMMENT 'JWT access token from Pronote',
    refresh_token TEXT COMMENT 'Refresh token for renewing session',
    cas_url VARCHAR(500) COMMENT 'ENT CAS URL if applicable',
    cas_token VARCHAR(255) COMMENT 'ENT CAS token if applicable',
    account_kind ENUM('STUDENT', 'PARENT', 'TEACHER') DEFAULT 'STUDENT',
    last_sync TIMESTAMP NULL COMMENT 'Last successful sync timestamp',
    auto_sync BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic daily sync',
    sync_frequency INT DEFAULT 24 COMMENT 'Sync frequency in hours',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Is config active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_pronote (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pronote_sync_logs
-- Stores history of sync operations
CREATE TABLE IF NOT EXISTS pronote_sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sync_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_completed_at TIMESTAMP NULL,
    status ENUM('pending', 'in_progress', 'success', 'error', 'partial') DEFAULT 'pending',
    assignments_imported INT DEFAULT 0 COMMENT 'Number of assignments imported',
    assignments_updated INT DEFAULT 0 COMMENT 'Number of assignments updated',
    assignments_skipped INT DEFAULT 0 COMMENT 'Number of assignments skipped (duplicates)',
    subjects_created INT DEFAULT 0 COMMENT 'Number of subjects auto-created',
    error_message TEXT COMMENT 'Error details if sync failed',
    metadata JSON COMMENT 'Additional sync metadata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sync (user_id, sync_started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pronote_assignment_mapping
-- Maps Pronote assignments to local assignments (for duplicate detection)
CREATE TABLE IF NOT EXISTS pronote_assignment_mapping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    local_assignment_id INT NOT NULL COMMENT 'Local assignment ID in assignments table',
    pronote_id VARCHAR(255) NOT NULL COMMENT 'Pronote unique assignment ID',
    pronote_subject_name VARCHAR(255) COMMENT 'Subject name from Pronote',
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (local_assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pronote_assignment (user_id, pronote_id),
    INDEX idx_local_assignment (local_assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_pronote_config_active ON pronote_config(user_id, is_active);
CREATE INDEX idx_sync_logs_status ON pronote_sync_logs(status, sync_started_at);
CREATE INDEX idx_sync_logs_user_recent ON pronote_sync_logs(user_id, sync_started_at DESC);

-- =============================================
-- Sample queries for testing
-- =============================================

-- Get user's Pronote config
-- SELECT * FROM pronote_config WHERE user_id = ? AND is_active = 1;

-- Get recent sync logs
-- SELECT * FROM pronote_sync_logs WHERE user_id = ? ORDER BY sync_started_at DESC LIMIT 10;

-- Get sync statistics
-- SELECT 
--     COUNT(*) as total_syncs,
--     SUM(assignments_imported) as total_imported,
--     SUM(assignments_updated) as total_updated,
--     MAX(sync_completed_at) as last_sync
-- FROM pronote_sync_logs 
-- WHERE user_id = ? AND status = 'success';
