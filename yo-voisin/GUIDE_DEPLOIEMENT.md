# 🚀 Guide de Déploiement Yo! Voiz sur Vercel

## ✅ Prérequis

- [x] Compte Vercel : `milourou-coulibalys-projects`
- [x] Projet Vercel : `yo-voiz`
- [x] GitHub repo : `coulmilourou-rgb/yo-voiz`
- [x] Supabase configuré et base de données créée

---

## 📦 Étape 1 : Préparer le Code pour Production

### 1.1 Vérifier le fichier package.json

Assure-toi que le script de build existe :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 1.2 Créer le fichier .env.production (optionnel)

Ce fichier ne sera pas commité mais te servira de référence :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Twilio (à configurer plus tard)
# TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
# TWILIO_AUTH_TOKEN=your_token
# TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## 🔧 Étape 2 : Configurer Vercel

### 2.1 Aller sur le Dashboard Vercel

1. Va sur : https://vercel.com/milourou-coulibalys-projects/yo-voiz
2. Clique sur **Settings** (en haut)

### 2.2 Configurer les Variables d'Environnement

1. Dans le menu gauche, clique sur **Environment Variables**
2. Ajoute ces variables **une par une** :

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : (copie depuis ton `.env.local`)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Clique sur **Save**

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : (copie depuis ton `.env.local`)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development
- Clique sur **Save**

### 2.3 Configurer le Build

1. Va dans **Settings** > **General**
2. Vérifie **Build & Development Settings** :
   - **Framework Preset** : `Next.js`
   - **Root Directory** : `yo-voisin` ⚠️ **IMPORTANT !**
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

---

## 🎯 Étape 3 : Déployer depuis GitHub

### Option A : Déploiement Automatique (Recommandé)

1. **Commit et Push** ton code :

```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
git add .
git commit -m "Prepare for production deployment - Dashboard Client ready"
git push origin main
```

2. **Vercel détecte automatiquement** le push et lance le build
3. Attends 2-3 minutes ⏳
4. Va sur https://vercel.com/milourou-coulibalys-projects/yo-voiz/deployments
5. Clique sur le dernier déploiement pour voir le statut

### Option B : Déploiement Manuel via CLI (Alternative)

Si tu préfères utiliser la ligne de commande :

```powershell
# Installer Vercel CLI globalement
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer (depuis le dossier yo-voisin)
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
vercel --prod
```

---

## 🔍 Étape 4 : Vérifier le Déploiement

### 4.1 Attendre la fin du Build

Sur Vercel, tu verras :
- ✅ **Building** (1-2 min)
- ✅ **Deploying** (30 sec)
- ✅ **Ready** (terminé !)

### 4.2 Tester l'URL de Production

Ton site sera disponible sur :
```
https://yo-voiz.vercel.app
```

Ou un sous-domaine généré par Vercel :
```
https://yo-voiz-xxxxx.vercel.app
```

### 4.3 Tests à Effectuer

1. **Page d'accueil** : https://yo-voiz.vercel.app
   - ✅ Logo et design s'affichent
   - ✅ Boutons "S'inscrire" et "Se connecter" fonctionnent

2. **Inscription** : https://yo-voiz.vercel.app/auth/inscription
   - ✅ Formulaire s'affiche
   - ✅ Possibilité de créer un compte (sans OTP)

3. **Connexion** : https://yo-voiz.vercel.app/auth/connexion
   - ✅ Se connecter avec le compte test créé

4. **Dashboard** : https://yo-voiz.vercel.app/dashboard/client
   - ✅ Affichage des stats
   - ✅ Bouton "Créer une mission"

5. **Nouvelle Mission** : https://yo-voiz.vercel.app/missions/nouvelle
   - ✅ Formulaire en 6 étapes fonctionne

---

## ⚠️ Résolution de Problèmes Courants

### Erreur : "Build Failed"

**Causes possibles :**
1. ❌ Root Directory incorrect → Vérifie que c'est bien `yo-voisin`
2. ❌ Variables d'environnement manquantes → Vérifie dans Settings > Environment Variables
3. ❌ Erreurs ESLint → Check les logs de build

