# 👋 BIENVENUE SUR YO!VOIZ

**Plateforme de services de proximité en Côte d'Ivoire** 🇨🇮

---

## ⚡ DÉMARRAGE RAPIDE (5 MINUTES)

Vous voulez tester la plateforme rapidement ?

### 📋 **Étape 1 : Insérer des données de test**

Suivez le guide : **[QUICK-START.md](QUICK-START.md)**

En 5 minutes, vous aurez :
- ✅ 5 prestataires avec profils
- ✅ 8 offres de services
- ✅ 5 demandes publiées
- ✅ 3 conversations avec messages
- ✅ 2 propositions de services

### 🧪 **Étape 2 : Tester les fonctionnalités**

Connectez-vous avec : **`tamoil@test.com`**

Testez les pages :
- `/home` - Services près de chez vous
- `/missions` - Toutes les demandes
- `/offreurs` - Prestataires disponibles
- `/messages` - Messagerie
- `/profile/requests` - Mes demandes

---

## 📚 DOCUMENTATION COMPLÈTE

Toute la documentation est dans : **[INDEX-DOCUMENTATION.md](INDEX-DOCUMENTATION.md)**

### **Guides principaux** :

1. **[QUICK-START.md](QUICK-START.md)** - Démarrage en 5 min
2. **[GUIDE-COMPLET-NOTIFICATIONS-EMAIL.md](GUIDE-COMPLET-NOTIFICATIONS-EMAIL.md)** - Système email (44 notifications)
3. **[docs/SYSTEME-OFFRES-EMPLOI.md](yo-voisin/docs/SYSTEME-OFFRES-EMPLOI.md)** - Système carrières/recrutement
4. **[MOTEUR-RECHERCHE-ACTIF.md](MOTEUR-RECHERCHE-ACTIF.md)** - Moteur de recherche
5. **[docs/GUIDE-DONNEES-TEST.md](yo-voisin/docs/GUIDE-DONNEES-TEST.md)** - Données de test détaillées

---

## 🎯 FONCTIONNALITÉS PRINCIPALES

### **Pour les utilisateurs** :
- ✅ Publier une demande de service
- ✅ Rechercher des prestataires
- ✅ Recevoir des propositions
- ✅ Négocier les prix
- ✅ Messagerie intégrée
- ✅ Système d'avis et notes

### **Pour les prestataires** :
- ✅ Créer un profil professionnel
- ✅ Publier des offres de services
- ✅ Répondre aux demandes
- ✅ Abonnement Pro (fonctionnalités avancées)
- ✅ Tableau de bord Pro (devis, factures, clients)
- ✅ Gestion du périmètre d'intervention

### **Pour les admins** :
- ✅ Modération des demandes/offres
- ✅ Gestion des utilisateurs
- ✅ Gestion des offres d'emploi
- ✅ Statistiques de la plateforme

---

## 🗄️ BASE DE DONNÉES

### **Tables principales** :
- `profiles` - Profils utilisateurs
- `requests` - Demandes de services
- `service_offers` - Offres de prestataires
- `negotiations` - Propositions et négociations
- `conversations` + `messages` - Messagerie
- `reviews` - Avis et notes
- `job_offers` + `job_applications` - Carrières

### **Script SQL principal** :
```
yo-voisin/supabase/schema.sql
```

---

## 📧 SYSTÈME DE NOTIFICATIONS

44 types de notifications email automatiques via Brevo :

- Welcome email
- Demande validée
- Nouvelle proposition
- Nouveau message
- Paiement confirmé
- Abonnement Pro activé
- etc.

**Guide complet** : [GUIDE-COMPLET-NOTIFICATIONS-EMAIL.md](GUIDE-COMPLET-NOTIFICATIONS-EMAIL.md)

---

## 🏗️ STRUCTURE DU PROJET

```
yo-voisin/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── home/              # Services près de chez vous
│   ├── missions/          # Demandes de services
│   ├── offreurs/          # Prestataires
│   ├── messages/          # Messagerie
│   ├── carrieres/         # Offres d'emploi
│   ├── blog/              # Articles de blog
│   ├── admin/             # Back-office admin
│   └── ...
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires et helpers
├── contexts/              # Contextes React (Auth, etc.)
├── supabase/              # Migrations SQL
└── docs/                  # Documentation
```

---

## 🚀 COMMANDES UTILES

### **Développement** :
```powershell
cd "C:\Users\coulm\OneDrive\Desktop\YO VOIZ\yo-voisin"
npm run dev
```

### **Build** :
```powershell
npm run build
```

### **Déployer Edge Function** :
```powershell
npx supabase functions deploy send-email-notification --project-ref hfrmctsvpszqdizritoe
```

---

## 🔑 INFORMATIONS DE CONNEXION

### **Compte de test** :
- **Email** : `tamoil@test.com`
- **Rôle** : Admin + Provider Pro

### **Supabase** :
- **URL** : `https://hfrmctsvpszqdizritoe.supabase.co`
- **Dashboard** : [Lien direct](https://supabase.com/dashboard/project/hfrmctsvpszqdizritoe)

### **Brevo (Email)** :
- **API Key** : Configurée dans Supabase Secrets
- **Limite gratuite** : 300 emails/jour

---

## 📞 SUPPORT & AIDE

### **En cas de problème** :

1. Consultez l'index : **[INDEX-DOCUMENTATION.md](INDEX-DOCUMENTATION.md)**
2. Vérifiez les logs Supabase
3. Regardez la console navigateur (`F12`)
4. Consultez les corrections récentes : **[CORRECTIONS-SESSION-14-FEV-2026.md](CORRECTIONS-SESSION-14-FEV-2026.md)**

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ **Insérer les données de test** → [QUICK-START.md](QUICK-START.md)
2. ⏳ Tester toutes les fonctionnalités
3. ⏳ Configurer le domaine `yovoiz.ci`
4. ⏳ Configurer l'email `recrutement@yovoiz.ci`
5. ⏳ Intégrer le système de paiement (Wave, Orange Money)
6. ⏳ Finaliser le système email
7. ⏳ Tests utilisateurs réels

---

## 📊 ÉTAT DU PROJET

| Fonctionnalité | État |
|----------------|------|
| Inscription/Connexion | ✅ Fonctionnel |
| Profils utilisateurs | ✅ Fonctionnel |
| Demandes de services | ✅ Fonctionnel |
| Offres de services | ✅ Fonctionnel |
| Moteur de recherche | ✅ Fonctionnel |
| Messagerie | ✅ Fonctionnel |
| Négociations | ✅ Fonctionnel |
| Système Pro (devis/factures) | ✅ Fonctionnel |
| Notifications email | ⏳ Déployé (à tester) |
| Carrières/Recrutement | ✅ Prêt (migration à exécuter) |
| Paiements | ⏳ À configurer |
| Application mobile | ⏳ À venir |

---

## 🎉 PRÊT À COMMENCER ?

Suivez le **[QUICK-START.md](QUICK-START.md)** pour insérer les données de test et commencer à tester la plateforme !

**Bon développement avec Yo!Voiz !** 🚀🇨🇮
