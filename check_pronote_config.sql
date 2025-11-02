-- Vérifier la configuration Pronote sauvegardée
SELECT 
    id,
    user_id,
    sync_homework,
    sync_timetable,
    sync_grades,
    auto_sync,
    sync_frequency,
    created_at,
    updated_at
FROM pronote_config
ORDER BY updated_at DESC;
