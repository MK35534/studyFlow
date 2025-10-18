-- Table pour stocker les sessions de focus/Pomodoro
CREATE TABLE IF NOT EXISTS focus_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  session_type VARCHAR(20) NOT NULL, -- 'focus', 'short-break', 'long-break'
  duration INT NOT NULL, -- Durée en minutes
  assignment_id INT NULL, -- Référence optionnelle à un devoir
  completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE SET NULL,
  
  INDEX idx_user_date (user_id, completed_at),
  INDEX idx_session_type (session_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter un commentaire sur la table
ALTER TABLE focus_sessions COMMENT = 'Historique des sessions de focus et pauses Pomodoro';
