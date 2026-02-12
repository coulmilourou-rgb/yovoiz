# 📱 Configuration WhatsApp Business pour OTP
## Guide Complet - Yo! Voiz

---

## 🎯 Pourquoi WhatsApp plutôt que SMS ?

### Avantages WhatsApp Business API
- **💰 80% moins cher** : ~0.005€/message vs 0.025€/SMS
- **📈 Taux d'ouverture supérieur** : 98% vs 90% pour SMS
- **✅ Support natif des emojis et formatage** (bold, italic)
- **🌍 Pas de problème de routage international**
- **📊 Statistiques de livraison précises** (delivered, read)

### Comparaison Coûts

| Volume | SMS (Twilio) | WhatsApp (Twilio) | Économie |
|--------|--------------|-------------------|----------|
| 100 messages | 2.50€ | 0.50€ | **80%** |
| 1,000 messages | 25€ | 5€ | **80%** |
| 10,000 messages | 250€ | 50€ | **80%** |

**Pour 10,000 utilisateurs inscrits = 200€ d'économie !**

---

## 🚀 Setup Twilio WhatsApp Business

### Étape 1 : Créer un compte Twilio

1. **S'inscrire** sur https://www.twilio.com/
   - Utiliser l'email professionnel de Yo! Voiz
   - Vérifier votre téléphone personnel

2. **Ajouter des crédits** (minimum 20€ recommandé)
   - Aller dans **Console → Billing**
   - Ajouter une carte bancaire
   - Acheter 20-50€ de crédits

3. **Récupérer les credentials** dans la Console
   - **Account SID** (commence par `AC...`)
   - **Auth Token** (clé secrète)

---

### Étape 2 : Configuration WhatsApp Business

Twilio propose **2 options** pour WhatsApp :

#### Option A : Sandbox WhatsApp (Gratuit, Tests uniquement) ✅ RECOMMANDÉ POUR DÉMARRER

**Avantages** :
- ✅ Setup en 5 minutes
- ✅ Gratuit
- ✅ Pas d'approbation Meta requise
- ⚠️ Utilisateurs doivent rejoindre le sandbox (envoyer "join <code>" au numéro Twilio)

**Setup Sandbox** :

1. Aller dans **Console Twilio → Messaging → Try it out → Send a WhatsApp message**
2. Vous verrez un numéro Twilio : `+1 415 523 8886` (exemple)
3. Votre **Sandbox Code** : `join <votre-code>` (ex: `join yellow-mountain`)
4. Pour **tester**, envoyer ce message depuis votre WhatsApp au numéro Twilio

**Configuration Sandbox dans `.env.local`** :

```bash
# Twilio WhatsApp Sandbox (Développement)
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886  # Numéro sandbox Twilio
```

**Test en local** :

```bash
# 1. Rejoindre le sandbox depuis votre WhatsApp
# Envoyer "join yellow-mountain" au +1 415 523 8886

# 2. Lancer l'app
npm run dev

# 3. S'inscrire avec votre vrai numéro CI (+225...)
# Vous recevrez le code OTP sur WhatsApp !
```

---

#### Option B : WhatsApp Business API (Production) 🚀 OBLIGATOIRE POUR LANCEMENT

**Avantages** :
- ✅ Pas besoin de "join" pour les utilisateurs
- ✅ Numéro WhatsApp Business officiel (+225...)
- ✅ Badge vérifié "Business" sur WhatsApp
- ⚠️ Approbation Meta requise (2-7 jours)
- ⚠️ Coût : 20€/mois + 0.005€/message

**Setup Production** :

##### 1. Demander un numéro WhatsApp Business

1. Aller dans **Console Twilio → Messaging → Senders → WhatsApp senders**
2. Cliquer **Request to add a WhatsApp sender**
3. Choisir **"Use your own number"**
4. Entrer votre numéro ivoirien : `+225 07 XX XX XX XX` (dédié à Yo! Voiz)
   - ⚠️ Ce numéro ne doit jamais avoir été utilisé sur WhatsApp personnel
   - ⚠️ Acheter une carte SIM neuve si nécessaire

##### 2. Remplir le formulaire Meta Business

Twilio vous redirige vers Meta. Informations à préparer :

- **Nom de l'entreprise** : Yo! Voiz
- **Description** : "Plateforme de services à domicile en Côte d'Ivoire"
- **Site web** : https://yovoiz.ci
- **Pays** : Côte d'Ivoire
- **Secteur d'activité** : Services aux particuliers
- **Adresse professionnelle** : Adresse légale de Yo! Voiz
- **Logo entreprise** : Logo Yo! Voiz (haute résolution)

##### 3. Créer des templates de messages

WhatsApp exige des **templates pré-approuvés** pour les messages automatiques.

**Template OTP à soumettre** :

