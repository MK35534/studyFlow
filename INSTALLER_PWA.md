# 📱 Comment installer StudyFlow en PWA

## 🎯 C'est quoi une PWA ?
Une **Progressive Web App** = ton site web installé comme une vraie application, **sans passer par l'App Store ou Google Play** (et donc **gratuitement** ! 💰).

---

## 🖥️ Installation sur PC (Windows/Mac/Linux)

### 1️⃣ Sur Chrome/Edge
1. **Ouvre** `http://localhost:3000`
2. Attends **3 secondes**, une popup apparaît en bas à droite :
   ```
   📱 Installer StudyFlow
   Accédez rapidement à vos devoirs depuis votre écran d'accueil
   ✅ Fonctionne hors ligne
   ✅ Notifications des devoirs
   ✅ Accès rapide depuis l'écran d'accueil
   [Installer] [Plus tard]
   ```
3. **Clique sur "Installer"**
4. L'appli s'installe et s'ouvre dans une fenêtre séparée (sans barre d'adresse)

**Alternative manuelle :**
- Regarde dans la **barre d'adresse** à droite → **icône ⊕ (plus)** ou **icône d'installation**
- Clique dessus → "Installer StudyFlow"

---

## 📱 Installation sur Android

### Sur Chrome
1. **Ouvre** ton site (localhost si en dev, ou URL de production)
2. Attends **3 secondes**, la popup apparaît
3. **Clique "Installer"**
4. Chrome affiche un message natif Android : "Ajouter StudyFlow à l'écran d'accueil ?"
5. **Confirme** → L'icône apparaît sur ton écran d'accueil !

**Alternative manuelle :**
- Menu ⋮ (3 points en haut à droite) → **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**

---

## 🍎 Installation sur iPhone/iPad

⚠️ **Safari seulement** (Chrome iOS ne supporte pas les PWA)

1. **Ouvre Safari** sur `http://localhost:3000` (ou ton URL de prod)
2. La popup apparaît avec **instructions iOS** :
   ```
   📱 Installer StudyFlow sur iOS
   
   Instructions :
   1. Touchez l'icône de partage 📤 en bas
   2. Faites défiler et sélectionnez "Sur l'écran d'accueil"
   3. Touchez "Ajouter"
   ```
3. **Suis les instructions** :
   - Touche **📤 (bouton partage)** en bas au milieu
   - Scroll jusqu'à trouver **"Sur l'écran d'accueil"**
   - Touche **"Ajouter"** en haut à droite

**Note :** iOS ne permet pas l'installation automatique, c'est toujours manuel.

---

## ✅ Comment vérifier que c'est bien installé ?

### Sur PC
- Une **icône StudyFlow** apparaît dans ton menu démarrer / Dock
- L'app s'ouvre **dans une fenêtre séparée** (pas d'onglet de navigateur)
- Pas de barre d'adresse visible

### Sur mobile
- **Icône StudyFlow** sur ton écran d'accueil
- Quand tu l'ouvres, ça ressemble à une vraie app (barre de statut + app plein écran)
- Pas de barre d'adresse Safari/Chrome visible

---

## 🧪 Tester que ça marche hors ligne

1. **Ouvre l'app installée**
2. **F12** → Onglet **"Application"** (Chrome) ou **"Stockage"** (Firefox)
3. Section **"Service Workers"** → Tu dois voir :
   ```
   ✅ Service Worker: Active and running
   Source: /sw.js ou /_nuxt/service-worker.js
   ```
4. Onglet **"Network"** → Coche **"Offline"**
5. **Rafraîchis la page** (F5)
6. ✅ **Ça marche quand même !** (cache du Service Worker)

---

## 🚨 Problèmes courants

### ❌ "La popup n'apparaît pas"
**Causes possibles :**
1. Tu l'as déjà installée → Vérifie dans ton menu démarrer / apps
2. Tu l'as dismissée (bouton ✕) → Elle reviendra dans 7 jours
3. Tu n'es pas sur **localhost** ou **HTTPS** → PWA nécessite une connexion sécurisée

**Solution rapide :**
```javascript
// Ouvre la console (F12) et tape :
localStorage.removeItem('pwa-install-dismissed')
location.reload()
```

### ❌ "Je n'ai pas d'icône ⊕ dans la barre d'adresse"
**Causes :**
1. Les **icônes PNG** ne sont pas générées
2. Le **manifest.json** est invalide

**Solution :**
```powershell
# 1. Génère les icônes
# Ouvre http://localhost:3000/icons/generator.html
# Télécharge le ZIP
# Extrais dans public/icons/

# 2. Vérifie le manifest
# F12 → Application → Manifest
# Tu dois voir 10 icônes (72x72 à 512x512)
```

### ❌ "Service Worker ne s'active pas"
**Causes :**
1. Mode **développement** → C'est normal, Service Worker en mode "auto-update"
2. Erreur dans `nuxt.config.ts`

**Solution :**
```powershell
# Vérifie dans F12 → Console
# Tu dois voir :
# ✅ "Nuxt PWA: Service Worker registered"

# Si erreur, relance le serveur :
npm run dev
```

---

## 🎯 En production (Vercel/Netlify)

1. **Deploy** sur Vercel/Netlify
2. URL = **https://studyflow.vercel.app** (exemple)
3. Ouvre sur mobile → **Popup automatique après 3 secondes**
4. **Installe !** 🚀

**Avantage production :**
- Fonctionne sur **tous les appareils** (pas besoin de localhost)
- **HTTPS** automatique (requis pour PWA)
- **Service Worker optimisé** (cache agressif)

---

## 📊 Checklist complète

- [ ] **Icons générés** (11 PNG dans `public/icons/`)
- [ ] **Serveur lancé** (`npm run dev`)
- [ ] **Navigateur compatible** (Chrome/Edge/Safari)
- [ ] **Popup apparaît** après 3 secondes
- [ ] **Installation réussie** (icône sur écran d'accueil)
- [ ] **Service Worker actif** (F12 → Application)
- [ ] **Fonctionne hors ligne** (mode offline testé)

---

## 💡 Résumé ultra-simple

### 🖥️ **PC** :
1. Ouvre `localhost:3000`
2. Clique sur **"Installer"** dans la popup
3. ✅ Terminé !

### 📱 **Android** :
1. Ouvre dans Chrome
2. Clique **"Installer"** dans la popup
3. ✅ Icône sur écran d'accueil !

### 🍎 **iPhone** :
1. Ouvre dans Safari
2. **📤 (partage)** → **"Sur l'écran d'accueil"** → **"Ajouter"**
3. ✅ Icône sur écran d'accueil !

---

**Besoin d'aide ?** Ouvre la console (F12) et regarde les messages de la PWA ! 🔍
