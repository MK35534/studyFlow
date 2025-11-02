# 🧪 Guide de test - Pronote Python Sync

## 📋 Checklist de test

### ✅ Phase 1 : Installation Python

```powershell
# 1. Vérifier Python installé
python --version
# Attendu : Python 3.8+

# 2. Installer dépendances
cd c:\Users\Maxime\Desktop\dev\studyFlow\server\python
pip install -r requirements.txt

# 3. Tester l'installation
python test_setup.py
# Attendu : ✅ All tests passed! (2/2)
```

**Si erreur :** Voir `server/python/INSTALL.md`

---

### ✅ Phase 2 : Test serveur

```powershell
# 1. Démarrer le serveur Nuxt (dans un terminal)
cd c:\Users\Maxime\Desktop\dev\studyFlow
npm run dev

# 2. Tester l'endpoint Python diagnostic (dans un autre terminal)
curl http://localhost:3000/api/pronote/check-python

# Attendu :
# {
#   "success": true,
#   "python": {
#     "installed": true,
#     "message": "Python dependencies are installed"
#   }
# }
```

---

### ✅ Phase 3 : Test synchronisation via UI

#### 3.1 Configuration

1. Ouvrir http://localhost:3000
2. Se connecter avec votre compte StudyFlow
3. Aller dans **Profil** ou **Paramètres**
4. Section **Synchronisation Pronote**
5. Remplir les champs :
   - **URL Pronote :** `https://[votre-etablissement].index-education.net/pronote/`
   - **Identifiant :** Votre identifiant ENT
   - **Mot de passe :** Votre mot de passe ENT
6. Cliquer **Enregistrer et synchroniser**

#### 3.2 Vérifier les logs (console serveur)

```
[Sync] Calling Python service for Pronote data...
[Pronote Python] [ENT] GET https://www.atrium-sud.fr/connexion/login...
[Pronote Python] [ENT] POST credentials
[Pronote Python] [ENT] Final URL: https://...pronote.../eleve.html?identifiant=...
[Pronote Python] [ENT] Cookies: 5 cookies captured
[Pronote Python] [pronotepy] Creating Client...
[Pronote Python] [pronotepy] Logged in: True
[Pronote Python] [pronotepy] Fetching homework...
[Pronote Python] [pronotepy] Homework: 15 assignments
[Pronote Service] Python fetch successful
[Pronote Service] Homework count: 15
[Sync] Successfully retrieved Pronote data
[Sync] Processed 15 homeworks from Pronote
```

#### 3.3 Vérifier l'interface

- [ ] Toast de succès affiché
- [ ] Statistiques mises à jour (X devoirs importés)
- [ ] Badge "À jour" affiché
- [ ] Dernière synchro affichée (il y a quelques secondes)

---

### ✅ Phase 4 : Vérifier la base de données

```sql
-- 1. Vérifier les devoirs importés
SELECT 
    a.id,
    a.title,
    s.name as subject,
    a.deadline,
    a.created_at
FROM assignments a
LEFT JOIN subjects s ON a.subject_id = s.id
WHERE a.user_id = [VOTRE_USER_ID]
ORDER BY a.created_at DESC
LIMIT 10;

-- Attendu : Les devoirs Pronote sont présents

-- 2. Vérifier les logs de synchronisation
SELECT 
    id,
    status,
    assignments_imported,
    assignments_skipped,
    subjects_created,
    sync_started_at,
    sync_completed_at,
    error_message
FROM pronote_sync_logs
WHERE user_id = [VOTRE_USER_ID]
ORDER BY sync_started_at DESC
LIMIT 5;

-- Attendu : Log avec status = 'success' et stats > 0

-- 3. Vérifier le mapping Pronote
SELECT 
    id,
    pronote_id,
    local_assignment_id,
    pronote_subject_name,
    created_at
FROM pronote_assignment_mapping
WHERE user_id = [VOTRE_USER_ID]
LIMIT 10;

-- Attendu : Mappings créés entre devoirs Pronote et locaux

-- 4. Vérifier les matières créées automatiquement
SELECT 
    id,
    name,
    color,
    created_at
FROM subjects
WHERE user_id = [VOTRE_USER_ID]
ORDER BY created_at DESC;

-- Attendu : Nouvelles matières créées pour les devoirs Pronote
```

