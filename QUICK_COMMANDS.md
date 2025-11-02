# ⚡ Commandes rapides - Pronote Python

## 🚀 Installation rapide

### 1. Migration SQL (OBLIGATOIRE - à faire en premier)

```sql
-- Exécuter dans MySQL Workbench / phpMyAdmin
-- Ouvrir et exécuter : database_pronote_migration.sql
-- Crée les tables : pronote_config, pronote_sync_logs, pronote_assignment_mapping
```

**Voir guide complet :** `FIX_SQL_PRONOTE_TABLES.md`

### 2. Python + dépendances

```powershell
# Installation automatique (recommandé)
.\setup-pronote.ps1

# OU installation manuelle
cd server\python
pip install -r requirements.txt
python test_setup.py
```

---

## 🧪 Tests rapides

```powershell
# 1. Test Python
python --version

# 2. Test dépendances
cd server\python
python test_setup.py

# 3. Test script direct (avec .env)
cd server\python\pronote
python pronote_sync.py "https://[URL]" "[USERNAME]" "[PASSWORD]"

# 4. Démarrer le serveur
cd ..\..\..\
npm run dev

# 5. Test endpoint diagnostic
curl http://localhost:3000/api/pronote/check-python

# 6. Test endpoint sync (nécessite JWT - via UI)
# Aller dans l'interface web : http://localhost:3000
```

---

## 🗃️ Base de données

```sql
-- Voir les devoirs importés
SELECT a.title, s.name, a.deadline, a.created_at 
FROM assignments a 
LEFT JOIN subjects s ON a.subject_id = s.id 
WHERE a.user_id = [USER_ID] 
ORDER BY a.created_at DESC 
LIMIT 10;

-- Voir les logs de sync
SELECT * FROM pronote_sync_logs 
WHERE user_id = [USER_ID] 
ORDER BY sync_started_at DESC 
LIMIT 5;

-- Voir le mapping Pronote
SELECT * FROM pronote_assignment_mapping 
WHERE user_id = [USER_ID] 
LIMIT 10;

-- Voir la config Pronote
SELECT instance_url, username, last_sync, auto_sync 
FROM pronote_config 
WHERE user_id = [USER_ID] AND is_active = 1;
```

---

## 📝 Logs

```powershell
# Logs serveur Nuxt (stdout)
npm run dev
# → Regarder la console

# Logs Python (stderr) - dans la console serveur
# [Pronote Python] [ENT] ...
# [Pronote Python] [pronotepy] ...
# [Pronote Service] ...

# Logs sync dans DB
# → Table pronote_sync_logs
```

---

## 🐛 Dépannage rapide

```powershell
# Python non trouvé
where.exe python
python --version

# Dépendances manquantes
cd server\python
pip install -r requirements.txt

# Test complet
python test_setup.py

# Réinstaller proprement
pip uninstall pronotepy beautifulsoup4 requests -y
pip install -r requirements.txt

# Vérifier installation pronotepy
python -c "import pronotepy; print(pronotepy.__version__)"
```

---

## 🔄 Workflow complet

```powershell
# 1. Installation (une fois)
.\setup-pronote.ps1

# 2. Développement
npm run dev

# 3. Configuration dans l'UI
# http://localhost:3000 → Profil → Pronote

# 4. Test sync
# Cliquer "Synchroniser" dans l'interface

# 5. Vérifier résultat
# → Toast de succès
# → Devoirs dans la page Assignments
# → Stats dans le dashboard Pronote
```

---

## 📦 Structure fichiers

```
server/
├── python/
│   ├── pronote/
│   │   ├── __init__.py
│   │   └── pronote_sync.py      ← Script principal
│   ├── requirements.txt          ← Dépendances
│   ├── test_setup.py             ← Tests
│   └── INSTALL.md                ← Guide complet
├── lib/
│   └── pronoteService.js         ← Wrapper Node.js
└── api/
    └── pronote/
        ├── sync.post.js          ← Endpoint modifié
        └── check-python.get.js   ← Diagnostic
```

---

## 🎯 Endpoints API

```
GET  /api/pronote/check-python       # Diagnostic Python
GET  /api/pronote/config              # Config utilisateur
POST /api/pronote/save-config        # Enregistrer config
POST /api/pronote/sync               # Synchronisation
GET  /api/pronote/sync-logs          # Historique
DELETE /api/pronote/config           # Supprimer config
```

---

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `RECAP_PRONOTE_PYTHON.md` | Récapitulatif complet |
| `PRIORITY_11_PRONOTE_PYTHON.md` | Documentation technique |
| `TEST_PRONOTE_PYTHON.md` | Guide de test détaillé |
| `server/python/INSTALL.md` | Guide d'installation |
| `ROADMAP.md` | Roadmap projet (Priority 11) |

---

## ⚡ TL;DR

```powershell
# Installer
.\setup-pronote.ps1

# Lancer
npm run dev

# Configurer
# http://localhost:3000 → Profil → Pronote

# Synchroniser
# Cliquer "Synchroniser" dans l'UI

# Vérifier
# Page Assignments → devoirs importés ✅
```

---

**C'est tout ! 🚀**
