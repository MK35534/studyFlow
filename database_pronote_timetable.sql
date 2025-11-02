-- Table pour stocker l'emploi du temps Pronote
CREATE TABLE IF NOT EXISTS pronote_timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  teacher VARCHAR(255),
  classroom VARCHAR(100),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  week_number INT,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, start_time),
  INDEX idx_week (user_id, week_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vérification
SELECT 'Table pronote_timetable créée avec succès!' AS status;
DESCRIBE pronote_timetable;
