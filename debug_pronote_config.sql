-- Vérifier TOUTES les configs avec les user_id
SELECT 
    pc.id,
    pc.user_id,
    pc.sync_homework,
    pc.sync_timetable,
    pc.sync_grades,
    pc.auto_sync,
    pc.sync_frequency
FROM pronote_config pc
ORDER BY pc.id;

-- Voir tous les users
SELECT * FROM users LIMIT 5;
