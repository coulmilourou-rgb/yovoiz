# 🚀 Guide de Déploiement Production - Yo! Voiz

Ce guide vous accompagne pour déployer Yo! Voiz en production avec tous les services nécessaires.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration WhatsApp OTP](#1-configuration-whatsapp-otp) ⭐ **NOUVEAU - Remplace SMS**
3. [Configuration Email (SMTP)](#2-configuration-email-smtp)
4. [Configuration CRON](#3-configuration-cron)
5. [Variables d'Environnement](#4-variables-denvironnement)
6. [Déploiement](#5-déploiement)
7. [Post-Déploiement](#6-post-déploiement)
8. [Monitoring](#7-monitoring)

---

## Prérequis

- ✅ Compte Supabase (projet créé)
- ✅ Nom de domaine configuré
- ✅ Serveur de production (Vercel, Netlify, ou autre)
- ✅ Budget pour WhatsApp OTP (~5-30€/mois selon volume) 💰 **80% moins cher que SMS**

---

## 1. Configuration WhatsApp OTP

> ⚠️ **IMPORTANT** : Yo! Voiz utilise désormais **WhatsApp** au lieu de SMS pour les codes OTP.
> 
> **Avantages** :
> - 💰 **80% moins cher** : 0.005€/message vs 0.025€/SMS
> - 📈 **Taux d'ouverture supérieur** : 98% vs 90%
> - ✅ **Support emojis et formatage natif**
> - 📊 **Statistiques précises** (delivered, read)

### 📖 Guide Complet : `CONFIGURATION_WHATSAPP.md`

**Voir le guide détaillé** : [CONFIGURATION_WHATSAPP.md](./CONFIGURATION_WHATSAPP.md)

Le guide complet contient :
- Setup Twilio WhatsApp Sandbox (tests gratuits)
- Demande de numéro WhatsApp Business officiel
- Création des templates Meta (messages pré-approuvés)
- Troubleshooting complet
- Estimation des coûts
- Comparaison SMS vs WhatsApp

### Résumé Rapide (Setup Minimum)

#### Étape 1.1 : Créer un Compte Twilio

1. **S'inscrire** sur https://www.twilio.com/
2. **Ajouter des crédits** (minimum 20€)
3. **Récupérer** :
   - `Account SID` (commence par `AC...`)
   - `Auth Token` (clé secrète)

#### Étape 1.2 : Configuration Sandbox (Tests)

1. Aller dans **Console Twilio → Messaging → Try WhatsApp**
2. Noter le numéro sandbox : `+1 415 523 8886`
3. Rejoindre depuis votre WhatsApp : envoyer `join <votre-code>`

#### Étape 1.3 : Variables d'Environnement

Dans `.env.local` (développement) :

```bash
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886  # Numéro sandbox
```

Dans Vercel (production) :

```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+22507XXXXXXXX  # Votre numéro WhatsApp Business CI
```

#### Étape 1.4 : Demander Numéro WhatsApp Business (Production)

> ⏱️ **Délai : 2-7 jours d'approbation Meta**

1. Dans Twilio Console → **WhatsApp senders** → **Request to add**
2. Utiliser un numéro CI neuf : `+225 07 XX XX XX XX`
3. Remplir le formulaire Meta Business :
   - Nom entreprise : Yo! Voiz
   - Site web : https://yovoiz.ci
   - Description : "Plateforme de services à domicile en Côte d'Ivoire"
4. Créer template de message OTP (voir guide complet)
5. Attendre approbation (email de confirmation)

#### ✅ Le Code est Déjà Prêt !

Le fichier `lib/otp.ts` contient déjà la logique WhatsApp via Twilio.
Aucun changement de code nécessaire, juste les variables d'environnement !

---

### Coûts Estimés WhatsApp vs SMS

| Volume | WhatsApp (Twilio) | SMS (Africa's Talking) | Économie |
|--------|-------------------|------------------------|----------|
| 100 messages | 0.50€ | 2.50€ | **80%** |
| 1,000 messages | 5€ | 25€ | **80%** |
| 10,000 messages | 50€ | 250€ | **80%** |

**Pour 10,000 utilisateurs = 200€ d'économie annuelle !**
---

## 2. Configuration Email (SMTP)

### Option A : SendGrid (Recommandé)

#### Étape 2.1 : Créer un Compte

1. **Aller sur** : https://sendgrid.com
2. **S'inscrire** (100 emails/jour gratuits)
3. **Vérifier** votre domaine

#### Étape 2.2 : Configurer Supabase

1. **Supabase Dashboard** → **Project Settings** → **Authentication**
2. **Scroll** jusqu'à **SMTP Settings**
3. **Activer** "Enable Custom SMTP"
4. **Remplir** :
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `[Votre API Key SendGrid]`
   - Sender email: `noreply@votre-domaine.com`
   - Sender name: `Yo! Voiz`

#### Étape 2.3 : Personnaliser les Templates

1. **Authentication** → **Email Templates**
2. **Modifier** :
   - **Confirm Signup** : Email de vérification après inscription
   - **Reset Password** : Email de réinitialisation

Exemple de template :

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
    .header { text-align: center; margin-bottom: 30px; }
    .button { display: inline-block; padding: 12px 32px; background: #1B7A3D; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #F37021;">Y<span style="color: #1B7A3D;">o! Voiz</span></h1>
    </div>
    <h2>Bienvenue sur Yo! Voiz !</h2>
    <p>Cliquez sur le bouton ci-dessous pour confirmer votre adresse email :</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" class="button">Confirmer mon email</a>
    </div>
    <p style="color: #6b7280; font-size: 14px;">
      Si vous n'avez pas créé de compte, ignorez cet email.
    </p>
  </div>
</body>
</html>
```

#### Tarifs SendGrid

- **Gratuit** : 100 emails/jour
- **Essentials** : 15$/mois → 50,000 emails/mois
- **Pro** : 90$/mois → 100,000 emails/mois

---

### Option B : Mailgun

Similaire à SendGrid, configuration identique dans Supabase SMTP.

---

## 3. Configuration CRON

### A. Nettoyage des Codes OTP Expirés

#### Avec Supabase Edge Functions

1. **Installer** Supabase CLI :
```bash
npm install -g supabase
```

2. **Créer** la fonction Edge :
```bash
supabase functions new cleanup-otp
```

3. **Code** dans `supabase/functions/cleanup-otp/index.ts` :

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Appeler la fonction SQL de nettoyage
  const { error } = await supabase.rpc('cleanup_expired_otps');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, message: 'OTP nettoyés' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
```

4. **Déployer** :
```bash
supabase functions deploy cleanup-otp
```

5. **Configurer** le CRON dans Supabase Dashboard :
   - **Database** → **Cron Jobs** → **Create a new cron job**
   - **Schedule** : `0 3 * * *` (tous les jours à 3h du matin)
   - **Command** : 
   ```sql
   SELECT cleanup_expired_otps();
   ```

---

### B. Avec Vercel Cron Jobs

Si déployé sur Vercel :

1. **Créer** `app/api/cron/cleanup-otp/route.ts` :

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  // Vérifier le secret pour sécuriser l'endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient();
  const { error } = await supabase.rpc('cleanup_expired_otps');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

2. **Ajouter** dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-otp",
      "schedule": "0 3 * * *"
    }
  ]
}
```

3. **Variable d'environnement** :
```env
CRON_SECRET=votre_secret_aleatoire_tres_long
```

---

## 4. Variables d'Environnement

### Fichier `.env.production`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon

# WhatsApp OTP - Twilio (NOUVEAU)
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=votre_auth_token_secret
TWILIO_WHATSAPP_NUMBER=+22507XXXXXXXX  # Votre numéro WhatsApp Business CI

# CRON (si Vercel)
CRON_SECRET=un_secret_tres_long_et_aleatoire

# URL du Site
NEXT_PUBLIC_SITE_URL=https://yovoiz.ci

# Environment
NODE_ENV=production
```

---

## 5. Déploiement

### Option A : Vercel (Recommandé pour Next.js)

#### Étape 5.1 : Préparer le Projet

1. **Push** sur GitHub :
```bash
git add .
git commit -m "Prêt pour production"
git push origin main
```

2. **Aller sur** : https://vercel.com
3. **Import Project** → Sélectionner votre repo GitHub

#### Étape 5.2 : Configuration Vercel

1. **Environment Variables** → Ajouter toutes les variables `.env.production`
2. **Build Settings** :
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Deploy**

#### Étape 5.3 : Domaine Personnalisé

1. **Settings** → **Domains**
2. **Add** : `yovoiz.com` et `www.yovoiz.com`
3. **Configurer DNS** chez votre registrar

---

### Option B : VPS (Ubuntu/Nginx)

#### Étape 5.1 : Installation

```bash
# Connexion SSH
ssh root@votre-serveur-ip

# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2
npm install -g pm2

# Cloner le projet
git clone https://github.com/votre-repo/yo-voiz.git
cd yo-voiz

# Installer dépendances
npm install

# Build production
npm run build
```

#### Étape 5.2 : Configuration PM2

Créer `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [{
    name: 'yo-voiz',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Démarrer :
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Étape 5.3 : Nginx

```nginx
server {
    listen 80;
    server_name yovoiz.com www.yovoiz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

SSL avec Certbot :
```bash
sudo certbot --nginx -d yovoiz.com -d www.yovoiz.com
```

---

## 6. Post-Déploiement

### ✅ Checklist

- [ ] Tester l'inscription avec un vrai numéro CI
- [ ] Vérifier réception **WhatsApp OTP** (pas SMS !)
- [ ] Tester mot de passe oublié
- [ ] Vérifier emails de confirmation
- [ ] Tester middleware (routes protégées)
- [ ] Vérifier logs Supabase
- [ ] **Vérifier Dashboard Twilio** (messages envoyés, coûts)
- [ ] Tester sur mobile (iOS + Android)
- [ ] Performance (Lighthouse > 90)
- [ ] SEO configuré (meta tags, sitemap)

### Configurer Supabase Production

1. **URLs Autorisées** :
   ```
   https://yovoiz.com
   https://www.yovoiz.com
   https://yovoiz.com/auth/reset-password
   https://yovoiz.com/auth/verify-email
   ```

2. **Rate Limiting** :
   - Dashboard → Settings → API
   - Activer rate limiting approprié

3. **Backups** :
   - Activer les backups automatiques quotidiens

---

## 7. Monitoring

### Logs à Surveiller

1. **Supabase Dashboard** → **Logs**
   - Erreurs d'authentification
   - Échecs d'envoi OTP
   - Tentatives de bruteforce

2. **Twilio Console** → **Logs** (NOUVEAU)
   - Messages WhatsApp envoyés/delivered/failed
   - Taux de livraison (objectif > 95%)
   - Coûts quotidiens

3. **Vercel Analytics**
   - Temps de chargement
   - Erreurs 500
   - Trafic

4. **Métriques Clés**
   - Taux de conversion inscription
   - Taux de succès OTP WhatsApp
   - Taux d'emails ouverts

### Alertes (Optionnel)

Configurer des alertes email/Slack pour :
- ❌ Erreurs 500 répétées
- ⚠️ Pic anormal de trafic
- 💰 Crédits WhatsApp faibles (< 20€)
- 📉 Taux de livraison WhatsApp < 90%

---

## 8. Coûts Estimés Mensuels

### Scénario : 1,000 utilisateurs actifs/mois

| Service | Coût |
|---------|------|
| **Vercel** (Pro) | 20$/mois |
| **Supabase** (Pro) | 25$/mois |
| **Twilio WhatsApp** (2000 messages) | **10€/mois** ⭐ |
| **SendGrid** (Essentials) | 15$/mois |
| **Domaine** (.ci) | 5$/mois |
| **Total** | **~75€/mois** |

> 💰 **Économie vs SMS** : 20€/mois (20% moins cher)

### Scénario : 10,000 utilisateurs actifs/mois

| Service | Coût |
|---------|------|
| **Vercel** (Pro) | 20$/mois |
| **Supabase** (Pro) | 25$/mois |
| **Twilio WhatsApp** (20,000 messages) | **120€/mois** ⭐ |
| **SendGrid** (Pro) | 90$/mois |
| **Domaine** | 5$/mois |
| **Total** | **~260€/mois** |

> 💰 **Économie vs SMS** : 180€/mois (40% moins cher)

### Comparaison SMS vs WhatsApp (10,000 users)

| Poste | SMS (Africa's Talking) | WhatsApp (Twilio) | Économie |
|-------|------------------------|-------------------|----------|
| 20,000 messages | 300€/mois | 120€/mois | **180€/mois** |
| Coût/message | 0.025€ | 0.005€ | **80%** |
| **Total annuel** | **3,600€/an** | **1,440€/an** | **2,160€/an** |

---

## 🆘 Support

**Besoin d'aide ?**
- 📧 Email: support@yovoiz.com
- 💬 Discord: [Lien Discord]
- 📖 Documentation: https://docs.yovoiz.com

---

**Bon déploiement ! 🚀**
