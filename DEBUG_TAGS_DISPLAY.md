# 🐛 Debug - Tags ne s'affichent pas bien

## 🔍 Diagnostic

### Ouvre la console (F12) et teste :

```javascript
// 1. Vérifier que les tags sont bien chargés
const response = await fetch('/api/assignments', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
const data = await response.json()
console.log('Devoirs avec tags:', data.data)

// 2. Vérifier un devoir spécifique
const premier = data.data[0]
console.log('Premier devoir:', premier)
console.log('Tags du premier devoir:', premier.tags)

// 3. Vérifier la structure d'un tag
if (premier.tags && premier.tags.length > 0) {
  console.log('Structure du premier tag:', premier.tags[0])
  // Doit avoir: { id, name, color }
}
```

---

## 🎨 Problèmes possibles

### 1. **Couleur du texte pas visible**
Si le fond est clair et le texte blanc → invisible !

**Solution :**
```vue
<!-- Avant (texte toujours blanc) -->
<span class="text-white" :style="{ backgroundColor: tag.color }">

<!-- Après (texte adapté au fond) -->
<span 
  class="shadow-sm transition-transform hover:scale-105"
  :style="{ 
    backgroundColor: tag.color,
    color: isLightColor(tag.color) ? '#1f2937' : '#ffffff'
  }"
>
```

### 2. **Tags vides ou undefined**
Si `tag.name` est vide → badge invisible

**Vérifier dans la console :**
```javascript
// Compter les tags vides
const devoirs = data.data
let tagsVides = 0
devoirs.forEach(d => {
  if (d.tags) {
    d.tags.forEach(t => {
      if (!t.name || t.name === '') {
        tagsVides++
        console.log('Tag vide trouvé:', t)
      }
    })
  }
})
console.log(`Total tags vides: ${tagsVides}`)
```

### 3. **Couleur mal formatée**
Si `tag.color` n'est pas un hex valide → pas de couleur de fond

**Vérifier :**
```javascript
devoirs.forEach(d => {
  if (d.tags) {
    d.tags.forEach(t => {
      if (!t.color || !t.color.startsWith('#')) {
        console.error('Couleur invalide:', t.name, t.color)
      }
    })
  }
})
```

---

## ✅ Solution : Améliorer l'affichage des tags

### Fonction helper pour contraste texte
```javascript
// À ajouter dans <script setup>
const isLightColor = (hexColor) => {
  if (!hexColor) return false
  
  // Convertir hex en RGB
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculer la luminosité (formule standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Si luminosité > 0.5 → couleur claire → texte noir
  return luminance > 0.5
}
```

### Template amélioré
```vue
<!-- Tags avec contraste automatique -->
<div v-if="assignment.tags && assignment.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
  <span
    v-for="tag in assignment.tags"
    :key="tag.id"
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105 hover:shadow-md"
    :style="{ 
      backgroundColor: tag.color || '#6b7280',
      color: isLightColor(tag.color) ? '#1f2937' : '#ffffff'
    }"
  >
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
    {{ tag.name || 'Sans nom' }}
  </span>
</div>
```

---

## 🧪 Test visuel rapide

### 1. Créer un tag avec couleur claire
```sql
-- Dans MySQL
INSERT INTO tags (user_id, name, color) VALUES
(1, 'Test Clair', '#fef3c7'); -- Jaune très clair
```

### 2. L'associer à un devoir
```sql
INSERT INTO assignment_tags (assignment_id, tag_id)
VALUES (1, LAST_INSERT_ID());
```

### 3. Recharger la page
- **Sans fix :** Texte blanc sur fond jaune = invisible
- **Avec fix :** Texte noir sur fond jaune = visible !

---

## 📊 Checklist de debug

- [ ] Console ouverte (F12)
- [ ] Vérifier que `data.data[0].tags` existe et n'est pas vide
- [ ] Vérifier que chaque tag a `{ id, name, color }`
- [ ] Vérifier visuellement les badges dans la page
- [ ] Tester avec des couleurs claires ET foncées
- [ ] Vérifier en mode dark

---

## 💡 Quick fix temporaire

Si tu veux un fix rapide sans la fonction de contraste :

```vue
<!-- Option 1: Toujours fond opaque + texte blanc -->
<span
  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm"
  :style="{ backgroundColor: tag.color }"
>

<!-- Option 2: Ajouter un contour si fond clair -->
<span
  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ring-1 ring-black/10"
  :style="{ 
    backgroundColor: tag.color + 'dd', // Opacité 87%
    color: '#ffffff'
  }"
>
```

---

**Dis-moi ce que tu vois dans la console !** 🔍
