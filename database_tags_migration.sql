-- Migration pour le système de tags
-- Date: 2025-10-18
-- Description: Ajoute les tables pour gérer les tags personnalisés des devoirs

-- Table des tags
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_tag (user_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table de liaison entre devoirs et tags (relation many-to-many)
CREATE TABLE IF NOT EXISTS assignment_tags (
  assignment_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assignment_id, tag_id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour optimiser les requêtes
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_assignment_tags_assignment ON assignment_tags(assignment_id);
CREATE INDEX idx_assignment_tags_tag ON assignment_tags(tag_id);

-- Insertion de quelques tags par défaut (optionnel)
-- Ces tags seront créés pour chaque nouvel utilisateur lors de l'inscription
-- Pour l'instant, on les laisse être créés manuellement par l'utilisateur
