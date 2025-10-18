# 🧪 Guide de Test - Dark Mode StudyFlow

> **Priority 4 :** Système de Dark Mode  
> **Statut :** ✅ Implémenté - À tester

---

## 🚀 Démarrage rapide

### 1. Lancer l'application
```powershell
npm run dev
```

### 2. Ouvrir dans le navigateur
```
http://localhost:3000
```

---

## ✅ Checklist de test

### Test 1 : Toggle Dark Mode
- [ ] Localiser le bouton avec l'icône ☀️ (Soleil) en haut de la sidebar
- [ ] Cliquer sur le bouton
- [ ] ✅ Vérifier que :
  - L'icône change pour 🌙 (Lune)
  - L'interface passe en mode sombre
  - Les transitions sont fluides

### Test 2 : Persistance
- [ ] Activer le dark mode (icône 🌙 visible)
- [ ] Rafraîchir la page (`F5` ou `Ctrl+R`)
- [ ] ✅ Vérifier que :
  - Le mode dark est toujours actif
  - L'icône affiche toujours 🌙

### Test 3 : Sélection de thème en Light Mode
- [ ] Désactiver le dark mode (cliquer pour revenir en ☀️)
- [ ] Cliquer sur l'icône 🎨 (Palette)
- [ ] Sélectionner différents thèmes (Violet, Bleu, Vert, Orange, Rose)
- [ ] ✅ Vérifier que :
  - Les aperçus de gradient correspondent au mode light
  - Les couleurs de l'interface changent selon le thème
  - Le panel se ferme après sélection

### Test 4 : Sélection de thème en Dark Mode
- [ ] Activer le dark mode (icône 🌙)
- [ ] Cliquer sur l'icône 🎨
- [ ] Sélectionner différents thèmes
- [ ] ✅ Vérifier que :
  - Les aperçus de gradient correspondent au mode dark
  - Les couleurs sont plus sombres et désaturées
  - Les thèmes restent cohérents

### Test 5 : ThemeSwitcher - Style Dark
- [ ] Activer le dark mode
- [ ] Observer le bouton ☀️/🌙
- [ ] ✅ Vérifier que :
  - Le fond du bouton est sombre (`dark:bg-gray-800`)
  - La bordure est visible (`dark:border-gray-700`)
  - Le hover fonctionne (`dark:hover:bg-gray-700`)

### Test 6 : Panel de thème - Style Dark
- [ ] En mode dark, cliquer sur 🎨
- [ ] ✅ Vérifier que :
  - Le fond du panel est sombre (`dark:bg-gray-800`)
  - Les bordures sont visibles (`dark:border-gray-700`)
  - Le texte est lisible (`dark:text-gray-100`)
  - Les cartes de thèmes ont un fond approprié (`dark:bg-gray-700`)
  - Les hover states fonctionnent

### Test 7 : Classe `dark` sur HTML
- [ ] Ouvrir les DevTools (`F12`)
- [ ] Inspecter l'élément `<html>`
- [ ] ✅ Vérifier que :
  - En mode dark : `<html class="dark">`
  - En mode light : `<html>` (pas de classe dark)

### Test 8 : localStorage
- [ ] Ouvrir DevTools > Application/Storage > Local Storage
- [ ] ✅ Vérifier que :
  - `studyflow-theme` existe (valeur: purple/blue/green/orange/rose)
  - `studyflow-theme-mode` existe (valeur: light/dark)
  - Les valeurs changent quand on toggle ou change de thème

### Test 9 : Transitions et animations
- [ ] Toggle plusieurs fois entre light/dark
- [ ] ✅ Vérifier que :
  - Les transitions sont fluides (pas de flash)
  - L'icône ☀️ tourne au hover (rotation 90°)
  - L'icône 🌙 tourne au hover (rotation -12°)
  - Le panel apparaît/disparaît avec transition

### Test 10 : Responsive (si applicable)
- [ ] Redimensionner la fenêtre
- [ ] Tester sur mobile (DevTools > Toggle device toolbar)
- [ ] ✅ Vérifier que :
  - Le ThemeSwitcher reste accessible
  - Les boutons sont cliquables
  - Le panel ne déborde pas

