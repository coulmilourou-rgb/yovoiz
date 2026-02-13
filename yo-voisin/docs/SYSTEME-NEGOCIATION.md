# 💰 Système de Négociation de Prix - Yo!Voiz

## Vue d'ensemble

Système de négociation permettant au client et au prestataire d'échanger des contre-propositions de prix jusqu'à accord final, avant le paiement.

---

## 🔄 Flow de négociation

```
1. Client publie DEMANDE avec budget indicatif (5K - 10K FCFA)
   ↓
2. Prestataire envoie DEVIS initial (8K FCFA)
   ↓
3. Client peut :
   - ✅ Accepter → Paiement
   - 💬 Négocier → Contre-proposition (7K FCFA)
   - ❌ Refuser → Fin
   ↓
4. Prestataire reçoit contre-proposition (7K FCFA)
   - ✅ Accepter → Paiement
   - 💬 Négocier → Nouvelle proposition (7.5K FCFA)
   - ❌ Refuser → Fin
   ↓
5. Cycles jusqu'à accord OU abandon (max 10 rounds)
   ↓
6. Accord final → Paiement escrow bloqué
```

---

## 📊 Schema SQL - Table negotiations

```sql
CREATE TYPE negotiation_status AS ENUM (
  'pending',      -- En attente réponse
  'accepted',     -- Accepté, paiement en cours
  'rejected',     -- Rejeté définitivement
  'countered',    -- Contre-offre envoyée
  'expired'       -- Expiré (72h sans réponse)
);

CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Historique des propositions
  proposals JSONB[] NOT NULL DEFAULT '{}', -- Array d'objets proposition
  
  -- État actuel
  current_proposal_index INTEGER NOT NULL DEFAULT 0,
  current_amount NUMERIC NOT NULL,
  current_proposer TEXT NOT NULL CHECK (current_proposer IN ('client', 'provider')),
  status negotiation_status DEFAULT 'pending',
  
  -- Métadonnées
  round_count INTEGER DEFAULT 1,
  max_rounds INTEGER DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '72 hours',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX idx_negotiations_mission ON negotiations(mission_id);
CREATE INDEX idx_negotiations_offer ON negotiations(offer_id);
CREATE INDEX idx_negotiations_client ON negotiations(client_id);
CREATE INDEX idx_negotiations_provider ON negotiations(provider_id);
CREATE INDEX idx_negotiations_status ON negotiations(status);

-- RLS
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les deux parties lisent la négociation"
  ON negotiations FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Les deux parties mettent à jour la négociation"
  ON negotiations FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = provider_id)
  WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);
```

---

## 📝 Structure JSONB proposal

```json
{
  "amount": 7500,
  "proposer": "client",
  "message": "Pourriez-vous baisser un peu le prix ?",
  "created_at": "2026-02-13T10:30:00Z",
  "expires_at": "2026-02-16T10:30:00Z"
}
```

---

## 🎯 Fonctions TypeScript

### 1. Créer une négociation (prestataire envoie devis initial)

```typescript
// lib/negotiations.ts

export const createNegotiation = async (
  missionId: string,
  offerId: string,
  providerId: string,
  clientId: string,
  initialAmount: number,
  message: string
) => {
  const proposal = {
    amount: initialAmount,
    proposer: 'provider',
    message,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72h
  };

  const { data, error } = await supabase
    .from('negotiations')
    .insert({
      mission_id: missionId,
      offer_id: offerId,
      client_id: clientId,
      provider_id: providerId,
      proposals: [proposal],
      current_amount: initialAmount,
      current_proposer: 'provider',
      status: 'pending',
      round_count: 1
    })
    .select()
    .single();

  if (error) throw error;

  // Notifier le client
  await sendNotification(clientId, {
    type: 'new_proposal',
    title: 'Nouveau devis reçu',
    message: `${initialAmount.toLocaleString()} FCFA`,
    link: `/missions/${missionId}/negotiations/${data.id}`
  });

  return data;
};
```

### 2. Envoyer une contre-proposition

```typescript
export const counterProposal = async (
  negotiationId: string,
  newAmount: number,
  message: string,
  userId: string
) => {
  // Récupérer négociation actuelle
  const { data: nego } = await supabase
    .from('negotiations')
    .select('*')
    .eq('id', negotiationId)
    .single();

  if (!nego) throw new Error('Négociation introuvable');
  if (nego.status !== 'pending') throw new Error('Négociation déjà terminée');
  if (nego.round_count >= nego.max_rounds) throw new Error('Limite de rounds atteinte');

  // Déterminer qui propose
  const proposer = userId === nego.client_id ? 'client' : 'provider';
  const receiver = proposer === 'client' ? nego.provider_id : nego.client_id;

  // Nouvelle proposition
  const newProposal = {
    amount: newAmount,
    proposer,
    message,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
  };

  // Mettre à jour
  const { data, error } = await supabase
    .from('negotiations')
    .update({
      proposals: [...nego.proposals, newProposal],
      current_proposal_index: nego.proposals.length,
      current_amount: newAmount,
      current_proposer: proposer,
      status: 'countered',
      round_count: nego.round_count + 1,
      expires_at: newProposal.expires_at
    })
    .eq('id', negotiationId)
    .select()
    .single();

  if (error) throw error;

  // Notifier l'autre partie
  await sendNotification(receiver, {
    type: 'counter_proposal',
    title: 'Nouvelle contre-proposition',
    message: `${newAmount.toLocaleString()} FCFA`,
    link: `/negotiations/${negotiationId}`
  });

  return data;
};
```

