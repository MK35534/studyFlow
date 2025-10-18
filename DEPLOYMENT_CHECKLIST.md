# 🚀 Instructions de Déploiement - Page Focus

## 📋 Checklist avant déploiement

### 1. Base de données
- [ ] Exécuter le script SQL pour créer la table `focus_sessions`
```bash
mysql -u root -p studyflow < database_focus_sessions.sql
```

- [ ] Vérifier que la table existe
```sql
SHOW TABLES LIKE 'focus_sessions';
DESCRIBE focus_sessions;
```

### 2. Variables d'environnement
- [ ] Vérifier que `JWT_SECRET` est défini dans `.env`
```
JWT_SECRET=votre_secret_jwt_super_securise_en_production
```

### 3. Dépendances
- [ ] Toutes les dépendances sont déjà installées (Nuxt 3, Vue 3, Tailwind)
- [ ] Aucune dépendance supplémentaire requise

### 4. Tests de fonctionnement

#### Test du timer
```bash
# 1. Démarrer le serveur
npm run dev

# 2. Naviguer vers http://localhost:3000/focus

# 3. Vérifier :
- [ ] Le timer s'affiche correctement
- [ ] Les boutons Start/Pause fonctionnent
- [ ] Le cercle de progression s'anime
- [ ] Les statistiques s'affichent
```

#### Test de la sélection de tâche
```bash
# 1. Créer au moins une matière
# 2. Créer au moins un devoir
# 3. Retourner sur /focus
# 4. Vérifier :
- [ ] Les devoirs s'affichent dans le sélecteur
- [ ] La sélection fonctionne
- [ ] Les badges colorés s'affichent
- [ ] La session libre est disponible
```

#### Test des sons d'ambiance
```bash
# Vérifier :
- [ ] Le bouton d'activation fonctionne
- [ ] Chaque son peut être activé/désactivé
- [ ] Le volume est ajustable
- [ ] Les sons peuvent jouer simultanément
```

#### Test des notifications
```bash
# 1. Autoriser les notifications dans le navigateur
# 2. Lancer une session courte (1 min pour tester)
# 3. Vérifier :
- [ ] Notification native à la fin
- [ ] Toast de fallback fonctionne
- [ ] Son joué à la fin
```

#### Test de l'API
```bash
# Test POST
curl -X POST http://localhost:3000/api/focus/sessions \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "session_type": "focus",
    "duration": 25,
    "assignment_id": null,
    "completed_at": "2025-01-01T12:00:00Z"
  }'

# Test GET
curl http://localhost:3000/api/focus/sessions?period=today \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### 5. Tests responsive

#### Mobile
```bash
# 1. Ouvrir les DevTools (F12)
# 2. Mode responsive (Ctrl+Shift+M)
# 3. Tester avec :
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] Samsung Galaxy S20 (360px)

# Vérifier :
- [ ] Le timer est lisible
- [ ] Les boutons sont accessibles
- [ ] Le texte n'est pas coupé
- [ ] La navigation bottom fonctionne
```

#### Tablet
```bash
# Tester avec :
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

# Vérifier :
- [ ] Layout adapté (1-2 colonnes)
- [ ] Espacement correct
```

#### Desktop
```bash
# Tester avec :
- [ ] 1280px (laptop)
- [ ] 1920px (desktop)
- [ ] 2560px (4K)

# Vérifier :
- [ ] Layout 3 colonnes
- [ ] Centrage correct
- [ ] Pas d'overflow horizontal
```

### 6. Tests de performance

#### Lighthouse
```bash
# 1. Ouvrir Chrome DevTools
# 2. Onglet Lighthouse
# 3. Run audit
# 4. Vérifier :
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90
```

#### Bundle size
```bash
# Vérifier la taille des composants
npm run build
npm run analyze

# Objectifs :
- [ ] FocusTimer.vue < 50KB
- [ ] Page focus.vue < 80KB
- [ ] Composants sons < 30KB
```

### 7. Tests de sécurité

```bash
# Vérifier l'authentification
- [ ] Impossible d'accéder à /api/focus/sessions sans token
- [ ] Token invalide retourne 401
- [ ] Token expiré retourne 401

