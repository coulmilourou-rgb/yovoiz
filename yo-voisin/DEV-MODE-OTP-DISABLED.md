# 🚧 Mode Développement - OTP WhatsApp Désactivé

## ⚠️ État actuel

La vérification OTP par WhatsApp a été **temporairement désactivée** pour faciliter le développement et les tests.

### Changements appliqués :

1. ✅ **Flux d'inscription simplifié** : Passage de 6 à 5 étapes
   - Étape 1 : Rôle
   - Étape 2 : Informations personnelles
   - ~~Étape 3 : Vérification OTP WhatsApp~~ (DÉSACTIVÉE)
   - Étape 3 : Localisation
   - Étape 4 : Vérification identité
   - Étape 5 : Bienvenue

2. ✅ **Téléphone automatiquement vérifié** lors de l'inscription
   - Le champ `phone_verified` est automatiquement défini à `true`
   - Pas de code OTP envoyé/demandé

3. ✅ **Fichiers modifiés** :
   - `app/auth/inscription/page.tsx` : STEPS réduit à 5
   - `components/auth/signup-steps/Step2Infos.tsx` : Auto-validation téléphone

---

## 🔄 Réactivation pour la Production

Avant le déploiement en production, suivre ces étapes :

### 1. Restaurer l'étape de vérification OTP

Dans `app/auth/inscription/page.tsx` :

```typescript
const STEPS = [
  { number: 1, title: 'Rôle', description: 'Qui êtes-vous ?' },
  { number: 2, title: 'Infos', description: 'Vos coordonnées' },
  { number: 3, title: 'Téléphone', description: 'Vérification WhatsApp' }, // ← Restaurer
  { number: 4, title: 'Localisation', description: 'Où habitez-vous ?' },
  { number: 5, title: 'Vérification', description: 'CNI + Selfie' },
  { number: 6, title: 'Bienvenue', description: 'C\'est terminé !' },
];
```

Et dans le `renderStep()` :

```typescript
switch (currentStep) {
  case 1:
    return <Step1Role {...props} />;
  case 2:
    return <Step2Infos {...props} />;
  case 3:
    return <Step2_5VerifyPhone {...props} />; // ← Restaurer
  case 4:
    return <Step3Localisation {...props} />;
  case 5:
    return <Step4Verification {...props} onSubmit={handleSubmit} loading={loading} />;
  case 6:
    return <Step5Bienvenue role={formData.role} name={formData.first_name} />;
  default:
    return null;
}
```

### 2. Retirer l'auto-validation du téléphone

Dans `components/auth/signup-steps/Step2Infos.tsx`, **supprimer** la ligne 106 :

```typescript
// ❌ Retirer cette ligne :
updateFormData({ phoneVerified: true });
```

### 3. Configurer Twilio WhatsApp

Ajouter ces variables d'environnement en production :

```bash
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 4. Vérifier le service OTP

S'assurer que `lib/otp.ts` et `app/api/auth/send-otp/route.ts` fonctionnent correctement avec Twilio.

---

## 📋 Checklist avant Production

- [ ] Restaurer l'étape 3 (vérification OTP) dans le flux
- [ ] Retirer l'auto-validation du téléphone (ligne 106)
- [ ] Configurer les credentials Twilio WhatsApp
- [ ] Tester l'envoi d'OTP en environnement de staging
- [ ] Vérifier le CRON de nettoyage des OTP expirés
- [ ] Configurer les limites de rate limiting (prévention spam)
- [ ] Mettre à jour la documentation utilisateur

---

## 🧪 Tests actuels

Pendant le développement, l'inscription se fait ainsi :

1. Remplir le formulaire (nom, email, téléphone, mot de passe)
2. ✅ Le téléphone est **automatiquement validé**
3. Continuer avec localisation et vérification identité

---

## 📝 Notes

- Le composant `Step2_5VerifyPhone.tsx` existe toujours mais n'est pas utilisé
- La table `otp_codes` existe en base mais n'est pas alimentée actuellement
- Les routes API OTP (`/api/auth/send-otp`, `/api/auth/verify-otp`) sont présentes mais non appelées

---

**Dernière mise à jour** : 12/02/2026  
**Statut** : Mode développement actif  
**À réactiver avant** : Déploiement production
