# 💬 Système de Négociation - Guide Utilisateur

## Vue d'ensemble

Le système de négociation Yo!Voiz permet aux clients et prestataires de négocier le prix d'une demande de service de manière transparente et sécurisée.

---

## 🎯 Principes clés

### ✅ Règles de fonctionnement

- **Maximum 10 tours** de négociation par demande
- **Expiration automatique** après 72h sans réponse
- **Alternance obligatoire** : on ne peut pas accepter sa propre proposition
- **Montants valides** : entre 500 et 1 000 000 FCFA
- **Paiement bloqué** dès acceptation (escrow)

---

## 📋 Flow complet

### 1️⃣ **Prestataire envoie un devis**

**Page** : `/missions/[id]`

Le prestataire consulte une demande et clique sur "Proposer un devis" :

```typescript
// Exemple: Proposition initiale à 15 000 FCFA
{
  missionId: 'abc123',
  clientId: 'user1',
  providerId: 'user2',
  initialAmount: 15000,
  message: "Je peux faire ce travail en 2 jours avec matériel inclus"
}
```

**Résultat** : Négociation créée avec statut `pending`, le client a 72h pour répondre.

---

### 2️⃣ **Client reçoit la notification**

Le client voit la proposition dans :
- Dashboard > Onglet "Négociations"
- Notification en temps réel (à implémenter)

**Indicateur visuel** : Badge "🔔 À votre tour de répondre !"

---

### 3️⃣ **Client répond**

**Page** : `/negotiations/[id]`

Le client a 3 choix :

#### ✅ Accepter
```typescript
await acceptProposal({
  negotiationId: 'nego123',
  userId: 'user1'
});
// → Status 'accepted', paiement escrow bloqué, mission assigned
```

#### 🔄 Négocier (contre-proposition)
```typescript
await counterProposal({
  negotiationId: 'nego123',
  newAmount: 12000,
  message: "Mon budget est plutôt 12 000 FCFA, possible ?",
  userId: 'user1'
});
// → Round +1, status 'countered', expire dans 72h
```

#### ❌ Refuser
```typescript
await rejectProposal({
  negotiationId: 'nego123',
  userId: 'user1',
  reason: "Budget trop élevé pour ce service"
});
// → Status 'rejected', négociation terminée
```

---

### 4️⃣ **Prestataire répond à la contre-offre**

C'est maintenant le tour du prestataire :

```typescript
// Accepter la contre-offre du client
await acceptProposal({
  negotiationId: 'nego123',
  userId: 'user2'
});

// OU faire une nouvelle contre-proposition
await counterProposal({
  negotiationId: 'nego123',
  newAmount: 13000,
  message: "Je peux faire 13 000 FCFA, dernier prix",
  userId: 'user2'
});
```

---

### 5️⃣ **Boucle jusqu'à acceptation/refus**

Le cycle continue jusqu'à :
- ✅ **Acceptation** → Paiement bloqué, mission assignée
- ❌ **Refus** → Négociation terminée, aucune transaction
- ⏰ **Expiration** → 72h sans réponse, status `expired`
- 🔢 **Limite atteinte** → 10 tours max, forcer acceptation/refus

---

## 🛡️ Validations et sécurité

### ✅ Checks côté client (UI)

```typescript
// Dans NegotiationActions.tsx
const isMyTurn = (
  (nego.current_proposer === 'provider' && isClient) ||
  (nego.current_proposer === 'client' && !isClient)
);

if (!isMyTurn) {
  // Désactiver tous les boutons
}
```

### 🔒 Checks côté serveur (lib/negotiations.ts)

```typescript
// Vérifier alternance
const isReceiver = (
  (nego.current_proposer === 'client' && userId === nego.provider_id) ||
  (nego.current_proposer === 'provider' && userId === nego.client_id)
);

if (!isReceiver) {
  throw new Error('Ce n\'est pas votre tour');
}

// Vérifier montant
if (newAmount < 500 || newAmount > 1000000) {
  throw new Error('Montant invalide');
}

// Vérifier limite rounds
if (nego.round_count >= nego.max_rounds) {
  throw new Error('Limite de 10 rounds atteinte');
}

// Vérifier expiration
if (new Date() > new Date(nego.expires_at)) {
  throw new Error('Cette proposition a expiré');
}
```

---

## 🎨 Composants UI

### 📊 NegotiationTimeline

**Fichier** : `components/negotiations/NegotiationTimeline.tsx`

