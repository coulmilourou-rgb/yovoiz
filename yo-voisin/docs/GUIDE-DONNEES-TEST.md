# 📊 GUIDE - DONNÉES DE TEST COMPLÈTES

## 🎯 OBJECTIF

Insérer des données de test réalistes pour tester les fonctionnalités suivantes :
- **Missions** : Demandes de services publiées
- **Offreurs** : Prestataires et leurs offres
- **Messagerie** : Conversations et messages

---

## 📋 CONTENU DES DONNÉES DE TEST

### 👥 **5 Profils Prestataires** :
1. **Jean Kouassi** - Plombier (Cocody)
2. **Marie Diallo** - Ménage (Plateau)
3. **Ibrahim Traoré** - Électricien (Marcory) - Niveau GOLD
4. **Fatou Koné** - Cours particuliers (Yopougon)
5. **Aya Bamba** - Coiffure (Adjamé)

### 💼 **8 Offres de Services** :
1. Plomberie et dépannage urgent
2. Ménage et entretien de maison
3. Installation électrique
4. Cours de mathématiques
5. Coiffure africaine
6. Entretien de jardin
7. Peinture intérieure/extérieure
8. Cours d'anglais

### 📝 **5 Demandes de Services (Missions)** :
1. Réparation urgente fuite d'eau
2. Ménage hebdomadaire
3. Cours de maths Terminale
4. Installation climatiseurs
5. Coiffure à domicile

### 💬 **3 Conversations avec Messages** :
1. **Avec Jean Kouassi** (Plombier)
   - 4 messages échangés
   - Négociation pour fuite d'eau
   - RDV fixé pour demain matin

2. **Avec Marie Diallo** (Ménage)
   - 5 messages échangés
   - Accord pour ménage hebdomadaire
   - 12 000 FCFA/semaine

3. **Avec Fatou Koné** (Cours)
   - 7 messages échangés
   - Planning défini (mercredi + samedi)
   - 5 000 FCFA/heure

### 💰 **2 Propositions (Négociations)** :
1. Jean Kouassi → Plomberie (18 000 FCFA) - En attente
2. Marie Diallo → Ménage (12 000 FCFA) - Acceptée

---

## 🚀 PROCÉDURE D'INSTALLATION

### **Étape 1 : Récupérer votre UUID utilisateur**

Dans Supabase SQL Editor, exécutez :
```sql
SELECT id, email, first_name, last_name 
FROM auth.users 
WHERE email = 'coulmilourou@gmail.com';
```

Copiez l'UUID retourné (ex: `8b8cb0f0-6712-445b-a9ed-a45aa78638d2`)

---

### **Étape 2 : Modifier le script**

Ouvrez `supabase/TEST-DATA-COMPLETE.sql` et **remplacez** :

```sql
main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'; -- Votre ID
```

Par votre vrai UUID récupéré à l'étape 1.

**⚠️ IMPORTANT** : Cette ligne apparaît **3 fois** dans le script (sections 3, 4 et 5). Modifiez-les toutes !

---

### **Étape 3 : Exécuter le script**

1. Allez sur **Supabase Dashboard** > **SQL Editor**
2. Collez le contenu de `TEST-DATA-COMPLETE.sql`
3. Cliquez sur **Run** (ou `Ctrl + Enter`)

---

### **Étape 4 : Vérifier les résultats**

Le script affiche automatiquement un récapitulatif :

```
✅ Profils prestataires     5
✅ Offres de services       8
✅ Demandes publiées        5
✅ Conversations            3
✅ Messages                25
✅ Propositions             2
```

---

## 🧪 TESTER LES FONCTIONNALITÉS

### **1. Page `/home`** - Services près de chez vous
- ✅ Devrait afficher les 8 offres de services
- ✅ Filtrable par commune
- ✅ Cliquable pour voir les détails

### **2. Page `/missions`** - Toutes les demandes
- ✅ Devrait afficher les 5 demandes publiées
- ✅ Avec catégories, budgets, urgences
- ✅ Cliquable pour voir détails

