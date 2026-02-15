# 🚀 Déploiement Edge Function Email

## Prérequis
- Compte Brevo créé (https://www.brevo.com)
- Clé API Brevo obtenue
- Supabase CLI installé

## Étapes de déploiement

### 1. Créer compte Brevo et obtenir clé API
```bash
# 1. S'inscrire sur https://www.brevo.com
# 2. Aller dans "SMTP & API" > "API Keys"
# 3. Créer une nouvelle clé API
# 4. Copier la clé (format: xkeysib-...)
```

### 2. Configurer les secrets Supabase
```powershell
# Se connecter à Supabase
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
npx supabase login

# Définir les secrets
npx supabase secrets set BREVO_API_KEY="xkeysib-VOTRE_CLE_ICI" --project-ref hfrmctsvpszqdizritoe
```

### 3. Déployer la Edge Function
```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
npx supabase functions deploy send-email-notification --project-ref hfrmctsvpszqdizritoe
```

### 4. Activer l'extension HTTP dans PostgreSQL
```sql
-- Se connecter à Supabase SQL Editor
-- Exécuter cette commande
CREATE EXTENSION IF NOT EXISTS http;
```

### 5. Créer les triggers email
```powershell
# Option 1: Via Supabase SQL Editor
# - Ouvrir SQL Editor
# - Copier le contenu de supabase/CREATE-EMAIL-TRIGGERS.sql
# - Exécuter

# Option 2: Via psql (si configuré)
psql -h db.hfrmctsvpszqdizritoe.supabase.co -U postgres -d postgres -f supabase/CREATE-EMAIL-TRIGGERS.sql
```

### 6. Tester l'Edge Function
```powershell
# Test local (optionnel)
npx supabase functions serve send-email-notification

# Test en production
curl -X POST https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "profile_verified",
    "userId": "8b8cb0f0-6712-445b-a9ed-a45aa78638d2",
    "data": {}
  }'
```

### 7. Configurer l'email expéditeur (Brevo)
```bash
# 1. Aller dans Brevo > Senders
# 2. Ajouter l'email: notifications@yovoiz.ci
# 3. Valider l'email (clic sur lien de confirmation)
# 4. Configurer SPF/DKIM pour votre domaine
```

### 8. Configurer SPF/DKIM (pour domaine yovoiz.ci)
```
# Ajouter ces enregistrements DNS chez votre registrar:

# SPF
Type: TXT
Nom: @
Valeur: v=spf1 include:spf.brevo.com ~all

# DKIM
Type: TXT
Nom: mail._domainkey
Valeur: [Fourni par Brevo dans Settings > Senders]
```

## Vérification

### 1. Vérifier les logs Edge Function
```powershell
npx supabase functions logs send-email-notification --project-ref hfrmctsvpszqdizritoe
```

### 2. Tester chaque trigger manuellement

#### Test 1: Demande validée
```sql
-- Créer une demande test
INSERT INTO requests (client_id, title, description, category, status)
VALUES ('8b8cb0f0-6712-445b-a9ed-a45aa78638d2', 'Test demande', 'Description test', 'menage', 'pending');

-- Valider la demande (devrait déclencher l'email)
UPDATE requests 
SET status = 'published' 
WHERE title = 'Test demande';
```

#### Test 2: Nouvelle proposition
```sql
-- Créer une négociation (devrait déclencher l'email)
INSERT INTO negotiations (request_id, client_id, provider_id, type, amount, message)
VALUES (
  '[ID_REQUEST]',
  '[ID_CLIENT]',
  '[ID_PROVIDER]',
  'devis',
  25000,
  'Voici ma proposition'
);
```

#### Test 3: Nouveau message
```sql
-- Créer un message (devrait déclencher l'email)
INSERT INTO messages (sender_id, receiver_id, content)
VALUES (
  '[ID_SENDER]',
  '[ID_RECEIVER]',
  'Bonjour, voici mon message test'
);
```

#### Test 4: Profil vérifié
```sql
-- Marquer profil comme vérifié (devrait déclencher l'email)
UPDATE profiles 
SET is_verified = true 
WHERE id = '8b8cb0f0-6712-445b-a9ed-a45aa78638d2';
```

#### Test 5: Transaction complétée
```sql
-- Créer transaction complétée (devrait déclencher 2 emails)
INSERT INTO transactions (client_id, provider_id, request_id, amount, status, reference)
VALUES (
  '[ID_CLIENT]',
  '[ID_PROVIDER]',
  '[ID_REQUEST]',
  50000,
  'completed',
  'TXN-' || floor(random() * 1000000)
);
```

## Monitoring

### Dashboard Brevo
- Taux d'ouverture
- Taux de clics
- Bounces
- Spam reports

### Logs Supabase
```powershell
# Voir tous les logs
npx supabase functions logs send-email-notification --project-ref hfrmctsvpszqdizritoe

# Suivre en temps réel
npx supabase functions logs send-email-notification --follow --project-ref hfrmctsvpszqdizritoe
```

## Troubleshooting

### Problème: Email non reçu
1. Vérifier les logs Edge Function
2. Vérifier que BREVO_API_KEY est correct
3. Vérifier que l'email expéditeur est validé dans Brevo
4. Vérifier le dossier spam du destinataire

### Problème: Trigger ne se déclenche pas
1. Vérifier que l'extension `http` est activée
2. Vérifier les logs PostgreSQL
3. Tester l'Edge Function manuellement
4. Vérifier que l'URL de la fonction est correcte dans le trigger

### Problème: Erreur 401 Unauthorized
1. Vérifier que BREVO_API_KEY est correct
2. Regénérer une nouvelle clé API dans Brevo
3. Mettre à jour le secret dans Supabase

## Désactivation temporaire

Pour désactiver temporairement les notifications :

```sql
-- Désactiver tous les triggers
ALTER TABLE requests DISABLE TRIGGER request_validated_trigger;
ALTER TABLE negotiations DISABLE TRIGGER new_proposal_trigger;
ALTER TABLE messages DISABLE TRIGGER new_message_trigger;
ALTER TABLE profiles DISABLE TRIGGER profile_verified_trigger;
ALTER TABLE transactions DISABLE TRIGGER transaction_completed_trigger;

-- Réactiver tous les triggers
ALTER TABLE requests ENABLE TRIGGER request_validated_trigger;
ALTER TABLE negotiations ENABLE TRIGGER new_proposal_trigger;
ALTER TABLE messages ENABLE TRIGGER new_message_trigger;
ALTER TABLE profiles ENABLE TRIGGER profile_verified_trigger;
ALTER TABLE transactions ENABLE TRIGGER transaction_completed_trigger;
```

## Coûts estimés (Brevo)

### Plan gratuit
- 300 emails/jour
- Idéal pour phase de test

### Plan Starter (€25/mois)
- 20.000 emails/mois
- ~667 emails/jour
- Suffisant pour 200-300 utilisateurs actifs

### Plan Business (€65/mois)
- 100.000 emails/mois
- ~3.333 emails/jour
- Suffisant pour 1000+ utilisateurs actifs

## Statut actuel

✅ Edge Function créée  
✅ Triggers SQL créés  
⏳ Compte Brevo à créer  
⏳ Clé API à configurer  
⏳ Edge Function à déployer  
⏳ Triggers à exécuter en base  
⏳ Tests à effectuer  

## Prochaines étapes

1. Créer compte Brevo
2. Obtenir clé API
3. Exécuter les commandes de déploiement ci-dessus
4. Tester chaque type de notification
5. Monitorer les premiers envois
