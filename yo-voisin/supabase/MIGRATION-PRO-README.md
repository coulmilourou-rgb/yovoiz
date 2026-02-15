# Migration: Ajout du système d'abonnement Pro

## 📋 Description
Cette migration ajoute les colonnes nécessaires pour le système d'abonnement Pro dans la table `profiles`.

## 🔧 Colonnes ajoutées

### Système Pro
- `is_pro` (BOOLEAN) - Indique si l'utilisateur a un abonnement Pro
- `pro_started_at` (TIMESTAMPTZ) - Date de début de l'abonnement Pro
- `pro_expires_at` (TIMESTAMPTZ) - Date d'expiration de l'abonnement Pro
- `commission_rate` (DECIMAL) - Taux de commission (5% standard, 3% Pro)

### Informations supplémentaires
- `quartier` (VARCHAR) - Quartier de résidence
- `date_naissance` (DATE) - Date de naissance
- `phone_verified` (BOOLEAN) - Téléphone vérifié
- `email_notifications` (BOOLEAN) - Notifications par email activées
- `sms_notifications` (BOOLEAN) - Notifications SMS activées
- `service_zones` (TEXT[]) - Zones d'intervention pour prestataires
- `categories` (TEXT[]) - Catégories de services proposés

### Statistiques améliorées
- `total_ratings` (INTEGER) - Nombre total d'avis reçus
- `response_time_avg` (INTEGER) - Temps de réponse moyen (en heures)

## 📝 Instructions d'exécution

### 1. Ouvrir Supabase SQL Editor
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur "SQL Editor" dans le menu de gauche
4. Cliquez sur "New query"

### 2. Exécuter la migration
1. Ouvrez le fichier `MIGRATION-ADD-PRO-COLUMNS.sql`
2. Copiez tout le contenu
3. Collez-le dans l'éditeur SQL
4. Cliquez sur "Run" ou appuyez sur `Ctrl+Enter`

### 3. Vérifier les résultats
Vous devriez voir :
- ✅ Toutes les colonnes ajoutées avec succès
- ✅ Le compte `tamoil@test.com` activé en Pro
- ✅ Message de confirmation avec le nombre d'utilisateurs Pro

### 4. Résultat attendu
```
✅ Colonnes Pro ajoutées avec succès!
total_pro_users: 1
```

## 🔍 Vérification manuelle

Si vous souhaitez vérifier manuellement, exécutez :

```sql
SELECT 
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_pro,
  p.pro_expires_at,
  p.commission_rate
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'tamoil@test.com';
```

Résultat attendu :
- `is_pro`: `true`
- `pro_expires_at`: Date dans 1 an
- `commission_rate`: `0.030` (3%)

## 🎯 Test de l'interface

Après avoir exécuté la migration :

1. Allez sur http://localhost:3004
2. Connectez-vous avec `tamoil@test.com`
3. Naviguez vers `/abonnement`
4. La section "Mon entreprise PRO" devrait être **déverrouillée**
5. Tous les menus (Tableau de bord, Devis, Factures, etc.) devraient être **cliquables**

## ⚠️ Important

- Cette migration est **idempotente** : vous pouvez l'exécuter plusieurs fois sans erreur (grâce à `IF NOT EXISTS`)
- Les colonnes existantes ne seront **pas modifiées**
- Les données existantes sont **préservées**
- La valeur par défaut de `is_pro` est `false` pour tous les utilisateurs existants

## 🔄 Rollback (si nécessaire)

Si vous devez annuler cette migration :

```sql
ALTER TABLE profiles 
DROP COLUMN IF EXISTS is_pro,
DROP COLUMN IF EXISTS pro_started_at,
DROP COLUMN IF EXISTS pro_expires_at,
DROP COLUMN IF EXISTS commission_rate,
DROP COLUMN IF EXISTS quartier,
DROP COLUMN IF EXISTS date_naissance,
DROP COLUMN IF EXISTS phone_verified,
DROP COLUMN IF EXISTS email_notifications,
DROP COLUMN IF EXISTS sms_notifications,
DROP COLUMN IF EXISTS service_zones,
DROP COLUMN IF EXISTS categories,
DROP COLUMN IF EXISTS total_ratings,
DROP COLUMN IF EXISTS response_time_avg;
```

## 📚 Fichiers liés

- `MIGRATION-ADD-PRO-COLUMNS.sql` - Script de migration principal
- `schema.sql` - Schéma mis à jour avec documentation
- `app/abonnement/page.tsx` - Interface du système d'abonnement
- `app/tarifs/page.tsx` - Grille tarifaire

## 🎉 Prochaines étapes

Après cette migration, vous pourrez :
1. Développer les pages du tableau de bord Pro
2. Implémenter le système de paiement pour les abonnements
3. Créer un panneau d'administration pour gérer les abonnements
4. Automatiser l'expiration des abonnements Pro
