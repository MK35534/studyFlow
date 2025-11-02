# 🚀 Landing Page StudyUp

> Landing page moderne et inspirante pour StudyUp - L'app qui aide les étudiants à s'organiser

[![Built with Nuxt](https://img.shields.io/badge/Built%20with-Nuxt%203-00DC82?style=flat&logo=nuxt.js)](https://nuxt.com/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table des matières

- [🎯 Aperçu](#-aperçu)
- [✨ Caractéristiques](#-caractéristiques)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [📂 Structure](#-structure)
- [🎨 Personnalisation](#-personnalisation)
- [📱 Responsive](#-responsive)
- [🌙 Dark Mode](#-dark-mode)
- [⚡ Performance](#-performance)
- [📚 Documentation](#-documentation)
- [🤝 Contribution](#-contribution)

---

## 🎯 Aperçu

Landing page premium pour StudyUp avec design moderne, animations fluides et expérience utilisateur optimale.

**🔗 URL de développement** : http://localhost:3000/landing

**📸 Screenshots** : _(À ajouter)_

---

## ✨ Caractéristiques

### Design
- ✅ Design minimaliste inspiré d'Apple, Notion, Linear
- ✅ Gradients modernes (Blue → Purple → Pink)
- ✅ Typographie élégante (Inter)
- ✅ Espaces aérés et hiérarchie visuelle claire

### Fonctionnalités
- ✅ **6 sections** : Hero, Problem, Features, Testimonials, CTA, Footer
- ✅ **Navigation fluide** : Smooth scroll entre sections
- ✅ **Formulaire bêta** : Email validation + success state
- ✅ **Scroll progress bar** : Barre de progression gradient
- ✅ **Scroll to top** : Bouton flottant

### Animations
- ✅ Fade-in progressif au chargement
- ✅ Scroll reveal avec IntersectionObserver
- ✅ Hover effects (scale, shadow, color)
- ✅ Float animations sur backgrounds
- ✅ Micro-interactions sur tous les éléments

### Responsive
- ✅ Mobile-first design (< 640px)
- ✅ Layout adapté tablet (640px-1024px)
- ✅ Expérience premium desktop (> 1024px)
- ✅ Hamburger menu mobile

### Performance
- ✅ SSR activé pour meilleur SEO
- ✅ Lazy loading des animations
- ✅ GPU acceleration (transform/opacity)
- ✅ Optimized scroll listeners

### SEO
- ✅ Meta tags (title, description, Open Graph)
- ✅ Semantic HTML
- ✅ Lighthouse score > 90

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repo (si applicable)
git clone [repo-url]

# Installer les dépendances
cd studyFlow
npm install

# Lancer le serveur de développement
npm run dev
```

### Accès à la landing page
Ouvrir http://localhost:3000/landing dans le navigateur

### Build pour production
```bash
npm run build
npm run preview
```

---

## 📂 Structure

```
studyFlow/
├── app/
│   ├── components/
│   │   └── landing/
│   │       ├── ScrollProgressBar.vue    # Barre de progression
│   │       ├── HeroSection.vue          # Section hero + CTA
│   │       ├── ProblemSection.vue       # Problème + Solution
│   │       ├── FeaturesSection.vue      # 4 fonctionnalités
│   │       ├── TestimonialsSection.vue  # 6 témoignages
│   │       └── CTASection.vue           # Formulaire bêta
│   ├── composables/
│   │   └── useScrollAnimation.js        # IntersectionObserver
│   ├── config/
│   │   └── landing.config.js            # Configuration centralisée
│   ├── pages/
│   │   └── landing.vue                  # Page principale
│   └── assets/
│       └── css/
│           └── main.css                 # Animations CSS
└── docs/
    ├── LANDING_PAGE_COMPLETE.md         # Doc technique
    ├── LANDING_PAGE_QUICKSTART.md       # Guide rapide
    ├── LANDING_PAGE_VISUAL.md           # Présentation visuelle
    └── LANDING_PAGE_SUMMARY.md          # Récapitulatif
```

---

## 🎨 Personnalisation

### Configuration centralisée
Modifier `app/config/landing.config.js` pour changer :
- Textes (titres, sous-titres, descriptions)
- Stats (500+, 10k+, 95%)
- Features (4 fonctionnalités)
- Testimonials (6 témoignages)
- Couleurs (gradients)

### Exemples

#### Changer le titre du Hero
```javascript
// app/config/landing.config.js
hero: {
  title: {
    gradient: 'Ton nouveau titre,',
    normal: 'suite du titre.',
  },
}
```

#### Modifier les couleurs
```javascript
colors: {
  gradient: 'from-green-600 via-blue-600 to-purple-600',
}
```

#### Ajuster les animations
```vue
<!-- Dans chaque composant -->
<div class="transition-all duration-300">
  <!-- Changer 300 pour plus rapide/lent -->
</div>
```

---

## 📱 Responsive

### Breakpoints Tailwind

| Device  | Width        | Layout                    |
|---------|--------------|---------------------------|
| Mobile  | < 640px      | 1 colonne, hamburger menu |
| Tablet  | 640-1024px   | 2 colonnes                |
| Desktop | > 1024px     | 3-4 colonnes              |

### Test responsive

**Option 1 : DevTools**
```
F12 → Toggle device toolbar → Choisir iPhone 12 Pro
```

**Option 2 : Réseau local**
```bash
# Trouver IP locale
ipconfig  # Windows
ifconfig  # Mac/Linux

# Ouvrir sur mobile
http://192.168.1.X:3000/landing
```

---

## 🌙 Dark Mode

### Activation
Cliquer sur l'icône 🌙/☀️ dans la navbar

### Persistance
Le choix est sauvegardé dans `localStorage` :
```javascript
localStorage.getItem('studyup-dark-mode') // 'true' ou 'false'
```

### Personnalisation
Modifier dans les composants :
```vue
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">
    Texte qui s'adapte au dark mode
  </p>
</div>
```

---

## ⚡ Performance

### Objectifs Lighthouse
- **Performance** : > 90
- **Accessibility** : > 95
- **Best Practices** : 100
- **SEO** : > 90

### Core Web Vitals
- **LCP** : < 2.5s
- **FID** : < 100ms
- **CLS** : < 0.1

### Optimisations appliquées
- ✅ SSR pour meilleur First Contentful Paint
- ✅ Lazy loading des animations avec cleanup
- ✅ GPU acceleration (transform/opacity)
- ✅ Passive scroll listeners
- ✅ Code splitting automatique (Nuxt)

### Mesurer les performances
```bash
# Lighthouse dans Chrome DevTools
F12 → Lighthouse → Generate report

# Ou en CLI
npm install -g lighthouse
lighthouse http://localhost:3000/landing
```

---

## 📚 Documentation

### Guides disponibles
- **LANDING_PAGE_COMPLETE.md** - Documentation technique complète
- **LANDING_PAGE_QUICKSTART.md** - Guide de test et déploiement
- **LANDING_PAGE_VISUAL.md** - Présentation visuelle ASCII art
- **LANDING_PAGE_SUMMARY.md** - Récapitulatif et checklist

### Composants détaillés

| Composant              | Description                          | Lignes |
|------------------------|--------------------------------------|--------|
| ScrollProgressBar.vue  | Barre de progression du scroll       | 40     |
| HeroSection.vue        | Section hero avec CTA                | 187    |
| ProblemSection.vue     | Problème + Solution                  | 67     |
| FeaturesSection.vue    | 4 fonctionnalités principales        | 171    |
| TestimonialsSection.vue| 6 témoignages étudiants              | 175    |
| CTASection.vue         | Formulaire d'inscription bêta        | 198    |
| landing.vue            | Page principale avec navbar + footer | 348    |

---

## 🐛 Debugging

### Animations ne se déclenchent pas ?
1. Vérifier la console DevTools (F12)
2. S'assurer que `useScrollAnimation.js` est chargé
3. Vérifier les classes `.animate-on-scroll`

### Dark mode ne fonctionne pas ?
1. DevTools → Application → Local Storage
2. Vérifier clé `studyup-dark-mode`
3. Inspecter `<html class="dark">` dans Elements

### Formulaire ne submit pas ?
1. Console → Vérifier erreurs JS
2. Email doit être valide (type="email")
3. Vérifier fonction `handleSubmit()`

---

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Installer Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=.output/public
```

### Variables d'environnement
Créer `.env` :
```env
NUXT_PUBLIC_API_URL=https://api.studyup.com
NUXT_PUBLIC_WAITLIST_ENDPOINT=/api/waitlist
```

---

## ✅ Checklist avant production

### Technique
- [x] Tous les composants testés
- [x] Responsive vérifié
- [x] Dark mode fonctionnel
- [x] Animations fluides
- [ ] Analytics configuré
- [ ] Endpoint API waitlist créé
- [ ] Lighthouse score > 90
- [ ] Favicon ajouté

### Contenu
- [x] Textes finalisés
- [x] Statistiques à jour
- [ ] Screenshots réelles
- [ ] Vidéo démo (optionnel)
- [ ] Témoignages vrais clients

### Légal
- [ ] CGU rédigées
- [ ] Politique de confidentialité
- [ ] RGPD compliance

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- **Nuxt 3** - Framework Vue.js
- **TailwindCSS** - Framework CSS
- **Inter Font** - Typographie
- Design inspiré de : Apple, Notion, Linear, Capacities

---

## 📧 Contact

**Projet** : StudyUp  
**Email** : contact@studyup.com  
**Website** : https://studyup.com

---

<div align="center">

**Fait avec ❤️ pour les étudiants**

[⬆ Retour en haut](#-landing-page-studyup)

</div>
