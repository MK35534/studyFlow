# 🔧 Fix - Erreur SQL Pronote

## Problème
```
ERROR: Incorrect arguments to mysqld_stmt_execute
Error fetching sync logs
```

## Cause
Les tables Pronote (`pronote_config`, `pronote_sync_logs`, `pronote_assignment_mapping`) n'existent pas encore dans votre base de données.

## Solution

### Option 1 : Via MySQL Workbench / phpMyAdmin (Recommandé)

1. **Ouvrir MySQL Workbench** ou phpMyAdmin
2. **Se connecter** à votre base de données :
   - Host: `studyflow-studyflow.e.aivencloud.com:23161`
   - Database: `studyflow`
   - User: `avnadmin`
   - Password: (votre mot de passe)

3. **Exécuter le fichier SQL** :
   - Ouvrir le fichier : `database_pronote_migration.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer "Execute" / "Exécuter"

### Option 2 : Via ligne de commande

```powershell
# Se connecter à MySQL
mysql -h studyflow-studyflow.e.aivencloud.com -P 23161 -u avnadmin -p studyflow

# Puis dans MySQL :
source c:/Users/Maxime/Desktop/dev/studyFlow/database_pronote_migration.sql;

# Ou en une ligne :
mysql -h studyflow-studyflow.e.aivencloud.com -P 23161 -u avnadmin -p studyflow < database_pronote_migration.sql
```

### Option 3 : Via VS Code extension MySQL

1. Installer extension : **MySQL** (by Jun Han)
2. Créer une connexion
3. Ouvrir `database_pronote_migration.sql`
4. Clic droit > "Run MySQL Query"

## Vérification

Après avoir exécuté la migration, vérifier que les tables existent :

```sql
-- Vérifier les tables
SHOW TABLES LIKE 'pronote%';

-- Devrait afficher :
-- pronote_config
-- pronote_sync_logs
-- pronote_assignment_mapping

-- Vérifier la structure
DESCRIBE pronote_config;
DESCRIBE pronote_sync_logs;
DESCRIBE pronote_assignment_mapping;
```

## Tester

1. **Redémarrer le serveur** :
   ```powershell
   # Ctrl+C pour arrêter
   npm run dev
   ```

2. **Rafraîchir la page** : http://localhost:3000/profile

3. **Résultat attendu** : 
   - ✅ Plus d'erreur SQL
   - ✅ Section "Synchronisation Pronote" affichée
   - ✅ Formulaire de configuration visible

## Si l'erreur persiste

Vérifier les logs du serveur pour le message exact :
```
[Nuxt] ERROR Error fetching sync logs: ...
```

Et consulter la section correspondante dans le code :
- `server/api/pronote/config.get.js`
- `server/api/pronote/sync-logs.get.js`

---

**Note :** Cette migration est nécessaire pour la fonctionnalité de synchronisation Pronote (Priority 11).
