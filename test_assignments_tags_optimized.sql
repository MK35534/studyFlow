-- 🧪 Test de la nouvelle API optimisée pour les devoirs avec tags
-- À exécuter dans MySQL Workbench ou phpMyAdmin

-- 1. Vérifier la structure des tables
DESCRIBE assignments;
DESCRIBE tags;
DESCRIBE assignment_tags;

-- 2. Créer des données de test (si besoin)
-- Remplace USER_ID par ton vrai user_id
SET @USER_ID = 1;
SET @SUBJECT_ID = 1; -- Remplace par un subject_id valide

-- Créer quelques devoirs de test
INSERT INTO assignments (user_id, subject_id, title, description, due_date, is_completed) VALUES
(@USER_ID, @SUBJECT_ID, 'Devoir Test 1', 'Exercices chapitre 3', DATE_ADD(NOW(), INTERVAL 3 DAY), FALSE),
(@USER_ID, @SUBJECT_ID, 'Devoir Test 2', 'Révisions', DATE_ADD(NOW(), INTERVAL 5 DAY), FALSE),
(@USER_ID, @SUBJECT_ID, 'Devoir Test 3', 'DM final', DATE_ADD(NOW(), INTERVAL 7 DAY), FALSE);

-- Créer quelques tags
INSERT INTO tags (user_id, name, color) VALUES
(@USER_ID, 'Urgent', '#ef4444'),
(@USER_ID, 'Important', '#f59e0b'),
(@USER_ID, 'Facile', '#10b981');

-- Associer des tags aux devoirs
INSERT INTO assignment_tags (assignment_id, tag_id)
SELECT a.id, t.id
FROM assignments a, tags t
WHERE a.user_id = @USER_ID
  AND t.user_id = @USER_ID
  AND a.title LIKE 'Devoir Test%'
LIMIT 5;

-- 3. Test de la requête optimisée (celle utilisée par le backend)
-- Cette requête simule ce que fait l'API GET /api/assignments

-- Étape 1: Récupérer les devoirs
SELECT a.*, s.name as subject_name, s.color as subject_color 
FROM assignments a 
LEFT JOIN subjects s ON a.subject_id = s.id 
WHERE a.user_id = @USER_ID
ORDER BY a.due_date ASC, a.created_at DESC;

-- Étape 2: Récupérer tous les tags pour ces devoirs
-- (remplace les ? par les IDs des devoirs retournés ci-dessus)
SELECT at.assignment_id, t.id, t.name, t.color
FROM assignment_tags at
INNER JOIN tags t ON at.tag_id = t.id
WHERE at.assignment_id IN (
  SELECT id FROM assignments WHERE user_id = @USER_ID
)
ORDER BY t.name ASC;

-- 4. Vérifier les stats
SELECT 
  'Total devoirs' as Métrique,
  COUNT(*) as Valeur
FROM assignments
WHERE user_id = @USER_ID

UNION ALL

SELECT 
  'Total tags',
  COUNT(*)
FROM tags
WHERE user_id = @USER_ID

UNION ALL

SELECT 
  'Total associations devoir-tag',
  COUNT(*)
FROM assignment_tags at
INNER JOIN assignments a ON at.assignment_id = a.id
WHERE a.user_id = @USER_ID;

-- 5. Test de performance: comptage par tag
SELECT 
  t.name as Tag,
  t.color as Couleur,
  COUNT(at.assignment_id) as 'Nombre de devoirs'
FROM tags t
LEFT JOIN assignment_tags at ON t.id = at.tag_id
WHERE t.user_id = @USER_ID
GROUP BY t.id, t.name, t.color
ORDER BY COUNT(at.assignment_id) DESC;

-- 6. Nettoyer les données de test (optionnel)
-- ATTENTION: Décommente seulement si tu veux supprimer les données de test
/*
DELETE FROM assignments WHERE title LIKE 'Devoir Test%' AND user_id = @USER_ID;
DELETE FROM tags WHERE name IN ('Urgent', 'Important', 'Facile') AND user_id = @USER_ID;
*/

-- 7. Résultat attendu
-- Tu devrais voir:
-- ✅ Chaque devoir avec sa matière (subject_name, subject_color)
-- ✅ Les tags associés regroupés par assignment_id
-- ✅ Temps d'exécution rapide (< 50ms pour 100 devoirs)
