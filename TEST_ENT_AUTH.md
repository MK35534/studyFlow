# 🧪 Guide de test : Authentification ENT

## 📋 Objectif

Tester la nouvelle fonctionnalité d'authentification via ENT pour les instances Pronote qui nécessitent un passage par l'Espace Numérique de Travail.

---

## 🎯 Scénarios de test

### ✅ Scénario 1 : Instance avec ENT (Atrium Sud)

#### Prérequis
- Avoir un compte Pronote sur une instance avec ENT obligatoire
- Exemple : Lycée en région PACA utilisant Atrium Sud

#### Étapes

1. **Accéder à la page de profil**
   ```
   http://localhost:3000/profile
   ```

2. **Section "Synchronisation Pronote"**
   - Saisir l'URL de votre instance Pronote
   - Exemple : `https://0691234x.index-education.net/pronote/eleve.html`

3. **Cliquer sur "Vérifier"**
   - ✅ Résultat attendu :
     ```
     ✅ Nom du lycée
     ⚠️ Cette instance nécessite une connexion via ENT
     ```

4. **Saisir l'identifiant Pronote**
   - C'est votre identifiant PRONOTE (pas celui de l'ENT !)
   - Format : `prenom.nom` ou numéro élève

5. **Cliquer sur "Se connecter via l'ENT"**
   - ✅ Une modal s'ouvre avec un iframe
   - ✅ Instructions affichées en haut
   - ✅ Page de connexion de l'ENT chargée