### **3. Page `/offreurs`** - Prestataires disponibles
- ✅ Devrait afficher les 5 prestataires
- ✅ Avec leurs offres de services
- ✅ Badge GOLD pour Ibrahim Traoré

### **4. Page `/messages`** - Messagerie
- ✅ Devrait afficher 3 conversations
- ✅ Avec les derniers messages
- ✅ Cliquable pour voir le fil complet

### **5. Page `/negotiations`** - Propositions reçues
- ✅ Devrait afficher 2 propositions
- ✅ 1 en attente + 1 acceptée
- ✅ Avec montants et messages

---

## 🔍 REQUÊTES DE VÉRIFICATION

### **Vérifier les profils créés** :
```sql
SELECT id, first_name, last_name, commune, role, provider_level
FROM profiles
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);
```

### **Vérifier les offres publiées** :
```sql
SELECT 
  title, 
  category, 
  price, 
  communes,
  is_published
FROM service_offers
WHERE is_published = true
ORDER BY created_at DESC;
```

### **Vérifier les demandes** :
```sql
SELECT 
  title, 
  category, 
  budget, 
  urgency,
  commune,
  status
FROM requests
WHERE status = 'published'
ORDER BY published_at DESC;
```

### **Vérifier les conversations** :
```sql
SELECT 
  c.id,
  p1.first_name || ' ' || p1.last_name AS user1,
  p2.first_name || ' ' || p2.last_name AS user2,
  (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) AS message_count
FROM conversations c
JOIN profiles p1 ON c.user1_id = p1.id
JOIN profiles p2 ON c.user2_id = p2.id;
```

---

## 🗑️ NETTOYER LES DONNÉES DE TEST

Si vous voulez supprimer toutes les données de test :

```sql
-- Supprimer les profils de test (cascade supprimera tout le reste)
DELETE FROM profiles
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

-- Ou supprimer uniquement les offres/demandes/messages
DELETE FROM service_offers WHERE profile_id IN (...);
DELETE FROM requests WHERE requester_id = 'VOTRE_UUID';
DELETE FROM messages WHERE conversation_id IN (...);
```

---

## ⚠️ NOTES IMPORTANTES

1. **UUIDs** : Les UUIDs des prestataires sont fixes pour faciliter les tests. En production, ils seront générés automatiquement.

2. **Votre profil** : Le script utilise votre UUID réel pour créer les demandes et conversations. Vous devez le remplacer avant exécution.

3. **Dates** : Les dates sont relatives (`NOW() - INTERVAL '2 days'`) pour avoir des données récentes même si vous exécutez le script plus tard.

4. **Cascade** : Grâce aux contraintes `ON DELETE CASCADE`, supprimer un profil supprime automatiquement toutes ses offres, demandes, messages, etc.

5. **Sécurité** : En production, désactivez les UUIDs fixes et utilisez uniquement des UUIDs générés par Supabase.

---

## 🎉 RÉSULTAT ATTENDU

Après exécution du script, vous devriez avoir :

- ✅ **5 prestataires fictifs** avec bios et localisations
- ✅ **8 offres variées** (plomberie, ménage, cours, beauté, etc.)
- ✅ **5 demandes publiées** sous votre compte
- ✅ **3 conversations actives** avec messages réalistes
- ✅ **2 propositions** pour tester le système de négociation

Vous pouvez maintenant **tester toutes les fonctionnalités** de la plateforme avec des données réalistes ! 🚀

---

## 📞 EN CAS DE PROBLÈME

### Erreur : "duplicate key value violates unique constraint"
- Les profils existent déjà. Modifiez les UUIDs ou supprimez les anciens.

### Erreur : "insert or update on table violates foreign key constraint"
- Vérifiez que votre UUID utilisateur est correct.
- Vérifiez que la table `auth.users` contient bien votre utilisateur.

### Les données n'apparaissent pas sur les pages
- Actualisez la page (`Ctrl + F5`)
- Vérifiez les logs de la console navigateur (`F12`)
- Vérifiez les policies RLS dans Supabase

---

**Bon développement !** 🎯
