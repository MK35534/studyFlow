-- Script de test pour la table focus_sessions
-- À exécuter après avoir créé la table principale

-- Insérer des données de test
INSERT INTO focus_sessions (user_id, session_type, duration, assignment_id, completed_at)
VALUES 
  (1, 'focus', 25, 1, NOW() - INTERVAL 2 HOUR),
  (1, 'short-break', 5, NULL, NOW() - INTERVAL 1 HOUR),
  (1, 'focus', 25, 2, NOW() - INTERVAL 30 MINUTE),
  (1, 'short-break', 5, NULL, NOW() - INTERVAL 5 MINUTE);

-- Vérifier les données
SELECT 
  fs.id,
  fs.session_type,
  fs.duration,
  fs.completed_at,
  a.title as assignment_title
FROM focus_sessions fs
LEFT JOIN assignments a ON fs.assignment_id = a.id
WHERE fs.user_id = 1
ORDER BY fs.completed_at DESC;

-- Statistiques du jour
SELECT 
  COUNT(*) as total_sessions,
  SUM(CASE WHEN session_type = 'focus' THEN duration ELSE 0 END) as total_focus_minutes,
  COUNT(CASE WHEN session_type = 'focus' THEN 1 END) as focus_sessions
FROM focus_sessions
WHERE user_id = 1
  AND DATE(completed_at) = CURDATE();

-- Nettoyer les données de test (optionnel)
-- DELETE FROM focus_sessions WHERE user_id = 1;
