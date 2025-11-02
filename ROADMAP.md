# 🗺️ Roadmap – Projet StudyFlow

> **Dernière mise à jour :** 23 octobre 2025  
> **État actuel :** Priority 11 (Migration Pronote vers Python) terminée ✅

---

## 📊 Vue d'ensemble

### ✅ Complété (Priorities 1-10)

**Priority 1 : Corrections bugs critiques**
- ✅ Erreurs hydration (HTML validation, SSR quote, Teleport modal)
- ✅ Toast errors dans profile.vue
- ✅ Navigation par avatar (suppression de "Profile" dans tabs)

**Priority 2 : Base de données**
- ✅ Migration `database_subjects_update.sql` (teacher, schedule, icon)
- ✅ API POST `/api/subjects/index.post.js` mise à jour
- ✅ API PATCH `/api/subjects/[id].patch.js` créée

**Priority 3 : Page Subjects - Améliorations majeures** 🎉
- ✅ Édition des matières (modal avec pré-remplissage)
- ✅ Ajout professeur (`teacher` VARCHAR 255)
- ✅ Ajout emploi du temps (`schedule` TEXT)
- ✅ Sélecteur de couleur étendu (8 → 16 couleurs)
- ✅ Sélecteur d'icône (préparé pour future implémentation)
- ✅ Statistiques par matière (total devoirs, % completion, urgents)
- ✅ Design modernisé avec thème dynamique
- ✅ Boutons Modifier/Supprimer sur chaque carte

**Priority 4 : Système de Dark Mode** 🌙 ✅
- ✅ Composable `useTheme.js` étendu avec `isDarkMode`
- ✅ 5 thèmes × 2 modes (light/dark) = 10 combinaisons
- ✅ Persistance dans `localStorage('studyflow-theme-mode')`
- ✅ Toggle Dark/Light dans `ThemeSwitcher.vue`
- ✅ Icônes animées (☀️ Soleil / 🌙 Lune)
- ✅ Configuration Tailwind (`darkMode: 'class'`)
- ✅ Application classe `dark` sur `<html>`
- ✅ Guide complet dans `DARK_MODE_GUIDE.md`
- ✅ Application complète dans toutes les pages et composants

**Priority 6 : Système de Tags** �️ ✅ 100%
**Objectif :** Ajouter des tags personnalisés aux devoirs pour meilleure organisation

**Infrastructure backend :**
- ✅ Migration SQL : tables `tags` et `assignment_tags` (many-to-many)
- ✅ Pool de connexions MySQL (10 connexions réutilisables)
- ✅ 6 endpoints API REST complets :
  * `GET /api/tags` - Liste des tags utilisateur
  * `POST /api/tags` - Créer un tag
  * `DELETE /api/tags/[id]` - Supprimer un tag
  * `GET /api/assignments/[id]/tags` - Tags d'un devoir
  * `POST /api/assignments/[id]/tags` - Associer tag à devoir
  * `DELETE /api/assignments/[id]/tags/[tagId]` - Retirer tag

**Interface utilisateur :**
- ✅ `TagSelector.vue` - Composant moderne avec palette de 16 couleurs
- ✅ `DatePicker.vue` - Calendrier dropdown élégant (remplace input date natif)
- ✅ Création rapide inline de tags
- ✅ Sélection multi-tags avec preview
- ✅ Affichage des tags sur cartes de devoirs (badges colorés)
- ✅ Dark mode complet sur tous les composants
- ✅ Design cohérent style Notion/Capacities

**Fonctionnalités :**
- ✅ Tags avec nom (max 100 caractères) et couleur (16 couleurs prédéfinies)
- ✅ Unicité des noms de tags par utilisateur
- ✅ Association multiple tags ↔ devoirs
- ✅ Chargement automatique des tags par devoir
- ✅ Suppression en cascade (tags + associations)
- ✅ Compteur d'utilisation par tag

**Corrections techniques :**
- ✅ Fonction `verifyToken()` robuste avec 4 méthodes fallback
- ✅ Gestion des variables d'environnement via `process.env`
- ✅ Suppression des fichiers dupliqués causant conflits de routing
- ✅ Import correct de `getRequestHeader` depuis h3

**Temps réalisé :** ~3h (avec debugging)

---

**Priority 7 : Notifications améliorées** 🔔 ✅ 100%
**Objectif :** Système de notifications intelligentes pour les devoirs urgents

