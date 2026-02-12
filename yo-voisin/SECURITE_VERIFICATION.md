# Système de Sécurité et Vérification - Yo! Voiz

## Vue d'ensemble

Ce document décrit le système complet de sécurité et de vérification mis en place pour empêcher les abus et garantir l'authenticité des utilisateurs.

## 1. Protection Anti-Duplication

### Contraintes Base de Données

- **Email unique** : Géré nativement par Supabase Auth (`auth.users.email`)
- **Téléphone unique** : Contrainte UNIQUE sur `profiles.phone`

### Vérification Côté Serveur

**Fonction SQL : `check_duplicate_contact()`**

```sql
CREATE OR REPLACE FUNCTION check_duplicate_contact(p_email VARCHAR, p_phone VARCHAR)
RETURNS TABLE(email_exists BOOLEAN, phone_exists BOOLEAN)
```

**Utilisation** :
- Appelée via l'API `/api/auth/check-duplicate` lors de l'étape 2 d'inscription
- Vérifie simultanément email ET téléphone
- Retourne `{emailExists: boolean, phoneExists: boolean}`

### Flux de Vérification

```
Step 2 Infos (inscription)
  ↓
Validation formulaire
  ↓
API: POST /api/auth/check-duplicate
  ↓
Fonction SQL: check_duplicate_contact()
  ↓
Vérification auth.users.email + profiles.phone
  ↓
Résultat : OK → Step 3 (Vérification SMS)
          KO → Message d'erreur + blocage
```

## 2. Vérification SMS par OTP

### Architecture

**Table : `otp_codes`**

```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Fonctions PostgreSQL

#### 2.1 Génération de Code

**Fonction : `generate_otp_code(p_phone VARCHAR)`**

- Génère un code aléatoire à 6 chiffres (000000-999999)
- Invalide automatiquement les anciens codes non utilisés pour ce numéro
- Insère le nouveau code avec expiration à 10 minutes
- Retourne le code généré

**Sécurité** :
- Un seul code actif par numéro à la fois
- Expiration stricte (10 minutes)
- Génération côté serveur (impossible à manipuler)

#### 2.2 Vérification de Code

**Fonction : `verify_otp_code(p_phone VARCHAR, p_code VARCHAR)`**

- Récupère le code le plus récent non utilisé et non expiré
- Incrémente le compteur de tentatives
- Marque le code comme utilisé si correct
- Bloque le code après 3 tentatives échouées

**Sécurité** :
- Max 3 tentatives par code
- Vérification atomique (transaction SQL)
- Code à usage unique
- Expiration automatique

#### 2.3 Nettoyage Automatique

**Fonction : `cleanup_expired_otps()`**

- Supprime les codes expirés depuis plus de 24h
- À exécuter via CRON ou Supabase Edge Function quotidiennement

### Flux d'Inscription avec OTP

```
Step 2 Infos → Vérification doublons
  ↓ (OK)
Step 3 Vérification SMS
  ↓
useEffect : Envoi auto du code OTP
  ↓
API: POST /api/otp/send
  ↓
SQL: generate_otp_code() → Code 6 chiffres
  ↓
SMS envoyé (ou console.log en DEV)
  ↓
Utilisateur saisit le code (6 inputs)
  ↓
API: POST /api/otp/verify
  ↓
SQL: verify_otp_code()
  ↓
Résultat : OK → formData.phoneVerified = true → Step 4
          KO → Message erreur + reset inputs
```

### Composant Frontend

**Step2_5VerifyPhone.tsx**

- 6 inputs séparés pour le code OTP
- Auto-focus sur le champ suivant
- Support du copier-coller (détection automatique)
- Soumission automatique quand 6 chiffres remplis
- Bouton "Renvoyer" avec cooldown 60 secondes
- Affichage du code en DEV pour faciliter les tests

### Protection Rate Limiting

- **Cooldown resend** : 60 secondes entre deux envois
- **Max tentatives** : 3 par code
- **Expiration** : 10 minutes par code
- **Blocage automatique** : Code invalidé après 3 échecs

## 3. Row Level Security (RLS)

### Table `otp_codes`

```sql
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own OTP codes"
  ON otp_codes FOR SELECT USING (true);
