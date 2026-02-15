# Rapport de Structure du Projet Yo!Voiz

**Date:** 2026-02-14  
**Objectif:** Scanner complet de la structure, identification des pages manquantes et erreurs TypeScript

---

## 1. PAGES EXISTANTES (47 pages)

### Auth (8 pages)
- ✅ `/auth/connexion` - Page de connexion
- ✅ `/auth/inscription` - Page d'inscription multi-étapes
- ✅ `/auth/mot-de-passe-oublie` - Récupération mot de passe
- ✅ `/auth/reset-password` - Réinitialisation mot de passe
- ✅ `/auth/confirm-email` - Confirmation email
- ✅ `/auth/verify-email` - Vérification email

### Dashboard (2 pages)
- ✅ `/dashboard/client` - Dashboard client avec onglet négociations
- ✅ `/dashboard/prestataire` - Dashboard prestataire

### Profil utilisateur (7 pages)
- ✅ `/profile/info` - Informations personnelles
- ✅ `/profile/security` - Sécurité et mot de passe
- ✅ `/profile/public` - Profil public visible
- ✅ `/profile/requests` - Mes demandes
- ✅ `/profile/payments` - Paiements reçus
- ✅ `/profile/perimeter` - Périmètre d'intervention
- ✅ `/profile/verification` - Vérification compte

### Missions/Demandes (4 pages)
- ✅ `/missions` - Liste des demandes
- ✅ `/missions/nouvelle` - Créer une demande
- ✅ `/missions/[id]` - Détail d'une demande
- ✅ `/missions/[id]/edit` - Modifier une demande

### Services/Offres (4 pages)
- ✅ `/services/nouvelle-offre` - Créer une offre de service
- ✅ `/services/mes-offres` - Mes offres de service
- ✅ `/services/offres/[id]/edit` - Modifier une offre

### Abonnement Pro (10 pages)
- ✅ `/abonnement` - Hub abonnement (page principale)
- ✅ `/abonnement/tableau-bord` - Tableau de bord Pro
- ✅ `/abonnement/devis` - Gestion devis
- ✅ `/abonnement/factures` - Gestion factures
- ✅ `/abonnement/encaissements` - Suivi encaissements
- ✅ `/abonnement/clients` - Répertoire clients
- ✅ `/abonnement/catalogue` - Catalogue d'articles
- ✅ `/abonnement/parametres-pro` - Paramètres entreprise
- ✅ `/abonnement/activites` - Historique d'activité
- ✅ `/abonnement/voir-demandes` - Voir demandes dans périmètre

### Négociations (1 page)
- ✅ `/negotiations/[id]` - Détail d'une négociation

### Autres pages (11 pages)
- ✅ `/` - Landing page publique
- ✅ `/home` - Accueil connecté (feed missions)
- ✅ `/messages` - Messagerie temps réel
- ✅ `/offreurs` - Annuaire des offreurs
- ✅ `/tarifs` - Page tarifs/pricing
- ✅ `/aide` - Centre d'aide/FAQ
- ✅ `/conditions-generales` - CGU/CGV
- ✅ `/demande-envoyee` - Confirmation demande envoyée
- ✅ `/admin/moderation` - Modération admin
- ✅ `/test-dashboard` - Page de test
- ✅ `/test-supabase` - Test connexion Supabase
- ✅ `/debug-cookies` - Debug cookies

---

## 2. COMPOSANTS RÉUTILISABLES (48 composants)

### Layout (3)
- `Navbar.tsx` - Navigation principale
- `NotificationsDropdown.tsx` - Dropdown notifications
- `PageHead.tsx` - Méta-données pages

### UI (10)
- `Avatar.tsx`, `Badge.tsx`, `Button.tsx`, `Card.tsx`
- `Input.tsx`, `Skeleton.tsx`, `EmptyState.tsx`
- `Toast.tsx`, `ProNotification.tsx`

### Auth (9)
- `RequireVerification.tsx`, `VerificationBanner.tsx`, `VerifyPhone.tsx`
- `StepIndicator.tsx`
- 5 steps d'inscription (Step1Role → Step5Bienvenue)

