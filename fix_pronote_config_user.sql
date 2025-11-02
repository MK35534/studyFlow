-- Créer la config Pronote pour le bon user (user_id 6)
-- D'abord, récupérer la config existante du user 5
SELECT * FROM pronote_config WHERE user_id = 5;

-- Créer une copie pour le user 6
INSERT INTO pronote_config 
(user_id, instance_url, username, encrypted_password, device_uuid, account_kind, sync_homework, sync_timetable, sync_grades, auto_sync, sync_frequency, is_active)
SELECT 
  6, -- Nouveau user_id
  instance_url, 
  username, 
  encrypted_password, 
  device_uuid, 
  account_kind, 
  1, -- sync_homework
  1, -- sync_timetable
  0, -- sync_grades
  1, -- auto_sync
  'hourly', -- sync_frequency
  1 -- is_active
FROM pronote_config 
WHERE user_id = 5;

-- Vérifier
SELECT id, user_id, sync_homework, sync_timetable, auto_sync, sync_frequency FROM pronote_config;
