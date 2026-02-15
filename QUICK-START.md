# 🚀 GUIDE RAPIDE - INSERTION DONNÉES DE TEST

## 📧 IMPORTANT : Votre email = `tamoil@test.com`

---

## ⚡ ÉTAPES RAPIDES

### **1️⃣ Récupérer votre UUID**

Dans **Supabase Dashboard** > **SQL Editor**, exécutez :

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'tamoil@test.com';
```

**Résultat attendu** :
```
id                                  | email            | created_at
------------------------------------+------------------+---------------------------
8b8cb0f0-6712-445b-a9ed-a45aa78638d2| tamoil@test.com  | 2026-02-14 10:23:45+00
```

**📋 Copiez l'UUID** (ex: `8b8cb0f0-6712-445b-a9ed-a45aa78638d2`)

---

### **2️⃣ Modifier le script**

Ouvrez le fichier :
```
yo-voisin/supabase/TEST-DATA-COMPLETE.sql
```

**Cherchez et remplacez** (3 occurrences) :

**Ligne ~183** (Section 3 - Demandes) :
```sql
main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'; -- ⬅️ REMPLACER PAR VOTRE UUID
```

**Ligne ~305** (Section 4 - Conversations) :
```sql
main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'; -- ⬅️ REMPLACER PAR VOTRE UUID
```

**Ligne ~396** (Section 5 - Négociations) :
```sql
main_user_id UUID := '8b8cb0f0-6712-445b-a9ed-a45aa78638d2'; -- ⬅️ REMPLACER PAR VOTRE UUID
```

**💡 Astuce** : Utilisez `Ctrl + F` pour chercher `main_user_id` et remplacer les 3 occurrences.

---

### **3️⃣ Exécuter le script**

1. Allez sur **Supabase Dashboard**
2. **SQL Editor** (menu gauche)
3. **New Query**
4. Copiez-collez **tout** le contenu de `TEST-DATA-COMPLETE.sql`
5. Cliquez sur **Run** (ou `Ctrl + Enter`)

**⏱️ Durée** : 2-3 secondes

---

### **4️⃣ Vérifier les résultats**

Le script affiche automatiquement :

```
✅ Profils prestataires     5
✅ Offres de services       8
✅ Demandes publiées        5
✅ Conversations            3
✅ Messages                25
✅ Propositions             2
```

Si vous voyez ces résultats, **c'est bon !** ✅

---

## 🧪 TESTER LES PAGES

### **1. Page `/home`** (Services près de chez vous)
- Devrait afficher **8 offres** de services
- Jean Kouassi (Plomberie)
- Marie Diallo (Ménage)
- Ibrahim Traoré (Électricité)
- Fatou Koné (Cours)
- Aya Bamba (Coiffure)
- etc.

### **2. Page `/missions`** (Toutes les demandes)
- Devrait afficher **5 demandes** publiées sous votre nom
- Réparation fuite d'eau
- Ménage hebdomadaire
- Cours de maths
- Installation climatiseurs
- Coiffure à domicile

### **3. Page `/offreurs`** (Prestataires disponibles)
- Devrait afficher **5 prestataires** avec leurs profils
- Avec photos, bios, communes
- Ibrahim Traoré aura un badge **GOLD**

### **4. Page `/messages`** (Messagerie)
- Devrait afficher **3 conversations**
- Avec Jean Kouassi (4 messages)
- Avec Marie Diallo (5 messages)
- Avec Fatou Koné (7 messages)

### **5. Menu utilisateur > Mes demandes**
- Devrait afficher vos **5 demandes**
- Avec statuts "Publiée"

---

## 🔍 VÉRIFICATION RAPIDE (SQL)

Si vous voulez vérifier que tout est bien inséré, exécutez :

```sql
-- Compter tout
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'provider') AS prestataires,
  (SELECT COUNT(*) FROM service_offers WHERE is_published = true) AS offres,
  (SELECT COUNT(*) FROM requests WHERE status = 'published') AS demandes,
  (SELECT COUNT(*) FROM conversations) AS conversations,
  (SELECT COUNT(*) FROM messages) AS messages,
  (SELECT COUNT(*) FROM negotiations) AS propositions;
```

**Résultat attendu** :
```
prestataires | offres | demandes | conversations | messages | propositions
-------------+--------+----------+---------------+----------+-------------
     5       |   8    |    5     |      3        |    25    |      2
```

---

## ❓ EN CAS DE PROBLÈME

### **Erreur : "duplicate key value"**
➜ Les données existent déjà. Pour nettoyer :
```sql
DELETE FROM profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);
```
Puis réexécutez le script.

### **Erreur : "violates foreign key constraint"**
➜ Vérifiez que vous avez bien remplacé l'UUID par le vôtre.

### **Les données n'apparaissent pas sur les pages**
➜ Actualisez avec `Ctrl + F5`
➜ Vérifiez la console navigateur (`F12`)
➜ Vérifiez que vous êtes bien connecté avec `tamoil@test.com`

---

## 🎉 C'EST TOUT !

Après avoir exécuté le script, vous avez des **données de test complètes** pour tester toutes les fonctionnalités de Yo!Voiz !

**Durée totale** : 5 minutes max ⏱️