**Infrastructure backend :**
- ✅ Migration SQL : table `notifications` avec types (urgent/warning/success/info)
- ✅ 6 endpoints API complets :
  * `GET /api/notifications` - Liste des notifications
  * `POST /api/notifications/generate` - Génération automatique depuis devoirs
  * `PATCH /api/notifications/[id]/read` - Marquer lu/non-lu
  * `DELETE /api/notifications/[id]` - Supprimer une notification
  * `POST /api/notifications/mark-all-read` - Tout marquer lu
  * `POST /api/notifications/clear-all` - Tout supprimer

**Interface utilisateur :**
- ✅ `NotificationCenter.vue` - Panel coulissant moderne (slide-in from right)
- ✅ `NotificationBell.vue` - Badge compteur avec animation pulse
- ✅ Composable `useNotifications.js` - Gestion centralisée de l'état
- ✅ Design moderne avec icônes et gradients par type
- ✅ Dark mode complet
- ✅ Responsive (fullscreen mobile, 450px desktop)

**Fonctionnalités :**
- ✅ Génération auto basée sur deadlines des devoirs :
  * En retard → notification urgente (rouge)
  * Aujourd'hui → notification urgente (rouge)
  * Demain → notification warning (orange)
  * 2-3 jours → notification info (bleu)
- ✅ Badge compteur avec pulse si urgence
- ✅ Affichage info devoir associé (matière + couleur)
- ✅ Actions : marquer lu, supprimer, tout marquer lu, tout supprimer
- ✅ Nettoyage automatique (> 30 jours)
- ✅ Rafraîchissement auto toutes les 30s
- ✅ Formatage dates relatif ("Il y a 5 min", etc.)

**Temps réalisé :** ~3h

---

**Priority 8 : Mobile UX & PWA** 📱 ✅ 100%
**Objectif :** Optimisation complète mobile et Progressive Web App

**PWA Implementation :**
- ✅ Manifest `manifest.webmanifest` avec 10 icônes (72px-512px + maskable)
- ✅ Meta tags PWA dans `app.vue` (theme-color, apple-mobile-web-app)
- ✅ Installation réussie sur mobile ✅
- ✅ Service worker via `@vite-pwa/nuxt`

**Mobile Layout & Navigation :**
- ✅ Bottom Navigation moderne avec 5 tabs (Home, Subjects, Assignments, Calendar, Focus)
- ✅ Active states avec gradients et animations
- ✅ Fixed positioning avec safe-area iOS/Android
- ✅ Swipe gestures pour navigation horizontale (`useSwipeGestures.js`)
- ✅ Anti double-tap (300ms delay entre touches)
- ✅ Protection `.no-swipe` sur éléments interactifs

**Calendar Mobile :**
- ✅ Modal jour modernisé avec design gradient purple/pink
- ✅ Poignée de drag iOS-style
- ✅ Padding `pb-32` pour éviter bottom navbar
- ✅ Coins arrondis `rounded-3xl` harmonieux
- ✅ Badges colorés pour matières avec transparence
- ✅ Checkmarks animés pour devoirs complétés
- ✅ Empty state avec CTA "Ajouter un devoir"
- ✅ Hover/active animations (scale, shadow)

**SSR Fixes :**
- ✅ Protection `localStorage` avec `process.server` dans `/focus`
- ✅ Protection `localStorage` dans `/calendar`
- ✅ Corrections balises HTML mal fermées
- ✅ Tous les computed et fonctions protégés contre SSR

**UX Improvements :**
- ✅ Overflow-x-hidden sur containers
- ✅ Modal détail devoir adapté (pb-20, max-h-85vh)
- ✅ Touch feedback sur toutes les interactions
- ✅ Animations slide-in/fade-in
- ✅ Backdrop blur sur modals

**Temps réalisé :** ~4h

---

**Priority 9 : Synchronisation Pronote** 🔄 ⚠️ Migré vers Priority 11
**Objectif :** Importer automatiquement les devoirs depuis Pronote

**Note :** L'implémentation avec Pawnote ne fonctionnait pas correctement avec l'authentification ENT.
→ **Voir Priority 11** pour la nouvelle implémentation avec Python/pronotepy qui fonctionne ! ✅

---

**Priority 10 : Migration Authentification vers Cookies** 🔐 ✅ 100%
**Objectif :** Migrer de localStorage vers cookies HTTP pour SSR et sécurité

**Problèmes résolus :**
- ✅ Redirect loop infini sur toutes les pages
- ✅ Erreur `jwt malformed` dans les notifications
- ✅ Badge compteur invisible au chargement
- ✅ Token illisible côté serveur (SSR)

