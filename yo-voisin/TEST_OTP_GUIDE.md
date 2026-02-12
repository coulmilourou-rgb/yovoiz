# 🧪 Guide de Test - Système OTP Yo! Voiz

## 🚀 Serveur lancé sur http://localhost:3004

---

## 📋 Checklist de Tests

### ✅ Test 1 : Flux d'inscription complet

**Étapes** :
1. Ouvrir http://localhost:3001/auth/inscription
2. **Étape 1 - Rôle** : Sélectionner "Demandeur", "Prestataire" ou "Les deux" → Suivant
3. **Étape 2 - Infos personnelles** :
   - Prénom : `Test`
   - Nom : `Utilisateur`
   - Email : `test@example.com`
   - Téléphone : `0123456789` (sera converti en +2250123456789)
   - Mot de passe : `Password123!`
   - Cliquer "Suivant"

**Résultat attendu** :
- ✅ Aucune erreur de doublon (première inscription)
- ✅ Passage automatique à l'étape 3 (Vérification SMS)

---

### ✅ Test 2 : Réception et affichage du code OTP

**Après l'étape 2** :

1. **Un alert() devrait apparaître automatiquement** avec le code OTP
   - Exemple : `📱 CODE OTP (DEV): 123456`
2. **Noter le code à 6 chiffres**
3. **Vérifier dans la console du navigateur (F12)** :
   - Console → devrait afficher : `📱 SMS simulé vers +2250123456789: Votre code de vérification Yo! Voiz est : 123456. Valide pendant 10 minutes.`

**Résultat attendu** :
- ✅ Alert avec code affiché automatiquement
- ✅ 6 champs vides pour saisir le code
- ✅ Téléphone masqué : `+225 01 •• •• ••`

---

### ✅ Test 3 : Saisie du code OTP (succès)

**Méthode 1 : Saisie manuelle**
1. Cliquer dans le premier champ
2. Taper les 6 chiffres un par un
3. Observer l'auto-focus sur champ suivant
4. À la fin, le code est vérifié automatiquement

**Méthode 2 : Copier-Coller**
1. Copier le code depuis l'alert (ex: `123456`)
2. Cliquer dans le premier champ
3. Coller (Ctrl+V)
4. Les 6 champs se remplissent automatiquement
5. Vérification automatique après 100ms

**Résultat attendu** :
- ✅ Message "Téléphone vérifié avec succès !" (vert)
- ✅ Redirection automatique vers **Étape 4 - Localisation** après 1 seconde

---

### ❌ Test 4 : Code OTP incorrect

**Étapes** :
1. Revenir à l'étape 3 (ou créer un nouveau compte)
2. Saisir un code FAUX : `000000`
3. Cliquer "Vérifier" ou laisser auto-submit

**Résultat attendu** :
- ❌ Message d'erreur : "Code incorrect ou expiré"
- 🔄 Les 6 champs se vident automatiquement
- 🎯 Focus retourne au premier champ
- ℹ️ Vous avez **3 tentatives maximum**

**Test tentatives multiples** :
- Tentative 1 : `000000` → Erreur
- Tentative 2 : `111111` → Erreur
- Tentative 3 : `222222` → Erreur + **Code bloqué** (marqué comme `used = true`)
- Tentative 4 : Même le bon code ne fonctionnera plus → Besoin de renvoyer un nouveau code

---

### 🔄 Test 5 : Renvoyer le code OTP

**Étapes** :
1. Sur la page de vérification SMS
2. Cliquer sur le bouton **"Renvoyer le code"**
3. Observer le compte à rebours (60 secondes)

**Résultat attendu** :
- ✅ Nouveau **alert()** avec nouveau code (différent du précédent)
- ✅ Bouton désactivé pendant 60 secondes avec texte "Renvoyer (59s)"
- ✅ Après 60s, bouton redevient cliquable
- ℹ️ L'ancien code est automatiquement invalidé (marqué `used = true`)

---

### 🚫 Test 6 : Protection anti-duplication (email)

**Étapes** :
1. Terminer l'inscription du Test 1 complètement
2. Ouvrir une nouvelle fenêtre de navigation privée
3. Aller sur http://localhost:3001/auth/inscription
4. Étape 1 → Choisir un rôle
5. Étape 2 → Utiliser **le même email** `test@example.com` mais un **téléphone différent** `0987654321`
6. Cliquer "Suivant"

**Résultat attendu** :
- ❌ Message d'erreur : "Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email."
- 🛑 Blocage à l'étape 2 (pas de passage à l'étape 3)

---

### 🚫 Test 7 : Protection anti-duplication (téléphone)

**Étapes** :
1. Navigation privée (ou nouveau compte)
2. http://localhost:3001/auth/inscription
3. Étape 1 → Choisir un rôle
4. Étape 2 → Utiliser un **email différent** `autre@example.com` mais **le même téléphone** `0123456789`
5. Cliquer "Suivant"