6. **S'authentifier sur l'ENT**
   - Saisir vos identifiants **ENT** (fournis par l'établissement)
   - Valider

7. **Autoriser l'accès (si demandé)**
   - Certains ENT demandent confirmation
   - Cliquer sur "Autoriser l'accès à Pronote"

8. **Authentification automatique**
   - ✅ Affichage "Authentification réussie !"
   - ✅ Compte à rebours 3, 2, 1...
   - ✅ Modal se ferme automatiquement
   - ✅ Toast : "Configuration ENT enregistrée !"
   - ✅ Première synchronisation lancée

9. **Vérifier le dashboard**
   - ✅ Nombre de devoirs importés affiché
   - ✅ Matières auto-créées si nécessaire
   - ✅ Badge de statut "À jour" (vert)

---

### ✅ Scénario 2 : Instance sans ENT (connexion directe)

#### Prérequis
- Avoir un compte Pronote sur une instance sans ENT
- Exemple : Démonstration Index Éducation

#### Étapes

1. **Accéder à la page de profil**
   ```
   http://localhost:3000/profile
   ```

2. **Saisir l'URL de démonstration**
   ```
   https://demo.index-education.net/pronote/eleve.html
   ```

3. **Cliquer sur "Vérifier"**
   - ✅ Résultat attendu :
     ```
     ✅ LYCEE DE DEMONSTRATION
     ```
   - ❌ PAS de message "nécessite ENT"

4. **Remplir le formulaire classique**
   - Identifiant : `demonstration`
   - Mot de passe : `pronotevs`

5. **Cliquer sur "Enregistrer et synchroniser"**
   - ✅ Toast : "Configuration enregistrée !"
   - ✅ Synchronisation lancée
   - ✅ Dashboard affiché

6. **Vérifier les devoirs**
   - ✅ Liste des devoirs de démonstration importés
   - ✅ Matières créées
   - ✅ Dates de deadline correctes

---

### ✅ Scénario 3 : Changement de mode (ENT → Direct)

#### Objectif
Vérifier qu'on peut passer d'une instance ENT à une instance sans ENT

#### Étapes

1. **Avoir une config ENT active**
   - Dashboard affiché avec instance ENT

2. **Cliquer sur "Modifier la configuration"**

3. **Vérifier une nouvelle instance SANS ENT**
   - Saisir URL de démonstration
   - Cliquer sur "Vérifier"
   - ✅ Pas de message ENT

4. **Saisir credentials directs**
   - Username/password

5. **Enregistrer**
   - ✅ Ancienne config mise à jour
   - ✅ Nouvelle sync avec credentials directs
   - ✅ Dashboard mis à jour

---

### ✅ Scénario 4 : Re-synchronisation avec ENT

#### Objectif
Vérifier que les syncs suivantes fonctionnent avec le token CAS stocké

#### Étapes

1. **Avoir une config ENT enregistrée**
   - Dashboard affiché

2. **Cliquer sur "Synchroniser maintenant"**
   - ✅ Spinner de chargement
   - ✅ Pas de nouvelle demande d'authentification ENT
   - ✅ Sync réussie avec le token CAS stocké
   - ✅ Toast : "X devoirs importés, Y ignorés"

3. **Vérifier les logs**
   - ✅ Nouvelle entrée dans l'historique
   - ✅ Statut "Success"
   - ✅ Durée affichée

---

## 🐛 Tests d'erreurs

### ❌ Test 1 : URL Pronote invalide

**Étapes :**
1. Saisir `https://mauvaise-url.com/pronote`
2. Cliquer sur "Vérifier"

**Résultat attendu :**
- ❌ Toast rouge : "Instance Pronote non trouvée"
- Pas de passage à l'étape suivante

---

### ❌ Test 2 : Identifiant ENT incorrect

**Étapes :**
1. Vérifier instance avec ENT
2. Saisir identifiant Pronote correct
3. Cliquer sur "Se connecter via l'ENT"
4. Saisir identifiants ENT **incorrects**

**Résultat attendu :**
- Page ENT affiche "Identifiants incorrects"
- Possibilité de réessayer
- Pas de fermeture automatique de la modal

---

### ❌ Test 3 : Token CAS expiré

**Étapes :**
1. Avoir une config ENT enregistrée depuis > 24h
2. Cliquer sur "Synchroniser maintenant"

**Résultat attendu (selon la gestion de Pawnote) :**
- Soit : Refresh automatique du token → Sync OK
- Soit : Erreur "Token expiré" → Toast rouge → Invitation à se reconnecter

---

### ❌ Test 4 : Instance Pronote hors ligne

**Étapes :**
1. Vérifier une URL valide mais serveur hors ligne
2. Ou tester pendant maintenance Pronote

**Résultat attendu :**
- ❌ Toast : "Impossible de se connecter à Pronote"
- Log d'erreur créé
- Dashboard affiche dernière sync réussie

---

## 📊 Checklist de validation

### Frontend

- [ ] Modal ENTWebViewAuth s'ouvre correctement
- [ ] iframe charge la page CAS
- [ ] Instructions affichées clairement
- [ ] Spinner pendant le chargement
- [ ] Animation de succès fluide
- [ ] Compte à rebours visible
- [ ] Modal se ferme automatiquement
- [ ] Toasts affichés aux bons moments
- [ ] Dark mode fonctionne
- [ ] Responsive sur mobile

### Backend

- [ ] Endpoint `/api/pronote/save-ent-config` répond
- [ ] Token CAS correctement chiffré
- [ ] Upsert dans `pronote_config` fonctionne
- [ ] Colonnes `cas_url` et `cas_token` remplies
- [ ] `encrypted_password` reste vide pour ENT
- [ ] Authentification `loginWithCAS()` réussit
- [ ] Sync avec CAS fonctionne
- [ ] Logs de sync créés correctement

### Sécurité

- [ ] Token CAS jamais exposé en clair
- [ ] Iframe sandbox appliqué
- [ ] JWT vérifié sur tous les endpoints
- [ ] Pas de fuite de données dans les logs
- [ ] Encryption AES-256 fonctionnelle

### Base de données

- [ ] Table `pronote_config` contient les données ENT
- [ ] Trigger `updated_at` mis à jour
- [ ] Logs de sync enregistrés
- [ ] Pas de doublons de configuration

---

## 🔍 Vérifications en BDD

### Config ENT correctement enregistrée

```sql
SELECT 
  id,
  user_id,
  instance_url,
  username,
  cas_url,
  CASE 
    WHEN cas_token IS NOT NULL THEN '[ENCRYPTED]' 
    ELSE NULL 
  END as cas_token_status,
  CASE 
    WHEN encrypted_password = '' THEN 'ENT MODE'
    ELSE 'DIRECT MODE'
  END as auth_mode,
  last_sync,
  is_active
FROM pronote_config
WHERE user_id = YOUR_USER_ID;
```

**Résultat attendu pour ENT :**
```
cas_url: https://cas.atrium-sud.fr/...
cas_token_status: [ENCRYPTED]
auth_mode: ENT MODE
```

### Logs de sync

```sql
SELECT 
  sync_started_at,
  sync_completed_at,
  status,
  assignments_imported,
  subjects_created,
  error_message
FROM pronote_sync_logs
WHERE user_id = YOUR_USER_ID
ORDER BY sync_started_at DESC
LIMIT 5;
```

**Résultat attendu :**
```
status: success
assignments_imported: > 0
error_message: NULL
```

---

## 📸 Screenshots attendus

### 1. Détection ENT
```
┌─────────────────────────────────────┐
│ URL de votre Pronote                │
│ [https://...pronote/]  [✓]          │
│                                     │
│ ✅ Lycée Victor Hugo                │
│ ⚠️ Cette instance nécessite ENT     │
└─────────────────────────────────────┘
```

### 2. Modal ENT ouverte
```
┌────────────────────────────────────┐
│ 🔒 Connexion via ENT      [✕]     │
├────────────────────────────────────┤
│ 1️⃣ Connectez-vous avec vos ID ENT │
│ 2️⃣ Autorisez l'accès à Pronote    │
│ 3️⃣ Fermeture automatique          │
├────────────────────────────────────┤
│ [iframe: Page ENT]                 │
└────────────────────────────────────┘
```

### 3. Authentification réussie
```
┌────────────────────────────────────┐
│         ✅                          │
│   Authentification réussie !       │
│   Fermeture dans 3s...             │
└────────────────────────────────────┘
```

### 4. Dashboard après sync
```
┌─────────────────────────────────────┐
│ Dernière sync : Il y a 2 min        │
│ [À jour] ●                          │
│                                     │
│ Statistiques                        │
│ 📊 12 devoirs importés              │
│ ⏭️  3 ignorés (doublons)            │
│ 📚 2 matières créées                │
└─────────────────────────────────────┘
```

---

## 🎓 URLs de test

### Instances ENT connues

**Atrium Sud (PACA) :**
```
CAS URL: https://cas.atrium-sud.fr/login
Région: Provence-Alpes-Côte d'Azur
Nécessite: Compte élève ENT Atrium
```

**Mon Bureau Numérique (Grand Est) :**
```
CAS URL: https://cas.monbureaunumerique.fr/login
Région: Grand Est
Nécessite: Compte élève MBN
```

**ENT77 (Seine-et-Marne) :**
```
CAS URL: https://ent77.seine-et-marne.fr/...
Région: Île-de-France
Nécessite: Compte élève ENT77
```

### Instance de démonstration (sans ENT)

```
URL: https://demo.index-education.net/pronote/eleve.html
Username: demonstration
Password: pronotevs
```

---

## 📞 Support

### Problème détecté ?

**Logs serveur à vérifier :**
```powershell
# Terminal où tourne npm run dev
# Chercher :
[ENT Auth] ...
[Sync] Authenticated via ENT/CAS
```

**Logs navigateur à vérifier :**
```javascript
// Console DevTools (F12)
// Chercher :
Error loading config: ...
Error saving ENT config: ...
```

**Fichier de debug :**
```
PRIORITY_9_PHASE_2_ENT_AUTH.md
→ Section "Debugging"
```

---

## ✅ Validation finale

Cocher si tous les tests passent :

- [ ] Scénario 1 : Instance ENT ✅
- [ ] Scénario 2 : Instance directe ✅
- [ ] Scénario 3 : Changement de mode ✅
- [ ] Scénario 4 : Re-sync avec ENT ✅
- [ ] Test erreur 1 : URL invalide ✅
- [ ] Test erreur 2 : ID incorrects ✅
- [ ] Test erreur 3 : Token expiré ✅
- [ ] Test erreur 4 : Serveur hors ligne ✅
- [ ] Vérification BDD ✅
- [ ] Dark mode ✅
- [ ] Mobile responsive ✅

**Si tous les tests passent → 🚀 Prêt pour la production !**

---

**Date:** 18 octobre 2025  
**Version testée:** Phase 2 ENT Auth  
**Testeur:** À compléter  
**Résultat:** ⏳ En attente de test
