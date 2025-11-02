-- Diagnostic complet de la colonne sync_frequency

-- 1. Voir le type de colonne
SHOW COLUMNS FROM pronote_config LIKE 'sync_frequency';

-- 2. Voir toutes les valeurs actuelles
SELECT id, user_id, sync_frequency FROM pronote_config;

-- 3. Si le type n'est pas ENUM, le forcer :
-- ALTER TABLE pronote_config DROP COLUMN sync_frequency;
-- ALTER TABLE pronote_config ADD COLUMN sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily';
