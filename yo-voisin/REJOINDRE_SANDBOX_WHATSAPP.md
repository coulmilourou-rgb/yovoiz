# 📱 Rejoindre le Sandbox WhatsApp Twilio

## ⚠️ ÉTAPE OBLIGATOIRE

Avant de tester l'inscription, vous devez activer le sandbox WhatsApp sur votre téléphone.

---

## 🔧 Instructions

### 1️⃣ Trouver Votre Code Sandbox

1. **Allez sur** : https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   
   OU
   
2. Dans le menu gauche :
   ```
   Messaging → Try it out → Send a WhatsApp message
   ```

3. Vous verrez une page avec :
   ```
   ┌─────────────────────────────────────────┐
   │  WhatsApp Sandbox                        │
   │                                          │
   │  From: +1 830 494 0577                  │ ← VOTRE numéro
   │  Your code: join <something>            │ ← VOTRE code unique
   └─────────────────────────────────────────┘
   ```

4. **Notez votre code** (exemple : `join yellow-mountain`, `join happy-tiger`, etc.)

---

### 2️⃣ Rejoindre le Sandbox depuis WhatsApp

1. **Sur votre téléphone**, ouvrez WhatsApp

2. **Ajoutez le numéro** `+1 830 494 0577` dans vos contacts
   - Nom du contact : "Twilio Sandbox" (ou ce que vous voulez)

3. **Envoyez un message** à ce contact :
   ```
   join votre-code-unique
   ```
   
   Exemple :
   ```
   join yellow-mountain
   ```

4. **Vous devriez recevoir** une réponse automatique :
   ```
   ✅ You are all set!
   
   Sandbox connected. You'll receive messages here from numbers
   managed by this account.
   ```

---

### 3️⃣ Vérifier la Connexion

Toujours dans la console Twilio, page WhatsApp Sandbox :

- Vous devriez voir votre numéro dans la liste **"Sandbox Participants"**

---

## 🎯 Important

- **Utilisez le MÊME numéro** pour rejoindre le sandbox ET pour tester l'inscription
- Si vous testez avec un autre numéro, il faudra aussi le faire rejoindre le sandbox
- Le sandbox est **GRATUIT** et illimité pour les tests

---

## ✅ Une Fois Connecté

Vous pourrez :
1. Tester l'inscription avec ce numéro
2. Recevoir le code OTP sur WhatsApp
3. Valider l'inscription

---

## 🔄 En cas de Problème

Si vous ne recevez pas le message de confirmation :

1. **Vérifiez le numéro** : `+1 830 494 0577` (celui dans votre .env.local)
2. **Vérifiez le code** : Retournez sur la console Twilio pour voir votre code exact
3. **Réessayez** d'envoyer `join votre-code`

---

**Prêt à rejoindre le sandbox ? Suivez les étapes ci-dessus !** 📱
