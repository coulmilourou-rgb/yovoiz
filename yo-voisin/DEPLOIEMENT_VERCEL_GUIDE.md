# 🚀 Guide de Déploiement sur Vercel - Yo! Voiz

Ce guide vous accompagne pour déployer Yo! Voiz sur Vercel **GRATUITEMENT** en moins d'1 heure.

---

## 📋 Prérequis

- [ ] Code du projet prêt (✅ déjà fait)
- [ ] Compte GitHub (à créer si nécessaire)
- [ ] Compte Vercel (à créer)
- [ ] Credentials Supabase (✅ déjà configurés en local)
- [ ] Credentials Twilio WhatsApp (✅ déjà configurés en local)

---

## 🎯 Étapes de Déploiement

### Étape 1 : Créer un Compte GitHub (5 minutes)

1. **Allez sur** : https://github.com/
2. **Cliquez** sur "Sign up"
3. **Remplissez** :
   - Username : `coulm-yovoiz` (exemple)
   - Email : Votre email
   - Password : Un mot de passe fort
4. **Vérifiez** votre email
5. **C'est fait !**

---

### Étape 2 : Installer Git (si pas déjà fait) (5 minutes)

#### Vérifier si Git est installé :

```powershell
git --version
```

Si erreur → Installer Git :

1. **Téléchargez** : https://git-scm.com/download/win
2. **Lancez** l'installeur
3. **Cliquez** "Next" partout (options par défaut)
4. **Redémarrez** PowerShell

---

### Étape 3 : Initialiser Git et Pousser sur GitHub (15 minutes)

#### 3.1 : Ouvrir PowerShell dans le projet

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
```

#### 3.2 : Initialiser Git (si pas déjà fait)

```powershell
git init
```

#### 3.3 : Ajouter tous les fichiers

```powershell
git add .
```

#### 3.4 : Créer le premier commit

```powershell
git commit -m "Initial commit - Yo! Voiz"
```

#### 3.5 : Créer un repository sur GitHub

1. **Allez sur** : https://github.com/new
2. **Nom du repository** : `yo-voiz`
3. **Description** : "Plateforme de services à domicile en Côte d'Ivoire"
4. **Visibilité** : **Private** (recommandé pour commencer)
5. **Cliquez** "Create repository"

#### 3.6 : Connecter le projet à GitHub

Copiez les commandes affichées sur GitHub (similaires à) :

```powershell
git remote add origin https://github.com/VOTRE-USERNAME/yo-voiz.git
git branch -M main
git push -u origin main
```

**Note** : Remplacez `VOTRE-USERNAME` par votre username GitHub.

#### 3.7 : Entrer vos identifiants GitHub

- Username : Votre username GitHub
- Password : **Utilisez un Personal Access Token** (pas votre mot de passe)

**Créer un Token** :
1. https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Cochez : `repo` (full control)
4. Générez et copiez le token
5. Utilisez-le comme "password"

---

### Étape 4 : Créer un Compte Vercel (5 minutes)

1. **Allez sur** : https://vercel.com/signup
2. **Cliquez** "Continue with GitHub"
3. **Autorisez** Vercel à accéder à GitHub
4. **C'est fait !**

---

### Étape 5 : Importer le Projet sur Vercel (10 minutes)

#### 5.1 : Importer depuis GitHub

1. **Dashboard Vercel** → **"Add New"** → **"Project"**
2. **Cherchez** `yo-voiz` dans la liste
3. **Cliquez** "Import"

#### 5.2 : Configurer le Projet

**Framework Preset** : Next.js (détecté automatiquement)

**Root Directory** : `.` (racine)

**Build Command** : `npm run build` (par défaut)

**Output Directory** : `.next` (par défaut)

#### 5.3 : Ajouter les Variables d'Environnement

**IMPORTANT** : Ajoutez TOUTES ces variables avant de déployer.

Cliquez sur "Environment Variables" et ajoutez :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hfrmctsvpszqdizritoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NDY5NTMsImV4cCI6MjA4NjQyMjk1M30.OogMznnRcG-DKZs_bSkJ-Kuu9MKHtSnh0WN7wDTLYR4

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=AC660822f5e7e2cafaf2e908a5a4b8ea9c
TWILIO_AUTH_TOKEN=af7a8b9e73df75a3c6c4bc138857d049
TWILIO_WHATSAPP_NUMBER=+18304940577

# WhatsApp Mode (true = envoi réel, false = popup debug)
NEXT_PUBLIC_ENABLE_REAL_WHATSAPP=true

# Node Environment
NODE_ENV=production
```

**Pour chaque variable** :
1. Copiez le nom (ex: `NEXT_PUBLIC_SUPABASE_URL`)
2. Collez dans "Name"
3. Copiez la valeur
4. Collez dans "Value"
5. Cliquez "Add"

#### 5.4 : Déployer

**Cliquez** "Deploy"

Vercel va :
1. ✅ Cloner le code depuis GitHub
2. ✅ Installer les dépendances (`npm install`)
3. ✅ Build le projet (`npm run build`)
4. ✅ Déployer sur le CDN mondial

**Durée** : 2-5 minutes

---

### Étape 6 : Votre Site est en Ligne ! 🎉

Une fois le build terminé, Vercel vous donne :

- **URL Production** : `https://yo-voiz.vercel.app`
- **URL avec domaine auto** : `https://yo-voiz-XXXXX.vercel.app`

**Cliquez** sur l'URL pour voir votre site en ligne !

---

## ⚙️ Configuration Post-Déploiement

### Configurer Supabase pour la Production

1. **Allez sur** : https://supabase.com/dashboard
2. **Sélectionnez** votre projet
3. **Settings** → **API** → **URL Configuration**
4. **Ajoutez** votre URL Vercel :

