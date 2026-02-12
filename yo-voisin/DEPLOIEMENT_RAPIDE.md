# 🚀 Déploiement sur Vercel - Étapes Simples

**Durée totale : ~30 minutes**

---

## ✅ Étape 1 : Vérifier que le code est prêt (2 min)

### Commandes PowerShell :

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"

# Vérifier que Git est initialisé
git status

# Résultat attendu : "On branch main"
```

✅ **C'est bon !** Git est déjà configuré.

---

## ✅ Étape 2 : Créer un compte GitHub (5 min)

### Si vous n'avez PAS encore de compte GitHub :

1. **Allez sur** : https://github.com/
2. **Cliquez** "Sign up"
3. **Remplissez** :
   - Username : `coulm-yovoiz` (ou ce que vous voulez)
   - Email : Votre email
   - Password : Un mot de passe fort
4. **Vérifiez** votre email
5. **Terminé !**

### Si vous avez DÉJÀ un compte :

✅ Passez à l'étape suivante.

---

## ✅ Étape 3 : Créer un repository GitHub (3 min)

1. **Allez sur** : https://github.com/new

2. **Remplissez** :
   - **Repository name** : `yo-voiz`
   - **Description** : "Plateforme de services à domicile en Côte d'Ivoire"
   - **Visibilité** : ⚠️ Sélectionnez **"Private"** (important !)
   - **Ne cochez RIEN d'autre** (pas de README, pas de .gitignore)

3. **Cliquez** "Create repository"

4. **GitHub vous affiche une page** avec des instructions. **Copiez l'URL** qui ressemble à :
   ```
   https://github.com/VOTRE-USERNAME/yo-voiz.git
   ```

---

## ✅ Étape 4 : Pousser le code sur GitHub (10 min)

### 4.1 : Ajouter tous les fichiers

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"

# Ajouter tous les fichiers
git add .

# Créer le commit initial
git commit -m "Initial commit - Yo! Voiz"
```

### 4.2 : Connecter à GitHub

**Remplacez `VOTRE-USERNAME` par votre vrai username GitHub** :

```powershell
git remote add origin https://github.com/VOTRE-USERNAME/yo-voiz.git
git branch -M main
```

### 4.3 : Pousser le code

```powershell
git push -u origin main
```

### ⚠️ GitHub vous demandera vos identifiants :

**Option A : Via navigateur (Recommandé)**
- Une fenêtre s'ouvre dans votre navigateur
- Cliquez "Authorize Git Credential Manager"
- C'est terminé !

**Option B : Personal Access Token**

Si l'option A ne fonctionne pas :

1. **Allez sur** : https://github.com/settings/tokens
2. **Cliquez** "Generate new token" → "Generate new token (classic)"
3. **Note** : "Yo! Voiz Deployment"
4. **Expiration** : 90 days
5. **Cochez** : ☑️ `repo` (full control of private repositories)
6. **Cliquez** "Generate token"
7. **Copiez** le token (exemple : `ghp_abc123...`)
8. **Dans PowerShell**, quand demandé :
   - Username : Votre username GitHub
   - Password : **Collez le token** (pas votre mot de passe !)

### 4.4 : Vérifier

Une fois le push terminé, allez sur :
```
https://github.com/VOTRE-USERNAME/yo-voiz
```

✅ Vous devez voir tous vos fichiers !

---

## ✅ Étape 5 : Créer un compte Vercel (2 min)

1. **Allez sur** : https://vercel.com/signup

2. **Cliquez** "Continue with GitHub"

3. **Autorisez** Vercel à accéder à GitHub

4. **C'est fait !** Vous êtes sur le Dashboard Vercel.

---

## ✅ Étape 6 : Importer le projet sur Vercel (5 min)

### 6.1 : Importer depuis GitHub

1. **Dashboard Vercel** → **Cliquez** "Add New..." → **"Project"**

2. **Dans la liste**, cherchez `yo-voiz`

3. **Cliquez** "Import"

### 6.2 : Configurer (ne touchez à rien sauf les variables)

- **Framework Preset** : Next.js ✅ (détecté automatiquement)
- **Root Directory** : `.` ✅
- **Build Command** : `npm run build` ✅
- **Output Directory** : `.next` ✅

### 6.3 : Ajouter les Variables d'Environnement

