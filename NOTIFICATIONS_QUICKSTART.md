# 🚀 Guide de démarrage rapide - Notifications

## ⚡ Installation en 3 étapes

### 1️⃣ Exécuter la migration SQL
```bash
mysql -u root -p studyflow_db < database_notifications_migration.sql
```

### 2️⃣ Vérifier la création de la table
```bash
mysql -u root -p studyflow_db
```
```sql
DESCRIBE notifications;
SELECT COUNT(*) FROM notifications;
```

### 3️⃣ Tester dans l'application
1. Démarrer le serveur : `npm run dev`
2. Se connecter
3. Cliquer sur la cloche 🔔 dans le header
4. Vérifier que le panel s'ouvre

---

## 🎯 Utilisation dans le code

### Dans un composant Vue

```vue
<script setup>
import { onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const { 
  notifications, 
  unreadCount, 
  generateNotifications,
  loadNotifications 
} = useNotifications()

onMounted(async () => {
  // Générer les notifications basées sur les devoirs
  await generateNotifications()
  
  // Ou charger les existantes
  await loadNotifications()
})
</script>

<template>
  <div>
    <p>Vous avez {{ unreadCount }} notification(s) non lue(s)</p>
    
    <div v-for="notif in notifications" :key="notif.id">
      {{ notif.title }} - {{ notif.message }}
    </div>
  </div>
</template>
```

### Intégrer le NotificationCenter

```vue
<template>
  <div>
    <!-- Bouton cloche -->
    <NotificationBell />
    
    <!-- Le panel NotificationCenter est déjà inclus dans NotificationBell -->
  </div>
</template>

<script setup>
// Rien à importer, le composant gère tout !
</script>
```

---

## 🧪 Tester les API endpoints

### Via fetch dans la console du navigateur

```javascript
// 1. Générer les notifications
const token = localStorage.getItem('studyflow-token')

await fetch('/api/notifications/generate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log)

// 2. Récupérer les notifications
await fetch('/api/notifications', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log)

// 3. Marquer toutes comme lues
await fetch('/api/notifications/mark-all-read', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log)
```

---

## 🎨 Personnaliser les notifications

### Créer une notification personnalisée

```javascript
// Via l'API directement (si besoin)
await $fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: {
    type: 'success',
    title: '🎉 Bravo !',
    message: 'Vous avez terminé tous vos devoirs',
    assignment_id: null
  }
})
```

---

## 🔔 Déclencher une génération automatique

### Depuis n'importe quelle page

```vue
<script setup>
import { useNotifications } from '~/composables/useNotifications'

const { generateNotifications } = useNotifications()

// Après création/modification d'un devoir
const handleAssignmentUpdate = async () => {
  // ... sauvegarder le devoir ...
  
  // Régénérer les notifications
  await generateNotifications()
}
</script>
```

---

## 📊 Vérifier l'état dans la console

```javascript
// Dans la console du navigateur
import { useNotifications } from '~/composables/useNotifications'
const { notifications, unreadCount } = useNotifications()

console.log('Notifications:', notifications.value)
console.log('Non lues:', unreadCount.value)
```

---

## 🐛 Debugging

### Problème : Le badge ne s'affiche pas

**Solution :**
1. Vérifier que la table `notifications` existe
2. Vérifier qu'il y a des devoirs non complétés
3. Appeler manuellement `generateNotifications()`
4. Vérifier dans la console les erreurs API

### Problème : Panel ne s'ouvre pas

**Solution :**
1. Vérifier que `NotificationCenter.vue` est bien importé
2. Vérifier les erreurs console
3. Vérifier le z-index (doit être 9999)

### Problème : Notifications vides

**Solution :**
1. Créer des devoirs avec deadline proche
2. Appeler `/api/notifications/generate` manuellement
3. Vérifier les logs serveur

---

## ✅ Checklist de vérification

- [ ] Table `notifications` créée dans MySQL
- [ ] 6 endpoints API fonctionnels
- [ ] NotificationBell affiche le badge
- [ ] Clic sur la cloche ouvre le panel
- [ ] Les notifications s'affichent correctement
- [ ] Dark mode fonctionne
- [ ] Actions (marquer lu, supprimer) fonctionnent
- [ ] Génération automatique fonctionne
- [ ] Responsive sur mobile

---

## 🎉 C'est prêt !

Le système de notifications est maintenant complètement opérationnel.

**Pour aller plus loin :**
- Voir `NOTIFICATIONS_COMPLETE.md` pour la documentation complète
- Voir `ROADMAP.md` pour les prochaines étapes
