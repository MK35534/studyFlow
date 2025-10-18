# 🌙 Guide d'implémentation du Dark Mode - StudyFlow

> **Date :** 18 octobre 2025  
> **Priority 4 :** Système de Dark Mode ✅

---

## 📋 Vue d'ensemble

Le système de Dark Mode a été implémenté avec :
- **5 thèmes** × **2 modes** (light/dark) = **10 combinaisons**
- Toggle fluide avec icônes animées (☀️ Soleil / 🌙 Lune)
- Persistance dans `localStorage`
- Classe `dark` appliquée sur `<html>` pour activation globale
- Transitions douces et design cohérent

---

## 🎨 Thèmes disponibles

Chaque thème possède maintenant deux variantes :

### 1. **Purple (Violet)**
- **Light :** purple-50 → purple-600, pink accents
- **Dark :** purple-950/30 → purple-400, tons sombres

### 2. **Blue (Bleu)** - Par défaut
- **Light :** blue-50 → blue-600, indigo accents
- **Dark :** blue-950/30 → blue-400, tons sombres

### 3. **Green (Vert)**
- **Light :** green-50 → green-600, emerald accents
- **Dark :** green-950/30 → green-400, tons sombres

### 4. **Orange**
- **Light :** orange-50 → orange-600, amber accents
- **Dark :** orange-950/30 → orange-400, tons sombres

### 5. **Rose**
- **Light :** rose-50 → rose-600, pink accents
- **Dark :** rose-950/30 → rose-400, tons sombres

---

## 🔧 Fichiers modifiés

### 1. **`app/composables/useTheme.js`**
✅ **Modifications :**
- Ajout de `isDarkMode` (ref reactive)
- Structure de thèmes étendue : `themes[themeName].light` et `themes[themeName].dark`
- Fonction `toggleDarkMode()` pour basculer entre modes
- Fonction `applyDarkClass()` pour gérer la classe `dark` sur `<html>`
- Persistance dans `localStorage('studyflow-theme-mode')`
- Le `computed theme` retourne automatiquement la bonne variante selon le mode

**Exemple d'utilisation :**
```javascript
const { theme, isDarkMode, toggleDarkMode } = useTheme()

// Accéder aux couleurs actuelles
theme.value.bg // Retourne bg-blue-50 (light) ou bg-blue-950/30 (dark)
theme.value.text // Retourne text-blue-600 (light) ou text-blue-400 (dark)

// Toggle dark mode
toggleDarkMode()
```

---

### 2. **`app/components/ThemeSwitcher.vue`**
✅ **Modifications :**
- Ajout d'un bouton **Toggle Dark/Light** avec icônes animées
- Icône ☀️ (Soleil) en mode light → rotation au hover
- Icône 🌙 (Lune) en mode dark → rotation au hover
- Support complet du dark mode dans le panel (fond, texte, bordures)
- Aperçu dynamique des gradients selon le mode actuel
- Classes Tailwind `dark:` appliquées partout

**Structure :**
```vue
<template>
  <div class="flex items-center gap-2">
    <!-- Toggle Dark Mode -->
    <button @click="toggleMode">
      <svg v-if="!isDarkMode">☀️</svg>
      <svg v-else>🌙</svg>
    </button>
    
    <!-- Sélecteur de thème -->
    <button @click="togglePanel">🎨</button>
  </div>
</template>
```

---

### 3. **`tailwind.config.js`** (nouveau fichier)
✅ **Création :**
```javascript
export default {
  darkMode: 'class', // Active le dark mode via classe 'dark'
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
}
```

---

### 4. **`app/app.vue`**
✅ **Modifications :**
- Import de `useTheme()`
- Application de la classe `dark` au montage du composant
- Synchronisation avec `localStorage`

```vue
<script setup>
import { useTheme } from '~/composables/useTheme'
import { onMounted } from 'vue'

const { isDarkMode } = useTheme()

onMounted(() => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
})
</script>
```

---

## 🎯 Utilisation dans les composants

Pour rendre un composant compatible dark mode, ajoutez simplement les classes `dark:` :

### Exemples de classes communes

#### **Backgrounds :**
```vue
<div class="bg-white dark:bg-gray-800">
  <!-- Contenu -->
</div>
```

#### **Text :**
```vue
<h1 class="text-gray-900 dark:text-gray-100">Titre</h1>
<p class="text-gray-600 dark:text-gray-400">Paragraphe</p>
```

#### **Borders :**
```vue
<div class="border border-gray-200 dark:border-gray-700">
  <!-- Contenu -->
</div>
```

#### **Hover states :**
```vue
<button class="hover:bg-gray-100 dark:hover:bg-gray-700">
  Bouton
</button>
```

