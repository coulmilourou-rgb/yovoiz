# 🗂️ STRUCTURE COMPLÈTE DU PROJET YO! VOIZ
## 120 pages + composants

```
yo-voisin/
├── app/
│   ├── (public)/                          # Routes publiques (sans auth)
│   │   ├── page.tsx                       # ✅ Landing page (EXISTANT)
│   │   ├── services/
│   │   │   ├── page.tsx                   # 📄 Liste tous les services
│   │   │   └── [slug]/
│   │   │       └── page.tsx               # 📄 Détail d'une catégorie
│   │   ├── prestataires/
│   │   │   ├── page.tsx                   # 📄 Annuaire prestataires
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 📄 Profil public prestataire
│   │   ├── comment-ca-marche/
│   │   │   └── page.tsx                   # 📄 Tutoriel
│   │   ├── tarifs/
│   │   │   └── page.tsx                   # 📄 Grille tarifaire
│   │   ├── zones/
│   │   │   └── page.tsx                   # 📄 Carte des communes
│   │   ├── devenir-prestataire/
│   │   │   └── page.tsx                   # 📄 Landing recrutement
│   │   ├── temoignages/
│   │   │   └── page.tsx                   # 📄 Success stories
│   │   ├── blog/
│   │   │   ├── page.tsx                   # 📄 Liste articles
│   │   │   └── [slug]/
│   │   │       └── page.tsx               # 📄 Article
│   │   ├── guides/
│   │   │   ├── page.tsx                   # 📄 Liste guides
│   │   │   └── [slug]/
│   │   │       └── page.tsx               # 📄 Guide détaillé
│   │   ├── a-propos/
│   │   │   └── page.tsx                   # 📄 À propos
│   │   ├── contact/
│   │   │   └── page.tsx                   # 📄 Formulaire contact
│   │   ├── faq/
│   │   │   └── page.tsx                   # 📄 FAQ
│   │   ├── presse/
│   │   │   └── page.tsx                   # 📄 Revue de presse
│   │   ├── stats/
│   │   │   └── page.tsx                   # 📄 Stats publiques
│   │   ├── conditions-generales/
│   │   │   └── page.tsx                   # 📄 CGU/CGV
│   │   ├── confidentialite/
│   │   │   └── page.tsx                   # 📄 Politique confidentialité
│   │   └── mentions-legales/
│   │       └── page.tsx                   # 📄 Mentions légales
│   │
│   ├── auth/                              # Authentification
│   │   ├── connexion/
│   │   │   └── page.tsx                   # ✅ Login (EXISTANT)
│   │   ├── inscription/
│   │   │   └── page.tsx                   # ✅ Signup (EXISTANT)
│   │   ├── mot-de-passe-oublie/
│   │   │   └── page.tsx                   # ✅ Forgot password (EXISTANT)
│   │   ├── reset-password/
│   │   │   └── page.tsx                   # ✅ Reset password (EXISTANT)
│   │   └── verify-email/
│   │       └── page.tsx                   # ✅ Email verification (EXISTANT)
│   │
│   ├── verification/                      # Vérification identité
│   │   ├── piece-identite/
│   │   │   └── page.tsx                   # 📄 Upload CNI/Passeport
│   │   ├── selfie/
│   │   │   └── page.tsx                   # 📄 Photo selfie
│   │   └── adresse/
│   │       └── page.tsx                   # 📄 Justificatif domicile
│   │
│   ├── client/                            # Espace Client
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # 📄 Dashboard client
│   │   ├── nouvelle-demande/
│   │   │   └── page.tsx                   # 📄 Créer demande
│   │   ├── demande-express/
│   │   │   └── page.tsx                   # 📄 Demande urgente
│   │   ├── mes-demandes/
│   │   │   ├── page.tsx                   # 📄 Liste demandes
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 📄 Détail demande
│   │   ├── recherche/
│   │   │   └── page.tsx                   # 📄 Recherche avancée
│   │   ├── comparer/
│   │   │   └── page.tsx                   # 📄 Comparer prestataires
│   │   ├── reserver/
│   │   │   └── [prestataireId]/
│   │   │       └── page.tsx               # 📄 Réserver prestataire
│   │   ├── profil/
│   │   │   └── page.tsx                   # 📄 Mon profil (édition)
│   │   ├── favoris/
│   │   │   └── page.tsx                   # 📄 Mes favoris
│   │   ├── historique/
│   │   │   └── page.tsx                   # 📄 Historique missions
│   │   ├── paiements/
│   │   │   └── page.tsx                   # 📄 Moyens paiement
│   │   ├── points-fidelite/
│   │   │   └── page.tsx                   # 📄 Programme fidélité
│   │   ├── parrainer/
│   │   │   └── page.tsx                   # 📄 Parrainage
│   │   ├── alertes/
│   │   │   └── page.tsx                   # 📄 Créer alertes
│   │   ├── recherches-sauvegardees/
│   │   │   └── page.tsx                   # 📄 Recherches sauvegardées
│   │   ├── parametres/
│   │   │   └── page.tsx                   # 📄 Paramètres compte
│   │   └── mes-donnees/
│   │       └── page.tsx                   # 📄 Export données RGPD
│   │
│   ├── prestataire/                       # Espace Prestataire
│   │   ├── onboarding/
│   │   │   └── page.tsx                   # 📄 Tunnel inscription pro
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # 📄 Dashboard prestataire
│   │   ├── missions/
│   │   │   ├── page.tsx                   # 📄 Toutes missions
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 📄 Détail mission
│   │   ├── demandes-recues/
│   │   │   └── page.tsx                   # 📄 Nouvelles demandes
│   │   ├── calendrier/
│   │   │   └── page.tsx                   # 📄 Planning
│   │   ├── mon-profil-public/
│   │   │   └── page.tsx                   # 📄 Aperçu profil public
│   │   ├── modifier-profil/
│   │   │   └── page.tsx                   # 📄 Édition profil pro
│   │   ├── portfolio/
│   │   │   └── page.tsx                   # 📄 Galerie photos
│   │   ├── certifications/
│   │   │   └── page.tsx                   # 📄 Documents & certifs
│   │   ├── revenus/
│   │   │   └── page.tsx                   # 📄 Dashboard revenus
│   │   ├── paiements/
│   │   │   └── page.tsx                   # 📄 Historique paiements
│   │   ├── retrait/
│   │   │   └── page.tsx                   # 📄 Demander retrait
│   │   ├── statistiques/
│   │   │   └── page.tsx                   # 📄 Stats détaillées
│   │   ├── avis/
│   │   │   └── page.tsx                   # 📄 Gérer avis
│   │   ├── facturation/
│   │   │   └── page.tsx                   # 📄 Générer factures
│   │   ├── devis/
│   │   │   └── page.tsx                   # 📄 Créer devis
│   │   ├── performance/
│   │   │   └── page.tsx                   # 📄 Indicateurs perfs
│   │   ├── concurrence/
│   │   │   └── page.tsx                   # 📄 Analyse concurrence
│   │   ├── insights/
│   │   │   └── page.tsx                   # 📄 Conseils amélioration
│   │   ├── demandes-perdues/
│   │   │   └── page.tsx                   # 📄 Demandes refusées
│   │   ├── formation/
│   │   │   └── page.tsx                   # 📄 Ressources & tutos
│   │   └── premium/
│   │       └── page.tsx                   # 📄 Abonnement pro
│   │
│   ├── messages/                          # Messagerie
│   │   ├── page.tsx                       # 📄 Liste conversations
│   │   └── [conversationId]/
│   │       └── page.tsx                   # 📄 Chat en temps réel
│   │
│   ├── notifications/
│   │   └── page.tsx                       # 📄 Centre notifications
│   │
│   ├── paiement/                          # Paiement
│   │   ├── [missionId]/
│   │   │   └── page.tsx                   # 📄 Page paiement
│   │   ├── succes/
│   │   │   └── page.tsx                   # 📄 Paiement réussi
│   │   └── echec/
│   │       └── page.tsx                   # 📄 Paiement échoué
│   │
│   ├── evaluer/                           # Évaluations
│   │   └── [missionId]/
│   │       └── page.tsx                   # 📄 Évaluer prestataire
│   │
│   ├── litige/                            # Litiges
│   │   ├── creer/
│   │   │   └── page.tsx                   # 📄 Ouvrir litige
│   │   └── [id]/
│   │       └── page.tsx                   # 📄 Suivi litige
│   │
│   ├── assurance/
│   │   └── page.tsx                       # 📄 Info assurance
│   │
│   ├── garantie/
│   │   └── page.tsx                       # 📄 Yo! Voiz Garantie
│   │
│   ├── promotions/
│   │   └── page.tsx                       # 📄 Offres en cours
│   │
│   ├── support/
│   │   └── page.tsx                       # 📄 Centre d'aide
│   │
│   ├── admin/                             # Back-office Admin
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # 📄 Dashboard admin
│   │   ├── utilisateurs/
│   │   │   ├── page.tsx                   # 📄 Liste utilisateurs
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 📄 Détail utilisateur
│   │   ├── validations-en-attente/
│   │   │   └── page.tsx                   # 📄 Valider profils
│   │   ├── missions/
│   │   │   ├── page.tsx                   # 📄 Toutes missions
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 📄 Détail mission
│   │   ├── litiges/
│   │   │   ├── page.tsx                   # 📄 Gestion litiges
│   │   │   └── [id]/
│   │   │       └── page.tsx               # 📄 Résoudre litige
│   │   ├── categories/
│   │   │   └── page.tsx                   # 📄 Gérer catégories
│   │   ├── communes/
│   │   │   └── page.tsx                   # 📄 Gérer communes
│   │   ├── contenus/
│   │   │   └── page.tsx                   # 📄 Éditer pages CMS
│   │   ├── signalements/
│   │   │   └── page.tsx                   # 📄 Gérer signalements
│   │   ├── avis-moderation/
│   │   │   └── page.tsx                   # 📄 Modérer avis
│   │   ├── finances/
│   │   │   └── page.tsx                   # 📄 Vue finances
│   │   ├── transactions/
│   │   │   └── page.tsx                   # 📄 Historique transactions
│   │   ├── retraits/
│   │   │   └── page.tsx                   # 📄 Valider retraits
│   │   ├── statistiques/
│   │   │   └── page.tsx                   # 📄 Stats avancées
│   │   ├── rapports/
│   │   │   └── page.tsx                   # 📄 Générer rapports
│   │   ├── audit-log/
│   │   │   └── page.tsx                   # 📄 Logs audit
│   │   ├── marketplace-health/
│   │   │   └── page.tsx                   # 📄 Santé marketplace
│   │   ├── fraud-detection/
│   │   │   └── page.tsx                   # 📄 Détection fraudes
│   │   ├── ab-tests/
│   │   │   └── page.tsx                   # 📄 A/B tests
│   │   ├── emails/
│   │   │   └── page.tsx                   # 📄 Templates emails
│   │   ├── sms/
│   │   │   └── page.tsx                   # 📄 Templates SMS
│   │   ├── banniere/
│   │   │   └── page.tsx                   # 📄 Gérer banners
│   │   ├── codes-promo/
│   │   │   └── page.tsx                   # 📄 Gérer codes promo
│   │   └── logs-securite/
│   │       └── page.tsx                   # 📄 Logs sécurité
│   │
│   ├── api/                               # Routes API
│   │   ├── auth/
│   │   │   ├── check-duplicate/
│   │   │   │   └── route.ts               # ✅ Vérif doublons (EXISTANT)
│   │   │   └── resend-verification/
│   │   │       └── route.ts               # ✅ Renvoyer email (EXISTANT)
│   │   ├── otp/
│   │   │   ├── send/
│   │   │   │   └── route.ts               # ✅ Envoyer OTP (EXISTANT)
│   │   │   └── verify/
│   │   │       └── route.ts               # ✅ Vérifier OTP (EXISTANT)
│   │   ├── missions/
│   │   │   ├── route.ts                   # 🔧 CRUD missions
│   │   │   ├── [id]/
│   │   │   │   └── route.ts               # 🔧 Mission spécifique
│   │   │   └── search/
│   │   │       └── route.ts               # 🔧 Recherche missions
│   │   ├── offers/
│   │   │   └── route.ts                   # 🔧 CRUD offres
│   │   ├── payments/
│   │   │   ├── create/
│   │   │   │   └── route.ts               # 🔧 Créer paiement
│   │   │   ├── verify/
│   │   │   │   └── route.ts               # 🔧 Vérifier paiement
│   │   │   └── webhook/
│   │   │       └── route.ts               # 🔧 Webhook Mobile Money
│   │   ├── reviews/
│   │   │   └── route.ts                   # 🔧 CRUD avis
│   │   ├── messages/
│   │   │   ├── route.ts                   # 🔧 CRUD messages
│   │   │   └── moderate/
│   │   │       └── route.ts               # 🔧 Modération auto
│   │   ├── notifications/
│   │   │   └── route.ts                   # 🔧 Push notifications
│   │   ├── upload/
│   │   │   └── route.ts                   # 🔧 Upload fichiers
│   │   ├── disputes/
│   │   │   └── route.ts                   # 🔧 Gérer litiges
│   │   ├── favorites/
│   │   │   └── route.ts                   # 🔧 Favoris
│   │   ├── promo-codes/
│   │   │   ├── validate/
│   │   │   │   └── route.ts               # 🔧 Valider code
│   │   │   └── apply/
│   │   │       └── route.ts               # 🔧 Appliquer réduction
│   │   ├── loyalty/
│   │   │   └── route.ts                   # 🔧 Points fidélité
│   │   ├── analytics/
│   │   │   └── route.ts                   # 🔧 Tracking événements
│   │   └── admin/
│   │       ├── users/
│   │       │   └── route.ts               # 🔧 Gestion users
│   │       ├── moderate/
│   │       │   └── route.ts               # 🔧 Modération
│   │       └── stats/
│   │           └── route.ts               # 🔧 Stats globales
│   │
│   ├── layout.tsx                         # ✅ Layout racine (EXISTANT)
│   ├── globals.css                        # ✅ Styles globaux (EXISTANT)
│   └── middleware.ts                      # ✅ Protection routes (EXISTANT)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                     # ✅ Navbar (EXISTANT)
│   │   ├── Footer.tsx                     # 🔧 Footer
│   │   ├── Sidebar.tsx                    # 🔧 Sidebar dashboards
│   │   └── MobileNav.tsx                  # 🔧 Navigation mobile
│   │
│   ├── ui/                                # Composants UI de base
│   │   ├── Button.tsx                     # ✅ (EXISTANT)
│   │   ├── Input.tsx                      # ✅ (EXISTANT)
│   │   ├── Card.tsx                       # ✅ (EXISTANT)
│   │   ├── Badge.tsx                      # ✅ (EXISTANT)
│   │   ├── Avatar.tsx                     # ✅ (EXISTANT)
│   │   ├── Modal.tsx                      # 🔧 Modal générique
│   │   ├── Dropdown.tsx                   # 🔧 Dropdown
│   │   ├── Tabs.tsx                       # 🔧 Onglets
│   │   ├── Accordion.tsx                  # 🔧 Accordéon
│   │   ├── Tooltip.tsx                    # 🔧 Tooltip
│   │   ├── Alert.tsx                      # 🔧 Alertes
│   │   ├── Toast.tsx                      # 🔧 Notifications toast
│   │   ├── Spinner.tsx                    # 🔧 Loading
│   │   ├── Progress.tsx                   # 🔧 Barre progression
│   │   ├── Select.tsx                     # 🔧 Select
│   │   ├── Checkbox.tsx                   # 🔧 Checkbox
│   │   ├── Radio.tsx                      # 🔧 Radio
│   │   ├── Switch.tsx                     # 🔧 Toggle switch
│   │   ├── Textarea.tsx                   # 🔧 Textarea
│   │   ├── DatePicker.tsx                 # 🔧 Calendrier
│   │   ├── TimePicker.tsx                 # 🔧 Sélecteur heure
│   │   ├── FileUpload.tsx                 # 🔧 Upload fichier
│   │   ├── Rating.tsx                     # 🔧 Étoiles notation
│   │   ├── Pagination.tsx                 # 🔧 Pagination
│   │   └── EmptyState.tsx                 # 🔧 État vide
│   │
│   ├── auth/
│   │   ├── VerifyPhone.tsx                # ✅ (EXISTANT)
│   │   ├── VerificationBanner.tsx         # ✅ (EXISTANT)
│   │   └── signup-steps/                  # ✅ (EXISTANT)
│   │       ├── Step1Type.tsx
│   │       ├── Step2Infos.tsx
│   │       ├── Step2_5VerifyPhone.tsx
│   │       ├── Step3Localisation.tsx
│   │       ├── Step4Verification.tsx
│   │       └── Step5Bienvenue.tsx
│   │
│   ├── missions/
│   │   ├── MissionCard.tsx                # 🔧 Carte mission
│   │   ├── MissionList.tsx                # 🔧 Liste missions
│   │   ├── MissionFilters.tsx             # 🔧 Filtres recherche
│   │   ├── MissionDetails.tsx             # 🔧 Détails mission
│   │   ├── CreateMissionForm.tsx          # 🔧 Formulaire création
│   │   └── MissionTimeline.tsx            # 🔧 Timeline mission
│   │
│   ├── providers/
│   │   ├── ProviderCard.tsx               # 🔧 Carte prestataire
│   │   ├── ProviderList.tsx               # 🔧 Liste prestataires
│   │   ├── ProviderProfile.tsx            # 🔧 Profil complet
│   │   ├── ProviderSearch.tsx             # 🔧 Recherche
│   │   └── ProviderComparison.tsx         # 🔧 Comparateur
│   │
│   ├── reviews/
│   │   ├── ReviewCard.tsx                 # 🔧 Carte avis
│   │   ├── ReviewForm.tsx                 # 🔧 Formulaire avis
│   │   ├── ReviewStats.tsx                # 🔧 Stats notes
│   │   └── RatingDisplay.tsx              # 🔧 Affichage notes
│   │
│   ├── chat/
│   │   ├── ChatBox.tsx                    # 🔧 Boîte chat
│   │   ├── MessageBubble.tsx              # 🔧 Bulle message
│   │   ├── ChatInput.tsx                  # 🔧 Input message
│   │   └── ConversationList.tsx           # 🔧 Liste conversations
│   │
│   ├── payments/
│   │   ├── PaymentForm.tsx                # 🔧 Formulaire paiement
│   │   ├── MobileMoneySelector.tsx        # 🔧 Choix opérateur
│   │   └── PaymentReceipt.tsx             # 🔧 Reçu
│   │
│   ├── admin/
│   │   ├── StatsCard.tsx                  # 🔧 Carte statistique
│   │   ├── Chart.tsx                      # 🔧 Graphiques
│   │   ├── DataTable.tsx                  # 🔧 Tableau données
│   │   └── ModerationPanel.tsx            # 🔧 Panel modération
│   │
│   ├── dashboard/
│   │   ├── DashboardCard.tsx              # 🔧 Carte dashboard
│   │   ├── QuickActions.tsx               # 🔧 Actions rapides
│   │   └── RecentActivity.tsx             # 🔧 Activité récente
│   │
│   └── features/
│       ├── Map.tsx                        # 🔧 Carte interactive
│       ├── SearchBar.tsx                  # 🔧 Barre recherche
│       ├── NotificationBell.tsx           # 🔧 Cloche notifications
│       ├── UserMenu.tsx                   # 🔧 Menu utilisateur
│       └── LiveIndicator.tsx              # 🔧 Indicateur temps réel
│
├── lib/
│   ├── supabase.ts                        # ✅ (EXISTANT)
│   ├── supabase-server.ts                 # ✅ (EXISTANT)
│   ├── otp.ts                             # ✅ (EXISTANT)
│   ├── utils.ts                           # ✅ (EXISTANT)
│   ├── constants.ts                       # ✅ (EXISTANT)
│   ├── types.ts                           # ✅ (EXISTANT)
│   ├── api-client.ts                      # 🔧 Client API
│   ├── mobile-money.ts                    # 🔧 Intégration Mobile Money
│   ├── notifications.ts                   # 🔧 Push notifications
│   ├── analytics.ts                       # 🔧 Google Analytics
│   ├── seo.ts                             # 🔧 Helpers SEO
│   ├── validation.ts                      # 🔧 Schémas validation
│   ├── formatting.ts                      # 🔧 Format nombres/dates
│   └── security.ts                        # 🔧 Helpers sécurité
│
├── contexts/
│   ├── AuthContext.tsx                    # ✅ (EXISTANT)
│   ├── NotificationContext.tsx            # 🔧 Notifications temps réel
│   ├── ChatContext.tsx                    # 🔧 Messagerie
│   └── ThemeContext.tsx                   # 🔧 Thème (mode sombre)
│
├── hooks/
│   ├── useAuth.ts                         # ✅ Hook auth
│   ├── useMissions.ts                     # 🔧 Hook missions
│   ├── useMessages.ts                     # 🔧 Hook messages
│   ├── useNotifications.ts                # 🔧 Hook notifications
│   ├── usePayments.ts                     # 🔧 Hook paiements
│   ├── useGeolocation.ts                  # 🔧 Hook géoloc
│   └── useDebounce.ts                     # 🔧 Hook debounce
│
├── public/
│   ├── images/                            # Images statiques
│   ├── icons/                             # Icônes
│   ├── og-image.png                       # Open Graph image
│   ├── favicon.ico                        # ✅ Favicon
│   ├── manifest.json                      # 🔧 PWA manifest
│   ├── sw.js                              # 🔧 Service Worker
│   └── robots.txt                         # 🔧 SEO
│
├── supabase/
│   ├── schema.sql                         # ✅ Schéma existant
│   ├── schema-complete.sql                # ✅ NOUVEAU schéma complet
│   ├── migrations/                        # Migrations
│   └── seed.sql                           # Données de test
│
├── .env.local                             # ✅ Variables d'environnement
├── next.config.mjs                        # ✅ Config Next.js
├── tailwind.config.ts                     # ✅ Config Tailwind
├── tsconfig.json                          # ✅ Config TypeScript
└── package.json                           # ✅ Dépendances

```

## 📊 RÉCAPITULATIF

| Catégorie | Nombre | Statut |
|-----------|--------|--------|
| **Pages publiques** | 18 | 1 ✅ / 17 🔧 |
| **Auth & Vérification** | 8 | 5 ✅ / 3 🔧 |
| **Client** | 14 | 0 ✅ / 14 🔧 |
| **Prestataire** | 19 | 0 ✅ / 19 🔧 |
| **Messages & Notifs** | 3 | 0 ✅ / 3 🔧 |
| **Paiement** | 3 | 0 ✅ / 3 🔧 |
| **Évaluation** | 1 | 0 ✅ / 1 🔧 |
| **Litige** | 2 | 0 ✅ / 2 🔧 |
| **Assurance/Garantie** | 2 | 0 ✅ / 2 🔧 |
| **Support** | 1 | 0 ✅ / 1 🔧 |
| **Admin** | 21 | 0 ✅ / 21 🔧 |
| **Routes API** | 25+ | 4 ✅ / 21+ 🔧 |
| **Composants** | 60+ | 7 ✅ / 53+ 🔧 |
| **TOTAL** | **~120 pages** | **17 ✅ / 103 🔧** |

**Légende :**
- ✅ Existant et fonctionnel
- 🔧 À développer