---

## 🐛 Problèmes potentiels et solutions

### Problème : Le dark mode ne s'applique pas
**Solution :**
1. Vérifier que `tailwind.config.js` existe avec `darkMode: 'class'`
2. Vider le cache (`Ctrl+Shift+R`)
3. Vérifier dans DevTools que `<html class="dark">` est présent
4. Redémarrer le serveur dev

### Problème : Les couleurs ne changent pas
**Solution :**
1. Vérifier que les classes `dark:` sont bien dans les composants
2. Pour l'instant, seuls `ThemeSwitcher.vue` et `app.vue` sont adaptés
3. Les pages/layouts nécessitent encore l'adaptation (Priority 5)

### Problème : Le mode ne persiste pas
**Solution :**
1. Vérifier localStorage dans DevTools
2. Vérifier qu'il n'y a pas d'erreur dans la console
3. S'assurer que `useTheme()` est bien initialisé dans `app.vue`

### Problème : Les gradients ne correspondent pas
**Solution :**
1. Vérifier dans `useTheme.js` que chaque thème a `.light` et `.dark`
2. Vérifier que `isDarkMode` est utilisé pour choisir la bonne variante
3. Inspecter le composant dans DevTools pour voir les classes appliquées

---

## 📊 Résultats attendus

### En mode Light (☀️)
- Background blanc/gris très clair
- Texte gris foncé/noir
- Gradients saturés et vifs
- Ombres visibles et nettes

### En mode Dark (🌙)
- Background gris très foncé/noir
- Texte gris clair/blanc
- Gradients désaturés et doux
- Ombres subtiles

---

## 🎨 Comparaison visuelle

### Thème Blue - Light Mode
- Logo : Gradient bleu-indigo vif
- Sidebar : Fond blanc semi-transparent
- Navigation : Texte gris foncé
- Hover : Gris clair

### Thème Blue - Dark Mode
- Logo : Gradient bleu-indigo doux
- Sidebar : Fond gris très foncé semi-transparent
- Navigation : Texte gris clair
- Hover : Gris foncé

---

## 🔍 Inspection DevTools

### Classes à vérifier sur `ThemeSwitcher.vue`

**Bouton Toggle :**
```html
<button class="
  p-2.5 rounded-xl 
  bg-white dark:bg-gray-800 
  border border-gray-200 dark:border-gray-700 
  hover:border-gray-300 dark:hover:border-gray-600 
  hover:bg-gray-50 dark:hover:bg-gray-700
">
```

**Panel :**
```html
<div class="
  fixed w-72 
  bg-white dark:bg-gray-800 
  rounded-2xl shadow-2xl 
  border-2 border-gray-200 dark:border-gray-700 
  p-4
">
```

---

## ✅ Validation complète

Une fois tous les tests passés :

- [ ] Le système de thème fonctionne (5 thèmes)
- [ ] Le dark mode fonctionne (toggle light/dark)
- [ ] La persistance fonctionne (localStorage)
- [ ] Les transitions sont fluides
- [ ] Aucune erreur dans la console
- [ ] Le code est propre (pas d'erreurs ESLint/TypeScript)

---

## 📝 Rapport de test

**Date :** _________________  
**Testeur :** _________________  
**Environnement :** _________________

### Résumé
- Tests réussis : ____ / 10
- Tests échoués : ____ / 10
- Bugs découverts : ____

### Bugs/Problèmes
1. ___________________________________
2. ___________________________________
3. ___________________________________

### Commentaires
_________________________________________
_________________________________________
_________________________________________

---

## 🚀 Prochaines étapes après validation

Si tous les tests passent, passer à **Priority 5** :
- Adapter `layouts/desktop.vue` et `layouts/mobile.vue`
- Adapter toutes les pages (`assignments.vue`, `calendar.vue`, etc.)
- Adapter tous les composants
- Re-tester l'ensemble de l'application

---

**🎉 Bon test ! Le Dark Mode devrait fonctionner parfaitement.**
