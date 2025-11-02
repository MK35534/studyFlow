# ✅ PRIORITY 10 - Migration Authentification vers Cookies (TERMINÉ)

**Date :** 23 octobre 2025  
**Statut :** ✅ COMPLET

---

## 🎯 Objectif
Migrer l'authentification de `localStorage` vers les **cookies HTTP** pour permettre la lecture côté serveur (SSR) et résoudre les problèmes de redirect loop + JWT malformed.

---

## 📋 Problèmes Résolus

### 1. **Redirect Loop Infini**
- **Symptôme :** Page login affichée en boucle même avec token valide
- **Cause :** Token dans cookies, mais pages vérifient `localStorage`
- **Solution :** Migration complète vers composable `useAuth()`

### 2. **Erreur JWT Malformed**
- **Symptôme :** `❌ Erreur génération notifications: jwt malformed`
- **Cause :** Endpoints API vérifient header mais pas les cookies
- **Solution :** Utilisation de `verifyToken(event)` partout

### 3. **Badge Notifications Non Affiché**
- **Symptôme :** Compteur bleu apparaît seulement après ouverture du panneau
- **Cause :** `localStorage.getItem('token')` + délai 500ms au chargement
- **Solution :** Utilisation `getToken()` + chargement immédiat

### 4. **Page Login avec Sidebar**
- **Symptôme :** Navigation visible sur page de connexion
- **Cause :** Layout par défaut appliqué
- **Solution :** `definePageMeta({ layout: false })` déjà présent

---

## 🛠️ Fichiers Modifiés

### **Backend (Server)**

#### 1. `app/lib/auth.js` (verifyToken)
```javascript
import { parseCookies } from 'h3'

export function verifyToken(event) {
  let token = null
  
  // PRIORITY 1: Lire depuis les cookies
  try {
    const cookies = parseCookies(event)
    token = cookies.token
  } catch (e) { }
  
  // PRIORITY 2: Fallback Authorization header
  if (!token) {
    const authHeader = getRequestHeader(event, 'authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }
  
  if (!token) {
    throw new Error('Token d\'authentification requis')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded // { userId, email, iat, exp }
}
```

#### 2. API Notifications (6 fichiers)
**Tous migrés vers `verifyToken(event)` :**
- ✅ `server/api/notifications/index.get.js`
- ✅ `server/api/notifications/generate.post.js`
- ✅ `server/api/notifications/mark-all-read.post.js`
- ✅ `server/api/notifications/clear-all.post.js`
- ✅ `server/api/notifications/[id].delete.js`
- ✅ `server/api/notifications/[id]/read.patch.js`

**Avant :**
```javascript
const authHeader = getRequestHeader(event, 'authorization')
const token = authHeader.substring(7)
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

**Après :**
```javascript
import { verifyToken } from '~/lib/auth'

