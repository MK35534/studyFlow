# 🔧 Fix - Tags s'affichent "Sans nom" après création

## 🐛 Problème
Après la création d'un devoir avec des tags :
1. ❌ Les tags s'affichent "Sans nom" (jusqu'au refresh)
2. ❌ La couleur n'est pas visible

## 🔍 Cause
Lors de l'association des tags, on stockait seulement les **IDs** (`[1, 2, 3]`) au lieu des **objets complets** avec `name` et `color`.

```javascript
// ❌ AVANT - Seulement les IDs
newAssignmentData.tags = newAssignment.tags // [1, 2, 3]

// Template essaye d'afficher :
tag.name   // undefined → fallback "Sans nom"
tag.color  // undefined → fallback #6b7280
```

---

## ✅ Solution appliquée

### 1. Backend - Retourner le tag complet après association

**Fichier modifié :** `server/api/assignments/[id]/tags/index.post.js`

**Avant :**
```javascript
return {
  success: true,
  message: 'Tag ajouté au devoir avec succès'
}
```

**Après :**
```javascript
// Récupérer le tag complet (id, name, color)
const tagResult = await executeQuery(
  'SELECT id, name, color FROM tags WHERE id = ? AND user_id = ?',
  [tag_id, payload.userId]
)
const tag = tagResult[0]

return {
  success: true,
  message: 'Tag ajouté au devoir avec succès',
  tag // ✅ Retourner { id, name, color }
}
```

---

### 2. Frontend - Utiliser les tags complets

**Fichier modifié :** `app/pages/assignments.vue`

**Avant :**
```javascript
// Associer les tags
for (const tagId of newAssignment.tags) {
  await $fetch(`/api/assignments/${id}/tags`, {
    method: 'POST',
    body: { tag_id: tagId }
  })
}

// ❌ Stocker seulement les IDs
newAssignmentData.tags = newAssignment.tags
```

**Après :**
```javascript
const associatedTags = []

// Associer les tags ET récupérer les objets complets
for (const tagId of newAssignment.tags) {
  const tagResponse = await $fetch(`/api/assignments/${id}/tags`, {
    method: 'POST',
    body: { tag_id: tagId }
  })
  
  // ✅ L'API retourne maintenant le tag complet
  if (tagResponse.success && tagResponse.tag) {
    associatedTags.push(tagResponse.tag)
  }
}

// ✅ Stocker les objets complets { id, name, color }
newAssignmentData.tags = associatedTags
```

---

### 3. Endpoint GET pour fallback

**Fichier créé :** `server/api/assignments/[id].get.js`

Permet de recharger un devoir spécifique avec ses tags si nécessaire.

```javascript
// GET /api/assignments/123
// Retourne :
{
  success: true,
  data: {
    id: 123,
    title: "Exercices",
    subject_name: "Maths",
    subject_color: "#3b82f6",
    tags: [
      { id: 1, name: "Urgent", color: "#ef4444" },
      { id: 2, name: "Important", color: "#f59e0b" }
    ]
  }
}
```

**Utilisé comme fallback :**
```javascript
if (associatedTags.length === 0) {
  // Si l'association a échoué, recharger le devoir
  const reloadResponse = await $fetch(`/api/assignments/${id}`)
  newAssignmentData.tags = reloadResponse.data.tags
}
```

---

## 📊 Flux de données corrigé

### Création d'un devoir avec tags

```
1. User sélectionne tags dans TagSelector
   → newAssignment.tags = [1, 2, 3] (IDs)

2. Création du devoir
   → POST /api/assignments
   → Response: { success: true, data: { id: 123, ... } }

3. Association des tags (pour chaque ID)
   → POST /api/assignments/123/tags
   → Body: { tag_id: 1 }
   → Response: { 
       success: true, 
       tag: { id: 1, name: "Urgent", color: "#ef4444" } ✅
     }

4. Stockage des tags complets
   → associatedTags = [
       { id: 1, name: "Urgent", color: "#ef4444" },
       { id: 2, name: "Important", color: "#f59e0b" },
       { id: 3, name: "Facile", color: "#10b981" }
     ]

5. Affichage immédiat
   → tag.name = "Urgent" ✅
   → tag.color = "#ef4444" ✅
   → Plus besoin de refresh !
```

---

## 🧪 Test du fix

### 1. Créer un devoir avec tags
```bash
1. Ouvre http://localhost:3000/assignments
2. Clique "Ajouter un devoir"
3. Remplis le formulaire
4. Sélectionne 2-3 tags
5. Clique "Créer le devoir"
```

### 2. Vérifier immédiatement
```
✅ Les tags s'affichent avec leur vrai nom (pas "Sans nom")
✅ Les couleurs sont visibles
✅ Pas besoin de refresh
```

### 3. Vérifier dans la console (F12)
```javascript
// Après création, vérifier le devoir dans assignments.value
const dernierDevoir = assignments.value[0]
console.log('Tags:', dernierDevoir.tags)

// Doit afficher :
// [
//   { id: 1, name: "Urgent", color: "#ef4444" },
//   { id: 2, name: "Important", color: "#f59e0b" }
// ]
```

---

## 📝 Fichiers modifiés

1. ✅ `server/api/assignments/[id]/tags/index.post.js`
   - Retourne maintenant le tag complet (`{ id, name, color }`)

2. ✅ `app/pages/assignments.vue`
   - Récupère et stocke les tags complets après association
   - Fallback : recharge le devoir si nécessaire

3. ✅ `server/api/assignments/[id].get.js` (nouveau)
   - Endpoint pour récupérer un devoir spécifique avec ses tags
   - Utilisé comme fallback

---

## 🔄 Comparaison avant/après

### Avant
```javascript
// Tags stockés
newAssignmentData.tags = [1, 2, 3]

// Affichage
<span>{{ tag.name || 'Sans nom' }}</span>
// Résultat : "Sans nom" (car tag = 1, pas un objet)
```

### Après
```javascript
// Tags stockés
newAssignmentData.tags = [
  { id: 1, name: "Urgent", color: "#ef4444" },
  { id: 2, name: "Important", color: "#f59e0b" }
]

// Affichage
<span :style="{ backgroundColor: tag.color, color: ... }">
  {{ tag.name || 'Sans nom' }}
</span>
// Résultat : "Urgent" avec fond rouge ✅
```

---

## ✅ Checklist

- [x] Backend retourne le tag complet après association
- [x] Frontend récupère les tags complets
- [x] Endpoint GET /api/assignments/[id] créé (fallback)
- [x] Fallback si association échoue
- [ ] Tester création devoir avec tags
- [ ] Vérifier affichage immédiat (nom + couleur)
- [ ] Vérifier en mode dark
- [ ] Déployer sur Vercel

---

**Les tags devraient maintenant s'afficher immédiatement avec leur nom et couleur !** 🎨✨
