# 🎯 Guide Rapide - Landing Page StudyUp

## 🚀 Accès rapide

**URL locale** : http://localhost:3000/landing

## 📋 Checklist de test

### ✅ Navigation
- [ ] Cliquer sur le logo → Retour en haut
- [ ] Menu "Fonctionnalités" → Scroll vers section Features
- [ ] Menu "Témoignages" → Scroll vers section Testimonials
- [ ] Bouton "Rejoindre la bêta" (navbar) → Scroll vers formulaire
- [ ] Bouton "Se connecter" → Redirige vers /login
- [ ] Toggle dark mode → Change le thème instantanément

### ✅ Hero Section
- [ ] Animations au chargement (fade-in progressif)
- [ ] Bouton "Rejoindre la bêta" → Scroll vers formulaire
- [ ] Bouton "Découvrir" → Scroll vers Features
- [ ] Cercles background animés (float effect)
- [ ] Stats (500+, 10k+, 95%) visibles
- [ ] Scroll indicator bounce en bas

### ✅ Problem Section
- [ ] 3 cartes problèmes avec hover scale
- [ ] Grande carte solution avec gradient animé
- [ ] Emojis et texte lisibles

### ✅ Features Section
- [ ] 4 cartes features avec icônes gradient
- [ ] Hover lift effect sur chaque carte
- [ ] Border coloré au hover
- [ ] Checkmarks verts visibles
- [ ] Texte bien espacé et lisible

### ✅ Testimonials Section
- [ ] 6 témoignages avec avatars colorés
- [ ] Étoiles jaunes (5/5)
- [ ] Hover scale sur cartes
- [ ] Gradient backgrounds différents
- [ ] Trust indicators en bas (logos écoles)

### ✅ CTA Section (Formulaire)
- [ ] Champ email avec validation
- [ ] Bouton change au hover (gradient + scale)
- [ ] Submit affiche spinner
- [ ] Message succès apparaît (fade-in vert)
- [ ] Email se vide après submit
- [ ] Trust badges visibles (Gratuit, etc.)
- [ ] Avatars sociaux en bas

### ✅ Footer
- [ ] Logo et description
- [ ] Liens organisés en colonnes
- [ ] Liens sociaux fonctionnels
- [ ] Copyright visible

### ✅ Mobile (< 768px)
- [ ] Hamburger menu fonctionnel
- [ ] Menu slide-down au clic
- [ ] Hero title responsive (text-5xl)
- [ ] Stats grid reste en 3 colonnes
- [ ] Features en 1 colonne
- [ ] Testimonials en 1 colonne
- [ ] Footer en 1 colonne
- [ ] Boutons bien dimensionnés (touch-friendly)

### ✅ Dark Mode
- [ ] Toggle soleil/lune fonctionne
- [ ] Tous les backgrounds s'adaptent
- [ ] Tous les textes restent lisibles
- [ ] Gradients conservés
- [ ] Borders visibles
- [ ] Persistence au refresh (localStorage)

### ✅ Performance
- [ ] Scroll fluide (60fps)
- [ ] Animations smooth (pas de lag)
- [ ] Pas de flash au chargement
- [ ] Images chargent vite (si ajoutées)
- [ ] Transitions rapides

### ✅ Scroll to top button
- [ ] Apparaît après scroll > 50px
- [ ] Disparaît en haut de page
- [ ] Clic → Retour en haut smooth
- [ ] Gradient bleu-violet
- [ ] Fixed en bas à droite

---

## 🎨 Variantes à tester

### Couleurs
Actuellement : Blue (#2563eb) → Purple (#9333ea) → Pink (#ec4899)

Pour changer, éditer dans chaque composant :
```vue
from-blue-600 via-purple-600 to-pink-600
```

### Typographie
Actuellement : Inter (font-family dans main.css)

Pour changer :
```css
@layer base {
  html {
    font-family: 'Satoshi', 'Poppins', system-ui, sans-serif;
  }
}
```

### Animations
Vitesse par défaut : 0.3s (hover), 0.8s (scroll)

Pour ajuster, chercher dans composants :
```vue
transition-all duration-300
```

---

## 🐛 Debug

### Animations ne se déclenchent pas ?
1. Vérifier que `useScrollAnimation.js` est importé
2. Vérifier classes `.animate-on-scroll` dans composants
3. Ouvrir DevTools → Console pour erreurs JS

### Dark mode ne fonctionne pas ?
1. Vérifier `localStorage` dans DevTools → Application
2. Clé : `studyup-dark-mode`
3. Vérifier classe `dark` sur `<html>` dans Elements

### Formulaire ne submit pas ?
1. Ouvrir DevTools → Console
2. Vérifier erreurs JavaScript
3. Email doit être valide (type="email")

### Scroll smooth ne fonctionne pas ?
1. Vérifier `scroll-behavior: smooth` dans CSS
2. IDs des sections corrects (#features, #testimonials, #waitlist)
3. Fonction `scrollTo()` appelée correctement

---

## 📱 Test sur mobile

### Option 1 : DevTools
1. F12 → Toggle device toolbar
2. Choisir iPhone 12 Pro ou Galaxy S20
3. Tester touch/scroll

### Option 2 : Réseau local
1. Trouver IP local : `ipconfig` (Windows) / `ifconfig` (Mac)
2. Exemple : http://192.168.1.10:3000/landing
3. Ouvrir sur téléphone connecté au même WiFi

### Option 3 : Tunnel (ngrok)
1. Installer ngrok
2. `ngrok http 3000`
3. URL publique temporaire générée

---

## 🎯 Modifications rapides

### Changer le texte du Hero
Fichier : `app/components/landing/HeroSection.vue`
Lignes : 22-30 (titre et sous-titre)

### Ajouter un témoignage
Fichier : `app/components/landing/TestimonialsSection.vue`
Dupliquer un bloc `<div class="group p-8 bg-gradient-to-br...">`

### Modifier les stats
Fichier : `app/components/landing/HeroSection.vue`
Lignes : 63-77 (500+, 10k+, 95%)

### Changer les features
Fichier : `app/components/landing/FeaturesSection.vue`
Modifier chaque `<div class="group feature-card...">` (4 blocs)

---

## 🚀 Déploiement

### Build production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

### Variables d'environnement
Créer `.env` :
```env
NUXT_PUBLIC_API_URL=https://api.studyup.com
NUXT_PUBLIC_WAITLIST_ENDPOINT=/api/waitlist
```

### Hébergement recommandé
- **Vercel** : Deploy automatique depuis GitHub
- **Netlify** : Similaire à Vercel
- **Cloudflare Pages** : Rapide et gratuit
- **VPS** : PM2 + Nginx

---

## 📊 Analytics (à ajouter)

### Google Analytics
1. Créer compte GA4
2. Ajouter script dans `nuxt.config.ts`
3. Tracker events : CTA clicks, form submits

### Plausible (recommandé)
Plus simple et privacy-friendly :
```vue
<script defer data-domain="studyup.com" src="https://plausible.io/js/script.js"></script>
```

---

## ✅ Prêt pour la production

Avant de mettre en ligne :

- [ ] Remplacer stats fictives par vraies données
- [ ] Ajouter vrai endpoint API pour waitlist
- [ ] Tester sur Chrome, Firefox, Safari, Edge
- [ ] Tester sur iOS et Android
- [ ] Vérifier Lighthouse score (> 90)
- [ ] Configurer Analytics
- [ ] Ajouter Favicon
- [ ] Configurer SEO meta tags
- [ ] Tester formulaire avec vrai backend
- [ ] Vérifier tous les liens

---

**La landing page est prête ! 🎉**