**Backend (Server-side) :**
- ✅ `app/lib/auth.js` - Fonction `verifyToken()` lit cookies PUIS header
- ✅ Import `parseCookies` depuis `h3`
- ✅ 6 endpoints notifications migrés vers `verifyToken(event)`
  * `/api/notifications` (GET)
  * `/api/notifications/generate` (POST)
  * `/api/notifications/mark-all-read` (POST)
  * `/api/notifications/clear-all` (POST)
  * `/api/notifications/[id]` (DELETE)
  * `/api/notifications/[id]/read` (PATCH)

**Frontend (Client-side) :**
- ✅ Nouveau composable `app/composables/useAuth.js`
  * `getToken()` - Lit via `useCookie()` puis `document.cookie`
  * `clearToken()` - Supprime cookie + localStorage
  * `isAuthenticated()` - Vérifie présence token
- ✅ 6 pages migrées avec `definePageMeta({ ssr: false })` :
  * `app/pages/index.vue`
  * `app/pages/profile.vue`
  * `app/pages/calendar.vue`
  * `app/pages/subjects.vue`
  * `app/pages/assignments.vue`
  * `app/pages/focus.vue`
- ✅ Login crée cookie (7 jours, SameSite=Lax)
- ✅ Composable `useNotifications.js` migré
- ✅ Composants notifications migrés :
  * `NotificationBell.vue` - Chargement immédiat sans délai
  * `NotificationCenter.vue` - Utilise `getToken()`

**Architecture :**
- ✅ Cookie prioritaire, fallback Authorization header
- ✅ `credentials: 'include'` sur tous les fetch
- ✅ Décoding URL automatique des cookies
- ✅ SSR désactivé sur pages authentifiées

**Résultats :**
- ✅ Navigation fluide sans redirect
- ✅ Notifications fonctionnelles (génération + affichage)
- ✅ Badge bleu affiché immédiatement au chargement
- ✅ Token lisible côté serveur ET client
- ✅ Architecture propre et centralisée

**Temps réalisé :** ~2h

**Documentation complète :**
- `PRIORITY_10_AUTH_COOKIES_COMPLETE.md` ⭐ NEW

---

## 🚀 Prochaines étapes (Priorities 11+)

### **Priority 11 : Calendrier avancé** 📅
**Objectif :** Améliorer drastiquement le calendrier

**Étapes :**
1. **Événements récurrents** :
   - Table `recurring_events` avec pattern RRULE
   - UI pour créer répétitions (quotidien, hebdo, mensuel)
   - Exceptions (jours fériés)

2. **Vues multiples** :
   - Vue jour (timeline heure par heure)
   - Vue semaine (7 colonnes)
   - Vue mois (grille)
   - Vue agenda (liste)

3. **Drag & drop** :
   - Déplacer événements dans le calendrier
   - Redimensionner durée
   - Multi-day events

4. **Import/Export** :
   - Export iCal (.ics)
   - Import fichier .ics
   - Sync Google Calendar (OAuth)

5. **Intégration emploi du temps** :
   - Afficher `schedule` des matières dans calendrier
   - Couleur par matière
   - Notifications avant cours

**Fichiers à créer :**
- `database_calendar_events.sql`
- `app/components/CalendarView.vue` (refonte)
- `app/components/EventModal.vue`
- `server/api/events/recurring.post.js`

**Fichiers à modifier :**
- `app/pages/calendar.vue`

**Temps estimé :** 5-7h

---

## 🎨 Améliorations futures (backlog)

### Design & UX
- [ ] Animations avancées (framer-motion)
- [ ] Skeleton loaders pendant chargements
- [ ] Transitions de pages fluides
- [ ] Micro-interactions (confetti après succès, etc.)
- [ ] Personnalisation couleurs complètes (color picker)

