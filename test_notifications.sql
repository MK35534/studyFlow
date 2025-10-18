-- ================================================
-- Script de test: Notifications
-- Date: 18 octobre 2025
-- Description: Données de test pour le système de notifications
-- ================================================

-- 1. Vérifier la table
DESCRIBE notifications;

-- 2. Insérer quelques notifications de test (remplacer user_id et assignment_id)
-- Note: À exécuter APRÈS avoir créé des utilisateurs et des devoirs

-- Exemple: Notification urgente
INSERT INTO notifications (user_id, type, title, message, assignment_id, is_read)
VALUES (1, 'urgent', '⚠️ Devoir en retard !', 'Mathématiques DM devait être rendu il y a 2 jours', 1, FALSE);

-- Exemple: Notification warning
INSERT INTO notifications (user_id, type, title, message, assignment_id, is_read)
VALUES (1, 'warning', '⏰ À rendre demain', 'Physique TP est à rendre demain', 2, FALSE);

-- Exemple: Notification info
INSERT INTO notifications (user_id, type, title, message, assignment_id, is_read)
VALUES (1, 'info', '📅 Devoir à venir', 'Histoire Exposé est à rendre dans 3 jours', 3, FALSE);

-- Exemple: Notification success (lue)
INSERT INTO notifications (user_id, type, title, message, assignment_id, is_read)
VALUES (1, 'success', '✅ Devoir terminé !', 'Vous avez complété Anglais Essay', 4, TRUE);

-- 3. Vérifier les notifications créées
SELECT * FROM notifications ORDER BY created_at DESC;

-- 4. Compter les non-lues
SELECT COUNT(*) as unread_count FROM notifications WHERE is_read = FALSE;

-- 5. Compter par type
SELECT type, COUNT(*) as count FROM notifications GROUP BY type;

-- 6. Supprimer les notifications de test
-- DELETE FROM notifications WHERE user_id = 1;

-- ================================================
-- Instructions de test via l'API
-- ================================================
-- 1. Générer automatiquement les notifications :
--    POST /api/notifications/generate
--
-- 2. Récupérer toutes les notifications :
--    GET /api/notifications
--
-- 3. Récupérer uniquement les non-lues :
--    GET /api/notifications?unread_only=true
--
-- 4. Marquer une notification comme lue :
--    PATCH /api/notifications/1/read
--    Body: { "is_read": true }
--
-- 5. Marquer toutes comme lues :
--    POST /api/notifications/mark-all-read
--
-- 6. Supprimer une notification :
--    DELETE /api/notifications/1
--
-- 7. Supprimer toutes les notifications :
--    POST /api/notifications/clear-all
--    Body: { "read_only": false }
-- ================================================
