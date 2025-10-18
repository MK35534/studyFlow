# 🌙 Pattern d'Adaptation Dark Mode - Pages

## 📋 Pattern de Classes Tailwind

### Textes
- `text-gray-900` → `text-gray-900 dark:text-gray-100`
- `text-gray-800` → `text-gray-800 dark:text-gray-200`
- `text-gray-700` → `text-gray-700 dark:text-gray-300`
- `text-gray-600` → `text-gray-600 dark:text-gray-400`
- `text-gray-500` → `text-gray-500 dark:text-gray-500`
- `text-gray-400` → `text-gray-400 dark:text-gray-600`

### Backgrounds
- `bg-white` → `bg-white dark:bg-gray-800`
- `from-white` → `from-white dark:from-gray-800`
- `to-white` → `to-white dark:to-gray-900`
- `bg-gray-50` → `bg-gray-50 dark:bg-gray-900/50`
- `bg-gray-100` → `bg-gray-100 dark:bg-gray-800/50`

### Borders
- `border-gray-200` → `border-gray-200 dark:border-gray-700`
- `border-gray-300` → `border-gray-300 dark:border-gray-700`
- `ring-white` → `ring-white dark:ring-gray-800`

### Couleurs status
- `text-red-600` → `text-red-600 dark:text-red-400`
- `text-green-600` → `text-green-600 dark:text-green-400`
- `text-blue-600` → `text-blue-600 dark:text-blue-400`
- `text-purple-600` → `text-purple-600 dark:text-purple-400`

### Backgrounds status avec transparence
- `bg-red-50` → `bg-red-50 dark:bg-red-900/20`
- `bg-green-50` → `bg-green-50 dark:bg-green-900/20`
- `bg-blue-50` → `bg-blue-50 dark:bg-blue-900/20`
- `bg-purple-50` → `bg-purple-50 dark:bg-purple-900/20`

### Transitions
Ajouter `transition-colors duration-300` sur tous les éléments qui changent de couleur

---

## 📄 Pages à Adapter

### ✅ Subjects (Done)
- Headers, cards, modals, forms, buttons
- Stats avec transparence

### ✅ Index/Dashboard (Done)  
- Headers, stats cards, sections devoirs/cours
- Raccourcis rapides, section par matière

### 🔨 Assignments (En cours)
**Sections principales :**
- Header avec titre et bouton
- Formulaire d'ajout (inputs, select, textarea)
- Filtres (boutons Tous/En cours/Terminés)
- Liste de devoirs (cards avec checkbox, labels, badges urgence)
- Message si pas de devoirs
- Message si pas de matières

**Classes à modifier :**
```vue
<!-- Header -->
text-gray-900 → text-gray-900 dark:text-gray-100
text-gray-600 → text-gray-600 dark:text-gray-400

<!-- Form -->
bg-white → bg-white dark:bg-gray-800
border-gray-200 → border-gray-200 dark:border-gray-700
border-gray-300 → border-gray-300 dark:border-gray-700
text-gray-900 → text-gray-900 dark:text-gray-100
text-gray-700 → text-gray-700 dark:text-gray-300

<!-- Cards devoirs -->
from-white → from-white dark:from-gray-800
to-blue-50/20 → to-blue-50/20 dark:to-gray-900
border-gray-200 → border-gray-200 dark:border-gray-700

<!-- Checkbox -->
bg-white → bg-white dark:bg-gray-800
border-gray-300 → border-gray-300 dark:border-gray-700

<!-- Filtres -->
bg-white → bg-white dark:bg-gray-800
text-gray-700 → text-gray-700 dark:text-gray-300
border-gray-300 → border-gray-300 dark:border-gray-700
```

### 🔨 Calendar
**Sections principales :**
- Header avec navigation mois
- Grille calendrier (jours de la semaine)
- Cellules de jours (aujourd'hui, sélection, hover)
- Liste d'événements du jour sélectionné
- Modal ajout événement

**Classes critiques :**
```vue
<!-- Header calendrier -->
text-gray-900 dark:text-gray-100
bg-white dark:bg-gray-800

<!-- Grille -->
border-gray-200 dark:border-gray-700
bg-gray-50 dark:bg-gray-900/50

<!-- Jours -->
text-gray-900 dark:text-gray-100
hover:bg-blue-50 dark:hover:bg-blue-900/20
bg-blue-100 dark:bg-blue-900/40 (aujourd'hui)

<!-- Événements -->
from-white dark:from-gray-800
border-gray-200 dark:border-gray-700
```

### 🔨 Focus
**Sections principales :**
- Header mode focus
- Timer (grand affichage temps)
- Boutons Play/Pause/Reset
- Sélecteur de session (Pomodoro/Deep/Custom)
- Stats de sessions
- Sons d'ambiance (si présent)

**Classes critiques :**
```vue
<!-- Timer central -->
text-gray-900 dark:text-gray-100
bg-white dark:bg-gray-800

<!-- Boutons contrôle -->
border-gray-300 dark:border-gray-700
text-gray-700 dark:text-gray-300

<!-- Stats -->
bg-gray-50 dark:bg-gray-900/50
text-gray-600 dark:text-gray-400
```

### 🔨 Profile
**Sections principales :**
- Header profil avec nom/email
- Formulaire modification profil (nom, email, password)
- Section préférences (notifications, thème)
- Bouton déconnexion
- Stats utilisateur

**Classes critiques :**
```vue
<!-- Forms -->
bg-white dark:bg-gray-800
border-gray-300 dark:border-gray-700
text-gray-900 dark:text-gray-100
placeholder-gray-400 dark:placeholder-gray-500

<!-- Sections -->
border-gray-200 dark:border-gray-700
bg-gray-50 dark:bg-gray-900/50
```

---

## 🎯 Stratégie d'Application

1. **Lire la page complète**
2. **Identifier les sections principales** (Header, Form, Cards, Lists, Modals)
3. **Appliquer le pattern systématiquement** :
   - Textes : dark:text-gray-XXX
   - Backgrounds : dark:bg-gray-XXX
   - Borders : dark:border-gray-700
   - Transitions : duration-300
4. **Tester visuellement** avec toggle dark mode
5. **Documenter les modifications**

---

## ✅ Checklist par Page

- [ ] **Assignments.vue**
  - [ ] Header + bouton
  - [ ] Formulaire ajout
  - [ ] Filtres
  - [ ] Cards devoirs
  - [ ] Messages vides
  
- [ ] **Calendar.vue**
  - [ ] Navigation mois
  - [ ] Grille jours
  - [ ] Événements
  - [ ] Modal ajout
  
- [ ] **Focus.vue**
  - [ ] Timer
  - [ ] Boutons contrôle
  - [ ] Sélecteur session
  - [ ] Stats
  
- [ ] **Profile.vue**
  - [ ] Formulaires
  - [ ] Préférences
  - [ ] Stats utilisateur
  - [ ] Boutons actions
