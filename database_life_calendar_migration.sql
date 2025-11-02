-- ============================================
-- Script de migration complet Life Calendar
-- ============================================

-- 1. Table life_calendar_events
CREATE TABLE IF NOT EXISTS life_calendar_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('course', 'homework', 'sport', 'leisure', 'personal', 'sleep', 'meal', 'other') NOT NULL DEFAULT 'personal',
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern ENUM('daily', 'weekly', 'monthly', 'none') DEFAULT 'none',
  recurrence_end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, start_time),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table life_calendar_templates
CREATE TABLE IF NOT EXISTS life_calendar_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table life_calendar_template_events
CREATE TABLE IF NOT EXISTS life_calendar_template_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category ENUM('course', 'homework', 'sport', 'leisure', 'personal', 'sleep', 'meal', 'other') NOT NULL DEFAULT 'personal',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  day_of_week TINYINT CHECK (day_of_week BETWEEN 0 AND 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES life_calendar_templates(id) ON DELETE CASCADE,
  INDEX idx_template (template_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vérification
SELECT 'Migration Life Calendar terminée avec succès!' AS status;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME LIKE 'life_calendar%';