### 3. Accepter une proposition

```typescript
export const acceptProposal = async (
  negotiationId: string,
  userId: string
) => {
  const { data: nego } = await supabase
    .from('negotiations')
    .select('*')
    .eq('id', negotiationId)
    .single();

  if (!nego) throw new Error('Négociation introuvable');

  // Vérifier que c'est bien le receveur qui accepte
  const isReceiver = (nego.current_proposer === 'client' && userId === nego.provider_id) ||
                     (nego.current_proposer === 'provider' && userId === nego.client_id);

  if (!isReceiver) throw new Error('Vous ne pouvez pas accepter votre propre proposition');

  // Accepter
  const { data, error } = await supabase
    .from('negotiations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString()
    })
    .eq('id', negotiationId)
    .select()
    .single();

  if (error) throw error;

  // Mettre à jour la mission avec le prix final
  await supabase
    .from('missions')
    .update({
      status: 'accepted',
      assigned_to: nego.provider_id,
      final_price: nego.current_amount
    })
    .eq('id', nego.mission_id);

  // Déclencher le paiement escrow
  await holdPayment(nego.mission_id, nego.current_amount);

  // Notifier l'autre partie
  const receiver = nego.current_proposer === 'client' ? nego.client_id : nego.provider_id;
  await sendNotification(receiver, {
    type: 'proposal_accepted',
    title: '🎉 Proposition acceptée !',
    message: `Accord conclu à ${nego.current_amount.toLocaleString()} FCFA`,
    link: `/missions/${nego.mission_id}`
  });

  return data;
};
```

### 4. Rejeter une proposition

```typescript
export const rejectProposal = async (
  negotiationId: string,
  userId: string,
  reason?: string
) => {
  const { data, error } = await supabase
    .from('negotiations')
    .update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejection_reason: reason
    })
    .eq('id', negotiationId)
    .select()
    .single();

  if (error) throw error;

  // Notifier l'autre partie
  const { data: nego } = data;
  const receiver = userId === nego.client_id ? nego.provider_id : nego.client_id;

  await sendNotification(receiver, {
    type: 'proposal_rejected',
    title: 'Proposition refusée',
    message: reason || 'Le prix ne convient pas',
    link: `/missions/${nego.mission_id}`
  });

  return data;
};
```

---

## 🎨 Interface Utilisateur

### Composant NegotiationTimeline

