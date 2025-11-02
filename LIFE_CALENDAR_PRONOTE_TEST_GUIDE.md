# 🧪 Guide de test - Life Calendar + Pronote

## ✅ Prérequis
- [x] Migrations SQL exécutées :
  - `database_pronote_config_columns.sql`
  - `database_pronote_timetable.sql`
  - `database_life_calendar_migration.sql`

## 📋 Test complet du flux

### 1. Configuration Pronote
**URL** : http://localhost:3000/pronote-settings

1. ✅ Cocher "Devoirs"
2. ✅ Cocher "Emploi du temps"
3. ✅ Activer "Synchronisation automatique"
4. ✅ Choisir "Une fois par jour"
5. ✅ Cliquer "Enregistrer"

**Vérification DB** :
```sql
SELECT sync_homework, sync_timetable, auto_sync, sync_frequency 
FROM pronote_config 
WHERE user_id = 5;
```

### 2. Synchronisation Pronote
**URL** : http://localhost:3000/pronote (page existante)

1. Cliquer sur "Synchroniser"
2. Attendre la fin (10-20 secondes)

**Logs attendus** :
```
[Sync] Calling Python service for Pronote data...
[pronotepy] Fetching timetable...
[pronotepy] Timetable: XXX lessons
[Sync] Syncing XXX lessons to timetable...
[Pronote Timetable] Syncing XXX lessons for user: 5
[Pronote Timetable] Imported: XXX Skipped: XXX
[Sync] Timetable sync: XXX imported, XXX skipped
```

**Vérification DB** :
```sql
-- Vérifier l'emploi du temps importé
SELECT COUNT(*) FROM pronote_timetable WHERE user_id = 5;

-- Voir quelques exemples
SELECT subject, teacher, classroom, start_time, end_time 
FROM pronote_timetable 
WHERE user_id = 5 
ORDER BY start_time DESC 
LIMIT 10;
```

### 3. Affichage dans Life Calendar
**URL** : http://localhost:3000/life-calendar

1. Naviguer jusqu'à une date avec des cours (lundi-vendredi)
2. Vérifier que les cours s'affichent :
   - ✅ Badge bleu "📖 Auto-importé de Pronote"
   - ✅ Icône 📖
   - ✅ Fond bleu clair
   - ✅ Heure de début/fin affichée
   - ✅ Prof et salle dans la description
   - ✅ Impossible à supprimer (pas de bouton rouge)

3. Vérifier que les devoirs s'affichent aussi :
   - ✅ Badge violet "Devoir à faire"
   - ✅ Icône ✍️
   - ✅ Fond violet clair

4. Créer un événement personnel :
   - ✅ Cliquer sur le "+" d'une heure
   - ✅ Remplir le formulaire
   - ✅ Vérifier qu'il apparaît avec la couleur choisie
   - ✅ Vérifier qu'on peut le supprimer

**Console navigateur** :
```
[Life Calendar GET] Fetching events for date: 2025-10-27 user: 5
[Life Calendar GET] Found X events (Y personal, Z courses, W homework)
```

### 4. Navigation entre jours
1. Cliquer "Jour précédent" → Charge les événements du jour -1
2. Cliquer "Jour suivant" → Charge les événements du jour +1
3. Cliquer "Aujourd'hui" → Revient à aujourd'hui

### 5. Test de désactivation
**URL** : http://localhost:3000/pronote-settings

1. Décocher "Emploi du temps"
2. Cliquer "Enregistrer"
3. Retourner sur Life Calendar
4. Rafraîchir → Les cours ne doivent plus apparaître
5. Les devoirs doivent encore être là (car "Devoirs" reste coché)

## 🐛 Debugging

### Problème : Aucun cours affiché
```sql
-- Vérifier la config
SELECT sync_timetable FROM pronote_config WHERE user_id = 5;

-- Vérifier les données
SELECT COUNT(*) FROM pronote_timetable WHERE user_id = 5;

-- Vérifier pour une date précise
SELECT * FROM pronote_timetable 
WHERE user_id = 5 
AND DATE(start_time) = '2025-10-27';
```

### Problème : Sync échoue
Vérifier les logs serveur :
```
[Sync] Python service error: ...
[Sync] Timetable sync failed: ...
```

Tester le script Python manuellement :
```bash
cd server/python/pronote
python pronote_sync.py "URL" "USERNAME" "PASSWORD"
```

### Problème : Cours en double
```sql
-- Supprimer l'emploi du temps et re-sync
DELETE FROM pronote_timetable WHERE user_id = 5;
```

## 📊 Structure de données

### Table `pronote_timetable`
```
id | user_id | subject | teacher | classroom | start_time | end_time | week_number | is_cancelled
```

### Exemple de ligne :
```
1 | 5 | Mathématiques | M. Dupont | Salle 204 | 2025-10-27 08:00:00 | 2025-10-27 09:00:00 | 43 | 0
```

### API Response structure
```json
{
  "success": true,
  "date": "2025-10-27",
  "events": [
    {
      "id": "course_Mathématiques_2025-10-27T08:00:00",
      "title": "Mathématiques",
      "description": "M. Dupont - Salle 204",
      "category": "course",
      "startTime": "2025-10-27T08:00:00",
      "endTime": "2025-10-27T09:00:00",
      "color": "#3B82F6",
      "source": "pronote_timetable",
      "teacher": "M. Dupont",
      "classroom": "Salle 204"
    }
  ]
}
```

## ✨ Fonctionnalités finales

### Cours Pronote dans Life Calendar
- ✅ Import automatique depuis pronotepy
- ✅ Stockage dans pronote_timetable
- ✅ Affichage conditionnel (selon sync_timetable)
- ✅ Badge "Auto-importé de Pronote"
- ✅ Protection contre la suppression
- ✅ Couleur bleue distinctive
- ✅ Affichage prof + salle

### Configuration utilisateur
- ✅ Page /pronote-settings avec toggles
- ✅ Sauvegarde dans pronote_config
- ✅ Application immédiate (pas besoin de redémarrer)

### Timeline Life Calendar
- ✅ Vue 24h (00:00-23:00)
- ✅ 3 types d'événements : personnel, devoirs, cours
- ✅ Création rapide avec modal
- ✅ Navigation jours précédent/suivant/aujourd'hui
- ✅ Dark mode complet

## 🎯 Checklist finale

- [ ] Config Pronote enregistrée
- [ ] Sync Pronote réussie (voir logs)
- [ ] Table pronote_timetable remplie (SQL)
- [ ] Cours visibles dans Life Calendar
- [ ] Badge "Auto-importé" présent
- [ ] Impossible de supprimer les cours
- [ ] Devoirs visibles aussi
- [ ] Événements personnels créables
- [ ] Navigation entre jours fonctionne
- [ ] Désactivation emploi du temps fonctionne

**Si tous les points sont ✅ → Life Calendar + Pronote 100% opérationnel !** 🎉