Affiche l'historique des propositions avec :
- Avatar client (bleu) vs prestataire (vert)
- Montant + message + timestamp
- Indicateur "Vous" pour l'utilisateur connecté

```tsx
<NegotiationTimeline
  proposals={negotiation.proposals}
  clientName="Jean Dupont"
  providerName="Marie Kouassi"
  currentUserId={user.id}
  clientId={negotiation.client_id}
/>
```

### 🎛️ NegotiationActions

**Fichier** : `components/negotiations/NegotiationActions.tsx`

Affiche les boutons Accepter/Négocier/Refuser avec :
- État désactivé si pas mon tour
- Formulaire contre-proposition (montant + message)
- Formulaire refus (raison optionnelle)
- Validation en temps réel

```tsx
<NegotiationActions
  negotiation={negotiation}
  currentUserId={user.id}
  onSuccess={() => loadNegotiation()}
/>
```

### 💰 ProposeQuoteModal

**Fichier** : `components/missions/ProposeQuoteModal.tsx`

Modal pour initier une négociation depuis une mission :
- Input montant (500 - 1M FCFA)
- Textarea message (optionnel, 500 char max)
- Info-box règles

---

## 📁 Structure données

### Table `negotiations`

```sql
CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  proposals JSONB[] NOT NULL DEFAULT '{}', -- Array de propositions
  current_proposal_index INT NOT NULL DEFAULT 0,
  current_amount INT NOT NULL,
  current_proposer TEXT NOT NULL CHECK (current_proposer IN ('client', 'provider')),
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'expired')),
  round_count INT NOT NULL DEFAULT 1,
  max_rounds INT NOT NULL DEFAULT 10,
  
  expires_at TIMESTAMPTZ NOT NULL,
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ
);
```

### Objet `Proposal`

```typescript
interface Proposal {
  amount: number;
  proposer: 'client' | 'provider';
  message?: string;
  created_at: string;
  expires_at: string;
}

// Exemple
{
  amount: 15000,
  proposer: 'provider',
  message: "Je peux faire ce travail en 2 jours",
  created_at: '2026-02-13T10:30:00Z',
  expires_at: '2026-02-16T10:30:00Z'
}
```

---

## ⚙️ Edge Function - Expiration auto

**Fichier** : `supabase/functions/expire-negotiations/index.ts`

**Cron** : Toutes les heures (`0 * * * *`)

**Action** :
1. Chercher négociations avec `expires_at < NOW()` et `status IN ('pending', 'countered')`
2. Mettre à jour `status = 'expired'`
3. (TODO) Envoyer notifications aux deux parties

**Déploiement** :
```bash
supabase functions deploy expire-negotiations
```

**Test manuel** :
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/expire-negotiations \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
```

---

## 🎯 Conseils UX pour les utilisateurs

### Pour les **clients** :

✅ **À faire** :
- Proposer un budget réaliste dès le départ
- Expliquer vos contraintes (budget, délai)
- Répondre rapidement (< 24h si possible)
- Être respectueux dans les messages

❌ **À éviter** :
- Négocier à l'infini sans accepter
- Laisser expirer sans réponse
- Refuser sans donner de raison
- Proposer des montants dérisoires

### Pour les **prestataires** :

✅ **À faire** :
- Justifier votre tarif (expérience, matériel, délai)
- Être transparent sur ce qui est inclus
- Proposer des alternatives (ex: sans matériel = moins cher)
- Montrer votre professionnalisme

❌ **À éviter** :
- Proposer un prix gonflé pour négocier
- Accepter un montant trop bas (dévalorisant)
- Insister si le client refuse
- Ne pas expliquer vos contre-offres

---

## 🔮 Futures améliorations

- [ ] **Notifications push** : Email + SMS à chaque tour
- [ ] **Suggestions de prix** : IA basée sur historique
- [ ] **Mode "Best offer"** : Plusieurs prestataires enchérissent
- [ ] **Chat intégré** : Discuter en live pendant négociation
- [ ] **Propositions par paliers** : "13k, 14k ou 15k selon options"
- [ ] **Historique stats** : Taux d'acceptation, durée moyenne

---

## 📞 Support

Questions ? Consultez :
- [TERMINOLOGIE.md](./TERMINOLOGIE.md) - Clarifications vocab
- [SYSTEME-NEGOCIATION.md](./SYSTEME-NEGOCIATION.md) - Specs techniques
- Code source : `lib/negotiations.ts` + `components/negotiations/`

**Équipe Yo!Voiz** 🇨🇮
