# 🚀 Script d'Application Dark Mode Rapide

## Pages restantes à adapter manuellement

Pour terminer rapidement l'adaptation dark mode, voici les modifications systématiques à appliquer :

### **Pattern de remplacement global**

Utiliser "Find & Replace" (Ctrl+H) dans VS Code sur chaque fichier :

#### 1. Textes principaux
```
Chercher:    class="text-gray-900
Remplacer:   class="text-gray-900 dark:text-gray-100 transition-colors duration-300

Chercher:    class="text-gray-800
Remplacer:   class="text-gray-800 dark:text-gray-200 transition-colors duration-300

Chercher:    class="text-gray-700
Remplacer:   class="text-gray-700 dark:text-gray-300 transition-colors duration-300

Chercher:    class="text-gray-600
Remplacer:   class="text-gray-600 dark:text-gray-400 transition-colors duration-300
```

#### 2. Backgrounds blancs
```
Chercher:    bg-white
Remplacer:   bg-white dark:bg-gray-800

Chercher:    from-white
Remplacer:   from-white dark:from-gray-800

Chercher:    to-white
Remplacer:   to-white dark:to-gray-900
```

#### 3. Borders
```
Chercher:    border-gray-200
Remplacer:   border-gray-200 dark:border-gray-700

Chercher:    border-gray-300
Remplacer:   border-gray-300 dark:border-gray-700
```

#### 4. Backgrounds gris
```
Chercher:    bg-gray-50
Remplacer:   bg-gray-50 dark:bg-gray-900/50

Chercher:    bg-gray-100
Remplacer:   bg-gray-100 dark:bg-gray-800/50
```

---

## ⚡ Application Rapide par Fichier

### **calendar.vue**
1. Ouvrir le fichier
2. Ctrl+H (Find & Replace)
3. Appliquer les 4 patterns ci-dessus
4. Sauvegarder

### **focus.vue**
1. Ouvrir le fichier
2. Ctrl+H (Find & Replace)
3. Appliquer les 4 patterns ci-dessus
4. Sauvegarder

### **profile.vue**
1. Ouvrir le fichier
2. Ctrl+H (Find & Replace)
3. Appliquer les 4 patterns ci-dessus
4. Sauvegarder

---

## ✅ Validation

Après chaque fichier :
1. Toggle le mode sombre (bouton lune/soleil)
2. Vérifier visuellement que ça marche
3. Si un élément ne change pas, l'adapter manuellement

---

## 🎯 Objectif

**100% des pages adaptées en dark mode en < 15 minutes !**
