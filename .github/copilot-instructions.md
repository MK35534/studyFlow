# 🎓 Instructions Copilot – Projet SaaS Éducatif

## 🌍 Contexte global
C’est un SaaS éducatif qui aide les étudiants à mieux s’organiser dans leurs cours et devoirs.  
Les principales fonctionnalités :
- Gestion des matières et des devoirs
- Calendrier avec événements récurrents
- Mode focus intégré
- Notifications avec toasts et animations
- Authentification JWT sécurisée (vérifiée côté frontend et backend)
- Interface responsive et bientôt disponible en PWA / appli mobile
- (à venir) Synchronisation automatique avec Pronote

L’objectif est d’avoir une application fluide, claire et agréable à utiliser.

---

## 🧱 Stack technique
**Frontend :**
- Nuxt 3 (Vue 3, Composition API)
- TailwindCSS
- PrimeVue (composants UI)
- Toasts pour notifications
- Transitions animées (framer-motion/vue transitions)
- JWT stocké dans les cookies (authentification persistante)
- Routing géré par NuxtLink

**Backend :**
- Node.js + Express
- Base de données MySQL
- Auth avec JWT
- API REST structurée (`/api/users`, `/api/subjects`, `/api/assignments`, etc.)

---

## 🧭 Directives générales pour Copilot

### ✅ Style de code
- Syntaxe moderne Vue 3 avec `<script setup>` et `export default` pour les composants.  
- Code lisible, bien indenté, commenté uniquement si utile.  
- Respecte les conventions Tailwind (`flex`, `items-center`, `justify-between`, etc.).  
- Utiliser des classes utilitaires Tailwind plutôt que du CSS manuel.  
- Préfère la **clarté à la concision** : Copilot doit proposer du code propre, pas du code “magique”.

### ✅ Accessibilité et design
- Interface minimaliste inspirée de Notion / Capacities (blanc, bleu, gris clair).
- Design responsive : priorité à mobile-first.
- Toujours tester le rendu sur `md:hidden` / `md:block`.
- Utiliser des icônes SVG inline, pas de librairies externes inutiles.

### ✅ Bonnes pratiques
- Pas de code dur : les routes, tokens et URLs doivent venir d’un fichier `config` ou `.env`.
- Ne jamais exposer le JWT directement.
- Toujours valider les entrées utilisateurs avant requêtes API.
- Les composants doivent être découplés : un composant = une responsabilité.
- Les transitions et animations doivent être fluides et discrètes.

---

## 🚀 Objectifs actuels du projet
1. Finaliser le **responsive design complet** (desktop / tablette / mobile).  
2. Structurer les **layouts** pour mobile (`BottomNavigation`, `SafeArea`, etc.).  
3. Améliorer la **gestion du calendrier** (ajout d’événements récurrents).  
4. Mettre en place une **base pour la future synchro Pronote** (sans encore l’intégrer).  
5. Préparer la structure pour le passage futur en **PWA / app mobile**.

---

## 🧩 Ce que Copilot doit éviter
- Générer du code aléatoire sans rapport avec Nuxt 3.  
- Proposer du code avec `Options API` (uniquement `Composition API`).  
- Ajouter des packages non présents dans le projet.  
- Utiliser `axios` si `useFetch()` ou `$fetch()` de Nuxt est disponible.  
- Créer des styles inline ou des fichiers CSS séparés (tout via Tailwind).  
- Modifier le code JWT ou l’auth existante sans raison.

---

## 🧠 Exemples de prompt internes
Copilot doit comprendre ce type d’intentions :
- “Créer un composant Vue responsive avec une bottom navbar animée.”  
- “Ajouter un calendrier interactif avec gestion des répétitions.”  
- “Faire une page de tâches avec filtre par matière.”  
- “Intégrer un layout mobile avec safe area et transitions douces.”  

---

## 🛡️ Sécurité
- Ne jamais stocker les tokens dans `localStorage`.
- Toujours passer par les endpoints sécurisés avec headers JWT.
- Masquer les données sensibles dans le frontend.

---

Copilot doit **compléter le code comme un développeur front-end Nuxt expérimenté**,  
qui comprend la logique éducative du projet et cherche la qualité du rendu avant la rapidité.
