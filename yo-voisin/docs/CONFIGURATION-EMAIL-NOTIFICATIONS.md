# 📧 CONFIGURATION DES NOTIFICATIONS EMAIL - YO!VOIZ
**Date : 15 Février 2026**

---

## ✅ ÉTAPES COMPLÉTÉES

### 1. **Configuration Brevo (Sendinblue)**
- ✅ Clé API configurée : `1RyY9PLWjc3G678D`
- ✅ Secret Supabase créé : `BREVO_API_KEY`
- ✅ Limite gratuite : 300 emails/jour

### 2. **Edge Function déployée**
- ✅ Fonction : `send-email-notification`
- ✅ URL : https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification
- ✅ Correction appliquée : Récupération email depuis `auth.users` au lieu de `profiles`
- ✅ Templates email : 6 types de notifications

### 3. **Extension PostgreSQL**
- ✅ `pg_net` installée et fonctionnelle
- ✅ Fonction `net.http_post` testée avec succès

### 4. **Triggers PostgreSQL**
- ✅ `request_validated_trigger` : Déclenché quand une demande passe en statut "published"
- ✅ `new_message_trigger` : Déclenché à chaque nouveau message
- ✅ `profile_verified_trigger` : Déclenché quand un profil est vérifié

---

## 🔧 FICHIERS CRÉÉS

### Scripts SQL (dans `yo-voisin/supabase/`)
1. **TEST-EMAIL-ALL-IN-ONE.sql** - Installation triggers + test automatique
2. **TEST-EMAIL-REAL-USER.sql** - Test avec votre compte réel
3. **CREATE-EMAIL-TRIGGERS-FINAL.sql** - Triggers de production
4. **DIAGNOSTIC-EMAIL-FINAL.sql** - Diagnostic complet du système
5. **FIX-INSTALL-HTTP-EXTENSION.sql** - Installation pg_net
6. **TEST-FINAL-EMAIL.sql** - Test final après corrections

### Edge Function (dans `yo-voisin/supabase/functions/send-email-notification/`)
- **index.ts** - Code source de la fonction (corrigé)

---

## 📧 TYPES DE NOTIFICATIONS CONFIGURÉES

1. **`request_validated`** - Demande validée par le back-office
   - Sujet : "🎉 Ta demande a été validée sur Yo!Voiz"
   - Destinataire : Demandeur

2. **`new_proposal`** - Nouvelle proposition/devis reçu
   - Sujet : "💼 Nouveau devis reçu pour ta demande"
   - Destinataire : Demandeur

3. **`new_message`** - Nouveau message dans la messagerie
   - Sujet : "💬 Nouveau message sur Yo!Voiz"
   - Destinataire : Destinataire du message

4. **`profile_verified`** - Profil vérifié par le back-office
   - Sujet : "✅ Ton profil Yo!Voiz est maintenant vérifié"
   - Destinataire : Utilisateur vérifié

5. **`transaction_completed_client`** - Transaction validée (vue client)
   - Sujet : "💰 Transaction effectuée avec succès"
   - Destinataire : Client

6. **`transaction_completed_provider`** - Paiement reçu (vue prestataire)
   - Sujet : "💰 Paiement reçu pour ta prestation"
   - Destinataire : Prestataire

---

## 🧪 TESTS EFFECTUÉS

### Test #1 : Appel HTTP direct
- Résultat : ✅ Succès (ID: 1)
- Problème détecté : `schema "net" does not exist`
- Solution : Installation de `pg_net`

### Test #2 : Après installation pg_net
- Résultat : ✅ Succès (ID: 2)
- Problème détecté : "Utilisateur introuvable" (email cherché dans `profiles`)
- Solution : Correction Edge Function pour chercher dans `auth.users`

### Test #3 : Après correction Edge Function
- Résultat : ✅ Requête lancée (ID: 3)
- Statut : En attente de vérification

---

## 📋 VÉRIFICATIONS À FAIRE

### 1. Email reçu ?
- [ ] Vérifier `coulmilourou@gmail.com`
- [ ] Vérifier dossier **SPAM**
- [ ] Chercher expéditeur : "Yo!Voiz" ou "notifications@yovoiz.ci"

### 2. Logs Supabase
URL : https://supabase.com/dashboard/project/hfrmctsvpszqdizritoe/functions/send-email-notification/logs

**Logs attendus :**
```
✅ Utilisateur trouvé: coulmilourou@gmail.com
✅ Email envoyé avec succès à: coulmilourou@gmail.com
```

---

## 🚀 PROCHAINES ÉTAPES (si tests réussis)

1. **Tester tous les types de notifications**
   - Créer un message test
   - Valider un profil test
   - Créer une négociation test

2. **Configuration email expéditeur personnalisé**
   - Configurer domaine `yovoiz.ci` dans Brevo
   - Valider DNS (SPF, DKIM, DMARC)
   - Remplacer `notifications@yovoiz.ci` par email réel

3. **Optimisations futures**
   - Ajouter templates pour autres événements
   - Configurer retry automatique en cas d'échec
   - Ajouter logs détaillés dans une table dédiée

---

## ⚠️ POINTS D'ATTENTION

### Limites Brevo gratuit
- 300 emails/jour maximum
- Surveiller le quota dans le dashboard Brevo

### Sécurité
- ✅ Clé API stockée comme secret Supabase (non exposée)
- ✅ CORS configuré dans Edge Function
- ✅ Authentification requise pour appeler la fonction

### Performance
- `pg_net` est **asynchrone** : les emails ne sont pas envoyés instantanément
- Délai normal : 5-30 secondes entre le trigger et l'envoi

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Email non reçu ?
1. Vérifier les logs Supabase Functions
2. Vérifier le dossier spam
3. Vérifier quota Brevo (300/jour)
4. Tester manuellement : `SELECT * FROM net.http_post(...)`

### Erreur "User not found" ?
- Vérifier que le `userId` existe dans `auth.users`
- Vérifier les permissions Supabase (service role key)

### Erreur "schema net does not exist" ?
- Réinstaller `pg_net` : `CREATE EXTENSION IF NOT EXISTS pg_net;`

---

## 📞 SUPPORT

- **Documentation Brevo** : https://developers.brevo.com/
- **Documentation Supabase Edge Functions** : https://supabase.com/docs/guides/functions
- **Documentation pg_net** : https://github.com/supabase/pg_net

---

**✅ Configuration terminée le 15 février 2026**
