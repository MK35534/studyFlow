# 🔧 Fix: "Aucun fichier manifest détecté"

## 🐛 Problème
Chrome/DevTools affiche : **"No manifest detected"** ou **"Aucun fichier manifest détecté"**

---

## ✅ Solution rapide

### 1. Vérifier que le serveur tourne
```powershell
# Dans le terminal
npm run dev

# Le serveur doit afficher :
# ✔ Vite server listening on http://localhost:3000
```

### 2. Vérifier le manifest dans le navigateur
```
Ouvre : http://localhost:3000/manifest.webmanifest

OU

Ouvre : http://localhost:3000/.vite/manifest.json
```

**Si erreur 404** → Le manifest n'est pas généré → Voir les solutions ci-dessous

---

## 🔍 Diagnostic complet

### Étape 1 : Vérifier la balise <link> dans le HTML

Ouvre `http://localhost:3000` puis **F12** → **Onglet Elements** → `<head>`

**Tu dois voir :**
```html
<link rel="manifest" href="/manifest.webmanifest">
```

**Si absente** → Le plugin PWA ne s'active pas

---

### Étape 2 : Vérifier la configuration Nuxt

Ouvre le terminal et vérifie :

```powershell
# 1. Vérifier que @vite-pwa/nuxt est installé
npm list @vite-pwa/nuxt

# Doit afficher :
# @vite-pwa/nuxt@1.1.0
```

**Si "UNMET DEPENDENCY"** :
```powershell
npm install @vite-pwa/nuxt@latest
npm install workbox-window
```

---

### Étape 3 : Redémarrer complètement le serveur

```powershell
# 1. Arrêter TOUS les processus Node
Get-Process -Name node | Stop-Process -Force

# 2. Supprimer les caches
Remove-Item -Recurse -Force .nuxt -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .output -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue

# 3. Relancer
npm run dev
```

---

### Étape 4 : Forcer la génération du manifest

Crée un fichier `public/manifest.webmanifest` manuel :

```json
{
  "name": "StudyFlow - Gestion des Devoirs",
  "short_name": "StudyFlow",
  "description": "Organisez vos cours, devoirs et révisions",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512x512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

---

### Étape 5 : Ajouter la balise manifest manuellement

Si le plugin ne fonctionne toujours pas, ajoute-le manuellement dans `app.vue` :

```vue
<script setup>
// Dans app.vue
useHead({
  link: [
    {
      rel: 'manifest',
      href: '/manifest.webmanifest'
    }
  ]
})
</script>
```

---

### Étape 6 : Vérifier les icônes

```powershell
# Les icônes DOIVENT exister
ls public/icons/*.png

# Tu dois avoir au minimum :
# icon-192x192.png
# icon-512x512.png
```

**Si elles manquent :**
1. Ouvre `http://localhost:3000/icons/generator.html`
2. Télécharge le ZIP
3. Extrais dans `public/icons/`

---

## 🧪 Test final

### Console JavaScript (F12)

```javascript
// 1. Vérifier le manifest
fetch('/manifest.webmanifest')
  .then(r => r.json())
  .then(m => console.log('✅ Manifest:', m))
  .catch(e => console.error('❌ Erreur manifest:', e))

// 2. Vérifier dans le DOM
const link = document.querySelector('link[rel="manifest"]')
if (link) {
  console.log('✅ Balise manifest:', link.href)
} else {
  console.error('❌ Pas de balise <link rel="manifest">')
}
```

---

## 🎯 Checklist de dépannage

- [ ] Serveur lancé (`npm run dev`)
- [ ] Module `@vite-pwa/nuxt` installé (`npm list @vite-pwa/nuxt`)
- [ ] Cache vidé (`.nuxt`, `.output`, `node_modules/.vite`)
- [ ] Serveur redémarré complètement
- [ ] Manifest accessible : `http://localhost:3000/manifest.webmanifest`
- [ ] Icônes présentes : `public/icons/icon-*.png`
- [ ] Balise `<link rel="manifest">` dans le `<head>`
- [ ] Hard refresh (Ctrl+Shift+R)

---

## 💡 Solution de secours

Si rien ne fonctionne, utilise le manifest manuel :

```powershell
# 1. Créer le fichier
New-Item -Path "public/manifest.webmanifest" -ItemType File -Force

# 2. Copier le contenu JSON ci-dessus dedans

# 3. Ajouter dans app.vue :
# useHead({ link: [{ rel: 'manifest', href: '/manifest.webmanifest' }] })

# 4. Redémarrer
npm run dev
```

---

## 📊 Commandes de diagnostic

```powershell
# Vérifier que le serveur écoute sur le port 3000
netstat -ano | findstr :3000

# Vérifier les processus Node
Get-Process -Name node

# Tester le manifest avec curl
curl http://localhost:3000/manifest.webmanifest

# Relancer proprement
npm run dev
```

---

**Si le problème persiste, envoie-moi les logs de la console !** 🔍
