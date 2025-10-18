# 🔍 Debug JWT - Notifications

## Problème : "jwt malformed"

### Causes possibles :
1. ❌ Token vide ou null
2. ❌ Token corrompu dans localStorage
3. ❌ Mauvais format du token (pas "xxx.yyy.zzz")
4. ❌ Token expiré

---

## ✅ Solutions appliquées

### 1. Protection dans `NotificationBell.vue`
```javascript
// Vérifications ajoutées :
- if (process.server) return // Pas de localStorage côté serveur
- if (!token || token === 'null' || token === 'undefined') return
- Nettoyage automatique si token invalide
- Délai de 500ms avant le premier chargement
- Vérification avant chaque refresh automatique
```

### 2. Gestion d'erreurs améliorée
```javascript
catch (error) {
  // Si erreur JWT, nettoyer le localStorage
  if (error.message?.includes('jwt') || error.message?.includes('malformed')) {
    console.warn('⚠️ Token JWT invalide, nettoyage...')
    localStorage.removeItem('token')
  }
}
```

---

## 🧪 Test manuel dans la console

### 1. Vérifier le token actuel
```javascript
// Ouvre la console (F12) et tape :
const token = localStorage.getItem('token')
console.log('Token:', token)

// Tu dois voir quelque chose comme :
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTYzOTU4NDAwMH0.abc123..."
```

### 2. Décoder le token (sans le secret)
```javascript
// Pour voir ce qu'il contient :
const parts = token.split('.')
if (parts.length === 3) {
  const payload = JSON.parse(atob(parts[1]))
  console.log('Payload JWT:', payload)
  // Tu dois voir : { userId: 1, email: "...", iat: ..., exp: ... }
} else {
  console.error('❌ Token malformé ! Il n\'a pas 3 parties')
}
```

### 3. Vérifier l'expiration
```javascript
const parts = token.split('.')
if (parts.length === 3) {
  const payload = JSON.parse(atob(parts[1]))
  const now = Math.floor(Date.now() / 1000)
  
  if (payload.exp && payload.exp < now) {
    console.error('❌ Token expiré depuis', new Date(payload.exp * 1000))
  } else if (payload.exp) {
    console.log('✅ Token valide jusqu\'à', new Date(payload.exp * 1000))
  } else {
    console.log('⚠️ Token sans expiration (pas recommandé)')
  }
}
```

### 4. Tester la requête manuellement
```javascript
const token = localStorage.getItem('token')
const response = await fetch('/api/notifications?unread_only=true&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
const data = await response.json()
console.log('Réponse API:', data)

// Si ça marche : { success: true, notifications: [...], unread_count: 5 }
// Si erreur : { success: false, message: "Token invalide ou expiré" }
```

---

## 🚨 Si le problème persiste

### Solution 1 : Se reconnecter
```javascript
// Vider le localStorage et se reconnecter
localStorage.clear()
// Puis va sur /login et reconnecte-toi
```

### Solution 2 : Vérifier le backend
```javascript
// Dans server/api/notifications/index.get.js
// Le problème vient peut-être de :
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt_super_securise_2024')

// Vérifie que JWT_SECRET est défini dans .env :
JWT_SECRET=votre_secret_jwt_super_securise_2024
```

### Solution 3 : Vérifier que le token existe vraiment
```javascript
// Au moment du login, vérifier que le token est bien sauvegardé :
// Dans app/pages/login.vue ligne 106
localStorage.setItem('token', response.token)
console.log('✅ Token sauvegardé:', response.token)

// Puis recharge la page et vérifie :
const token = localStorage.getItem('token')
console.log('Token lu depuis localStorage:', token)
```

---

## 🎯 Checklist de débogage

- [ ] Ouvrir la console (F12)
- [ ] Vérifier que `localStorage.getItem('token')` existe et n'est pas vide
- [ ] Vérifier que le token a 3 parties séparées par des points (xxx.yyy.zzz)
- [ ] Décoder le payload pour voir le userId et l'expiration
- [ ] Tester la requête `/api/notifications` manuellement avec fetch
- [ ] Si ça ne marche pas, se déconnecter puis reconnecter
- [ ] Recharger la page (Ctrl+Shift+R)

---

## 💡 Résumé rapide

**Le problème "jwt malformed" arrive quand :**
1. Tu n'es pas connecté (token vide)
2. Le token est corrompu
3. Le format du token est invalide

**Les correctifs appliqués :**
✅ Vérification du token avant chaque requête
✅ Nettoyage automatique si token invalide
✅ Délai de 500ms au chargement pour laisser le temps au token de se charger
✅ Pas d'appel aux notifications si pas connecté

**Pour tester maintenant :**
1. Ouvre la console (F12)
2. Tape `localStorage.getItem('token')`
3. Si vide → Va sur `/login` et connecte-toi
4. Si rempli → Vérifie le format avec `.split('.')` (doit avoir 3 parties)
5. Recharge la page → L'erreur doit disparaître !

---

**Si l'erreur persiste après connexion, fais :**
```javascript
localStorage.clear()
// Puis reconnecte-toi sur /login
```