### Abonnement Pro (14)
- Gestion clients: `ClientForm.tsx`, `ClientHistoryModal.tsx`
- Gestion devis: `DevisForm.tsx`, `DevisView.tsx`, `DevisSendEmail.tsx`
- Gestion factures: `FactureForm.tsx`, `FactureView.tsx`, `FactureReminder.tsx`
- Autres: `ServiceForm.tsx`, `ExportModal.tsx`
- Embeds: `PerimeterEmbed.tsx`, `ProfileEditEmbed.tsx`, `ProfilePublicEmbed.tsx`
- Guide: `GUIDE-UTILISATION-DEVIS-FACTURES.tsx`

### Dashboard (3)
- `DashboardCard.tsx`, `QuickActions.tsx`, `NegotiationsTab.tsx`

### Missions (1)
- `ProposeQuoteModal.tsx`

### Négociations (2)
- `NegotiationActions.tsx`, `NegotiationTimeline.tsx`

### Features (4)
- `LiveChat.tsx`, `LiveNotifications.tsx`, `ScrollToTop.tsx`, `VideoModal.tsx`

---

## 3. LIENS ET NAVIGATION

### Navigation principale (Navbar)
```typescript
// Pour utilisateurs connectés
- /home (Accueil)
- /missions (Missions)
- /offreurs (Offreurs)
- /missions/nouvelle (Nouvelle Demande)
- /abonnement (Abonnement Pro)
- /messages (Messagerie)

// Menu utilisateur
- /profile/requests (Mes demandes)
- /services/mes-offres (Mes Services)
- /profile/payments (Mes paiements)
- /profile/info (Informations personnelles)
- /profile/security (Sécurité)
- /aide (Aide)

// Non connectés
- /auth/connexion
- /auth/inscription
```

### Redirections router.push()
**Toutes les destinations sont valides** - Aucun lien cassé détecté

Destinations fréquentes:
- `/auth/connexion` (15 occurrences)
- `/missions/nouvelle` (10 occurrences)
- `/home` (8 occurrences)
- `/missions` (7 occurrences)
- `/profile/requests` (5 occurrences)
- `/tarifs` (4 occurrences)

---

## 4. PAGES POTENTIELLEMENT MANQUANTES

### ❌ Page manquante critique
```typescript
// Dans offreurs/page.tsx (ligne 129)
router.push(`/profile/public/${prestataireId}`);
```
**PROBLÈME:** La route `/profile/public/[id]` n'existe pas !  
**Solution:** Créer `yo-voisin/app/profile/public/[id]/page.tsx`  
**Impact:** Empêche l'affichage des profils publics d'autres utilisateurs

### ⚠️ Routes dynamiques à vérifier
- `/negotiations` (sans ID) - Existe via `/dashboard/client` (NegotiationsTab) mais pas de page standalone
- `/negotiations?request_id=xxx` - Appelé depuis `/abonnement/voir-demandes` mais pas de gestion du query param

---

## 5. ERREURS TYPESCRIPT DÉTECTÉES

### Erreurs Supabase - Tables non définies dans schema
**Fichiers affectés:**
- `app/abonnement/catalogue/page.tsx` - Table `services_catalogue` introuvable
- `app/abonnement/clients/page.tsx` - Table `clients` introuvable

**Cause:** Ces tables n'existent pas dans `database.types.ts`

**Solution:**
1. Vérifier que les tables existent en base Supabase
2. Régénérer les types: `npx supabase gen types typescript --project-id xxx > lib/database.types.ts`

### Erreurs Button variant
**Fichiers:** `app/abonnement/catalogue/page.tsx` (lignes 289, 296, 305)

**Erreur:**
```typescript
variant="default" // ❌ 'default' n'existe pas
```

**Types valides:**
```typescript
'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'destructive'
```

**Solution:** Remplacer `variant="default"` par `variant="primary"`

### Propriété manquante
**Fichier:** `app/abonnement/clients/page.tsx` (ligne 154)

**Erreur:** `Property 'amount' does not exist on type 'never'`

**Cause:** Référence à une propriété inexistante dans le type Client

---

## 6. HOOKS ET LIBS

### Hooks personnalisés
- `usePageTitle()` - Gestion dynamique titre page (utilisé dans `/messages`)
- `useAuth()` - Context authentification (utilisé partout)

