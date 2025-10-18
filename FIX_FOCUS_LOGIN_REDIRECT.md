# 🔧 Correction - Redirection vers Login sur la Page Focus

## ❌ Problème

Quand on clique sur le lien vers la page Focus, la page s'affiche un instant puis redirige immédiatement vers `/login`.

## 🔍 Cause du problème

La page Focus avait plusieurs problèmes d'authentification :

1. **Mauvaise clé de token** : Utilisait `localStorage.getItem('auth_token')` au lieu de `token`
2. **Pas de vérification au chargement** : Aucune vérification du token dans `onMounted()`
3. **Utilisation de `fetch` au lieu de `$fetch`** : Incompatibilité avec Nuxt 3
4. **Gestion incorrecte de la réponse** : Utilisation de `.ok` et `.json()` avec `$fetch`

## ✅ Corrections appliquées

### 1. **Correction de la clé de token**

**Avant :**
```javascript
const token = localStorage.getItem('auth_token') // ❌
```

**Après :**
```javascript
const token = localStorage.getItem('token') // ✅
```

### 2. **Ajout de la vérification au chargement**

**Avant :**
```javascript
onMounted(() => {
  loadAssignments()
  loadSessionHistory()
  // ...
})
```

**Après :**
```javascript
onMounted(() => {
  // Vérifier l'authentification avant tout
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (!token) {
      navigateTo('/login')
      return
    }
  }
  
  loadAssignments()
  loadSessionHistory()
  // ...
})
```

### 3. **Utilisation de $fetch au lieu de fetch**

**Avant :**
```javascript
const response = await fetch('/api/assignments', {
  headers: { 'Authorization': `Bearer ${token}` }
})

if (!response.ok) {
  throw new Error('Erreur')
}

const data = await response.json()
assignments.value = data.filter(a => !a.completed)
```

**Après :**
```javascript
const response = await $fetch('/api/assignments', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// $fetch retourne directement les données
assignments.value = (response.data || []).filter(a => !a.completed)
```

### 4. **Amélioration de la fonction loadAssignments**

**Avant :**
```javascript
const loadAssignments = async () => {
  try {
    loadingAssignments.value = true
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigateTo('/login')
      return
    }
    // ...
  } catch (error) {
    console.error('Erreur:', error)
  }
}
```

**Après :**
```javascript
const loadAssignments = async () => {
  try {
    if (typeof window === 'undefined') return
    
    loadingAssignments.value = true
    
    const token = localStorage.getItem('token')
    if (!token) {
      await navigateTo('/login')
      return
    }
    // ...
  } catch (error) {
    console.error('Erreur:', error)
    
    // Rediriger vers login si erreur 401
    if (error.response?.status === 401) {
      await navigateTo('/login')
      return
    }
    
    const { error: showError } = useToast()
    showError('Erreur', 'Impossible de charger les devoirs')
  }
}
```

### 5. **Correction de la sauvegarde des sessions**

**Avant :**
```javascript
const token = localStorage.getItem('auth_token')
await fetch('/api/focus/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ ... })
})
```

**Après :**
```javascript
const token = localStorage.getItem('token')
await $fetch('/api/focus/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: { ... } // $fetch convertit automatiquement en JSON
})
```

## 🎯 Résultat

✅ **Plus de flash** - La vérification se fait immédiatement au chargement  
✅ **Redirection propre** - Si pas de token, redirection immédiate vers `/login`  
✅ **Token correct** - Utilisation cohérente de `token` au lieu de `auth_token`  
✅ **API Nuxt** - Utilisation correcte de `$fetch` au lieu de `fetch`  
✅ **Gestion d'erreurs** - Redirection automatique si erreur 401  

## 🧪 Test

1. **Sans authentification :**
   - Cliquer sur "Mode Focus"
   - ✅ Redirection immédiate vers `/login` sans flash

2. **Avec authentification :**
   - Se connecter
   - Cliquer sur "Mode Focus"
   - ✅ Page Focus s'affiche correctement
   - ✅ Devoirs chargés
   - ✅ Sessions sauvegardées

## 📝 Fichiers modifiés

- ✅ `app/pages/focus.vue` - Corrections d'authentification et d'API

## 🎉 Statut

**✅ RÉSOLU !** La page Focus fonctionne maintenant correctement avec l'authentification.
