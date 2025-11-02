-- Vérifier le type actuel de sync_frequency
SELECT COLUMN_NAME, COLUMN_TYPE, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'studyflow' 
AND TABLE_NAME = 'pronote_config' 
AND COLUMN_NAME = 'sync_frequency';

-- Modifier le type de colonne pour qu'elle soit ENUM au lieu d'INTEGER
ALTER TABLE pronote_config 
MODIFY COLUMN sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily';

-- Vérification
DESCRIBE pronote_config;