# Test SQL injection
- [ ] Paramètres API validés
- [ ] Pas d'injection possible
```

### 8. Tests de compatibilité navigateurs

#### Chrome/Edge
- [ ] Toutes fonctionnalités OK
- [ ] Animations fluides
- [ ] Sons fonctionnels

#### Firefox
- [ ] Toutes fonctionnalités OK
- [ ] Notifications OK
- [ ] Audio OK

#### Safari
- [ ] Toutes fonctionnalités OK
- [ ] Web Audio API OK
- [ ] Notifications OK

#### Mobile Safari (iOS)
- [ ] Interface responsive
- [ ] Touch events OK
- [ ] Safe areas respectées

#### Chrome Mobile (Android)
- [ ] Interface responsive
- [ ] Touch events OK
- [ ] Notifications OK

### 9. Documentation

- [ ] README principal mis à jour
- [ ] FOCUS_PAGE_README.md créé
- [ ] MODIFICATIONS_SUMMARY.md créé
- [ ] Commentaires dans le code

### 10. Git

```bash
# Vérifier les fichiers à commiter
git status

# Devrait inclure :
# - app/pages/focus.vue
# - app/components/FocusTimer.vue
# - app/components/FocusSessionSelector.vue
# - app/components/AmbientSound.vue
# - app/components/FocusGuideModal.vue
# - app/components/FocusIntenseMode.vue
# - app/composables/useFocusShortcuts.js
# - server/api/focus/sessions.post.js
# - server/api/focus/sessions.get.js
# - database_focus_sessions.sql
# - FOCUS_PAGE_README.md
# - MODIFICATIONS_SUMMARY.md

# Commiter
git add .
git commit -m "✨ Add Focus page with Pomodoro timer and productivity features"
git push origin master
```

## 🔍 Tests post-déploiement

### 1. Environnement de production
```bash
# Build pour production
npm run build

# Preview du build
npm run preview

# Vérifier :
- [ ] Pas d'erreurs console
- [ ] Toutes les pages chargent
- [ ] API endpoints fonctionnent
```

### 2. Tests utilisateurs réels
- [ ] Faire tester par 3-5 utilisateurs
- [ ] Collecter les retours
- [ ] Noter les bugs éventuels
- [ ] Mesurer le temps de première session

### 3. Monitoring
```bash
# Activer les logs
- [ ] Logs API focus endpoints
- [ ] Tracking des sessions complétées
- [ ] Erreurs captées et loggées
```

## 🐛 Troubleshooting

### Problème : La table focus_sessions n'existe pas
```bash
# Solution
mysql -u root -p studyflow < database_focus_sessions.sql
```

### Problème : Erreur 401 sur l'API
```bash
# Vérifier
- Token JWT valide et non expiré
- Header Authorization bien formaté
- JWT_SECRET correct dans .env
```

### Problème : Sons ne jouent pas
```bash
# Causes possibles
- Navigateur bloque l'autoplay
- Web Audio API non supportée
- Permissions audio refusées

# Solution
- Demander interaction utilisateur d'abord
- Vérifier compatibilité navigateur
```

### Problème : Notifications ne s'affichent pas
```bash
# Vérifier
- Permission notifications accordée
- HTTPS en production (requis)
- Fallback toast fonctionne
```

### Problème : Layout cassé sur mobile
```bash
# Vérifier
- Viewport meta tag présent
- Tailwind classes responsive (md:, lg:)
- Safe areas pour iOS
```

## 📊 Métriques à suivre

### Engagement
- Nombre de sessions lancées par jour
- Durée moyenne des sessions
- Taux de complétion des sessions
- Nombre de cycles Pomodoro complets

### Technique
- Temps de chargement page focus
- Erreurs API focus endpoints
- Taux de rebond sur la page
- Temps passé sur la page

### Feedback utilisateurs
- Note satisfaction (1-5)
- Fonctionnalités les plus utilisées
- Sons d'ambiance préférés
- Suggestions d'amélioration

## 🎉 C'est prêt !

Une fois tous ces tests passés, la page Focus est prête pour la production ! 🚀

Les étudiants peuvent maintenant :
- ✅ Se concentrer efficacement avec Pomodoro
- ✅ Suivre leur productivité
- ✅ Personnaliser leur expérience
- ✅ Créer un environnement de travail optimal

**Bon focus ! 🎯**