---

### ✅ Phase 5 : Test de double synchronisation (détection doublons)

1. Cliquer à nouveau sur **Synchroniser**
2. Vérifier logs :
   ```
   [Sync] Processed 15 homeworks from Pronote
   Stats: { imported: 0, skipped: 15 }
   ```
3. ✅ Les devoirs ne doivent **pas** être dupliqués !

---

### ✅ Phase 6 : Vérifier l'affichage frontend

1. Aller dans **Devoirs** (Assignments)
2. Vérifier que les devoirs Pronote sont affichés
3. Vérifier les matières (couleurs automatiques)
4. Vérifier les deadlines
5. Marquer un devoir comme complété → devrait fonctionner normalement

---

## 🐛 Dépannage

### ❌ Python non trouvé
**Logs :** `Failed to start Python process`

**Solution :**
```powershell
# Vérifier PATH
python --version

# Ou modifier pronoteService.js ligne 20
const pythonCmd = 'C:\\Users\\Maxime\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
```

### ❌ Dépendances manquantes
**Logs :** `ModuleNotFoundError: No module named 'pronotepy'`

**Solution :**
```powershell
cd server/python
pip install -r requirements.txt
python test_setup.py
```

### ❌ Authentification ENT échoue
**Logs :** `Login form not found on ENT page`

**Solution :**
1. Vérifier l'URL Pronote (doit finir par `/pronote/`)
2. Vérifier username/password corrects
3. Si autre ENT que Atrium Sud, modifier `pronote_sync.py` ligne 61

### ❌ Aucun devoir récupéré
**Logs :** `Homework: 0 assignments`

**Solution :**
1. Vérifier que votre compte Pronote a bien des devoirs
2. Vérifier la période scolaire (script récupère toute l'année)
3. Regarder stderr pour erreurs spécifiques

### ❌ Devoirs dupliqués
**Logs :** `Stats: { imported: 15, skipped: 0 }` (à chaque sync)

**Solution :**
1. Vérifier table `pronote_assignment_mapping`
2. Si vide, la détection de doublons ne fonctionne pas
3. Vérifier logique dans `sync.post.js` lignes 150-180

---

## 📊 Résultats attendus

### ✅ Sync réussie
- Python process terminé avec code 0
- JSON valide parsé
- 10-20 devoirs importés (selon votre Pronote)
- 3-5 matières créées automatiquement
- Log de sync avec status='success'
- Badge "À jour" dans l'interface
- Devoirs visibles dans la page Assignments

### ⏱️ Performance attendue
- Auth ENT : 1-2s
- Fetch homework : 2-4s
- Process + DB : 1s
- **Total : 3-6 secondes**

### 📦 Données récupérées
```json
{
  "homework": [
    {
      "id": "12345",
      "description": "Exercices page 42",
      "subject": "Mathématiques",
      "date": "2025-10-25T00:00:00",
      "done": false,
      ...
    }
  ],
  "lessons": [...],  // Emploi du temps (pas encore utilisé)
  "grades": {...}    // Notes (pas encore utilisé)
}
```

---

## 🎯 Critères de validation

- [x] Python installé et dépendances OK
- [ ] Endpoint `/api/pronote/check-python` retourne success
- [ ] Configuration Pronote enregistrée
- [ ] Synchronisation complète réussie
- [ ] Devoirs importés dans la base de données
- [ ] Logs de sync avec status='success'
- [ ] Devoirs affichés dans l'interface
- [ ] Détection doublons fonctionne (2e sync)
- [ ] Performance acceptable (< 10s)
- [ ] Aucune erreur dans la console

---

## 📝 Notes de test

**Date du test :** ________________

**Environnement :**
- OS : Windows 11
- Python version : ________________
- Node.js version : ________________
- Établissement Pronote : ________________
- ENT utilisé : Atrium Sud / Autre : ________________

**Résultats :**
- Nombre de devoirs importés : ________________
- Nombre de matières créées : ________________
- Durée de la synchronisation : ________________ secondes
- Erreurs rencontrées : ________________

**Commentaires :**
_________________________________________________
_________________________________________________
_________________________________________________

---

Bon test ! 🚀