```
https://yo-voiz.vercel.app/*
https://yo-voiz-*.vercel.app/*
```

5. **Authentication** → **URL Configuration** :

**Site URL** :
```
https://yo-voiz.vercel.app
```

**Redirect URLs** (ajouter ces 2) :
```
https://yo-voiz.vercel.app/auth/callback
https://yo-voiz.vercel.app/auth/reset-password
```

6. **Sauvegardez**

---

## 🧪 Tests de Production

### Test 1 : Page d'Accueil

1. **Ouvrez** : `https://yo-voiz.vercel.app`
2. **Vérifiez** :
   - ✅ Page se charge correctement
   - ✅ Logo "Yo! Voiz" affiché
   - ✅ Bouton "S'inscrire" fonctionne

### Test 2 : Inscription

1. **Cliquez** "S'inscrire"
2. **Remplissez** le formulaire avec un vrai email
3. **Utilisez** un vrai numéro de téléphone
4. **Vérifiez** :
   - ✅ Pas d'erreur dans le formulaire
   - ✅ Passage à l'étape OTP
   - ⚠️ **WhatsApp** : Sandbox uniquement (utilisateurs doivent rejoindre)

### Test 3 : Connexion

1. **Page** : `/auth/connexion`
2. **Testez** avec un compte existant
3. **Vérifiez** la redirection après login

### Test 4 : Mot de Passe Oublié

1. **Page** : `/auth/mot-de-passe-oublie`
2. **Entrez** un email
3. **Vérifiez** la réception de l'email
4. **Testez** le lien de réinitialisation

---

## 🔧 Dépannage

### Erreur : "Build Failed"

**Vérifiez dans les logs Vercel** :
- Erreurs TypeScript ?
- Dépendances manquantes ?
- Variables d'environnement oubliées ?

**Solution** : Corriger le code et push :

```powershell
git add .
git commit -m "Fix: correction erreur build"
git push
```

Vercel redéploie automatiquement !

---

### Erreur : "Supabase client error"

**Cause** : Variables Supabase incorrectes

**Solution** :
1. Vercel Dashboard → Projet → Settings → Environment Variables
2. Vérifiez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Corrigez si nécessaire
4. Redéployez : Settings → Deployments → ... → Redeploy

---

### Erreur : "WhatsApp not sending"

**Cause 1** : `NEXT_PUBLIC_ENABLE_REAL_WHATSAPP=false`

**Solution** : Changez en `true` dans les variables Vercel

**Cause 2** : Utilisateur n'a pas rejoint le sandbox

**Solution** : En production sandbox, les utilisateurs doivent d'abord :
1. Envoyer `join <code>` au numéro Twilio
2. Puis s'inscrire

**Alternative** : Demander un numéro WhatsApp Business (voir `CONFIGURATION_WHATSAPP.md`)

---

### Page 404 sur certaines routes

**Cause** : Routes dynamiques non reconnues

**Solution** : Vérifiez que le projet est bien configuré comme Next.js App Router

---

## 🚀 Déploiement Continu

### Chaque fois que vous faites un `git push` :

1. ✅ Vercel détecte le push
2. ✅ Build automatique
3. ✅ Déploiement automatique
4. ✅ URL mise à jour

**Preview Deployments** :
- Chaque branche = URL preview unique
- Testez avant de merger en `main`

---

## 📊 Monitoring

### Dashboard Vercel

**Analytics** : https://vercel.com/VOTRE-USERNAME/yo-voiz/analytics

**Métriques** :
- Visiteurs uniques
- Pages vues
- Temps de chargement
- Taux d'erreur

**Logs** : https://vercel.com/VOTRE-USERNAME/yo-voiz/logs
- Erreurs runtime
- Requêtes API
- Performances

---

## 💰 Coûts

### Plan Hobby (Gratuit)

**Inclus** :
- ✅ Bande passante : 100 GB/mois
- ✅ Build time : 100h/mois
- ✅ Projets : Illimités
- ✅ Domaines : Illimités
- ✅ SSL : Automatique

**Limite** :
- ~5,000 utilisateurs actifs/mois
- ~150,000 pages vues/mois

**Upgrade** : Quand vous dépassez → Pro à 20€/mois

---

## ✅ Checklist Finale

- [ ] Code poussé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement ajoutées
- [ ] Build réussi
- [ ] Site accessible sur `yo-voiz.vercel.app`
- [ ] URLs ajoutées dans Supabase
- [ ] Test inscription fonctionnel
- [ ] Test connexion fonctionnel
- [ ] Test mot de passe oublié fonctionnel

---

## 🎯 Prochaines Étapes

### Option A : Ajouter un Domaine Custom (Plus tard)

1. Acheter `yovoiz.ci`
2. Dans Vercel : Settings → Domains → Add
3. Configurer les DNS
4. Attendre propagation (1-24h)

### Option B : Activer WhatsApp Production (Plus tard)

1. Demander numéro WhatsApp Business
2. Créer templates Meta
3. Attendre approbation (2-7 jours)
4. Mettre à jour `TWILIO_WHATSAPP_NUMBER`

### Option C : Développer les Fonctionnalités Métier (Maintenant)

- Dashboard utilisateur
- Système de demandes
- Système d'offres
- Matching
- Messagerie
- Paiement Mobile Money

---

## 📞 Besoin d'Aide ?

**Problème de déploiement ?**
- Vérifiez les logs Vercel
- Contactez-moi avec le message d'erreur

**Questions sur la configuration ?**
- Voir `GUIDE_DEPLOIEMENT_COMPLET.md`
- Voir `CONFIGURATION_WHATSAPP.md`

---

**Félicitations ! Yo! Voiz est maintenant en ligne ! 🎉**

**URL** : https://yo-voiz.vercel.app