```typescript
// components/negotiations/NegotiationTimeline.tsx

interface Proposal {
  amount: number;
  proposer: 'client' | 'provider';
  message: string;
  created_at: string;
}

const NegotiationTimeline = ({ negotiation }: { negotiation: Negotiation }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Historique des propositions</h3>
      
      {negotiation.proposals.map((proposal, idx) => (
        <Card key={idx} className={`p-4 ${
          proposal.proposer === 'client' ? 'bg-blue-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar size="sm" />
              <span className="font-semibold">
                {proposal.proposer === 'client' ? 'Toi' : 'Prestataire'}
              </span>
            </div>
            <Badge className="text-lg font-bold">
              {proposal.amount.toLocaleString()} FCFA
            </Badge>
          </div>
          
          {proposal.message && (
            <p className="text-sm text-gray-600 mb-2">
              💬 "{proposal.message}"
            </p>
          )}
          
          <p className="text-xs text-gray-500">
            {getTimeAgo(proposal.created_at)}
          </p>
        </Card>
      ))}
    </div>
  );
};
```

### Composant NegotiationActions

```typescript
const NegotiationActions = ({ 
  negotiation, 
  userId, 
  onAccept, 
  onCounter, 
  onReject 
}: Props) => {
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [showCounter, setShowCounter] = useState(false);
  
  const isMyTurn = (
    (negotiation.current_proposer === 'client' && userId === negotiation.provider_id) ||
    (negotiation.current_proposer === 'provider' && userId === negotiation.client_id)
  );

  if (!isMyTurn) {
    return (
      <Card className="p-6 bg-gray-50">
        <p className="text-center text-gray-600">
          ⏳ En attente de la réponse de l'autre partie...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Proposition actuelle</h3>
        <Badge className="text-2xl font-bold bg-yo-orange text-white">
          {negotiation.current_amount.toLocaleString()} FCFA
        </Badge>
      </div>

      {!showCounter ? (
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={onAccept}
            className="bg-yo-green hover:bg-yo-green-dark"
          >
            ✅ Accepter
          </Button>
          
          <Button
            onClick={() => setShowCounter(true)}
            variant="secondary"
          >
            💬 Négocier
          </Button>
          
          <Button
            onClick={onReject}
            variant="secondary"
            className="text-red-600 hover:bg-red-50"
          >
            ❌ Refuser
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Votre contre-proposition (FCFA)
            </label>
            <Input
              type="number"
              value={counterAmount}
              onChange={(e) => setCounterAmount(e.target.value)}
              placeholder={negotiation.current_amount.toString()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Message (optionnel)
            </label>
            <textarea
              value={counterMessage}
              onChange={(e) => setCounterMessage(e.target.value)}
              placeholder="Expliquez votre proposition..."
              className="w-full px-4 py-3 rounded-lg border"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => onCounter(parseInt(counterAmount), counterMessage)}
              disabled={!counterAmount}
              className="flex-1"
            >
              Envoyer contre-proposition
            </Button>
            <Button
              onClick={() => setShowCounter(false)}
              variant="secondary"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
      
      {/* Limites */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-600">
        <span>Round {negotiation.round_count} / {negotiation.max_rounds}</span>
        <span>Expire dans {getTimeUntil(negotiation.expires_at)}</span>
      </div>
    </Card>
  );
};
```

---

## 📱 Pages à créer

### 1. `/missions/[id]/negotiations/[negotiationId]`
- Timeline des propositions
- Actions (Accepter/Négocier/Refuser)
- Détails mission
- Chat en temps réel (optionnel)

### 2. `/negotiations` (liste)
- Négociations en cours
- Négociations terminées
- Filtres (en attente/acceptées/refusées)

---

## 🔔 Notifications

### Types de notifications
1. **new_proposal** : "Nouveau devis reçu - 8000 FCFA"
2. **counter_proposal** : "Contre-proposition - 7500 FCFA"
3. **proposal_accepted** : "🎉 Accord conclu à 7500 FCFA"
4. **proposal_rejected** : "Proposition refusée"
5. **negotiation_expired** : "⏰ Négociation expirée après 72h"

---

## ⚙️ Règles métier

### Limites
- **Max rounds** : 10 échanges
- **Expiration** : 72h par proposition
- **Prix min** : 500 FCFA
- **Prix max** : 1 000 000 FCFA
- **Écart min** : 100 FCFA entre propositions

### Auto-expiration (Edge Function)
```typescript
// supabase/functions/expire-negotiations/index.ts

Deno.serve(async () => {
  const { data: expired } = await supabase
    .from('negotiations')
    .select('*')
    .eq('status', 'pending')
    .lt('expires_at', new Date().toISOString());

  for (const nego of expired) {
    await supabase
      .from('negotiations')
      .update({ status: 'expired' })
      .eq('id', nego.id);

    // Notifier les deux parties
    await sendNotification(nego.client_id, {
      type: 'negotiation_expired',
      message: 'Négociation expirée'
    });
    await sendNotification(nego.provider_id, {
      type: 'negotiation_expired',
      message: 'Négociation expirée'
    });
  }

  return new Response(JSON.stringify({ expired: expired.length }));
});
```

---

## 🚀 Ordre d'implémentation

### Phase 1 : Backend (2-3 jours)
1. ✅ Créer table `negotiations`
2. ✅ Fonctions CRUD TypeScript
3. ✅ RLS policies
4. ✅ Edge Function expiration

### Phase 2 : UI (2-3 jours)
1. ✅ Composant Timeline
2. ✅ Composant Actions
3. ✅ Page détail négociation
4. ✅ Page liste négociations

### Phase 3 : Intégration (1 jour)
1. ✅ Lier avec flow mission
2. ✅ Intégrer paiement escrow
3. ✅ Tests end-to-end

---

## 📊 Métriques à suivre

```sql
-- Taux d'accord
SELECT 
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) * 100.0 / COUNT(*) as acceptance_rate
FROM negotiations;

-- Nombre moyen de rounds avant accord
SELECT 
  AVG(round_count) as avg_rounds
FROM negotiations
WHERE status = 'accepted';

-- Durée moyenne de négociation
SELECT 
  AVG(EXTRACT(EPOCH FROM (accepted_at - created_at))/3600) as avg_hours
FROM negotiations
WHERE status = 'accepted';
```

---

**Ce système est-il conforme à votre vision ?** Voulez-vous que je commence l'implémentation ? 🎯
