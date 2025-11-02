-- Supprimer la colonne sync_frequency (type int incorrect)
ALTER TABLE pronote_config DROP COLUMN sync_frequency;

-- Recréer avec le bon type ENUM
ALTER TABLE pronote_config ADD COLUMN sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily';

-- Vérification
SHOW COLUMNS FROM pronote_config LIKE 'sync_frequency';
SELECT id, user_id, sync_frequency FROM pronote_config;
