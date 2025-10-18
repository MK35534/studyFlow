-- ================================================
-- Migration: Système de Notifications
-- Date: 18 octobre 2025
-- Description: Table pour notifications intelligentes
-- ================================================

-- Table principale des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('urgent', 'warning', 'success', 'info') NOT NULL DEFAULT 'info',
  title VARCHAR(255) NOT NULL,
  message TEXT,
  assignment_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Contraintes de clés étrangères
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  
  -- Index pour optimiser les requêtes
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_assignment (assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Instructions d'exécution
-- ================================================
-- 1. Se connecter à MySQL :
--    mysql -u root -p studyflow_db
--
-- 2. Exécuter ce fichier :
--    source database_notifications_migration.sql
--
-- 3. Vérifier la création :
--    DESCRIBE notifications;
--    SELECT COUNT(*) FROM notifications;
-- ================================================
