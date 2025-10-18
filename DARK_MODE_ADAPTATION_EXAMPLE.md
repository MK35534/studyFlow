# 🎨 Exemple d'adaptation Dark Mode - Layout Desktop

## Avant / Après comparaison

### ❌ AVANT (Light mode uniquement)
```vue
<aside class="w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r-2 border-gray-200">
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-8 bg-gradient-to-r">
      StudyFlow
    </h1>
    
    <nav class="space-y-1.5">
      <NuxtLink class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100">
        <span class="font-semibold">Dashboard</span>
      </NuxtLink>
    </nav>
  </div>
</aside>
```

### ✅ APRÈS (Light + Dark mode)
```vue
<aside class="w-64 bg-white/80 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-r-2 border-gray-200 dark:border-gray-700">
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-8 bg-gradient-to-r">
      StudyFlow
    </h1>
    
    <nav class="space-y-1.5">
      <NuxtLink class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
        <span class="font-semibold">Dashboard</span>
      </NuxtLink>
    </nav>
  </div>
</aside>
```

---

## 📝 Liste des changements à appliquer

### 1. **Sidebar (aside)**
```vue
<!-- Avant -->
<aside class="bg-white/80 border-gray-200">

<!-- Après -->
<aside class="bg-white/80 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700">
```

### 2. **Liens de navigation**
```vue
<!-- Avant -->
<NuxtLink class="text-gray-700 hover:bg-gray-100">

<!-- Après -->
<NuxtLink class="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
```

### 3. **Bordures**
```vue
<!-- Avant -->
<div class="border-t border-gray-200">

<!-- Après -->
<div class="border-t border-gray-200 dark:border-gray-700">
```

### 4. **User section**
```vue
<!-- Avant -->
<div class="bg-white/80 border-gray-200">
  <button class="hover:bg-gray-100">
    <p class="text-gray-900">{{ userName }}</p>
    <p class="text-gray-500">Voir le profil</p>
  </button>
</div>

<!-- Après -->
<div class="bg-white/80 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700">
  <button class="hover:bg-gray-100 dark:hover:bg-gray-800">
    <p class="text-gray-900 dark:text-gray-100">{{ userName }}</p>
    <p class="text-gray-500 dark:text-gray-400">Voir le profil</p>
  </button>
</div>
```

### 5. **Header principal**
```vue
<!-- Avant -->
<div class="bg-white/80 border-b border-gray-200">

<!-- Après -->
<div class="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
```

### 6. **Background principal**
```vue
<!-- Avant -->
<div class="bg-gradient-to-br from-gray-50 to-white">

<!-- Après -->
<div class="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
```

### 7. **Main content**
```vue
<!-- Avant -->
<main class="bg-gradient-to-br from-gray-50 via-white to-gray-50">

<!-- Après -->
<main class="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
```

---

## 🎨 Palette de référence rapide

| Élément | Light Mode | Dark Mode |
|---------|-----------|-----------|
| **Background principal** | `bg-white` | `dark:bg-gray-900` |
| **Background sidebar** | `bg-white/80` | `dark:bg-gray-900/95` |
| **Gradient fond** | `from-gray-50 to-white` | `dark:from-gray-950 dark:to-gray-900` |
| **Texte principal** | `text-gray-900` | `dark:text-gray-100` |
| **Texte secondaire** | `text-gray-700` | `dark:text-gray-300` |
| **Texte subtil** | `text-gray-500` | `dark:text-gray-400` |
| **Bordure** | `border-gray-200` | `dark:border-gray-700` |
| **Hover background** | `hover:bg-gray-100` | `dark:hover:bg-gray-800` |
| **Hover bordure** | `hover:border-gray-300` | `dark:hover:border-gray-600` |

---

## ⚡ Workflow d'adaptation rapide

Pour adapter n'importe quel composant :

1. **Identifier tous les backgrounds** → Ajouter `dark:bg-*`
2. **Identifier tous les textes** → Ajouter `dark:text-*`
3. **Identifier toutes les bordures** → Ajouter `dark:border-*`
4. **Identifier tous les hover/focus** → Ajouter `dark:hover:*`, `dark:focus:*`
5. **Tester visuellement** → Toggle entre light/dark et vérifier le contraste
6. **Ajuster si nécessaire** → Certaines couleurs peuvent nécessiter des ajustements

---

## 🚀 Fichier complet adapté : `desktop.vue`

Voici le fichier `layouts/desktop.vue` complètement adapté au dark mode :

```vue
<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
    <!-- Sidebar moderne avec gradient -->
    <aside class="w-64 bg-white/80 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-r-2 border-gray-200 dark:border-gray-700 relative z-50">
      <div class="p-6">
        <!-- Logo avec gradient text -->
        <h1 class="text-2xl font-bold mb-8 bg-gradient-to-r" :class="theme.gradient + ' bg-clip-text text-transparent'">
          StudyFlow
        </h1>
        
        <!-- Navigation moderne -->
        <nav class="space-y-1.5">
          <NuxtLink 
            to="/" 
            :class="[
              'flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 group',
              isActive('/') 
                ? \`bg-gradient-to-r \${theme.gradient} text-white shadow-lg \${theme.shadow}\` 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            <span class="font-semibold">Dashboard</span>
          </NuxtLink>
          
          <!-- Répéter pour tous les autres liens avec le même pattern -->
        </nav>
      </div>

      <!-- Aide et Thème -->
      <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Thème</span>
          <ThemeSwitcher align="left" />
        </div>
        
        <button
          @click="showHelpModal = true"
          class="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors w-full py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Raccourcis (?)
        </button>
      </div>
      
      <!-- User section moderne en bas -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/95 backdrop-blur-sm">
        <button 
          @click="navigateTo('/profile')"
          class="flex items-center w-full p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 group"
        >
          <div class="flex items-center flex-1 min-w-0">
            <div :class="\`w-10 h-10 rounded-xl bg-gradient-to-br \${theme.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow\`">
              <span class="text-white text-sm font-bold">{{ userInitials }}</span>
            </div>
            <div class="ml-3 min-w-0 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Voir le profil →</p>
            </div>
          </div>
        </button>
      </div>
    </aside>
    
    <!-- Contenu principal avec gradient bg -->
    <main class="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
      <!-- Header avec notifications -->
      <div class="sticky top-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-end shadow-sm">
        <NotificationBell :assignments="assignments" />
      </div>
      
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>

  <!-- Modals restent identiques -->
  <CommandPalette />
  <KeyboardHelpModal />
  <Toast />
</template>
```

---

## ✅ Checklist pour adapter un fichier

- [ ] Background principal
- [ ] Background des cartes/panels
- [ ] Textes (titres, paragraphes, labels)
- [ ] Bordures
- [ ] États hover
- [ ] États focus
- [ ] États active
- [ ] Ombres (si applicable)
- [ ] Gradients (si applicable)
- [ ] Icons (si couleur spécifique)
- [ ] Inputs et formulaires
- [ ] Modals et overlays
- [ ] Tester visuellement en light mode
- [ ] Tester visuellement en dark mode
- [ ] Vérifier le contraste et la lisibilité

---

**Prochaine étape :** Appliquer ces patterns à tous les fichiers listés dans Priority 5 de la ROADMAP.
