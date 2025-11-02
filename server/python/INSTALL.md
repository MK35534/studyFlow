# 🚀 Installation Guide - Pronote Python Service

## Prérequis

- **Python 3.8+** installé sur le système
- **pip** (gestionnaire de paquets Python)
- **Node.js** et **npm** (pour le reste de StudyFlow)

---

## Installation

### 1. Installer Python (si nécessaire)

#### Windows
```powershell
# Via Microsoft Store ou winget
winget install Python.Python.3.12

# Vérifier l'installation
python --version
```

#### Linux/macOS
```bash
# Python est généralement déjà installé
python3 --version

# Si absent, installer via le gestionnaire de paquets
# Ubuntu/Debian
sudo apt install python3 python3-pip

# macOS
brew install python3
```

### 2. Installer les dépendances Python

```powershell
# Se placer dans le dossier server/python
cd server/python

# Installer les dépendances
pip install -r requirements.txt

# Ou avec Python 3 explicitement
python -m pip install -r requirements.txt
```

### 3. Tester l'installation

```powershell
# Lancer le script de test
python test_setup.py

# Résultat attendu :
# ✅ All tests passed! (2/2)
# 🎉 Python environment is ready for Pronote sync!
```

### 4. Tester l'API (serveur lancé)

```powershell
# Démarrer le serveur Nuxt
npm run dev

# Dans un autre terminal, tester l'endpoint
curl http://localhost:3000/api/pronote/check-python
```

**Réponse attendue :**
```json
{
  "success": true,
  "python": {
    "installed": true,
    "message": "Python dependencies are installed"
  }
}
```

---

## Utilisation

### Via l'interface StudyFlow

1. Ouvrir StudyFlow dans le navigateur
2. Aller dans **Paramètres** ou **Profil**
3. Section **Synchronisation Pronote**
4. Remplir les champs :
   - **URL Pronote** : `https://[votre-etablissement].index-education.net/pronote/`
   - **Identifiant** : Votre identifiant ENT
   - **Mot de passe** : Votre mot de passe ENT
5. Cliquer sur **Enregistrer et synchroniser**
6. Les devoirs seront importés automatiquement !

### Via l'API directement

```javascript
// POST /api/pronote/sync
fetch('http://localhost:3000/api/pronote/sync', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Dépannage

### ❌ "Python is not installed or not in PATH"

**Solution :**
1. Installer Python (voir étape 1)
2. Vérifier que Python est dans le PATH :
   ```powershell
   # Windows
   python --version
   
   # Si erreur, ajouter Python au PATH :
   # Panneau de configuration > Système > Variables d'environnement
   # Ajouter : C:\Users\[USER]\AppData\Local\Programs\Python\Python312\
   ```

### ❌ "ModuleNotFoundError: No module named 'pronotepy'"

**Solution :**
```powershell
cd server/python
pip install -r requirements.txt
```

### ❌ "Failed to spawn Python process"

**Solution :**
- Vérifier les permissions d'exécution du script
- Sur Windows, utiliser `python` au lieu de `python3`
- Modifier `server/lib/pronoteService.js` ligne 20 si besoin

### ❌ "Login form not found on ENT page"

**Solution :**
- Vérifier l'URL de l'instance Pronote
- Vérifier que vous utilisez bien un ENT compatible (Atrium Sud)
- Adapter le CAS URL dans `pronote_sync.py` si nécessaire

---

## Structure des fichiers

```
studyFlow/
├── server/
│   ├── python/
│   │   ├── requirements.txt          # Dépendances Python
│   │   ├── test_setup.py             # Script de test
│   │   └── pronote/
│   │       ├── __init__.py           # Module Python
│   │       └── pronote_sync.py       # Script principal
│   ├── lib/
│   │   └── pronoteService.js         # Wrapper Node.js
│   └── api/
│       └── pronote/
│           ├── sync.post.js          # Endpoint de sync
│           └── check-python.get.js   # Endpoint de diagnostic
```

---

## Tests recommandés

### 1. Test Python isolé
```powershell
cd server/python/pronote
python pronote_sync.py "https://[URL]" "[USERNAME]" "[PASSWORD]"
# Doit afficher un JSON avec les devoirs
```

### 2. Test via l'API
```powershell
# Vérifier que le serveur est lancé
curl http://localhost:3000/api/pronote/check-python

# Tester la synchronisation (nécessite un JWT)
# Utiliser l'interface web ou Postman
```

### 3. Test complet
1. Configurer Pronote dans l'interface
2. Cliquer sur "Synchroniser"
3. Vérifier les logs dans la console serveur
4. Vérifier les devoirs dans l'interface StudyFlow
5. Vérifier la base de données :
   ```sql
   SELECT * FROM assignments ORDER BY created_at DESC LIMIT 10;
   SELECT * FROM pronote_sync_logs ORDER BY sync_started_at DESC LIMIT 5;
   ```

---

## Performance

- **Authentification ENT** : ~1-2s
- **Fetch homework (1 semaine)** : ~0.5s
- **Fetch homework (année entière)** : ~2-4s
- **Process + mapping + DB insert** : ~1s
- **Total** : **3-6 secondes** pour une synchronisation complète

---

## Sécurité

✅ **Mots de passe chiffrés** en AES-256 dans la base de données  
✅ **Credentials non loggés** (ni stdout ni stderr)  
✅ **JWT obligatoire** pour appeler l'API de sync  
✅ **Process Python isolé** (pas d'accès direct à la DB)

---

## Support

**Documentation :**
- `PRIORITY_11_PRONOTE_PYTHON.md` - Documentation technique
- `server/python/pronote/pronote_sync.py` - Code source commenté

**Logs :**
- Console du serveur Nuxt (stderr Python)
- Table `pronote_sync_logs` en base de données

**Aide :**
- Vérifier les logs dans la console
- Utiliser `test_setup.py` pour diagnostiquer
- Consulter la documentation de pronotepy : https://github.com/bain3/pronotepy

---

Bon sync ! 🚀
