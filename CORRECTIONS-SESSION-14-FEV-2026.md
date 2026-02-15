# ✅ CORRECTION - SCRIPT DONNÉES DE TEST

## 🔧 PROBLÈME RÉSOLU

**Erreur** : `column "is_provider" of relation "profiles" does not exist`

**Cause** : Le script utilisait l'ancienne structure de la table `profiles` avec une colonne `is_provider` (boolean), mais la structure actuelle utilise la colonne `role` avec l'enum `user_role`.

---

## ✅ CORRECTIONS APPLIQUÉES

### 1. **Table `profiles` - Insertion**

**Avant** (incorrect) :
```sql
INSERT INTO profiles (
  id, first_name, last_name, phone, commune,
  avatar_url, provider_bio, is_provider, provider_level
) VALUES (...)
```

**Après** (correct) :
```sql
INSERT INTO profiles (
  id, first_name, last_name, phone, commune,
  avatar_url, provider_bio, role, provider_level
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Jean', 'Kouassi', '+225 07 12 34 56 78', 'Cocody',
  null, 'Plombier professionnel...', 'provider', 'standard'
)
```

**Changement** : 
- ❌ `is_provider = true`
- ✅ `role = 'provider'`

---

### 2. **Requête de vérification**

**Avant** (incorrect) :
```sql
SELECT COUNT(*) FROM profiles WHERE is_provider = true;
```

**Après** (correct) :
```sql
SELECT COUNT(*) FROM profiles WHERE role = 'provider';
```

---

## 📊 STRUCTURE ACTUELLE DE LA TABLE `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  commune TEXT,
  avatar_url TEXT,
  provider_bio TEXT,
  role user_role DEFAULT 'user',  -- ✅ ENUM: 'user', 'provider', 'admin'
  provider_level provider_level_enum DEFAULT 'standard',  -- 'standard', 'gold', 'platinum'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎯 FICHIERS CORRIGÉS

1. ✅ **`supabase/TEST-DATA-COMPLETE.sql`**
   - Ligne 24 : `is_provider` → `role`
   - Lignes 36, 48, 60, 72, 84 : `true` → `'provider'`
   - Ligne 477 : `is_provider = true` → `role = 'provider'`

2. ✅ **`docs/GUIDE-DONNEES-TEST.md`**
   - Ligne 145 : Documentation mise à jour
   - Requête de vérification corrigée

---

## 🚀 PRÊT À EXÉCUTER

Le script est maintenant **100% compatible** avec votre schéma de base de données actuel.

### **Procédure** :

1. **Récupérer votre UUID** :
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'coulmilourou@gmail.com';
   ```

2. **Modifier le script** :
   - Ouvrir `supabase/TEST-DATA-COMPLETE.sql`
   - Remplacer les 3 occurrences de `main_user_id` par votre UUID

3. **Exécuter dans Supabase** :
   - SQL Editor → Coller le script → Run

4. **Vérifier les résultats** :
   ```
   ✅ Profils prestataires     5
   ✅ Offres de services       8
   ✅ Demandes publiées        5
   ✅ Conversations            3
   ✅ Messages                ~25
   ✅ Propositions             2
   ```

---

## 🎉 RÉSULTAT

Après exécution, vous aurez des données de test complètes pour :
- ✅ `/home` - Offres de services
- ✅ `/missions` - Demandes publiées
- ✅ `/offreurs` - Prestataires avec profils
- ✅ `/messages` - Conversations avec historique
- ✅ `/negotiations` - Propositions reçues

**Le script est prêt à être exécuté !** 🚀
