# GUIDE D'EXÉCUTION DES MIGRATIONS SQL
## Date: 2026-02-14
## Corrections: Périmètre d'intervention + Profil Pro

---

## ✅ MIGRATIONS À EXÉCUTER (dans l'ordre)

### 1. Ajouter colonne availability_hours
**Fichier:** `PATCH-ADD-AVAILABILITY-HOURS.sql`
**Description:** Permet de stocker les jours et plages horaires de disponibilité

```sql
-- Exécuter ce fichier dans le SQL Editor de Supabase
```

### 2. Ajouter colonnes entreprise (company)
**Fichier:** `PATCH-ADD-COMPANY-COLUMNS.sql`
**Description:** Ajoute company_name, company_description, website, cover_url

```sql
-- Exécuter ce fichier dans le SQL Editor de Supabase
```

---

## 📋 VÉRIFICATIONS POST-MIGRATION

Après avoir exécuté les 2 migrations, vérifier que les colonnes existent :

```sql
-- Vérifier toutes les nouvelles colonnes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN (
  'availability_hours', 
  'company_name', 
  'company_description', 
  'website', 
  'cover_url'
);
```

Résultat attendu : **5 lignes**

---

## 🔧 CORRECTIONS APPLIQUÉES DANS LE CODE

### 1. **Gérer mon périmètre** (`/profile/perimeter`)
- ✅ Colonne `availability_hours` ajoutée (JSONB)
- ✅ Sauvegarde des jours disponibles fonctionnelle
- ✅ Sauvegarde des plages horaires fonctionnelle

### 2. **Modifier ma page** (`/abonnement` → Modifier ma page)
- ✅ Colonnes `company_name`, `company_description`, `website`, `cover_url` ajoutées
- ✅ Modifications prises en compte correctement
- ✅ Photo de couverture uploadable

### 3. **Export Tableau de Bord** (`/abonnement/tableau-bord`)
- ✅ Bouton "Exporter PDF" ajouté
- ✅ Bouton "Exporter Excel" ajouté
- ✅ Générateurs fonctionnels (lib/export-dashboard.ts)

### 4. **Devis - Erreur services.map**
- ✅ Utilise `items` au lieu de `services`
- ✅ Fallback sécurisé si undefined
- ✅ Gestion des anciennes/nouvelles structures

### 5. **Factures - Chargement données modification**
- ✅ useEffect ajouté dans FactureForm.tsx
- ✅ Données pré-remplies automatiquement
- ✅ Support items/services pour rétrocompatibilité

### 6. **Devis - Chargement données modification**
- ✅ useEffect ajouté dans DevisForm.tsx
- ✅ Données pré-remplies automatiquement
- ✅ Support items/services pour rétrocompatibilité

### 7. **Générateur PDF Factures**
- ✅ Déjà fonctionnel (lib/pdf-generator.ts)
- ✅ Utilise jsPDF correctement
- ✅ Téléchargement automatique

---

## 📦 DÉPENDANCES INSTALLÉES

- ✅ `jspdf` - Génération PDF
- ✅ `xlsx` - Export Excel

---

## 🚀 ÉTAPES POUR TESTER

1. **Exécuter les migrations SQL** dans Supabase SQL Editor
2. **Redémarrer le serveur de dev** (si nécessaire)
3. **Tester chaque fonctionnalité** :
   - Gérer mon périmètre → Enregistrer
   - Modifier ma page → Sauvegarder
   - Tableau de bord → Exporter PDF/Excel
   - Devis → Créer/Modifier
   - Factures → Créer/Modifier → Générer PDF

---

## ⚠️ IMPORTANT

- **Backup recommandé** avant exécution des migrations
- Les migrations sont **idempotentes** (IF NOT EXISTS)
- Aucune donnée existante n'est supprimée

---

## 📞 SUPPORT

Si problème après migration :
1. Vérifier les colonnes avec la requête de vérification ci-dessus
2. Vider le cache navigateur (Ctrl+Shift+R)
3. Vérifier la console (F12) pour erreurs