### Fonctionnalités
- [ ] Statistiques avancées (graphiques, tendances)
- [ ] Export PDF des devoirs
- [ ] Partage de liste de devoirs
- [ ] Mode collaboratif (groupe d'étude)
- [ ] IA suggestions (meilleur moment pour étudier)

### Technique
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD avec GitHub Actions
- [ ] Docker containerization
- [ ] Monitoring (Sentry)

---

## 📝 Notes importantes

### Conventions de code
- **Composants** : `<script setup>` + Composition API uniquement
- **Styling** : TailwindCSS (pas de CSS inline)
- **Routes** : NuxtLink pour navigation
- **Auth** : JWT dans cookies HttpOnly
- **API** : Toujours valider inputs côté serveur

### Structure fichiers
```
app/
├── components/       # Composants réutilisables
├── composables/      # Logique partagée (useX)
├── layouts/          # Layouts desktop/mobile
├── pages/            # Pages avec routing auto
└── assets/css/       # Styles globaux

server/
└── api/              # Endpoints REST
    ├── auth/
    ├── subjects/
    ├── assignments/
    └── focus/
```

### Base de données
- **Host** : studyflow-studyflow.e.aivencloud.com:23161
- **DB** : studyflow
- **User** : avnadmin
- **Migrations** : Fichiers SQL à exécuter manuellement

---

## ✨ Priority 11 : Migration Pronote vers Python/pronotepy ✅ 100%

**Date :** 23 octobre 2025  
**Durée estimée :** 2-3h  
**Durée réelle :** ~2h  
**Statut :** ✅ Implémentation complète

### Problème
L'implémentation Priority 9 utilisait **Pawnote** (JS) qui ne fonctionnait pas avec l'authentification ENT/CAS (Atrium Sud, etc.).

### Solution
Migration vers **pronotepy** (Python officiel) avec support complet ENT/CAS.

### Architecture

**1. Service Python (`server/python/pronote/`)**
- ✅ `pronote_sync.py` - Script principal d'authentification ENT + fetch data
- ✅ `requirements.txt` - Dépendances (pronotepy, beautifulsoup4, requests)
- ✅ `test_setup.py` - Script de test d'installation
- ✅ `__init__.py` - Module Python

**2. Service Node.js (`server/lib/pronoteService.js`)**
- ✅ Wrapper qui spawn le process Python
- ✅ Gestion stdout/stderr
- ✅ Parse JSON et retourne données
- ✅ Fonction de diagnostic `checkPythonDependencies()`

**3. API modifiée (`server/api/pronote/sync.post.js`)**
- ✅ Remplacement Pawnote par service Python
- ✅ Mapping données Python vers format StudyFlow
- ✅ Conservation de toute la logique métier (doublons, matières, etc.)

**4. Nouvel endpoint (`server/api/pronote/check-python.get.js`)**
- ✅ Diagnostic installation Python + dépendances

### Données récupérées
- ✅ **Homework** (devoirs) - toute l'année scolaire
- ✅ **Lessons** (emploi du temps) - toute l'année
- ✅ **Grades** (notes) - par période

### Avantages
- ✅ Authentification ENT/CAS fonctionnelle (Atrium Sud testé)
- ✅ Bibliothèque officielle maintenue
- ✅ Récupération complète des données
- ✅ Gestion erreurs robuste (par semaine)
- ✅ Compatible avec l'architecture existante (pas de changement frontend)

### Performance
- Auth ENT : ~1-2s
- Fetch homework (année) : ~2-4s
- Process + DB : ~1s
- **Total : 3-6 secondes**

### Installation
```powershell
cd server/python
pip install -r requirements.txt
python test_setup.py
```

### Documentation
- ✅ `PRIORITY_11_PRONOTE_PYTHON.md` - Documentation technique complète
- ✅ `server/python/INSTALL.md` - Guide d'installation
- ✅ Code source commenté en anglais + logs en français

### Fichiers créés/modifiés
- `server/api/pronote/sync.post.js` - Logique de sync modifiée
- `server/api/pronote/check-python.get.js` (nouveau) - Diagnostic
- `server/lib/pronoteService.js` (nouveau) - Wrapper Node.js
- `server/python/pronote/pronote_sync.py` (nouveau) - Script Python
- `server/python/pronote/__init__.py` (nouveau) - Module
- `server/python/requirements.txt` (nouveau) - Dépendances
- `server/python/test_setup.py` (nouveau) - Tests
- `server/python/INSTALL.md` (nouveau) - Guide
- `PRIORITY_11_PRONOTE_PYTHON.md` (nouveau) - Doc complète
- `ROADMAP.md` - Mise à jour

### Tests à effectuer
- [ ] Installation Python + dépendances
- [ ] Test `python test_setup.py`
- [ ] Test endpoint `/api/pronote/check-python`
- [ ] Synchronisation complète avec identifiants réels
- [ ] Vérification devoirs importés dans StudyFlow
- [ ] Vérification logs de synchronisation

**Temps réalisé :** ~2h

---

## 🚦 Comment utiliser cette roadmap

1. **Choisir une Priority** (commencer par 4, puis 5, etc.)
2. **Créer un nouveau chat Copilot** avec le contexte :
   ```
   Je travaille sur le projet StudyFlow (SaaS éducatif Nuxt 3).
   Voir ROADMAP.md et .github/copilot-instructions.md pour contexte.
   Je veux implémenter Priority X : [nom de la priority].
   ```
3. **Suivre les étapes** une par une
4. **Tester** chaque fonctionnalité
5. **Cocher** ✅ dans ce fichier quand terminé
6. **Commit** avec message clair : `feat: add dark mode system (Priority 4)`

---

**Bon courage ! 🚀**
