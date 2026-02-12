# 🚀 Guide d'Installation du Schéma Supabase - Yo! Voisin

## Étapes pour configurer la base de données

### 1️⃣ Accéder au SQL Editor

1. Va sur **https://supabase.com/dashboard**
2. Sélectionne ton projet : `yo-voisin-prod`
3. Dans le menu latéral, clique sur **"SQL Editor"**

### 2️⃣ Exécuter le schéma complet

1. Clique sur **"New Query"** (bouton en haut à droite)
2. Ouvre le fichier `supabase/schema.sql` de ce projet
3. **Copie TOUT le contenu** du fichier (742 lignes)
4. **Colle** dans l'éditeur SQL de Supabase
5. Clique sur **"Run"** (ou `Ctrl + Enter`)

⏱️ **Temps d'exécution** : environ 5-10 secondes

✅ **Vérification** : Si tout est OK, tu verras "Success. No rows returned" en vert

### 3️⃣ Configurer le Storage (fichiers)

Après l'exécution du schéma, configure les buckets de stockage :

1. Va dans **Storage** (menu latéral)
2. Crée 3 buckets publics :

#### Bucket 1 : `id-cards`
```
- Name: id-cards
- Public: NO (privé)
- File size limit: 5 MB
- Allowed MIME types: image/jpeg, image/png
```

#### Bucket 2 : `selfies`
```
- Name: selfies
- Public: NO (privé)
- File size limit: 5 MB
- Allowed MIME types: image/jpeg, image/png
```

#### Bucket 3 : `request-photos`
```
- Name: request-photos
- Public: YES (public)
- File size limit: 5 MB
- Allowed MIME types: image/jpeg, image/png, image/webp
```

#### Bucket 4 : `avatars`
```
- Name: avatars
- Public: YES (public)
- File size limit: 2 MB
- Allowed MIME types: image/jpeg, image/png, image/webp
```

### 4️⃣ Configurer les Storage Policies

Pour chaque bucket, va dans **Policies** et crée :

#### Policies pour `id-cards` et `selfies` (privés)
```sql
-- Upload : Utilisateur peut uploader sa propre CNI/selfie
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Read : Utilisateur peut voir ses propres fichiers + admins
CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Delete : Utilisateur peut supprimer ses fichiers
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

#### Policies pour `request-photos` et `avatars` (publics)
```sql
-- Upload : Utilisateur authentifié peut uploader
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Read : Tout le monde peut lire (public)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (true);

-- Delete : Propriétaire peut supprimer
CREATE POLICY "Owner can delete"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 5️⃣ Activer l'Authentication

1. Va dans **Authentication** > **Providers**
2. Active **Email** (déjà activé par défaut)
3. Configure les paramètres :
   - ✅ Enable email confirmations : **ON**
   - ✅ Enable email change confirmations : **ON**
   - ✅ Secure password change : **ON**

### 6️⃣ Configurer les URLs de redirection

1. Va dans **Authentication** > **URL Configuration**
2. Ajoute ces URLs dans **Redirect URLs** :
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
```

### 7️⃣ (Optionnel) Créer un utilisateur admin de test

Va dans **SQL Editor** et exécute :

```sql
-- Crée un utilisateur admin (change l'email et password)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@yovoisin.ci',
  crypt('MotDePasseSecurise123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Récupère l'ID de l'admin créé
SELECT id, email FROM auth.users WHERE email = 'admin@yovoisin.ci';

-- Crée le profil admin (remplace <USER_ID> par l'ID récupéré)
INSERT INTO profiles (
  id,
  role,
  first_name,
  last_name,
  phone,
  commune,
  verification_status
) VALUES (
  '<USER_ID>',
  'both',
  'Admin',
  'Yo Voisin',
  '+22500000000',
  'Plateau',
  'approved'
);
```

---

## ✅ Vérification finale

Exécute dans **SQL Editor** :

```sql
-- Vérifie les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifie les vues
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Vérifie les triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Tu devrais voir :
- ✅ 11 tables (profiles, requests, quotes, missions, payments, messages, reviews, disputes, withdrawals, notifications, admin_logs)
- ✅ 3 vues (provider_dashboard, requester_dashboard, top_providers)
- ✅ 12+ triggers

---

## 🎯 Prochaine étape

Une fois le schéma installé, redémarre ton serveur Next.js :

```bash
cd yo-voisin
npm run dev
```

Et teste la connexion en accédant à : http://localhost:3000

---

## 🆘 En cas de problème

### Erreur "relation already exists"
- Solution : Le schéma est déjà installé. Pas besoin de le réexécuter.

### Erreur "permission denied"
- Solution : Assure-toi d'être connecté avec le compte propriétaire du projet.

### Erreur "syntax error"
- Solution : Vérifie que tu as copié TOUT le fichier schema.sql sans modification.

---

## 📊 Structure de la base créée

### Tables principales
- **profiles** : Utilisateurs (demandeurs + prestataires)
- **requests** : Demandes de service
- **quotes** : Devis/candidatures
- **missions** : Services acceptés
- **payments** : Paiements + escrow
- **messages** : Messagerie sécurisée
- **reviews** : Notations bidirectionnelles
- **disputes** : Gestion litiges
- **withdrawals** : Retraits prestataires
- **notifications** : Notifications in-app
- **admin_logs** : Audit trail admin

### Fonctionnalités automatiques
✅ Row Level Security (RLS) activée sur toutes les tables
✅ Triggers pour calcul automatique des niveaux (Bronze/Argent/Or/Platine)
✅ Trigger de filtrage anti-désintermédiation (masquage numéros/emails)
✅ Auto-incrémentation des compteurs (missions, devis, etc.)
✅ Timestamps auto (created_at, updated_at)
✅ Vues optimisées pour dashboards

---

**Prêt pour la prochaine étape ? Dis "schéma installé" quand c'est fait ! 🚀**
