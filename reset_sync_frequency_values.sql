-- Mettre à jour toutes les valeurs existantes avec 'daily' par défaut
UPDATE pronote_config SET sync_frequency = 'daily';

-- Vérification
SELECT id, user_id, sync_frequency FROM pronote_config;
