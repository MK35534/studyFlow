# 🎯 Page Focus - Mode Pomodoro

## Vue d'ensemble

La page **Focus** est une fonctionnalité complète qui permet aux étudiants de booster leur productivité grâce à la technique Pomodoro. Elle offre un environnement de travail optimisé avec timer personnalisable, sons d'ambiance, et suivi des sessions.

## 🌟 Fonctionnalités

### 1. **Timer Pomodoro Avancé** (`FocusTimer.vue`)
- ⏱️ Cercle de progression visuel animé
- 🎨 Changement de couleur selon le type de session (focus/pause)
- ⏯️ Contrôles Start/Pause/Skip intuitifs
- 🔄 Gestion automatique des cycles (4 sessions focus + pauses)
- 📊 Statistiques en temps réel (sessions complétées, minutes focus, série)
- 🔔 Notifications natives + sons au changement de session
- ⚙️ Durées personnalisables via les settings

### 2. **Sélecteur de Tâche** (`FocusSessionSelector.vue`)
- 📝 Liste de tous les devoirs à faire
- 🎨 Badge coloré par matière
- 📅 Affichage intelligent des dates (Aujourd'hui, Demain, Dans Xj)
- 🔥 Indicateurs de priorité visuels
- ✨ Session libre sans devoir spécifique
- ✅ Sélection visuelle avec animation

### 3. **Sons d'Ambiance** (`AmbientSound.vue`)
- 🌧️ Pluie
- 🌲 Forêt
- 🌊 Océan
- ☕ Café
- 🔥 Cheminée
- 📻 Bruit blanc
- 🎚️ Contrôle du volume par son
- 🔇 Activation/désactivation globale

### 4. **Paramètres Personnalisables**
- ⏲️ Durée de focus (15-60 min)
- ☕ Durée pause courte (3-10 min)
- 🌴 Durée pause longue (15-30 min)
- ⚡ Auto-démarrage des pauses
- 🔔 Notifications sonores activables

### 5. **Historique & Statistiques**
- 📈 Sessions d'aujourd'hui avec timeline
- 🎯 Stats du jour (sessions, minutes, série)
- 💾 Sauvegarde en base de données
- 📊 Suivi de la productivité

### 6. **Conseils de Productivité**
- 💡 10 conseils rotatifs
- 🎲 Changement manuel ou automatique
- 📚 Basés sur les meilleures pratiques

## 🏗️ Architecture

```
app/
├── pages/
│   └── focus.vue                    # Page principale
├── components/
│   ├── FocusTimer.vue              # Composant timer Pomodoro
│   ├── FocusSessionSelector.vue    # Sélecteur de tâche
│   └── AmbientSound.vue            # Gestionnaire de sons
server/
└── api/
    └── focus/
        ├── sessions.post.js        # Créer une session
        └── sessions.get.js         # Récupérer l'historique
```

## 🎨 Design

### Principes UX/UI respectés
- ✅ **Minimaliste** : Interface épurée, focus sur l'essentiel
- ✅ **Moderne** : Gradients, animations fluides, micro-interactions
- ✅ **Responsive** : Adaptation mobile/tablette/desktop
- ✅ **Intuitif** : Actions claires, feedback visuel immédiat
- ✅ **Accessible** : Contrastes, tailles de police, zones de clic

### Palette de couleurs
- 🔴 **Focus** : Rouge/Orange (énergie, concentration)
- 🟢 **Pause courte** : Vert (repos, régénération)
- 🔵 **Pause longue** : Bleu (relaxation profonde)
- 🟣 **Statistiques** : Violet (accomplissement)

## 📊 Base de données

### Table `focus_sessions`
```sql
CREATE TABLE focus_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  session_type VARCHAR(20) NOT NULL,  -- 'focus', 'short-break', 'long-break'
  duration INT NOT NULL,              -- En minutes
  assignment_id INT NULL,             -- Référence optionnelle
  completed_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);
```

## 🚀 Installation

1. **Créer la table en base de données**
```bash
mysql -u root -p studyflow < database_focus_sessions.sql
```

2. **Les composants sont déjà intégrés**, pas besoin d'installation supplémentaire

3. **Accéder à la page**
   - Desktop : Menu latéral > Mode Focus
   - Mobile : Barre de navigation > Focus

## 🎯 Utilisation

### Démarrer une session
1. Ouvre la page Focus
2. Sélectionne un devoir (ou session libre)
3. Ajuste les paramètres si besoin
4. Clique sur "Démarrer"
5. Concentre-toi ! 🧠

### Personnaliser l'expérience
- Modifie les durées avec les sliders
- Active les sons d'ambiance
- Configure les notifications
- Active l'auto-démarrage des pauses

### Suivre ta progression
- Consulte les stats en temps réel
- Vérifie l'historique du jour
- Maintiens ta série active 🔥

## 🧪 Fonctionnalités techniques

### LocalStorage
- Statistiques du jour
- Historique des sessions
- Paramètres utilisateur
- État des sons d'ambiance

### API Endpoints
- `POST /api/focus/sessions` - Sauvegarder une session
- `GET /api/focus/sessions?period=today` - Récupérer l'historique

### Notifications
- Notifications natives du navigateur
- Fallback sur toasts intégrés
- Sons personnalisables (Web Audio API)

## 🎨 Animations & Transitions

- Cercle de progression fluide (SVG + CSS)
- Changements de couleur en dégradé
- Hover effects sur tous les boutons
- Transitions entre sessions
- Feedback visuel instantané

## 📱 Responsive Design

### Mobile (< 768px)
- Layout vertical optimisé
- Boutons tactiles larges
- Bottom navigation intégrée
- Gestion safe areas (notch iPhone)

### Tablet (768px - 1024px)
- Grille adaptative 1-2 colonnes
- Espacement optimisé
- Touch-friendly

### Desktop (> 1024px)
- Grille 3 colonnes
- Sidebar toujours visible
- Espacement généreux

## 🔮 Améliorations futures

- [ ] Mode "Focus extrême" (masque tout sauf le timer)
- [ ] Graphiques de productivité avancés
- [ ] Objectifs quotidiens/hebdomadaires
- [ ] Intégration calendrier (planifier sessions)
- [ ] Sons d'ambiance avec vrais fichiers audio
- [ ] Mode sombre spécial focus
- [ ] Exportation des statistiques
- [ ] Compétition avec amis
- [ ] Badges et achievements
- [ ] Widgets home screen (PWA)

## 📝 Notes de développement

### Props du FocusTimer
```js
{
  assignment: Object,           // Devoir sélectionné
  autoStart: Boolean,          // Démarrage auto
  focusDuration: Number,       // 25 par défaut
  shortBreakDuration: Number,  // 5 par défaut
  longBreakDuration: Number    // 15 par défaut
}
```

### Events émis
```js
@session-complete  // Émis à la fin d'une session
@cycle-complete    // Émis après 4 cycles complets
@timer-start       // Émis au démarrage
@timer-pause       // Émis en pause
```

## 🤝 Contribution

Pour améliorer la page Focus :
1. Teste l'expérience utilisateur
2. Propose des nouveaux sons d'ambiance
3. Suggère des conseils de productivité
4. Rapporte les bugs
5. Optimise les performances

## 📚 Ressources

- [Technique Pomodoro](https://francescocirillo.com/pages/pomodoro-technique)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [SVG Animations](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)

---

**Fait avec 💙 pour aider les étudiants à mieux se concentrer**