```
Nom du template : yo_voiz_otp_code
Langue : Français
Catégorie : AUTHENTICATION

Contenu du message :
---
🔐 Yo! Voiz

Votre code de vérification est : *{{1}}*

Valide pendant 10 minutes.

Ne partagez ce code avec personne.
---

Variables :
- {{1}} = Code OTP à 6 chiffres
```

**Autres templates utiles** :

```
Nom : yo_voiz_welcome
Catégorie : UTILITY
---
👋 Bienvenue sur Yo! Voiz !

Votre compte est activé. Vous pouvez maintenant publier des demandes et trouver des prestataires de confiance.

Téléchargez l'app : https://yovoiz.ci/app
---
```

```
Nom : yo_voiz_password_reset
Catégorie : AUTHENTICATION
---
🔑 Réinitialisation de mot de passe

Cliquez ici pour réinitialiser votre mot de passe :
{{1}}

Ce lien expire dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.
---

Variables :
- {{1}} = Lien de réinitialisation
```

##### 4. Attendre l'approbation (2-7 jours)

- Meta vérifie votre entreprise
- Vous recevrez un email de confirmation
- Les templates seront approuvés individuellement

##### 5. Configuration Production `.env`

Une fois approuvé :

```bash
# Twilio WhatsApp Production
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+22507XXXXXXXX  # Votre numéro WhatsApp Business CI
```

---

## 🔧 Intégration dans le Code

### Le code est déjà prêt ! ✅

Le fichier `lib/otp.ts` contient déjà la logique WhatsApp :

```typescript
export async function sendOTP(phone: string, code: string): Promise<void> {
  const message = `🔐 Yo! Voiz\n\nVotre code de vérification est : *${code}*\n\nValide pendant 10 minutes.\n\nNe partagez ce code avec personne.`;

  // En développement, simuler l'envoi
  if (process.env.NODE_ENV === 'development') {
    console.log(`📱 WhatsApp simulé vers ${phone}:\n${message}`);
    return;
  }

  // Production : WhatsApp via Twilio
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: `whatsapp:${phone}`,  // Format WhatsApp
      From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Erreur Twilio WhatsApp:', error);
    throw new Error('Failed to send WhatsApp message via Twilio');
  }
}
```

### Aucun changement nécessaire dans :
- ✅ `app/api/otp/send/route.ts` (appelle déjà `sendOTP`)
- ✅ `app/api/otp/verify/route.ts` (inchangé)
- ✅ `components/auth/signup-steps/Step2_5VerifyPhone.tsx` (UI identique)
- ✅ Base de données `otp_codes` (structure identique)

**Seules les variables d'environnement changent !**

---

## 📋 Checklist de Déploiement

### Phase 1 : Tests Locaux avec Sandbox

- [ ] Créer compte Twilio
- [ ] Activer WhatsApp Sandbox
- [ ] Ajouter `TWILIO_*` dans `.env.local`
- [ ] Rejoindre le sandbox depuis votre WhatsApp
- [ ] Tester l'inscription avec votre numéro
- [ ] Vérifier réception du code OTP sur WhatsApp
- [ ] Valider le code et compléter l'inscription

### Phase 2 : Production WhatsApp Business

- [ ] Acheter carte SIM CI neuve pour Yo! Voiz
- [ ] Demander numéro WhatsApp Business dans Twilio
- [ ] Remplir le formulaire Meta Business
- [ ] Créer les templates de messages
- [ ] Soumettre pour approbation
- [ ] Attendre validation (2-7 jours)
- [ ] Configurer `.env` production Vercel
- [ ] Déployer sur Vercel
- [ ] Tester avec 5-10 utilisateurs beta

### Phase 3 : Monitoring

- [ ] Vérifier logs Twilio (taux de livraison)
- [ ] Surveiller les erreurs dans Vercel
- [ ] Vérifier les coûts quotidiens
- [ ] Configurer alertes si budget dépassé

---

## 💰 Estimation des Coûts (1ère année)

### Scénario Conservateur (1,000 utilisateurs)

| Poste | Calcul | Coût/mois | Coût/an |
|-------|--------|-----------|---------|
| **Twilio Abonnement** | Fixe | 20€ | 240€ |
| **Messages OTP** | 1000 users × 2 OTP × 0.005€ | 10€ | 120€ |
| **Total** | | **30€/mois** | **360€/an** |

### Scénario Croissance (10,000 utilisateurs)

| Poste | Calcul | Coût/mois | Coût/an |
|-------|--------|-----------|---------|
| **Twilio Abonnement** | Fixe | 20€ | 240€ |
| **Messages OTP** | 10,000 users × 2 OTP × 0.005€ | 100€ | 1,200€ |
| **Total** | | **120€/mois** | **1,440€/an** |

**Comparaison avec SMS** :
- 10,000 users en SMS = **500€/mois** (5,000€/an)
- **Économie annuelle = 3,560€** 🎉

---

## 🔒 Sécurité & Bonnes Pratiques

### 1. Protéger les credentials

