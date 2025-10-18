# 🧪 Script de test complet - Notifications

## Test rapide dans la console du navigateur

Ouvrez la console (F12) et exécutez ces commandes :

### 1. Vérifier que le token existe
```javascript
const token = localStorage.getItem('studyflow-token')
console.log('Token:', token ? '✅ Présent' : '❌ Absent')
```

### 2. Générer des notifications
```javascript
const response = await fetch('/api/notifications/generate', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

console.log('✅ Résultat génération:', response)
```

### 3. Récupérer toutes les notifications
```javascript
const notifications = await fetch('/api/notifications', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

console.log('✅ Notifications:', notifications)
console.log(`📊 Total: ${notifications.total} | Non-lues: ${notifications.unread_count}`)
```

### 4. Récupérer uniquement les non-lues
```javascript
const unread = await fetch('/api/notifications?unread_only=true', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

console.log('✅ Non-lues:', unread.notifications)
```

### 5. Marquer une notification comme lue
```javascript
// Remplacer '1' par l'ID de votre notification
const markRead = await fetch('/api/notifications/1/read', {
  method: 'PATCH',
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ is_read: true })
}).then(r => r.json())

console.log('✅ Marquée comme lue:', markRead)
```

### 6. Marquer toutes comme lues
```javascript
const markAll = await fetch('/api/notifications/mark-all-read', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

console.log('✅ Toutes marquées:', markAll)
```

### 7. Supprimer une notification
```javascript
// Remplacer '1' par l'ID de votre notification
const deleteOne = await fetch('/api/notifications/1', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

console.log('✅ Supprimée:', deleteOne)
```

### 8. Supprimer toutes les notifications
```javascript
const deleteAll = await fetch('/api/notifications/clear-all', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ read_only: false })
}).then(r => r.json())

console.log('✅ Toutes supprimées:', deleteAll)
```

---

## Test via le composable useNotifications

```javascript
// Dans un composant Vue ou dans la console si disponible
import { useNotifications } from '~/composables/useNotifications'

const { 
  notifications, 
  unreadCount, 
  loadNotifications,
  generateNotifications,
  markAllAsRead,
  clearAll
} = useNotifications()

// Générer
await generateNotifications()
console.log('✅ Notifications générées')

// Charger
await loadNotifications()
console.log('📊 Notifications:', notifications.value)
console.log('🔔 Non-lues:', unreadCount.value)

// Marquer toutes comme lues
await markAllAsRead()
console.log('✅ Toutes marquées comme lues')

// Supprimer toutes
await clearAll()
console.log('✅ Toutes supprimées')
```

---

## Test complet automatisé

Copiez-collez ce script complet dans la console :

```javascript
(async function testNotifications() {
  console.log('🚀 Début des tests...\n')
  
  const token = localStorage.getItem('studyflow-token')
  if (!token) {
    console.error('❌ Pas de token trouvé')
    return
  }
  
  const headers = { 'Authorization': `Bearer ${token}` }
  
  try {
    // Test 1: Générer
    console.log('1️⃣ Test génération...')
    const gen = await fetch('/api/notifications/generate', {
      method: 'POST',
      headers
    }).then(r => r.json())
    console.log('✅ Génération:', gen.message)
    
    // Test 2: Récupérer
    console.log('\n2️⃣ Test récupération...')
    const all = await fetch('/api/notifications', { headers }).then(r => r.json())
    console.log(`✅ Total: ${all.total} | Non-lues: ${all.unread_count}`)
    
    if (all.notifications.length > 0) {
      // Test 3: Marquer comme lu
      console.log('\n3️⃣ Test marquer comme lu...')
      const firstId = all.notifications[0].id
      const read = await fetch(`/api/notifications/${firstId}/read`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true })
      }).then(r => r.json())
      console.log('✅ Marquée comme lue:', read.message)
      
      // Test 4: Marquer toutes
      console.log('\n4️⃣ Test marquer toutes...')
      const markAll = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers
      }).then(r => r.json())
      console.log('✅ Toutes marquées:', markAll.message)
      
      // Test 5: Supprimer une
      console.log('\n5️⃣ Test suppression...')
      const del = await fetch(`/api/notifications/${firstId}`, {
        method: 'DELETE',
        headers
      }).then(r => r.json())
      console.log('✅ Supprimée:', del.message)
    }
    
    console.log('\n🎉 Tous les tests réussis !')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
})()
```

---

## Checklist de vérification visuelle

### Dans l'interface
- [ ] La cloche affiche un badge avec le nombre de non-lues
- [ ] Le badge est bleu pour notifications normales
- [ ] Le badge est rouge avec animation pulse pour urgences
- [ ] Clic sur la cloche → Panel s'ouvre de la droite
- [ ] Les notifications s'affichent avec couleurs appropriées :
  - [ ] Rouge = urgent (en retard / aujourd'hui)
  - [ ] Orange = warning (demain)
  - [ ] Bleu = info (2-3 jours)
- [ ] Les icônes correspondent au type
- [ ] Les dates sont formatées correctement ("Il y a X min")
- [ ] Les infos de devoir (matière + couleur) s'affichent
- [ ] Clic sur notification → Toggle read/unread
- [ ] Bouton poubelle → Supprime la notification
- [ ] "Tout marquer lu" → Toutes deviennent lues
- [ ] "Tout supprimer" → Demande confirmation puis supprime
- [ ] Panel est responsive (fullscreen sur mobile)
- [ ] Dark mode fonctionne partout

### Backend
- [ ] Table `notifications` existe dans MySQL
- [ ] Index sont créés
- [ ] Relations FK fonctionnent
- [ ] Génération automatique fonctionne
- [ ] Pas de doublons créés
- [ ] Nettoyage auto des anciennes (> 30j)

---

## Débogage rapide

### Problème : Badge ne s'affiche pas
```javascript
// Vérifier le compteur
const count = await fetch('/api/notifications?unread_only=true', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

console.log('Compteur non-lues:', count.unread_count)
```

### Problème : Aucune notification générée
```javascript
// Vérifier les devoirs
const assignments = await fetch('/api/assignments', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('studyflow-token')}` }
}).then(r => r.json())

const pending = assignments.data.filter(a => !a.is_completed)
console.log('Devoirs non complétés:', pending.length)
console.log('Devoirs:', pending.map(a => ({
  title: a.title,
  dueDate: a.due_date,
  daysLeft: Math.ceil((new Date(a.due_date) - new Date()) / (1000*60*60*24))
})))
```

### Problème : Erreur API
```javascript
// Vérifier le token
const token = localStorage.getItem('studyflow-token')
console.log('Token valide:', token && token.length > 0)

// Tester un endpoint simple
try {
  const test = await fetch('/api/notifications', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  console.log('Status:', test.status)
  const data = await test.json()
  console.log('Réponse:', data)
} catch (e) {
  console.error('Erreur:', e)
}
```

---

## 🎯 Résultat attendu

Après avoir créé quelques devoirs avec deadlines proches et exécuté la génération :

```
✅ Génération: 3 notification(s) générée(s)
📊 Total: 3 | Non-lues: 3

Notifications générées:
- ⚠️ Devoir en retard ! (urgent/rouge)
- 🔥 À rendre aujourd'hui ! (urgent/rouge)
- ⏰ À rendre demain (warning/orange)
```

Badge sur la cloche : **3** (rouge avec pulse)

---

**Bon test ! 🧪**
