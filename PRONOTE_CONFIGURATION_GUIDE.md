# 🔧 Configuration Pronote - Guide complet

## 📋 Migrations à exécuter

### 1. Colonnes de configuration
Fichier : `database_pronote_config_columns.sql`

```sql
ALTER TABLE pronote_config
ADD COLUMN IF NOT EXISTS sync_homework BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sync_timetable BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sync_grades BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_sync BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sync_frequency ENUM('manual', 'hourly', 'daily', 'weekly') DEFAULT 'daily';
```

### 2. Table emploi du temps
Fichier : `database_pronote_timetable.sql`

```sql
CREATE TABLE IF NOT EXISTS pronote_timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  teacher VARCHAR(255),
  classroom VARCHAR(100),
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  week_number INT,
  is_cancelled BOOLEAN DEFAULT FALSE,
  ...
)
```

## 🎯 Fonctionnalités ajoutées

### Page de configuration
**URL**: `/pronote-settings`

Options disponibles :
- ✅ **Devoirs** : Import dans Assignments + Life Calendar
- ✅ **Emploi du temps** : Affichage dans Life Calendar
- ⏳ **Notes** : À venir

Synchronisation automatique :
- Manuelle uniquement
- Toutes les heures
- Une fois par jour (recommandé)

### Intégration Life Calendar

L'emploi du temps Pronote s'affiche automatiquement dans le Life Calendar si activé :
- Badge "📖 Auto-importé de Pronote"
- Couleur bleue (#3B82F6)
- Affiche le prof et la salle
- Non supprimable (protection)

## 🔄 Flux de données

```
1. User → Configure /pronote-settings
2. Active "Emploi du temps" ✅
3. Sync Pronote → Récupère timetable
4. Stocke dans pronote_timetable
5. Life Calendar GET → Lit pronote_timetable + pronote_config
6. Affiche cours si sync_timetable = TRUE
```

## 📝 TODO : Ajouter l'emploi du temps au script Python

Le script `pronote_sync.py` doit être modifié pour récupérer l'emploi du temps :

```python
def fetch_pronote_timetable(date_from, date_to):
    """Récupère l'emploi du temps Pronote"""
    try:
        client = login_pronote()
        
        # Récupérer les cours de la période
        lessons = client.lessons(date_from, date_to)
        
        timetable_data = []
        for lesson in lessons:
            timetable_data.append({
                'subject': lesson.subject.name if lesson.subject else 'Cours',
                'teacher': lesson.teacher_name if hasattr(lesson, 'teacher_name') else None,
                'classroom': lesson.classroom if hasattr(lesson, 'classroom') else None,
                'start_time': lesson.start.isoformat(),
                'end_time': lesson.end.isoformat(),
                'is_cancelled': lesson.canceled if hasattr(lesson, 'canceled') else False
            })
        
        return timetable_data
    except Exception as e:
        print(f"[ERROR] Timetable fetch failed: {e}")
        return []
```

## 🎨 UI/UX

### Page de configuration
- Cards avec icônes pour chaque option
- Toggle switches visuels
- Info box explicative
- Bouton "Synchroniser maintenant"

### Life Calendar
Les cours Pronote apparaissent :
- Avec l'heure exacte (startTime, endTime)
- Badge "Auto-importé"
- Icône 📖
- Impossible à supprimer (source = 'pronote_timetable')

## ✅ Checklist d'installation

1. [ ] Exécuter `database_pronote_config_columns.sql`
2. [ ] Exécuter `database_pronote_timetable.sql`
3. [ ] Modifier `pronote_sync.py` pour ajouter fetch_timetable
4. [ ] Tester `/pronote-settings`
5. [ ] Activer "Emploi du temps"
6. [ ] Synchroniser Pronote
7. [ ] Vérifier affichage dans `/life-calendar`

## 🚀 Améliorations futures

- [ ] Notes et moyennes par matière
- [ ] Notifications avant un cours
- [ ] Détection changements emploi du temps
- [ ] Export ICS de l'emploi du temps
- [ ] Statistiques temps par matière