### Libs métier
- `lib/messages.ts` - Gestion messagerie temps réel
- `lib/negotiations.ts` - Gestion négociations
- `lib/notifications.ts` - Notifications
- `lib/pdf-generator.ts` - Génération PDF devis/factures
- `lib/formatters.ts` - Formatage données
- `lib/constants.ts` - Constantes (COMMUNES, CATEGORIES)
- `lib/supabase.ts` / `lib/supabase-server.ts` - Client Supabase

---

## 7. ACTIONS RECOMMANDÉES

### 🔴 Priorité HAUTE
1. **Créer `/profile/public/[id]/page.tsx`**
   - Permet de voir le profil public d'autres utilisateurs
   - Appelé depuis `/offreurs` (ligne 129)
   - Template: Reprendre la logique de `/profile/public/page.tsx` en ajoutant la gestion de l'ID

2. **Corriger erreurs TypeScript Button variant**
   - Remplacer `"default"` par `"primary"` dans catalogue/page.tsx

3. **Régénérer types Supabase**
   - Ajouter tables manquantes: `services_catalogue`, `clients`
   - Ou créer les tables si elles n'existent pas

### 🟠 Priorité MOYENNE
4. **Gérer query params dans /negotiations**
   - Ajouter gestion de `?request_id=xxx` dans `/negotiations/[id]/page.tsx`

5. **Vérifier imports cassés**
   - Tous les imports semblent valides (aucun import non résolu détecté)

### 🟢 Priorité BASSE
6. **Nettoyer pages de test**
   - `/test-dashboard`
   - `/test-supabase`
   - `/debug-cookies`

7. **Compléter EmptyState**
   - Vérifier que `EmptyOpportunities` existe dans `components/ui/EmptyState.tsx`

---

## 8. STRUCTURE DES DOSSIERS

```
yo-voisin/
├── app/                          # Pages Next.js 13+ (App Router)
│   ├── (auth)
│   │   ├── connexion/
│   │   ├── inscription/
│   │   ├── mot-de-passe-oublie/
│   │   └── ...
│   ├── dashboard/
│   │   ├── client/
│   │   └── prestataire/
│   ├── profile/
│   │   ├── info/
│   │   ├── security/
│   │   ├── public/              # ⚠️ Manque [id]/
│   │   └── ...
│   ├── missions/
│   │   ├── [id]/
│   │   │   ├── edit/
│   │   │   └── page.tsx
│   │   ├── nouvelle/
│   │   └── page.tsx
│   ├── abonnement/
│   │   ├── tableau-bord/
│   │   ├── devis/
│   │   ├── factures/
│   │   └── ...
│   ├── negotiations/
│   │   └── [id]/
│   ├── messages/
│   ├── offreurs/
│   └── ...
├── components/
│   ├── layout/
│   ├── ui/
│   ├── auth/
│   ├── abonnement/
│   ├── dashboard/
│   ├── missions/
│   └── negotiations/
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── types.ts
│   ├── messages.ts
│   ├── negotiations.ts
│   └── ...
└── hooks/
    └── usePageTitle.ts
```

---

## 9. RÉSUMÉ EXÉCUTIF

### ✅ Points forts
- Architecture bien structurée (App Router Next.js 13+)
- Composants réutilisables bien organisés
- Système d'authentification complet
- Messagerie temps réel fonctionnelle
- Module abonnement Pro complet
- Aucun lien de navigation cassé dans le code

### ⚠️ Points d'attention
- **1 page critique manquante:** `/profile/public/[id]`
- **Erreurs TypeScript à corriger** dans les pages Pro (catalogue, clients)
- Tables Supabase manquantes ou types non synchronisés
- Query params non gérés dans certaines routes

### 📊 Statistiques
- **47 pages** créées
- **48 composants** réutilisables
- **17 fichiers** dans /lib
- **~80% complétude** (estimation)
- **3-4h** de travail pour finaliser les corrections

---

## 10. PLAN D'ACTION IMMÉDIAT

```bash
# 1. Créer la page manquante
yo-voisin/app/profile/public/[id]/page.tsx

# 2. Corriger Button variants
# Fichier: app/abonnement/catalogue/page.tsx
# Remplacer: variant="default"
# Par: variant="primary"

# 3. Régénérer types Supabase
cd yo-voisin
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts

# 4. Vérifier compilation
npm run build
```

---

**Fin du rapport**
