-- Version simplifiée et directe (peut générer des erreurs si colonnes existent déjà, mais c'est normal)

ALTER TABLE pronote_config ADD COLUMN sync_homework BOOLEAN DEFAULT TRUE;
ALTER TABLE pronote_config ADD COLUMN sync_timetable BOOLEAN DEFAULT TRUE;
ALTER TABLE pronote_config ADD COLUMN sync_grades BOOLEAN DEFAULT FALSE;
ALTER TABLE pronote_config ADD COLUMN auto_sync BOOLEAN DEFAULT TRUE;
ALTER TABLE pronote_config ADD COLUMN sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily';

-- Si vous avez des erreurs "Duplicate column name", c'est normal, ça veut dire que les colonnes existent déjà

-- Vérification
DESCRIBE pronote_config;
