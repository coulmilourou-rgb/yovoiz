# 📖 Guide de Terminologie Yo!Voiz

## Vocabulaire standardisé

### 👤 Côté Demandeur (Client)
| Terme | Usage | Exemples |
|-------|-------|----------|
| **Demande** | Publication d'un besoin | "Publier une demande", "Ma demande", "Toutes les demandes" |
| **Prestation** | Service reçu | "Prestation terminée", "Valider la prestation" |
| **Prestataire** | Personne qui répond | "Choisir un prestataire", "Contacter le prestataire" |

### 👨‍🔧 Côté Prestataire (Provider)
| Terme | Usage | Exemples |
|-------|-------|----------|
| **Offre** | Service proposé | "Mes offres", "Créer une offre", "Offre active" |
| **Demande** | Besoin client (vue externe) | "Répondre à une demande", "Demandes disponibles" |
| **Client** | Personne qui demande | "Contact client", "Client satisfait" |

### 🔄 Termes neutres (les deux côtés)
| Terme | Usage | Contexte |
|-------|-------|----------|
| **Service** | Prestation générique | "Service de plomberie", "Rechercher un service" |
| **Mission** | ❌ **À ÉVITER** | Ancien terme remplacé par "Demande" |
| **Profil** | Compte utilisateur | "Mon profil", "Profil vérifié" |
| **Abonnement** | Plan Premium | "Mon abonnement", "Passer Premium" |

---

## 📍 Mapping par page

### Pages Demandeur
- `/missions/nouvelle` → **"Publier une demande de service"**
- `/missions` → **"Toutes les demandes"**
- `/home` (feed) → **"Services près de chez vous"** (demandes des autres)

### Pages Prestataire
- `/services/nouvelle-offre` → **"Créer une offre de service"**
- `/services/mes-offres` → **"Mes offres de services"**
- `/offreurs` → **"Prestataires de services"**

### Pages Mixtes
- `/abonnement` → "Plans Premium"
- `/messages` → "Messagerie"
- `/home` → Feed personnalisé (demandes locales)

---

## 🎯 Règles de rédaction

### ✅ Bonnes pratiques
1. **Côté demandeur** :
   - ✅ "Je publie **une demande**"
   - ✅ "J'ai reçu **3 réponses**"
   - ✅ "Choisir **un prestataire**"

2. **Côté prestataire** :
   - ✅ "Je crée **une offre**"
   - ✅ "J'ai reçu **5 demandes**"
   - ✅ "Répondre **au client**"

3. **Boutons d'action** :
   - ✅ "Publier ma demande" (demandeur)
   - ✅ "Créer mon offre" (prestataire)
   - ✅ "Contacter" (les deux)

### ❌ À éviter
- ❌ "Ma mission" → ✅ "Ma demande"
- ❌ "Poster une mission" → ✅ "Publier une demande"
- ❌ "Mission terminée" → ✅ "Prestation terminée"

---

## 🗂️ États et statuts

### Demande (missions table)
```typescript
'draft'           → Brouillon
'published'       → Publiée
'offers_received' → Réponses reçues
'accepted'        → Prestataire choisi
'in_progress'     → En cours
'completed'       → Terminée
'validated'       → Validée
'cancelled'       → Annulée
'disputed'        → Litige
```

### Offre (service_offers table)
```typescript
'active'    → Active
'inactive'  → Inactive
'pending'   → En attente validation
'rejected'  → Rejetée
```

---

## 🎨 Ton et voix

### Général
- **Tutoiement** : "Publie ta demande", "Ton profil"
- **Amical mais pro** : "✨ Super !", "🎉 C'est parti !"
- **Concis et clair** : Phrases courtes, verbes d'action

### Exemples de messages
- ✅ "Demande publiée avec succès !"
- ✅ "3 prestataires disponibles dans ta zone"
- ✅ "Offre activée - Tu es maintenant visible"
- ✅ "Client satisfait - +5 ⭐"

---

## 📱 Notifications

### Demandeur
- "📢 **Nouvelle réponse** à ta demande 'Plomberie urgente'"
- "✅ Prestation **validée** - Note ton prestataire"
- "⏰ **Rappel** : Valide ta prestation avant 48h"

### Prestataire
- "🔔 **Nouvelle demande** dans ta zone : Yopougon"
- "🎉 **Demande acceptée** - Contact le client"
- "💰 **Paiement reçu** : 15 000 FCFA"

---

## 🔍 SEO & Marketing

### Mots-clés principaux
- "services à domicile Abidjan"
- "trouver un prestataire Côte d'Ivoire"
- "demande de service rapide"
- "offres de services locaux"

### Pages meta descriptions
- **Home** : "Trouve des services à domicile près de chez toi à Abidjan. Publie ta demande et reçois des réponses en minutes."
- **Offreurs** : "Découvre les meilleurs prestataires de services à Abidjan. Plombiers, électriciens, ménage et plus."
- **Abonnement** : "Passe Premium pour booster ton activité. Plus de visibilité, plus de clients."

---

## ✏️ Checklist avant publication

Avant de publier une nouvelle page/feature, vérifier :

- [ ] Vocabulaire cohérent (Demande/Offre)
- [ ] Tutoiement partout
- [ ] Emojis appropriés (pas trop)
- [ ] Messages d'erreur clairs
- [ ] Confirmations positives
- [ ] Pas de "Mission" (sauf code backend)

---

**Dernière mise à jour** : 2026-02-13  
**Version** : 1.0