**IMPORTANT** : Cliquez sur "Environment Variables" et ajoutez **TOUTES** ces variables :

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://hfrmctsvpszqdizritoe.supabase.co`
- Cliquez "Add"

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NDY5NTMsImV4cCI6MjA4NjQyMjk1M30.OogMznnRcG-DKZs_bSkJ-Kuu9MKHtSnh0WN7wDTLYR4`
- Cliquez "Add"

#### Variable 3 : TWILIO_ACCOUNT_SID
- **Name** : `TWILIO_ACCOUNT_SID`
- **Value** : `AC660822f5e7e2cafaf2e908a5a4b8ea9c`
- Cliquez "Add"

#### Variable 4 : TWILIO_AUTH_TOKEN
- **Name** : `TWILIO_AUTH_TOKEN`
- **Value** : `af7a8b9e73df75a3c6c4bc138857d049`
- Cliquez "Add"

#### Variable 5 : TWILIO_WHATSAPP_NUMBER
- **Name** : `TWILIO_WHATSAPP_NUMBER`
- **Value** : `+18304940577`
- Cliquez "Add"

#### Variable 6 : NEXT_PUBLIC_ENABLE_REAL_WHATSAPP
- **Name** : `NEXT_PUBLIC_ENABLE_REAL_WHATSAPP`
- **Value** : `true`
- Cliquez "Add"

#### Variable 7 : NODE_ENV
- **Name** : `NODE_ENV`
- **Value** : `production`
- Cliquez "Add"

### 6.4 : Déployer !

**Cliquez** "Deploy"

Vercel va :
1. ✅ Télécharger le code depuis GitHub
2. ✅ Installer les dépendances (2 min)
3. ✅ Build le projet (2-3 min)
4. ✅ Déployer sur le CDN mondial

**Attendez** 3-5 minutes...

---

## 🎉 Étape 7 : Votre Site est en Ligne !

### Une fois le build terminé :

✅ Vercel affiche : **"Congratulations! Your project has been deployed."**

### Votre URL de production :

```
https://yo-voiz.vercel.app
```

ou

```
https://yo-voiz-XXXXX.vercel.app
```

**Cliquez sur l'URL** pour voir votre site ! 🚀

---

## ⚙️ Étape 8 : Configurer Supabase (5 min)

### 8.1 : Ajouter l'URL Vercel dans Supabase

1. **Allez sur** : https://supabase.com/dashboard

2. **Sélectionnez** votre projet

3. **Settings** → **Authentication**

4. **Site URL** : Remplacez par votre URL Vercel
   ```
   https://yo-voiz.vercel.app
   ```

5. **Redirect URLs** : Ajoutez ces 2 lignes (une par ligne) :
   ```
   https://yo-voiz.vercel.app/*
   https://yo-voiz.vercel.app/auth/callback
   ```

6. **Cliquez** "Save"

---

## 🧪 Étape 9 : Tester le Site (5 min)

### Test 1 : Page d'Accueil

1. **Ouvrez** : `https://yo-voiz.vercel.app`
2. ✅ La page se charge ?
3. ✅ Logo "Yo! Voiz" affiché ?
4. ✅ Boutons fonctionnent ?

### Test 2 : Inscription

1. **Cliquez** "S'inscrire"
2. **Remplissez** avec un vrai email
3. **Utilisez** votre vrai numéro de téléphone
4. **Cliquez** "Suivant"

⚠️ **WhatsApp Sandbox** : En production sandbox, les utilisateurs doivent d'abord rejoindre le sandbox :
- Envoyer `join <code>` au +18304940577 sur WhatsApp
- Puis s'inscrire

### Test 3 : Connexion

1. **Page** : `/auth/connexion`
2. **Testez** avec un compte créé
3. ✅ Redirection après login ?

---

## ✅ Checklist Finale

- [ ] Code poussé sur GitHub
- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement ajoutées
- [ ] Build réussi (pas d'erreur)
- [ ] Site accessible sur yo-voiz.vercel.app
- [ ] URLs Supabase configurées
- [ ] Page d'accueil fonctionne
- [ ] Inscription fonctionne

---

## 🎯 Prochaines Étapes

### Option A : Ajouter un Domaine Custom

1. Acheter `yovoiz.ci`
2. Dans Vercel : Settings → Domains → Add
3. Configurer les DNS
4. Site accessible sur `yovoiz.ci`

### Option B : Développer les Fonctionnalités

- Dashboard utilisateur
- Système de demandes
- Système d'offres
- Messagerie
- Paiement

### Option C : Activer WhatsApp Production

1. Demander numéro WhatsApp Business
2. Créer templates Meta
3. Attendre approbation (2-7 jours)
4. Mettre à jour TWILIO_WHATSAPP_NUMBER

---

## 🐛 En Cas de Problème

### Erreur : "Build Failed"

1. **Dashboard Vercel** → **Deployments** → Cliquez sur le deployment
2. **Onglet "Build Logs"** : Regardez l'erreur
3. **Si erreur TypeScript** : Corrigez le code localement
4. **Poussez** : `git add . ; git commit -m "Fix build" ; git push`
5. Vercel redéploie automatiquement !

### Erreur : "Supabase client error"

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
3. **Redéployez** : Deployments → ... → Redeploy

### Le site ne charge pas

1. Attendez 2-3 minutes (propagation DNS)
2. Videz le cache du navigateur (Ctrl+Shift+R)
3. Essayez en navigation privée

---

## 📞 Besoin d'Aide ?

**En cas de blocage** :
1. Notez le message d'erreur exact
2. Faites une capture d'écran
3. Contactez-moi avec le détail

---

## 🎉 Félicitations !

**Yo! Voiz est maintenant en ligne ! 🚀**

**URL** : https://yo-voiz.vercel.app

**Prochaine étape** : Développer les fonctionnalités métier (Dashboard, Demandes, Offres) !

---

**Questions ?** Voir le guide complet : `DEPLOIEMENT_VERCEL_GUIDE.md`
