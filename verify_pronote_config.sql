-- Vérifier les colonnes de pronote_config
DESCRIBE pronote_config;

-- Vérifier si les colonnes existent
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config';
