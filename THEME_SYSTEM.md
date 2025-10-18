# 🎨 Système de Thèmes – StudyFlow

## 📝 Vue d'ensemble

Le système de thèmes permet de personnaliser l'apparence de l'application avec **5 thèmes prédéfinis** :

- 🟣 **Purple** (par défaut) : Violet & Indigo
- 🔵 **Blue** : Bleu & Cyan
- 🟢 **Green** : Vert & Émeraude
- 🟠 **Orange** : Orange & Ambre
- 🌸 **Rose** : Rose & Pink

Les thèmes sont **persistés dans localStorage** et s'appliquent automatiquement sur toute l'application.

---

## 🧩 Architecture

### **1. Composable : `useTheme.js`**

Fichier : `app/composables/useTheme.js`

**Structure d'un thème :**
```js
{
  name: 'purple',
  primary: {
    50: 'purple-50',
    100: 'purple-100',
    // ...
    700: 'purple-700'
  },
  secondary: {
    50: 'indigo-50',
    // ...
  },
  gradient: 'from-purple-600 to-indigo-600',
  gradientHover: 'hover:from-purple-700 hover:to-indigo-700',
  gradientBg: 'from-purple-50 to-indigo-50',
  shadow: 'shadow-purple-500/50',
  shadowHover: 'hover:shadow-purple-600/50',
  ring: 'ring-purple-500',
  focus: 'focus:ring-purple-500',
  text: {
    '600': 'text-purple-600',
    '700': 'text-purple-700'
  },
  bg: {
    '50': 'bg-purple-50',
    '600': 'bg-purple-600',
    // ...
  },
  border: {
    '600': 'border-purple-600',
    '700': 'border-purple-700'
  }
}
```

**Fonctions disponibles :**
- `initTheme()` : Initialise le thème depuis localStorage
- `setTheme(themeName)` : Change le thème actif
- `useTheme()` : Retourne `{ theme, currentTheme, setTheme, availableThemes }`

---

### **2. Composant : `ThemeSwitcher.vue`**

Fichier : `app/components/ThemeSwitcher.vue`

**Utilisation :**
```vue
<ThemeSwitcher />
```

**Rendu :**
- Bouton avec icône palette 🎨
- Dropdown avec aperçu visuel de chaque thème
- Badge checkmark ✓ pour le thème actif
- Click-outside pour fermer automatiquement

**Intégré dans :**
- `desktop.vue` : dans la sidebar (en bas, avec "Raccourcis")
- `mobile.vue` : dans le header (à côté des notifications)

---

## 🎯 Utilisation dans les composants

### **1. Importer le thème**
```vue
<script setup>
const { theme } = useTheme()
</script>
```

### **2. Utiliser les classes dynamiques**

**Exemple : Bouton avec gradient**
```vue
<button :class="`bg-gradient-to-r ${theme.gradient} hover:scale-105 shadow-lg ${theme.shadow}`">
  Sauvegarder
</button>
```

**Exemple : Texte coloré**
```vue
<h1 :class="`text-2xl font-bold ${theme.text['700']}`">
  Titre
</h1>
```

**Exemple : Bordure**
```vue
<div :class="`border-2 ${theme.border['600']} rounded-xl`">
  Contenu
</div>
```

**Exemple : Navigation active**
```vue
<NuxtLink 
  to="/"
  :class="[
    'px-4 py-3 rounded-xl transition-all',
    isActive ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}` : 'hover:bg-gray-100'
  ]"
>
  Dashboard
</NuxtLink>
```

---

## 🧪 Composants modernisés

### **✅ Composants avec thèmes**
- ✅ `Toast.vue` : Gradients sur notifications
- ✅ `NotificationBell.vue` : Icônes avec gradients
- ✅ `ThemeSwitcher.vue` : Sélecteur de thème
- ✅ `desktop.vue` : Navigation avec thème dynamique
- ✅ `mobile.vue` : Bottom navbar avec thème dynamique

### **🔄 À moderniser**
- ⏳ `CommandPalette.vue`
- ⏳ `EmptyState.vue`
- ⏳ `LoadingSpinner.vue`
- ⏳ `KeyboardHelpModal.vue`
- ⏳ `QuickAssignmentModal.vue`
- ⏳ `PomodoroTimer.vue`

---

## 🎨 Design System

### **Palette de couleurs par thème**

| Thème    | Couleur primaire | Couleur secondaire | Gradient                              |
|----------|------------------|--------------------|---------------------------------------|
| Purple   | Purple           | Indigo             | `from-purple-600 to-indigo-600`       |
| Blue     | Blue             | Cyan               | `from-blue-600 to-cyan-600`           |
| Green    | Green            | Emerald            | `from-green-600 to-emerald-600`       |
| Orange   | Orange           | Amber              | `from-orange-600 to-amber-600`        |
| Rose     | Rose             | Pink               | `from-rose-600 to-pink-600`           |

### **Classes communes**
- **Backgrounds** : `bg-50`, `bg-100`, `bg-600`, `bg-700`
- **Textes** : `text-600`, `text-700`, `text-900`
- **Bordures** : `border-600`, `border-700`
- **Focus** : `focus:ring-500`, `ring-500`
- **Ombres** : `shadow-500/50`, `shadow-600/50`

---

## 💡 Bonnes pratiques

### ✅ **À faire**
- Utiliser les classes `theme.gradient` pour les boutons et éléments actifs
- Utiliser `theme.text['600']` pour les textes colorés
- Utiliser `theme.shadow` pour les cartes et éléments élevés
- Tester tous les thèmes avant de valider un nouveau design

### ❌ **À éviter**
- **Ne pas** hardcoder les couleurs (`text-purple-600` directement)
- **Ne pas** oublier d'importer `useTheme()` dans les nouveaux composants
- **Ne pas** utiliser des classes Tailwind qui ne sont pas dans le thème

---

## 🚀 Prochaines étapes

1. **Moderniser les composants restants** avec le système de thèmes
2. **Mettre à jour les pages** (dashboard, assignments, subjects, etc.) pour utiliser `useTheme()`
3. **Ajouter un mode sombre** (optionnel, futur)
4. **Créer des thèmes personnalisés** (permettre à l'utilisateur de créer son propre thème)

---

## 📚 Exemples de code complets

### **Exemple 1 : Carte moderne**
```vue
<template>
  <div 
    :class="`bg-white rounded-2xl p-6 border-2 ${theme.border['600']} shadow-xl ${theme.shadow} hover:scale-105 transition-all`"
  >
    <h3 :class="`text-xl font-bold ${theme.text['700']}`">Titre</h3>
    <p class="text-gray-600 mt-2">Description</p>
    <button :class="`mt-4 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-semibold hover:scale-105`">
      Action
    </button>
  </div>
</template>

<script setup>
const { theme } = useTheme()
</script>
```

### **Exemple 2 : Badge dynamique**
```vue
<template>
  <span 
    :class="`px-3 py-1 rounded-lg text-xs font-semibold ${theme.bg['100']} ${theme.text['700']}`"
  >
    Badge
  </span>
</template>

<script setup>
const { theme } = useTheme()
</script>
```

---

Copilot doit maintenant utiliser `useTheme()` partout où des couleurs sont nécessaires ! 🎨
