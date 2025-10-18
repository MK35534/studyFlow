# 🚀 Guide Rapide : Installer StudyFlow PWA

## Pour toi (développeur)

### 1️⃣ Générer les icônes (5 minutes)

```bash
# Ouvrir le générateur dans ton navigateur
http://localhost:3000/icons/generator.html

# OU ouvrir le fichier directement
C:\Users\Maxime\Desktop\dev\studyFlow\public\icons\generator.html
```

**Étapes dans le générateur** :
1. Les icônes sont générées automatiquement au chargement
2. Clique sur "📥 Télécharger le ZIP"
3. Extrais le ZIP
4. Copie tous les fichiers PNG dans `public/icons/`

**Résultat** : 11 fichiers PNG prêts à l'emploi

---

### 2️⃣ Redémarrer le serveur

```powershell
# Arrête le serveur (Ctrl+C)
# Puis relance
npm run dev
```

---

### 3️⃣ Tester sur Desktop

1. Ouvre **Chrome**
2. Va sur http://localhost:3000
3. Attends **3 secondes**
4. Une popup apparaît en bas à droite
5. Clique sur **"Installer"**
6. L'app s'ouvre dans une fenêtre séparée
7. Vérifie le menu démarrer → Icône StudyFlow ajoutée

---

### 4️⃣ Tester Offline

```
1. F12 (DevTools)
2. Onglet "Network"
3. Coche "Offline"
4. Rafraîchis la page
5. L'app doit fonctionner normalement ✅
```

---

## Pour tes utilisateurs

### 📱 Sur Android (Chrome/Edge)

```
1. Ouvrir studyflow.com
2. Popup "Installer StudyFlow" apparaît
3. Appuyer sur "Installer"
4. ✅ Icône ajoutée à l'écran d'accueil
```

**Utilisation** :
- Ouvre comme une app normale
- Plein écran (pas de barre d'URL)
- Fonctionne sans réseau

---

### 🍎 Sur iPhone/iPad (Safari)

```
1. Ouvrir studyflow.com sur Safari
2. Popup avec instructions apparaît
3. Appuyer sur le bouton "Partager" 📤
4. Scroll vers le bas
5. Choisir "Ajouter à l'écran d'accueil"
6. Appuyer sur "Ajouter"
7. ✅ Icône ajoutée
```

**Note iOS** : Apple ne supporte pas le prompt automatique, donc on affiche des instructions manuelles.

---

### 💻 Sur Desktop (Chrome/Edge)

```
1. Ouvrir studyflow.com
2. Popup d'installation apparaît
3. OU : Icône ⊕ dans la barre d'adresse
4. Cliquer sur "Installer"
5. ✅ App dans la barre des tâches
```

---

## ⚙️ Options Avancées

### Changer les icônes plus tard

```bash
# Remplace simplement les fichiers dans public/icons/
# Pas besoin de modifier nuxt.config.ts
# Les nouvelles icônes sont prises au prochain build
```

### Changer les couleurs du thème

```typescript
// nuxt.config.ts → pwa.manifest
theme_color: '#3b82f6',        // Barre de statut Android
background_color: '#ffffff',   // Splash screen
```

### Désactiver le prompt d'installation

```vue
<!-- app/app.vue -->
<!-- Commente ou supprime cette ligne -->
<!-- <PWAInstallPrompt /> -->
```

### Forcer la mise à jour du Service Worker

```javascript
// Dans la console du navigateur
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister())
})
location.reload()
```

---

## 🐛 Troubleshooting

### Le prompt n'apparaît pas
- Vérifie que tu n'es pas déjà en mode standalone
- Vide le cache : Ctrl+Shift+R
- Vérifie DevTools → Application → Manifest

### Icônes ne s'affichent pas
- Génère-les avec generator.html
- Vérifie qu'elles sont dans `public/icons/`
- Nom exact : `icon-192x192.png` (pas d'espace)

### Service Worker ne se met pas à jour
- Ferme tous les onglets de l'app
- Ouvre DevTools → Application → Service Workers
- Clique sur "Unregister"
- Rafraîchis

### Mode offline ne fonctionne pas
- Visite d'abord les pages online (elles seront cachées)
- Vérifie DevTools → Application → Cache Storage
- Les ressources doivent être listées

---

## 📊 Vérifier que ça fonctionne

### Chrome DevTools Audit

```
1. F12 → Lighthouse
2. Sélectionne "Progressive Web App"
3. Clique "Generate report"
4. Score attendu : 90-100/100 ✅
```

### Checklist PWA

```
✅ Service Worker enregistré
✅ Manifest présent
✅ Icônes 192x192 et 512x512
✅ HTTPS (en production)
✅ Responsive
✅ Installable
✅ Offline capable
```

---

## 🎯 Prochaine Étape

Une fois que tout fonctionne :

**Priority 10 : Notifications Push** (optionnel)
- Rappels de devoirs
- Événements du calendrier
- Mode focus terminé

Dis-moi quand tu es prêt ! 🚀

---

*Guide créé le 18 octobre 2025*
*Pour StudyFlow PWA v1.0*
