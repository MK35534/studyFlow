-- Mettre à jour toutes les lignes existantes de pronote_config avec les valeurs par défaut

UPDATE pronote_config 
SET 
  sync_homework = COALESCE(sync_homework, 1),
  sync_timetable = COALESCE(sync_timetable, 1),
  sync_grades = COALESCE(sync_grades, 0),
  auto_sync = COALESCE(auto_sync, 1),
  sync_frequency = COALESCE(sync_frequency, 'daily')
WHERE user_id IS NOT NULL;

-- Vérification
SELECT id, user_id, sync_homework, sync_timetable, sync_grades, auto_sync, sync_frequency 
FROM pronote_config;
