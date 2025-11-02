-- Migration alternative pour pronote_config (compatible toutes versions MySQL)

-- Méthode sûre : on vérifie d'abord si la colonne existe avant de l'ajouter

-- Étape 1 : Ajouter sync_homework
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config' 
AND COLUMN_NAME = 'sync_homework';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE pronote_config ADD COLUMN sync_homework BOOLEAN DEFAULT TRUE',
  'SELECT "sync_homework already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Étape 2 : Ajouter sync_timetable
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config' 
AND COLUMN_NAME = 'sync_timetable';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE pronote_config ADD COLUMN sync_timetable BOOLEAN DEFAULT TRUE',
  'SELECT "sync_timetable already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Étape 3 : Ajouter sync_grades
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config' 
AND COLUMN_NAME = 'sync_grades';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE pronote_config ADD COLUMN sync_grades BOOLEAN DEFAULT FALSE',
  'SELECT "sync_grades already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Étape 4 : Ajouter auto_sync
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config' 
AND COLUMN_NAME = 'auto_sync';

SET @query = IF(@col_exists = 0, 
  'ALTER TABLE pronote_config ADD COLUMN auto_sync BOOLEAN DEFAULT TRUE',
  'SELECT "auto_sync already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Étape 5 : Ajouter sync_frequency
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config' 
AND COLUMN_NAME = 'sync_frequency';

SET @query = IF(@col_exists = 0, 
  "ALTER TABLE pronote_config ADD COLUMN sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily'",
  'SELECT "sync_frequency already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérification finale
SELECT 'Migration terminée!' AS status;
DESCRIBE pronote_config;