const decoded = verifyToken(event)
const userId = decoded.userId
```

---

### **Frontend (Client)**

#### 3. Nouveau Composable `app/composables/useAuth.js`
```javascript
export const useAuth = () => {
  const getToken = () => {
    if (process.server) return null
    
    // Priorité 1: useCookie Nuxt
    const tokenCookie = useCookie('token')
    if (tokenCookie.value) return tokenCookie.value
    
    // Priorité 2: Lecture manuelle document.cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }

  const clearToken = () => {
    if (process.server) return
    document.cookie = 'token=; path=/; max-age=0'
    localStorage.removeItem('user')
  }

  const isAuthenticated = () => !!getToken()

  return { getToken, clearToken, isAuthenticated }
}
```

#### 4. Pages Migrées (6 fichiers)
**Toutes avec `definePageMeta({ ssr: false })` + `useAuth()` :**
- ✅ `app/pages/index.vue`
- ✅ `app/pages/profile.vue`
- ✅ `app/pages/calendar.vue`
- ✅ `app/pages/subjects.vue`
- ✅ `app/pages/assignments.vue`
- ✅ `app/pages/focus.vue`

**Pattern appliqué :**
```javascript
<script setup>
definePageMeta({
  ssr: false // Évite problèmes cookies côté serveur
})

const { getToken } = useAuth()

// Remplacer partout :
// OLD: const token = localStorage.getItem('token')
// NEW: const token = getToken()
</script>
```

#### 5. Login (Création Cookie)
**Fichier :** `app/pages/login.vue`

**Modification ligne ~106 :**
```javascript
// OLD:
localStorage.setItem('token', response.token)

// NEW:
document.cookie = `token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
// 7 jours d'expiration
```

#### 6. Composables Notifications
**Fichier :** `app/composables/useNotifications.js`

```javascript
import { useAuth } from './useAuth'

export const useNotifications = () => {
  const { getToken } = useAuth()
  
  const loadNotifications = async () => {
    const token = getToken()
    const response = await $fetch('/api/notifications', {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include' // Important !
    })
  }
  
  // Toutes les fonctions migrées :
  // - loadNotifications()
  // - toggleRead()
  // - markAllAsRead()
  // - deleteNotification()
  // - clearAll()
  // - generateNotifications()
  // - getUnreadCount()
}
```

#### 7. Composants Notifications
**Fichiers modifiés :**
- ✅ `app/components/NotificationBell.vue`
- ✅ `app/components/NotificationCenter.vue`

**Changements :**
```javascript
const { getToken } = useAuth()

// NotificationBell.vue - Chargement immédiat
onMounted(() => {
  loadUnreadCount() // Plus de setTimeout(500ms)
  
  refreshInterval = setInterval(() => {
    const token = getToken()
    if (token) loadUnreadCount()
  }, 30000)
})
```

---

## 🔧 Script PowerShell de Migration

Pour remplacer automatiquement tous les `localStorage.getItem('token')` :

```powershell
(Get-Content "fichier.vue" -Raw) -replace "const token = localStorage\.getItem\('token'\)", "const token = getToken()" | Set-Content "fichier.vue"
```

Appliqué sur :
- calendar.vue
- subjects.vue
- assignments.vue
- focus.vue
- useNotifications.js
- NotificationCenter.vue

---

## ✅ Résultats

### Avant
- ❌ Redirect loop sur toutes les pages
- ❌ JWT malformed dans les notifications
- ❌ Badge compteur invisible au chargement
- ❌ Authentification uniquement côté client

### Après
- ✅ Navigation fluide sans redirect
- ✅ Notifications fonctionnelles (génération + affichage)
- ✅ Badge bleu affiché immédiatement
- ✅ Token lisible côté serveur ET client
- ✅ Architecture propre avec composable centralisé
- ✅ Cookies sécurisés (7 jours, SameSite=Lax)

---

## 📊 Statistiques

- **Fichiers backend modifiés :** 7
- **Fichiers frontend modifiés :** 11
- **Pages migrées :** 6
- **Composants migrés :** 2
- **Composables créés :** 1
- **Endpoints API corrigés :** 6

---

## 🔐 Sécurité

### Configuration Cookie
```javascript
token=${jwt}
path=/              // Disponible sur tout le site
max-age=604800      // 7 jours (7*24*60*60)
SameSite=Lax        // Protection CSRF
```

### Lecture Côté Serveur
```javascript
import { parseCookies } from 'h3'
const cookies = parseCookies(event)
const token = cookies.token
```

### Lecture Côté Client
```javascript
const tokenCookie = useCookie('token') // Nuxt composable
// OU
const token = document.cookie.split('; ').find(r => r.startsWith('token='))
```

---

## 🎓 Bonnes Pratiques Appliquées

1. ✅ **Cookies > localStorage** pour l'authentification
2. ✅ **Composable centralisé** (`useAuth`) 
3. ✅ **SSR désactivé** sur pages authentifiées (`ssr: false`)
4. ✅ **Credentials include** sur tous les fetch
5. ✅ **Fallback Authorization header** pour compatibilité
6. ✅ **Nettoyage logout** (cookie + localStorage)

---

## 🚀 Prochaines Étapes (Suggestions)

- [ ] Middleware global d'authentification
- [ ] Refresh token automatique avant expiration
- [ ] HttpOnly cookies (nécessite modifications serveur)
- [ ] Secure flag en production (HTTPS uniquement)
- [ ] Session persistence côté serveur (Redis/DB)

---

## 📝 Notes Techniques

### Pourquoi SSR False ?
Les pages protégées utilisent `definePageMeta({ ssr: false })` car :
- `document.cookie` n'existe pas côté serveur
- `useCookie()` fonctionne mais nécessite plus de config
- Évite les problèmes de hydration mismatch
- Pages authentifiées = contenu dynamique anyway

### Pourquoi pas HttpOnly ?
Les cookies ne sont **pas HttpOnly** car :
- Besoin de `document.cookie` côté client
- Alternative : API `/api/auth/me` pour récupérer l'user
- Trade-off sécurité vs simplicité
- Peut être amélioré en Phase 2

### Pattern credentials: 'include'
Tous les `$fetch()` vers l'API incluent :
```javascript
credentials: 'include'
```
Cela envoie automatiquement les cookies dans les requêtes.

---

## 🐛 Bugs Corrigés

1. ✅ **Infinite redirect /login**
2. ✅ **jwt malformed notifications**
3. ✅ **Badge compteur invisible**
4. ✅ **localStorage SSR errors**
5. ✅ **Token vide après reload**

---

## 📚 Fichiers de Référence

- Architecture : `DARK_MODE_GUIDE.md`
- Authentification : `app/lib/auth.js`
- Composable : `app/composables/useAuth.js`
- Exemple page : `app/pages/profile.vue`

---

**Migration réussie ! 🎉**  
Tout le système d'authentification utilise maintenant les cookies HTTP avec fallback localStorage pour les données utilisateur (firstname, lastname, etc.).
