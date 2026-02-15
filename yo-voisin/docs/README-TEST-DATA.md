# ✅ SCRIPT FINAL - PRÊT À EXÉCUTER

## 📧 Email : `tamoil@test.com`

---

## 🚀 INSTRUCTIONS SIMPLES

### **1. Ouvrir Supabase**
Allez sur : https://supabase.com/dashboard/project/hfrmctsvpszqdizritoe/sql

### **2. Copier le script**
Ouvrez le fichier :
```
yo-voisin/supabase/TEST-DATA-TAMOIL.sql
```

### **3. Coller et Exécuter**
- Coller tout le contenu dans SQL Editor
- Cliquer sur **Run** (ou `Ctrl + Enter`)

### **4. Vérifier les résultats**
Le script affichera automatiquement :
```
✅ Profils prestataires     5
✅ Offres de services       8
✅ Demandes publiées        5
✅ Conversations            3
✅ Messages                16
✅ Propositions             2
📧 Votre compte            tamoil@test.com + votre UUID
```

---

## 📊 CE QUE VOUS OBTIENDREZ

### **5 Prestataires** :
1. **Jean Kouassi** - Plombier (Cocody) - Bronze
2. **Marie Diallo** - Ménage (Plateau) - Bronze
3. **Ibrahim Traoré** - Électricien (Marcory) - **GOLD** ⭐
4. **Fatou Koné** - Cours particuliers (Yopougon) - Bronze
5. **Aya Bamba** - Coiffure (Adjamé) - Bronze

### **8 Offres de services** :
1. Plomberie urgente (15 000 FCFA)
2. Ménage hebdomadaire (3 000 FCFA/h)
3. Installation électrique (20 000 FCFA)
4. Cours de maths (5 000 FCFA/h)
5. Coiffure africaine (8 000 FCFA)
6. Entretien jardin (12 000 FCFA)
7. Peinture (25 000 FCFA)
8. Cours d'anglais (6 000 FCFA/h)

### **5 Demandes (sous votre compte)** :
1. Réparation fuite d'eau (urgent)
2. Ménage hebdomadaire
3. Cours de maths Terminale
4. Installation climatiseurs
5. Coiffure à domicile

### **3 Conversations complètes** :
1. **Jean Kouassi** - 4 messages (négociation plomberie)
2. **Marie Diallo** - 5 messages (accord ménage)
3. **Fatou Koné** - 7 messages (planning cours)

### **2 Propositions** :
1. Jean → Plomberie (18 000 FCFA) - En attente
2. Marie → Ménage (12 000 FCFA) - Acceptée

---

## 🧪 TESTER LES PAGES

Après exécution du script, testez :

### **`/home`** - Services près de chez vous
✅ Devrait afficher 8 offres

### **`/missions`** - Toutes les demandes
✅ Devrait afficher au moins 5 demandes

### **`/offreurs`** - Prestataires disponibles
✅ Devrait afficher 5 prestataires
✅ Ibrahim Traoré aura un badge **GOLD**

### **`/messages`** - Messagerie
✅ Devrait afficher 3 conversations
✅ Avec historique complet de messages

### **Menu utilisateur > Mes demandes**
✅ Devrait afficher vos 5 demandes
✅ Avec statut "Publiée"

---

## 🔧 CORRECTIONS APPLIQUÉES

### ❌ **Erreur précédente** :
```
column "provider_level" of relation "profiles" does not exist
```

### ✅ **Solution** :
1. Supprimé `provider_level` de l'INSERT (car valeur par défaut = 'bronze')
2. Ajouté un UPDATE séparé pour mettre Ibrahim en 'gold' après l'insertion
3. Le niveau est maintenant calculé automatiquement par le trigger

### **Enum provider_level** :
- ✅ `bronze` (par défaut)
- ✅ `silver`
- ✅ `gold`
- ✅ `platinum`
- ❌ ~~`standard`~~ (n'existe pas)

---

## ⚡ LE SCRIPT EST 100% AUTOMATIQUE

- ✅ **Récupère automatiquement** votre UUID depuis `tamoil@test.com`
- ✅ **Aucune modification nécessaire**
- ✅ **Vérifie** que vous existez avant d'insérer
- ✅ **Affiche** les résultats à la fin
- ✅ **Gère** les conflits (ON CONFLICT DO NOTHING)

---

## 🎉 PRÊT !

Le fichier **`yo-voisin/supabase/TEST-DATA-TAMOIL.sql`** est prêt à être exécuté !

**Durée d'exécution** : ~3 secondes ⏱️

**Aucune modification nécessaire** - Juste copier-coller et exécuter ! 🚀
