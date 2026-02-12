# 🆕 Setup GitHub Complet - Depuis Zéro

## Étape 1 : Créer le Repository GitHub (2 minutes)

### 1.1 Créer le Repo

1. Va sur : **https://github.com/new**
2. Remplis :
   - **Repository name** : `yo-voiz`
   - **Description** : `Plateforme de services entre voisins - Abidjan`
   - **Visibility** : Public ou Private (ton choix)
   - ❌ **NE COCHE RIEN** (pas de README, pas de .gitignore, pas de license)
3. Clique sur **"Create repository"**

### 1.2 Copier l'URL du Repository

Après création, GitHub affiche des instructions. **Copie l'URL** qui ressemble à :
```
https://github.com/coulmilourou-rgb/yo-voiz.git
```

---

## Étape 2 : Réinitialiser Git Localement (3 minutes)

### 2.1 Supprimer l'ancien Git

Ouvre **PowerShell** et exécute :

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"

# Supprimer le dossier .git (ancien historique)
Remove-Item -Recurse -Force .git
```

### 2.2 Initialiser un nouveau Git

```powershell
# Initialiser un nouveau repository Git
git init

# Vérifier le statut
git status
```

Tu devrais voir tous les fichiers en "Untracked files".

---

## Étape 3 : Premier Commit (2 minutes)

### 3.1 Ajouter tous les fichiers

```powershell
# Ajouter tous les fichiers au staging
git add .

# Vérifier ce qui est ajouté
git status
```

### 3.2 Créer le commit initial

```powershell
git commit -m "Initial commit: Yo! Voiz MVP - Dashboard Client + Auth"
```

---

## Étape 4 : Lier au Repository GitHub (1 minute)

### 4.1 Ajouter le remote

**REMPLACE** `https://github.com/coulmilourou-rgb/yo-voiz.git` par l'URL que tu as copiée à l'étape 1.2

```powershell
# Ajouter le remote origin
git remote add origin https://github.com/coulmilourou-rgb/yo-voiz.git

# Vérifier que c'est bien ajouté
git remote -v
```

Tu devrais voir :
```
origin  https://github.com/coulmilourou-rgb/yo-voiz.git (fetch)
origin  https://github.com/coulmilourou-rgb/yo-voiz.git (push)
```

### 4.2 Renommer la branche en "main"

```powershell
git branch -M main
```

---

## Étape 5 : Push vers GitHub (2 minutes)

### 5.1 Pousser le code

```powershell
git push -u origin main
```

**Note** : GitHub te demandera peut-être de t'authentifier :

#### Si tu as un Personal Access Token (PAT) :
- **Username** : `coulmilourou-rgb`
- **Password** : Colle ton **Personal Access Token** (pas ton mot de passe GitHub)

#### Si tu n'as pas de PAT :
1. Va sur : https://github.com/settings/tokens
2. Clique sur **"Generate new token (classic)"**
3. **Note** : `Yo Voiz Deploy`
4. **Expiration** : 90 days (ou plus)
5. **Scopes** : Coche `repo` (full control)
6. Clique sur **"Generate token"**
7. **COPIE LE TOKEN** (tu ne pourras plus le revoir !)
8. Utilise-le comme mot de passe lors du `git push`

### 5.2 Vérifier sur GitHub

Va sur : `https://github.com/coulmilourou-rgb/yo-voiz`

Tu devrais voir tous tes fichiers ! 🎉

---

## Étape 6 : Configurer Vercel (5 minutes)

### 6.1 Se connecter à Vercel

1. Va sur : https://vercel.com/login
2. Connecte-toi avec **GitHub**

### 6.2 Importer le Projet

1. Sur le Dashboard Vercel, clique sur **"Add New..."** > **"Project"**
2. Cherche et sélectionne le repository **`yo-voiz`**
3. Clique sur **"Import"**

### 6.3 Configurer le Projet

**IMPORTANT** : Configure ces paramètres avant de déployer :

#### A. Root Directory
- Clique sur **"Edit"** à côté de "Root Directory"
- Entre : `yo-voisin`
- ⚠️ **TRÈS IMPORTANT** : Sans ça, le build échouera !

#### B. Variables d'Environnement

Clique sur **"Environment Variables"** et ajoute :

**Variable 1** :
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://xxxxx.supabase.co` (ton URL Supabase)
- Coche : ✅ Production ✅ Preview ✅ Development

