# 🗺️ Roadmap – Projet StudyFlow

> **Dernière mise à jour :** 18 octobre 2025  
> **État actuel :** Priority 7 terminée ✅

---

## 📊 Vue d'ensemble

### ✅ Complété (Priorities 1-7)

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

## 🚀 Prochaines étapes (Priorities 8+)

### **Priority 8 : Mobile Layout finalisé** 📱
**Objectif :** Optimiser complètement l'expérience mobile

**Étapes :**
1. **Créer `BottomNavigation.vue`** :
   - 5 tabs : Home, Matières, Devoirs, Focus, Profil
   - Icônes + labels
   - Active state avec animation
   - Fixed bottom avec safe-area

2. **Composant `SafeArea.vue`** :
   - Gère les notch iPhone/Android
   - Padding dynamique top/bottom
   - Wrapper pour toutes les pages

3. **Améliorer `mobile.vue` layout** :
   - Header collapsible (scroll up → hide)
   - Bottom nav toujours visible
   - Gestion des modals (fullscreen sur mobile)

4. **Swipe gestures** :
   - Swipe left/right pour naviguer entre pages
   - Pull-to-refresh sur les listes
   - Swipe-to-delete sur cartes

5. **Touch optimizations** :
   - Zones de touch plus grandes (min 44px)
   - Feedback visuel au tap (ripple effect)
   - Prévenir double-tap zoom

**Fichiers à créer :**
- `app/components/BottomNavigation.vue`
- `app/components/SafeArea.vue`
- `app/composables/useSwipeGestures.js`

**Fichiers à modifier :**
- `app/layouts/mobile.vue`
- Toutes les pages (wrapper SafeArea)

**Temps estimé :** 3-4h

---

### **Priority 8 : PWA & Offline** 📲
**Objectif :** Transformer en Progressive Web App installable

**Étapes :**
1. **Configuration Nuxt PWA** :
   ```bash
   npm install @vite-pwa/nuxt
   ```

2. **Fichier `nuxt.config.ts`** :
   ```typescript
   modules: ['@vite-pwa/nuxt'],
   pwa: {
     manifest: {
       name: 'StudyFlow',
       short_name: 'StudyFlow',
       description: 'Organisation scolaire intelligente',
       theme_color: '#3b82f6',
       icons: [...]
     },
     workbox: {
       navigateFallback: '/',
       runtimeCaching: [...]
     }
   }
   ```

3. **Service Worker** :
   - Cache des assets statiques
   - Cache des API responses
   - Offline fallback

4. **Icônes PWA** :
   - 192x192, 512x512 PNG
   - Maskable icons pour Android
   - Apple touch icons

5. **Installation prompt** :
   - Bannière "Installer l'app"
   - Bouton dans profile.vue
   - Détection A2HS (Add to Home Screen)

**Fichiers à créer :**
- `public/icons/` (toutes les tailles)
- `public/manifest.json`
- Service worker (auto-généré)

**Fichiers à modifier :**
- `nuxt.config.ts`
- `app/pages/profile.vue`

**Temps estimé :** 2-3h

---

### **Priority 9 : Synchronisation Pronote** 🔄
**Objectif :** Importer automatiquement les devoirs depuis Pronote

**Étapes :**
1. **Recherche librairie** :
   - Tester `pronote-api` (Node.js)
   - Alternative : scraping manuel avec Puppeteer

2. **Composant `PronoteSync.vue`** :
   - Formulaire de connexion (URL établissement, login, password)
   - Stockage sécurisé credentials (chiffrement)
   - Bouton "Synchroniser maintenant"
   - Dernière synchro affichée

3. **API endpoint** :
   - `POST /api/pronote/connect` → test connexion
   - `POST /api/pronote/sync` → récupère devoirs
   - `GET /api/pronote/status` → état de la synchro

4. **Logique de synchronisation** :
   - Mapper devoirs Pronote → table assignments
   - Détecter doublons (par nom + date)
   - Créer matières manquantes auto
   - Logs de synchro

5. **Table BDD** :
   ```sql
   CREATE TABLE pronote_config (
     user_id INT PRIMARY KEY,
     establishment_url VARCHAR(255),
     username VARCHAR(255),
     encrypted_password TEXT,
     last_sync TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

6. **Cron job optionnel** :
   - Synchro auto quotidienne (6h du matin)
   - Notifications si nouveaux devoirs

**Fichiers à créer :**
- `database_pronote_migration.sql`
- `app/components/PronoteSync.vue`
- `server/api/pronote/connect.post.js`
- `server/api/pronote/sync.post.js`
- `server/api/pronote/status.get.js`
- `server/lib/pronote.js` (wrapper API)

**Fichiers à modifier :**
- `app/pages/profile.vue` (ajouter section Pronote)

**⚠️ Complexité :** Très élevée (API Pronote instable, besoin chiffrement)

**Temps estimé :** 6-10h

---

### **Priority 10 : Calendrier avancé** 📅
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
