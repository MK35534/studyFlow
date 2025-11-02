-- Nettoyer les logs de synchronisation bloqués en "in_progress"
-- Ces logs sont créés au début d'une synchro mais jamais finalisés si erreur

UPDATE pronote_sync_logs 
SET status = 'error',
    error_message = 'Synchronisation interrompue',
    sync_completed_at = NOW()
WHERE status = 'in_progress'
  AND sync_started_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE);

-- Afficher le résultat
SELECT 
  id,
  user_id,
  sync_started_at,
  status,
  error_message
FROM pronote_sync_logs
ORDER BY sync_started_at DESC
LIMIT 10;