**Variable 2** :
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGc...` (ta clé Supabase)
- Coche : ✅ Production ✅ Preview ✅ Development

**Où trouver ces valeurs ?**
- Dans ton fichier local : `C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin\.env.local`
- OU sur Supabase Dashboard > Project Settings > API

### 6.4 Déployer

1. Une fois tout configuré, clique sur **"Deploy"**
2. Attends 2-3 minutes ⏳
3. Le build va se lancer...

---

## Étape 7 : Vérifier le Déploiement (3 minutes)

### 7.1 Suivre le Build

Sur Vercel, tu verras :
- 🟡 **Building...** (1-2 min)
- 🟡 **Deploying...** (30 sec)
- 🟢 **Ready** (Terminé !)

### 7.2 Accéder au Site

Vercel te donne une URL comme :
```
https://yo-voiz.vercel.app
```
OU
```
https://yo-voiz-xxxxx.vercel.app
```

### 7.3 Tester

Ouvre l'URL et teste :

1. **Page d'accueil** : `https://yo-voiz.vercel.app`
   - ✅ Logo et design s'affichent
   - ✅ Pas d'erreurs dans la console (F12)

2. **Inscription** : `/auth/inscription`
   - ✅ Formulaire s'affiche
   - ✅ Créer un compte test

3. **Connexion** : `/auth/connexion`
   - ✅ Se connecter avec le compte créé

4. **Dashboard Client** : `/dashboard/client`
   - ✅ Voir les stats
   - ✅ Bouton "Créer une mission"

5. **Nouvelle Mission** : `/missions/nouvelle`
   - ✅ Les 6 étapes fonctionnent

---

## ⚠️ En Cas de Problème

### ❌ "Build Failed" sur Vercel

**Causes possibles** :
1. Root Directory incorrect → Vérifie que c'est `yo-voisin`
2. Variables d'environnement manquantes
3. Erreurs de code

**Solution** :
1. Clique sur le déploiement qui a échoué
2. Lis les **logs d'erreur** (très détaillés)
3. Corrige le problème
4. **Redéploie** :
   - Vercel > Deployments > ... > **Redeploy**

### ❌ "Authentication failed" lors du `git push`

**Solution** :
1. Génère un Personal Access Token : https://github.com/settings/tokens
2. Permissions : `repo` (full control)
3. Copie le token
4. Utilise-le comme mot de passe lors du push

### ❌ Page blanche ou 404 en production

**Solution** :
1. Vercel Dashboard > Settings > General
2. Vérifie **Root Directory** : doit être `yo-voisin`
3. Redéploie

### ❌ "Supabase connection error"

**Solution** :
1. Vercel Dashboard > Settings > Environment Variables
2. Vérifie que les 2 variables sont bien configurées
3. Copie-colle exactement depuis `.env.local`
4. Redéploie

---

## 📊 Workflow Après Déploiement

### Développement Continu

Maintenant, chaque modification suit ce cycle :

```powershell
# 1. Développe en local
npm run dev

# 2. Teste
# ...

# 3. Commit
git add .
git commit -m "feat: Add new feature"

# 4. Push (déclenche le déploiement automatique)
git push origin main

# 5. Vérifie sur Vercel
# Vercel build et déploie automatiquement
# URL : https://yo-voiz.vercel.app
```

### Déploiement Automatique

✨ **Chaque `git push origin main` déploie automatiquement en production !**

Tu n'as plus besoin de faire quoi que ce soit manuellement. Vercel :
1. Détecte le push
2. Lance le build
3. Déploie si le build passe
4. Envoie une notification

---

## ✅ Checklist Finale

Avant de déclarer le déploiement réussi :

- [ ] Repository GitHub créé
- [ ] Code pushé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Root Directory = `yo-voisin`
- [ ] Variables d'environnement configurées
- [ ] Build réussi (vert sur Vercel)
- [ ] Page d'accueil fonctionne
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard s'affiche
- [ ] Aucune erreur dans la console (F12)

---

## 🎯 Prochaines Étapes

Une fois en production, on pourra développer sereinement :

1. ✅ Page Détail Mission
2. ✅ Dashboard Prestataire
3. ✅ Système d'Offres
4. ✅ Messagerie Temps Réel
5. ✅ Paiement Mobile Money
6. ✅ Avis & Évaluations
7. ✅ Réactiver OTP WhatsApp

---

**Temps total estimé** : 15-20 minutes  
**Dernière mise à jour** : 12/02/2026  
**Status** : Prêt à déployer ! 🚀
