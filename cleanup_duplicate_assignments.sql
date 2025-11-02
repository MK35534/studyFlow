-- Nettoyage des devoirs dupliqués dans StudyFlow
-- Ce script supprime les doublons en gardant le devoir le plus récent (ID le plus élevé)

-- 1. Supprimer d'abord les mappings orphelins
DELETE FROM pronote_assignment_mapping 
WHERE local_assignment_id NOT IN (SELECT id FROM assignments);

-- 2. Identifier et supprimer les devoirs dupliqués
-- Un doublon = même titre, même date d'échéance, même utilisateur
DELETE a1 FROM assignments a1
INNER JOIN assignments a2 
WHERE a1.user_id = a2.user_id
  AND a1.title = a2.title
  AND DATE(a1.due_date) = DATE(a2.due_date)
  AND a1.id < a2.id;  -- Garde le plus récent (ID le plus grand)

-- 3. Nettoyer les mappings qui pointent vers des devoirs supprimés
DELETE FROM pronote_assignment_mapping 
WHERE local_assignment_id NOT IN (SELECT id FROM assignments);

-- 4. Afficher le résultat
SELECT 
    user_id,
    COUNT(*) as total_devoirs,
    SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as devoirs_completes,
    SUM(CASE WHEN is_completed = 0 THEN 1 ELSE 0 END) as devoirs_en_cours
FROM assignments
GROUP BY user_id;