#### **Thèmes dynamiques :**
```vue
<script setup>
const { theme } = useTheme()
</script>

<template>
  <div :class="[
    theme.bg, // Applique automatiquement light ou dark
    theme.text
  ]">
    Contenu avec thème dynamique
  </div>
</template>
```

---

## 📦 Structure des variantes dark

Chaque propriété de thème a son équivalent dark :

| Propriété Light | Propriété Dark | Usage |
|----------------|----------------|-------|
| `bg-blue-50` | `bg-blue-950/30` | Fond clair → sombre |
| `text-blue-600` | `text-blue-400` | Texte foncé → clair |
| `border-blue-100` | `border-blue-900/50` | Bordure subtile → visible |
| `from-blue-600` | `from-blue-500` | Gradient saturé → atténué |
| `shadow-blue-500/30` | `shadow-blue-500/20` | Ombre forte → légère |

---

## 🚀 Prochaines étapes

### Pages à adapter (Priority 5)

Les pages suivantes doivent maintenant recevoir les classes `dark:` :

1. **`pages/subjects.vue`** ✅ (déjà modernisée)
2. **`pages/assignments.vue`** 🔨 À adapter
3. **`pages/calendar.vue`** 🔨 À adapter
4. **`pages/focus.vue`** 🔨 À adapter
5. **`pages/profile.vue`** 🔨 À adapter
6. **`pages/index.vue`** 🔨 À adapter
7. **`layouts/desktop.vue`** 🔨 À adapter
8. **`layouts/mobile.vue`** 🔨 À adapter

### Composants à adapter

- `Toast.vue`
- `NotificationBell.vue`
- `FocusTimer.vue`
- `PomodoroTimer.vue`
- `CommandPalette.vue`
- Tous les modals

---

## ✅ Checklist d'implémentation

- [x] Créer les variantes dark pour les 5 thèmes
- [x] Ajouter `isDarkMode` dans `useTheme.js`
- [x] Créer `toggleDarkMode()`
- [x] Persister le mode dans `localStorage`
- [x] Ajouter toggle dans `ThemeSwitcher.vue`
- [x] Créer `tailwind.config.js` avec `darkMode: 'class'`
- [x] Appliquer classe `dark` dans `app.vue`
- [ ] Adapter toutes les pages avec classes `dark:`
- [ ] Adapter tous les layouts
- [ ] Adapter tous les composants
- [ ] Tester sur mobile et desktop
- [ ] Vérifier les transitions et animations
- [ ] Documenter les patterns dans un guide

---

## 🎨 Palette de couleurs Dark Mode

### Backgrounds
- **Page principale :** `bg-white dark:bg-gray-900`
- **Cartes/Panels :** `bg-white dark:bg-gray-800`
- **Hover states :** `hover:bg-gray-50 dark:hover:bg-gray-700`
- **Inputs :** `bg-gray-50 dark:bg-gray-700`

### Text
- **Titres principaux :** `text-gray-900 dark:text-gray-100`
- **Titres secondaires :** `text-gray-800 dark:text-gray-200`
- **Corps de texte :** `text-gray-600 dark:text-gray-400`
- **Texte subtil :** `text-gray-500 dark:text-gray-500`

### Borders
- **Bordures principales :** `border-gray-200 dark:border-gray-700`
- **Bordures subtiles :** `border-gray-100 dark:border-gray-800`
- **Séparateurs :** `divide-gray-200 dark:divide-gray-700`

---

## 💡 Tips et bonnes pratiques

1. **Toujours tester les deux modes** lors de l'ajout de nouveaux composants
2. **Utiliser les variantes de thème** (`theme.bg`, `theme.text`) pour une cohérence maximale
3. **Préférer les opacités** (`/30`, `/50`) pour les fonds sombres
4. **Les gradients** doivent être légèrement désaturés en dark mode
5. **Les ombres** doivent être plus subtiles en dark mode
6. **Les contrastes** doivent rester lisibles dans les deux modes

---

## 🐛 Debugging

Si le dark mode ne s'applique pas :

1. Vérifier que `tailwind.config.js` contient `darkMode: 'class'`
2. Vérifier que `<html>` a la classe `dark` dans l'inspecteur
3. Vérifier que `localStorage.getItem('studyflow-theme-mode')` retourne `'dark'`
4. Forcer le rafraîchissement avec `Ctrl+Shift+R`
5. Vider le cache du navigateur si nécessaire

---

**🎉 Le système de Dark Mode est maintenant opérationnel !**  
Vous pouvez basculer entre modes et thèmes de manière fluide.  
La prochaine étape est d'appliquer les classes `dark:` dans toutes les pages et composants.