```bash
# .env.local (JAMAIS commité sur Git)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...  # Garder SECRET !
TWILIO_WHATSAPP_NUMBER=+225...
```

### 2. Rate Limiting

Le code actuel limite déjà :
- ✅ 1 OTP par numéro toutes les 60 secondes (cooldown)
- ✅ 3 tentatives max par code
- ✅ Expiration automatique 10 minutes

### 3. Monitoring des abus

Créer des alertes Twilio si :
- Plus de 100 messages/heure envoyés
- Taux d'échec > 5%
- Budget quotidien dépassé

### 4. Conformité RGPD (Côte d'Ivoire)

- ✅ Stocker uniquement le hash du téléphone
- ✅ Supprimer les OTP après utilisation
- ✅ Permettre suppression du compte

---

## 🐛 Troubleshooting

### Erreur : "To number is not a valid WhatsApp number"

**Cause** : Le numéro n'a pas rejoint le sandbox OU format incorrect

**Solution** :
1. Vérifier le format : `whatsapp:+225XXXXXXXXXX`
2. En sandbox : envoyer "join <code>" au numéro Twilio
3. En production : attendre 24h après activation du numéro

---

### Erreur : "Unable to create record: The 'From' number is not an approved WhatsApp sender"

**Cause** : Le numéro expéditeur n'est pas approuvé

**Solution** :
1. Vérifier dans Twilio Console → WhatsApp senders
2. Statut doit être "Approved" (pas "Pending")
3. Vérifier `TWILIO_WHATSAPP_NUMBER` dans `.env`

---

### Erreur : "Template not found"

**Cause** : Vous utilisez un template non approuvé

**Solution** :
- En sandbox : les templates ne sont PAS requis ✅
- En production : utiliser uniquement les templates approuvés par Meta
- Notre code OTP envoie du texte libre = fonctionne en sandbox seulement

**Pour production, modifier `lib/otp.ts`** :

```typescript
// Au lieu d'envoyer le texte libre, utiliser le template approuvé
body: new URLSearchParams({
  To: `whatsapp:${phone}`,
  From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
  // ContentSid : ID du template approuvé
  ContentSid: 'HX1234567890abcdef1234567890abcdef',
  // Variables du template
  ContentVariables: JSON.stringify({
    "1": code  // {{1}} dans le template = code OTP
  }),
}),
```

**Récupérer le ContentSid** :
1. Aller dans Twilio Console → Messaging → Content Templates
2. Copier le SID du template `yo_voiz_otp_code`

---

### Messages non reçus (utilisateur)

**Vérifications** :
1. L'utilisateur a-t-il WhatsApp installé ?
2. Le numéro est-il correct (+225...) ?
3. Vérifier dans Twilio Console → Logs → Messages
   - Status "Delivered" = envoyé ✅
   - Status "Failed" = voir l'erreur
4. En sandbox : l'utilisateur a-t-il rejoint le sandbox ?

---

### Coûts plus élevés que prévu

**Causes possibles** :
1. ❌ Spam/abus : un utilisateur génère 100+ OTP
2. ❌ Boucle infinie dans le code
3. ❌ Tests en production (utiliser DEV)

**Solutions** :
- Implémenter rate limiting IP-based
- Logger tous les envois dans la BDD
- Configurer des alertes budgétaires Twilio

---

## 📊 Dashboard Twilio : Suivi des Performances

### Métriques à surveiller

1. **Messages envoyés** : Aller dans Console → Messaging → Logs
   - Voir tous les messages OTP des dernières 24h
   - Statuts : Queued → Sent → Delivered → Read

2. **Taux de livraison** : 
   - Objectif : > 95%
   - Si < 90% : vérifier les numéros invalides

3. **Coûts quotidiens** :
   - Aller dans Console → Usage → Messaging
   - Voir le graph des coûts par jour

4. **Erreurs** :
   - Filtrer par "Failed" dans les logs
   - Identifier les patterns d'erreurs

---

## 🎓 Ressources Officielles

### Documentation Twilio
- **WhatsApp API** : https://www.twilio.com/docs/whatsapp/api
- **Sandbox Setup** : https://www.twilio.com/docs/whatsapp/sandbox
- **Pricing** : https://www.twilio.com/whatsapp/pricing
- **Templates** : https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates

### Support
- **Twilio Support** : https://support.twilio.com (24/7 en anglais)
- **Meta Business Support** : https://business.facebook.com/business/help

---

## ✅ Prochaines Étapes

1. **Maintenant** : Setup Sandbox Twilio (5 minutes)
2. **Cette semaine** : Tester en local avec 3-5 utilisateurs
3. **Semaine prochaine** : Demander numéro WhatsApp Business officiel
4. **Dans 2 semaines** : Déployer en production après approbation Meta

**Vous êtes prêt à déployer avec WhatsApp ! 🚀**

---

**Questions ?** Relire la section Troubleshooting ou contacter le support Twilio.
