-- Vérifier que la colonne sync_frequency existe et a le bon type
SHOW COLUMNS FROM pronote_config LIKE 'sync_frequency';

-- Vérifier les valeurs actuelles
SELECT user_id, sync_frequency, updated_at 
FROM pronote_config 
ORDER BY updated_at DESC;
