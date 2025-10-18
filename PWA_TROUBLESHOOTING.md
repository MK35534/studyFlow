# 🔧 Troubleshooting PWA - Chrome Desktop

## 🐛 Problème : Pas d'icône d'installation dans Chrome

### Symptômes
- L'icône ⊕ (installer) n'apparaît pas dans la barre d'adresse
- Pas de popup d'installation après 5 secondes
- Chrome ne propose pas d'installer la PWA

---

## ✅ Solutions

### 1. Vérifier les prérequis PWA

Chrome n'affiche l'icône d'installation que si **tous les critères PWA sont remplis** :

#### Ouvrir les DevTools (F12) → Onglet "Application"

**Section "Manifest" :**
```
✅ Le manifest est présent et valide
✅ Les icônes sont chargées (au moins 192x192 et 512x512)
✅ name, short_name, start_url sont définis
✅ display: "standalone" ou "fullscreen"
```

**Section "Service Workers" :**
```
✅ Au moins 1 Service Worker actif
✅ État: "activated and is running"
```

---

### 2. Vérifier le manifest.json

#### Dans la console (F12), tape :
```javascript
fetch('/manifest.webmanifest')
  .then(r => r.json())
  .then(data => console.log('Manifest:', data))
```

**Tu dois voir :**
```json
{
  "name": "StudyFlow - Gestion des Devoirs",
  "short_name": "StudyFlow",
  "description": "Organisez vos devoirs et révisions",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Si erreur 404 :** Le manifest n'est pas généré → Relance `npm run dev`

---

### 3. Vérifier les icônes

#### Dans DevTools → Application → Manifest
Vérifie que toutes les icônes s'affichent (pas d'erreur 404).

**Si icônes manquantes :**
```bash
# Les icônes doivent être dans public/icons/
ls public/icons/*.png

# Tu dois avoir au minimum :
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png
icon-192x192.png
icon-384x384.png
icon-512x512.png
```

**Si elles manquent :**
1. Ouvre `http://localhost:3000/icons/generator.html`
2. Clique "📥 Télécharger le ZIP"
3. Extrais les PNG dans `public/icons/`
4. Relance le serveur

---

### 4. Vérifier le Service Worker

#### DevTools → Application → Service Workers

**Si "No service workers" :**
```javascript
// Dans la console, force l'enregistrement
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('✅ SW enregistré:', reg))
    .catch(err => console.error('❌ Erreur SW:', err))
}
```

**Si erreur 404 sur /sw.js :**
- Vérifie que `@vite-pwa/nuxt` est bien dans `nuxt.config.ts`
- Relance `npm run dev`
- Le Service Worker est généré automatiquement par Vite PWA

---

### 5. Vérifier la configuration Nuxt

#### Dans `nuxt.config.ts` :
```typescript
export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt' // ✅ Doit être présent
  ],
  
  pwa: {
    manifest: {
      name: 'StudyFlow - Gestion des Devoirs',
      short_name: 'StudyFlow',
      // ... autres options
    },
    
    workbox: {
      // Configuration du Service Worker
    }
  }
})
```

---

### 6. Tester manuellement l'installation

#### Si l'icône n'apparaît toujours pas :

**Option A : Menu Chrome**
1. Menu ⋮ (3 points en haut à droite)
2. **"Enregistrer et partager"** → **"Installer StudyFlow..."**
3. Si cette option n'existe pas → Critères PWA non remplis

**Option B : Forcer via la console**
```javascript
// Écouter l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ beforeinstallprompt déclenché !')
  e.preventDefault()
  
  // Afficher le prompt immédiatement
  e.prompt()
  
  e.userChoice.then((choice) => {
    console.log('Choix:', choice.outcome)
  })
})

// Si aucun log après 10 secondes → Critères PWA non remplis
```

---

### 7. Mode développement vs production

⚠️ **Important :** Chrome est plus strict en développement (localhost)

**En développement (localhost) :**
- Service Worker peut ne pas s'activer immédiatement
- Icônes peuvent être en cache
- `beforeinstallprompt` peut ne pas se déclencher

**Solutions :**
1. **Hard refresh :** Ctrl + Shift + R
2. **Vider le cache :** F12 → Application → Storage → Clear storage
3. **Tester en production :** Déployer sur Vercel/Netlify

---

### 8. Vérifier HTTPS (production)

Chrome nécessite **HTTPS** pour les PWA (sauf localhost).

**Si déployé sur Vercel/Netlify :**
- ✅ HTTPS automatique
- ✅ Service Worker activé automatiquement

**Si hébergement custom :**
- Vérifie que l'URL commence par `https://`
- Installe un certificat SSL (Let's Encrypt gratuit)

---

### 9. Popup personnalisée (fallback)

Si Chrome ne déclenche pas `beforeinstallprompt`, la popup personnalisée s'affiche **après 5 secondes** avec les instructions manuelles :

```
Sur Chrome/Edge (desktop) :
1. Cherchez l'icône ⊕ dans la barre d'adresse (à droite)
2. Cliquez sur "Installer StudyFlow"
3. L'application s'ouvrira dans une fenêtre séparée
```

**Si la popup n'apparaît pas :**
```javascript
// Forcer l'affichage dans la console
localStorage.removeItem('pwa-install-dismissed')
location.reload()
```

---

## 🧪 Checklist complète

- [ ] Serveur lancé (`npm run dev`)
- [ ] Chrome/Edge (pas Firefox)
- [ ] DevTools → Application → Manifest visible
- [ ] DevTools → Application → Service Worker actif
- [ ] Icônes dans `public/icons/` (au moins 192x192 et 512x512)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Cache vidé (F12 → Application → Clear storage)
- [ ] Attendre 5 secondes pour la popup
- [ ] Vérifier la barre d'adresse (icône ⊕ à droite)

---

## 🎯 Test rapide

```javascript
// Copie-colle dans la console (F12)

// 1. Vérifier le manifest
fetch('/manifest.webmanifest')
  .then(r => r.json())
  .then(m => {
    console.log('✅ Manifest:', m.name)
    console.log('✅ Icônes:', m.icons.length)
  })
  .catch(e => console.error('❌ Manifest error:', e))

// 2. Vérifier le Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => {
      if (regs.length > 0) {
        console.log('✅ Service Workers:', regs.length)
      } else {
        console.warn('⚠️ Pas de Service Worker enregistré')
      }
    })
}

// 3. Vérifier les critères d'installation
console.log('Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'Standalone (déjà installé)' : 'Browser')
```

---

## 💡 Solutions rapides

### Si rien ne fonctionne :

1. **Redémarrer complètement :**
   ```bash
   # Arrêter le serveur (Ctrl+C)
   npm run dev
   ```

2. **Vider tout le cache :**
   - F12 → Application → Clear storage → "Clear site data"
   - Relancer Chrome

3. **Tester en navigation privée :**
   - Ctrl+Shift+N (mode incognito)
   - Ouvrir `http://localhost:3000`
   - Pas de cache, pas d'extensions

4. **Tester en production :**
   ```bash
   # Déployer sur Vercel
   git push
   
   # Puis ouvrir l'URL de production
   # → Chrome sera moins strict
   ```

---

## 📱 Alternative : Tester sur mobile

Si Chrome desktop ne fonctionne pas, teste sur mobile :

**Android :**
1. Connecte ton téléphone au même WiFi que ton PC
2. Trouve l'IP de ton PC : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
3. Sur Android Chrome : `http://192.168.X.X:3000`
4. → La popup d'installation devrait apparaître immédiatement

**iOS :**
1. Utilise Safari (pas Chrome iOS)
2. Même IP : `http://192.168.X.X:3000`
3. Bouton partage → "Sur l'écran d'accueil"

---

**Si le problème persiste, envoie-moi les logs de la console !** 🔍