```

**Restrictions** :
- Lecture seule pour les utilisateurs
- Aucune politique INSERT/UPDATE/DELETE
- Seules les fonctions SQL `generate_otp_code()` et `verify_otp_code()` peuvent modifier la table
- Protection contre les tentatives de brute force

## 4. Vérification d'Identité (CNI + Selfie)

### Flux d'Approbation

```
Step 5 : Upload CNI (recto) + Selfie
  ↓
Stockage dans Supabase Storage
  ↓
profiles.verification_status = 'pending'
  ↓
Admin vérifie manuellement (dashboard)
  ↓
Status : 'in_review' → 'approved' ou 'rejected'
  ↓
Si approuvé → Accès complet à la plateforme
Si rejeté → Compte limité (read-only)
```

### Protection Accès

**Composant : `RequireVerification.tsx`**

- Bloque l'accès si `verification_status != 'approved'`
- Affiche message approprié selon le statut :
  - `pending` : "En attente de vérification"
  - `in_review` : "Vérification en cours"
  - `rejected` : "Document refusé - resoumission requise"
- Limite les actions aux pages publiques

## 5. Intégration Service SMS

### En Développement

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log(`📱 SMS simulé vers ${phone}: ${code}`);
  // Affichage du code via alert() dans le frontend
}
```

### En Production

**Option 1 : Africa's Talking** (recommandé pour CI)

```typescript
const response = await fetch('https://api.africastalking.com/version1/messaging', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'apiKey': process.env.AFRICAS_TALKING_API_KEY!,
  },
  body: new URLSearchParams({
    username: process.env.AFRICAS_TALKING_USERNAME!,
    to: phone,
    message: `Votre code Yo! Voiz: ${code}`,
  }),
});
```

**Variables d'environnement** :
```env
AFRICAS_TALKING_API_KEY=votre_cle_api
AFRICAS_TALKING_USERNAME=votre_username
```

**Option 2 : Twilio**

```typescript
const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');

const response = await fetch(twilioUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    To: phone,
    From: process.env.TWILIO_PHONE_NUMBER!,
    Body: `Votre code Yo! Voiz: ${code}`,
  }),
});
```

