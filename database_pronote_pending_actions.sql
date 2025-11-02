-- Create table for pending Pronote actions (mark homework done/undone)
-- These actions will be executed during the next Pronote sync

CREATE TABLE IF NOT EXISTS pronote_pending_actions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  assignment_id INT NOT NULL,
  action_type ENUM('mark_done', 'mark_undone') NOT NULL,
  pronote_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL DEFAULT NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  
  INDEX idx_user_pending (user_id, processed_at),
  INDEX idx_assignment (assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