**Résultat attendu** :
- ❌ Message d'erreur : "Ce numéro de téléphone est déjà utilisé. Utilisez un autre numéro."
- 🛑 Blocage à l'étape 2

---

### ⏰ Test 8 : Expiration du code OTP (optionnel)

**Étapes** :
1. Créer un nouveau compte et arriver à l'étape 3 (Vérification SMS)
2. Noter le code reçu
3. **Attendre 11 minutes** (code expire après 10 min)
4. Saisir le code après expiration

**Résultat attendu** :
- ❌ Message d'erreur : "Code incorrect ou expiré"
- 🔄 Besoin de cliquer "Renvoyer" pour obtenir un nouveau code

**Note** : Pour tester rapidement, vous pouvez modifier temporairement l'expiration dans `supabase/schema.sql` ligne 773 :
```sql
-- Au lieu de 10 minutes
VALUES (p_phone, v_code, NOW() + INTERVAL '10 minutes');
-- Mettre 30 secondes pour tester
VALUES (p_phone, v_code, NOW() + INTERVAL '30 seconds');
```

---

## 🔍 Vérification en Base de Données (Supabase)

### Consulter les codes OTP générés

1. Aller sur https://supabase.com
2. Sélectionner votre projet Yo! Voiz
3. Aller dans **SQL Editor**
4. Exécuter :

```sql
-- Voir tous les codes OTP récents
SELECT 
  phone,
  code,
  attempts,
  used,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at < NOW() THEN 'EXPIRÉ'
    WHEN used = true THEN 'UTILISÉ'
    ELSE 'ACTIF'
  END as status
FROM otp_codes
ORDER BY created_at DESC
LIMIT 10;
```

### Vérifier les doublons

```sql
-- Compter les utilisateurs avec le même téléphone
SELECT phone, COUNT(*) as count
FROM profiles
GROUP BY phone
HAVING COUNT(*) > 1;

-- Compter les utilisateurs avec le même email
SELECT email, COUNT(*) as count
FROM auth.users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Nettoyer les tests

```sql
-- Supprimer les comptes de test
DELETE FROM profiles WHERE email LIKE '%@example.com';
DELETE FROM auth.users WHERE email LIKE '%@example.com';

-- Supprimer tous les codes OTP
DELETE FROM otp_codes;
```

---

## 🐛 Débogage

### Console Navigateur (F12)

**Console** :
- Rechercher `📱 SMS simulé` pour voir les codes envoyés
- Vérifier les erreurs API (fetch errors)

**Network** :
- Filtrer par `otp` pour voir les requêtes `/api/otp/send` et `/api/otp/verify`
- Vérifier les réponses (200 = succès, 400 = erreur)

**Application** :
- Storage → Local Storage → Vérifier les données de session

### Console Serveur (Terminal)

Dans le terminal où `npm run dev` tourne, vérifier :
- `📱 SMS simulé vers +2250123456789: ...`
- Erreurs SQL (si problème avec Supabase)

### Logs Supabase

1. Supabase Dashboard → Logs
2. Filtrer par `otp_codes` ou `check_duplicate_contact`
3. Vérifier les erreurs d'exécution des fonctions PostgreSQL

---

## ✅ Checklist Finale

Cocher après chaque test réussi :

- [ ] Test 1 : Inscription étape 1-2 sans erreur
- [ ] Test 2 : Réception du code OTP (alert + console)
- [ ] Test 3 : Code correct → Vérification réussie
- [ ] Test 4 : Code incorrect → Message d'erreur + 3 tentatives max
- [ ] Test 5 : Renvoyer code → Nouveau code + cooldown 60s
- [ ] Test 6 : Doublon email → Blocage + message
- [ ] Test 7 : Doublon téléphone → Blocage + message
- [ ] Test 8 : (Optionnel) Expiration code après 10 min

---

## 🎯 Résultat Attendu Global

Si **tous les tests passent** :
- ✅ Le système OTP fonctionne parfaitement
- ✅ La protection anti-duplication est active
- ✅ L'expérience utilisateur est fluide
- ✅ Le système est prêt pour l'intégration d'un service SMS réel (Africa's Talking / Twilio)

---

## 🚀 Prochaine Étape Après Tests

Une fois tous les tests validés, nous pourrons :
1. **Intégrer un vrai service SMS** (Africa's Talking pour CI)
2. **Implémenter les 3 pages restantes** :
   - Page "Mot de passe oublié"
   - Middleware de protection des routes
   - Page de vérification email

---

**Bon test ! 🎉**

Pour toute question ou erreur rencontrée, notez :
- Le message d'erreur exact
- L'étape où ça bloque
- Le code OTP utilisé
- Les logs de la console
