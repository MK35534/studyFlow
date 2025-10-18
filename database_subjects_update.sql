-- Script pour ajouter les nouveaux champs à la table subjects
-- Exécuter avec: mysql -u root -p studyflow < database_subjects_update.sql

USE studyflow;

-- Ajouter le champ teacher (professeur)
ALTER TABLE subjects 
ADD COLUMN teacher VARCHAR(255) NULL AFTER color;

-- Ajouter le champ schedule (emploi du temps, format JSON ou texte)
ALTER TABLE subjects 
ADD COLUMN schedule TEXT NULL AFTER teacher;

-- Ajouter le champ icon (nom de l'icône)
ALTER TABLE subjects 
ADD COLUMN icon VARCHAR(50) DEFAULT 'book' AFTER schedule;

-- Vérifier les colonnes
DESCRIBE subjects;

SELECT 'Migration terminée avec succès!' AS message;