**Solution :**
1. Va sur Vercel > Deployments > Clique sur le déploiement qui a échoué
2. Lis les logs d'erreur
3. Corrige le problème localement
4. Commit et push de nouveau

### Erreur : "404 - Page Not Found"

**Cause :** Root Directory incorrecte

**Solution :**
1. Vercel Settings > General > Root Directory
2. Change en `yo-voisin`
3. Redéploie

### Erreur : "Supabase connection failed"

**Cause :** Variables d'environnement non configurées

**Solution :**
1. Vercel Settings > Environment Variables
2. Ajoute `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redéploie (Settings > Deployments > ... > Redeploy)

### Erreur : Page blanche ou erreur runtime

**Solution :**
1. Ouvre la console du navigateur (F12)
2. Vérifie les erreurs
3. Souvent lié à des variables d'environnement manquantes

---

## 🎨 Étape 5 : Configurer un Domaine Personnalisé (Optionnel)

Si tu as un nom de domaine :

1. Va dans **Settings** > **Domains**
2. Clique sur **Add**
3. Entre ton domaine : `yovoiz.com`
4. Suis les instructions pour configurer les DNS

**DNS à configurer chez ton registrar :**
```
Type: CNAME
Name: @ (ou www)
Value: cname.vercel-dns.com
```

---

## 📊 Étape 6 : Monitoring et Analytics

### 6.1 Activer Vercel Analytics (Optionnel)

1. Va sur le dashboard Vercel
2. Clique sur **Analytics**
3. Active **Web Analytics** (gratuit)

### 6.2 Vérifier les Logs

Pour voir les logs en temps réel :
1. Vercel Dashboard > **Logs**
2. Filtre par **Production**

---

## 🔄 Workflow de Développement Après Déploiement

### Pour chaque nouvelle fonctionnalité :

1. **Développe en local** (http://localhost:3000)
2. **Teste** que tout fonctionne
3. **Commit et Push** :
   ```powershell
   git add .
   git commit -m "feat: Add XYZ feature"
   git push origin main
   ```
4. **Vercel déploie automatiquement** en production
5. **Teste sur l'URL de production**

### Branches de développement (Recommandé) :

```powershell
# Créer une branche pour une feature
git checkout -b feature/dashboard-prestataire

# Développer...
# Commit...

# Push la branche
git push origin feature/dashboard-prestataire

# Vercel crée automatiquement une Preview Deployment
# URL : https://yo-voiz-git-feature-dashboard-xxxxx.vercel.app

# Une fois validé, merge dans main
git checkout main
git merge feature/dashboard-prestataire
git push origin main
```

---

## 📋 Checklist Finale

Avant de déclarer le déploiement réussi :

- [ ] Page d'accueil fonctionne
- [ ] Inscription fonctionne (création compte)
- [ ] Connexion fonctionne
- [ ] Dashboard Client s'affiche
- [ ] Création de mission fonctionne
- [ ] Les images/logos s'affichent correctement
- [ ] Pas d'erreur dans la console navigateur (F12)
- [ ] Variables d'environnement configurées
- [ ] Build passe sans erreur

---

## 🎯 Prochaines Étapes Après Déploiement

Une fois en production, nous pourrons développer sereinement :

1. ✅ **Page Détail Mission**
2. ✅ **Dashboard Prestataire**
3. ✅ **Système d'Offres**
4. ✅ **Messagerie**
5. ✅ **Paiement Mobile Money**
6. ✅ **Avis et Évaluations**
7. ✅ **Réactiver OTP WhatsApp** (en dernier)

---

## 🆘 Support

En cas de problème :
1. Check les logs Vercel
2. Vérifie la console navigateur (F12)
3. Teste en local d'abord
4. Commit les fixes et redéploie

---

**Dernière mise à jour** : 12/02/2026  
**Version** : v1.0 - MVP Dashboard Client
