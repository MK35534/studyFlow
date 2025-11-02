-- Ajouter les colonnes de configuration de synchronisation
ALTER TABLE pronote_config
ADD COLUMN IF NOT EXISTS sync_homework BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sync_timetable BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sync_grades BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_sync BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily';

-- Vérification
SELECT 'Colonnes de configuration ajoutées avec succès!' AS status;
DESCRIBE pronote_config;
