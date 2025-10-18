# 🔍 Debug des Notifications - Checklist

## 1️⃣ Vérifier que vous avez des devoirs

```javascript
const token = localStorage.getItem('token')

// Vérifier les devoirs
const assignments = await fetch('/api/assignments', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())

console.log('📚 Nombre de devoirs:', assignments.data?.length || 0)
console.log('Devoirs:', assignments.data)

// Filtrer les devoirs non complétés
const pending = assignments.data?.filter(a => !a.is_completed) || []
console.log('📝 Devoirs non complétés:', pending.length)

// Afficher les deadlines
pending.forEach(a => {
  const dueDate = new Date(a.due_date)
  const now = new Date()
  const diffDays = Math.ceil((dueDate - now) / (1000*60*60*24))
  console.log(`- ${a.title}: dans ${diffDays} jour(s) (${a.due_date})`)
})
```

---

## 2️⃣ Tester la génération manuelle

```javascript
const token = localStorage.getItem('token')

// Générer les notifications
const result = await fetch('/api/notifications/generate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())

console.log('✅ Résultat génération:', result)
```

---

## 3️⃣ Vérifier les notifications créées

```javascript
const token = localStorage.getItem('token')

// Récupérer toutes les notifications
const notifs = await fetch('/api/notifications', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())

console.log('🔔 Notifications:', notifs)
console.log(`Total: ${notifs.total} | Non-lues: ${notifs.unread_count}`)
```

---

## 4️⃣ Vérifier directement dans MySQL

```sql
-- Se connecter à MySQL
mysql -u root -p studyflow

-- Vérifier la table
SELECT * FROM notifications;

-- Compter les notifications
SELECT COUNT(*) FROM notifications;

-- Vérifier les devoirs non complétés
SELECT id, title, due_date, is_completed FROM assignments WHERE is_completed = FALSE;
```

---

## 5️⃣ Créer une notification de test manuelle

```javascript
const token = localStorage.getItem('token')

// Insérer une notification de test via SQL
// OU créer un devoir avec deadline proche
```

**Via SQL direct :**
```sql
-- Remplacer user_id par votre ID utilisateur
INSERT INTO notifications (user_id, type, title, message, is_read)
VALUES (1, 'urgent', '⚠️ Test notification', 'Ceci est un test', FALSE);
```

---

## 6️⃣ Vérifier les erreurs console

Ouvrez la console (F12) et regardez :
- Y a-t-il des erreurs rouges ?
- Que dit "Erreur génération notifications" ?
- Le token est-il valide ?

---

## 7️⃣ Forcer le rechargement

```javascript
// Recharger le composable
import { useNotifications } from '~/composables/useNotifications'
const { loadNotifications, generateNotifications } = useNotifications()

await generateNotifications()
await loadNotifications()
```

---

## ✅ Checklist rapide

- [ ] La table `notifications` existe dans MySQL
- [ ] Vous avez des devoirs dans la base de données
- [ ] Au moins un devoir est non complété (`is_completed = FALSE`)
- [ ] Au moins un devoir a une deadline proche (< 3 jours)
- [ ] Le token existe dans localStorage (`localStorage.getItem('token')`)
- [ ] Pas d'erreur dans la console
- [ ] L'endpoint `/api/notifications/generate` répond

---

## 🚨 Si rien ne fonctionne

**Créez un devoir de test avec deadline aujourd'hui :**

1. Allez sur la page Devoirs
2. Créez un nouveau devoir
3. Mettez la date d'échéance à aujourd'hui ou hier
4. Sauvegardez
5. Rechargez la page
6. Cliquez sur la cloche 🔔

Ou via SQL :
```sql
-- Insérer un devoir de test
INSERT INTO assignments (user_id, subject_id, title, description, due_date, is_completed)
VALUES (1, 1, 'Devoir TEST', 'Test notifications', CURDATE(), FALSE);
```