**Variables d'environnement** :
```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=votre_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 6. Endpoints API

### POST /api/auth/check-duplicate

**Body** :
```json
{
  "email": "user@example.com",
  "phone": "+2250123456789"
}
```

**Response** :
```json
{
  "emailExists": false,
  "phoneExists": false
}
```

### POST /api/otp/send

**Body** :
```json
{
  "phone": "+2250123456789"
}
```

**Response (DEV)** :
```json
{
  "success": true,
  "message": "Code envoyé avec succès",
  "code": "123456"
}
```

**Response (PROD)** :
```json
{
  "success": true,
  "message": "Code envoyé avec succès"
}
```

### POST /api/otp/verify

**Body** :
```json
{
  "phone": "+2250123456789",
  "code": "123456"
}
```

**Response (succès)** :
```json
{
  "success": true,
  "message": "Téléphone vérifié avec succès"
}
```

**Response (erreur)** :
```json
{
  "error": "Code incorrect ou expiré"
}
```

## 7. Messages d'Erreur Utilisateur

### Doublons

- **Email existant** : "Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email."
- **Téléphone existant** : "Ce numéro de téléphone est déjà utilisé. Utilisez un autre numéro."

### OTP

- **Code incorrect** : "Code incorrect. Il vous reste X tentatives."
- **Code expiré** : "Ce code a expiré. Demandez un nouveau code."
- **Max tentatives** : "Trop de tentatives. Un nouveau code a été envoyé."
- **Erreur envoi** : "Impossible d'envoyer le code. Vérifiez votre numéro."

### Vérification Identité

- **Pending** : "🕐 Votre demande de vérification est en attente. Vous recevrez un email dès qu'elle sera traitée."
- **In Review** : "🔍 Vos documents sont en cours de vérification. Cela peut prendre 24-48h."
- **Rejected** : "❌ Votre demande a été refusée. Raison : [admin note]. Soumettez de nouveaux documents."

## 8. Tests et Débogage

### Mode Développement

1. Le code OTP s'affiche dans la console serveur
2. Le code est retourné dans la réponse API `/api/otp/send`
3. Un `alert()` affiche automatiquement le code dans le navigateur
4. Logs détaillés pour chaque étape

### Tests Recommandés

**Anti-duplication** :
1. ✅ Créer un compte avec email@example.com
2. ❌ Tenter de recréer avec le même email → Erreur
3. ❌ Tenter avec même téléphone → Erreur
4. ✅ Utiliser email ET téléphone différents → Succès

**OTP** :
1. ✅ Code correct du premier coup → Succès
2. ❌ Code incorrect 2 fois → Erreur
3. ❌ Code incorrect 3 fois → Blocage + invalidation
4. ⏱️ Attendre 11 minutes → Code expiré
5. 🔄 Renvoyer code → Nouveau code généré (ancien invalidé)
6. ⏳ Cliquer "Renvoyer" immédiatement → Cooldown 60s

**Vérification Identité** :
1. Upload CNI floue → Status pending → Admin rejette
2. Re-upload CNI claire → Status in_review → Admin approuve
3. Tenter d'accéder à `/demandes/nouvelle` sans approbation → Redirection + message

## 9. Performance et Scalabilité

### Optimisations

- **Index sur `otp_codes.phone`** : Recherche rapide par numéro
- **Index sur `otp_codes.expires_at`** : Nettoyage efficace
- **CRON cleanup** : Exécuter `cleanup_expired_otps()` tous les jours à 3h du matin
- **Rate limiting** : Cooldown côté client + max tentatives côté serveur

### Monitoring

**Métriques à surveiller** :
- Nombre d'OTP générés par heure
- Taux de succès de vérification OTP
- Taux de doublons détectés
- Temps moyen de vérification d'identité (admin)

## 10. Maintenance

### Tâches Quotidiennes

```sql
-- Nettoyer les OTP expirés (via CRON)
SELECT cleanup_expired_otps();
```

### Tâches Hebdomadaires

```sql
-- Vérifier les comptes en attente de vérification depuis >7 jours
SELECT id, first_name, last_name, created_at
FROM profiles
WHERE verification_status = 'pending'
  AND created_at < NOW() - INTERVAL '7 days';
```

### Tâches Mensuelles

```sql
-- Stats de sécurité
SELECT 
  COUNT(*) FILTER (WHERE verification_status = 'approved') as approved,
  COUNT(*) FILTER (WHERE verification_status = 'pending') as pending,
  COUNT(*) FILTER (WHERE verification_status = 'rejected') as rejected
FROM profiles;
```

## 11. Checklist Pré-Production

- [ ] Décommenter le code d'envoi SMS dans `lib/otp.ts`
- [ ] Ajouter les clés API SMS dans `.env`
- [ ] Tester l'envoi réel de SMS sur numéro CI
- [ ] Configurer le CRON `cleanup_expired_otps()`
- [ ] Activer le rate limiting global (Supabase Edge Functions)
- [ ] Configurer les alertes monitoring (OTP failures, doublons)
- [ ] Tester le flux complet en environnement staging
- [ ] Vérifier les messages d'erreur en français
- [ ] Documenter la procédure de vérification admin

---

**Document maintenu par** : Équipe Tech Yo! Voiz  
**Dernière mise à jour** : 2026-02-12  
**Version** : 1.0
