# Spécifications Techniques - Nouvelles Fonctionnalités

## 1. 🌍 Géolocalisation Automatique

### Objectif
Détecter automatiquement la position de l'utilisateur (commune, quartier, latitude, longitude) lors de l'inscription et permettre la mise à jour ultérieure.

### API & Technologies
- **Browser Geolocation API** : `navigator.geolocation.getCurrentPosition()`
- **Reverse Geocoding** : 
  - Option 1: OpenStreetMap Nominatim (gratuit)
  - Option 2: Google Maps Geocoding API (payant mais précis)
  - Option 3: MapBox Geocoding API (10K requêtes/mois gratuit)

### Flow d'implémentation

#### A. Lors de l'inscription
```typescript
// Step 1: Demander permission géolocalisation
const requestLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Step 2: Reverse geocoding
        const location = await reverseGeocode(latitude, longitude);
        
        // Step 3: Pré-remplir formulaire
        setFormData({
          ...formData,
          commune: location.commune,
          quartier: location.quartier,
          latitude,
          longitude
        });
      },
      (error) => {
        console.error('Géolocalisation refusée:', error);
        // Fallback: sélection manuelle commune
      }
    );
  }
};
```

#### B. Reverse Geocoding avec Nominatim (Abidjan)
```typescript
const reverseGeocode = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
  );
  const data = await response.json();
  
  // Parser pour Abidjan
  return {
    commune: data.address.suburb || data.address.city_district || 'Non défini',
    quartier: data.address.neighbourhood || data.address.road || '',
    ville: data.address.city || 'Abidjan'
  };
};
```

#### C. Schema SQL - Ajout champs GPS
```sql
-- Déjà existant dans profiles, mais s'assurer que c'est bien rempli
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS latitude NUMERIC,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC,
  ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

#### D. Composant LocationPicker
```typescript
// components/forms/LocationPicker.tsx
- Bouton "Détecter ma position"
- Carte interactive (Leaflet ou Mapbox)
- Input manuel commune/quartier (fallback)
- Badge de précision (GPS précis / Manuel)
```

### Permissions & UX
1. **Demande permission** : "Yo!Voiz souhaite accéder à votre position pour trouver des services près de chez vous"
2. **Refus** : Sélection manuelle dans liste communes Abidjan (10 communes)
3. **Mise à jour** : Bouton dans Paramètres → "Mettre à jour ma position"

---

## 2. 📊 Système de Tracking Missions

### Objectif
Suivre l'état d'une mission en temps réel avec une timeline visible pour les 2 parties (demandeur + prestataire).

### États de mission (status)
```typescript
enum MissionStatus {
  PUBLISHED = 'published',          // Demande publiée, en attente candidatures
  CANDIDATES_REVIEW = 'review',     // Demandeur examine les candidats
  ACCEPTED = 'accepted',            // Prestataire choisi, deal conclu
  IN_PROGRESS = 'in_progress',      // Prestation en cours
  COMPLETED = 'completed',          // Prestataire a marqué "terminé"
  VALIDATED = 'validated',          // Client a validé la prestation
  PAID = 'paid',                    // Paiement effectué
  DISPUTED = 'disputed',            // Litige (optionnel)
  CANCELLED = 'cancelled'           // Annulée
}
```

### Schema SQL - Table mission_tracking
```sql
CREATE TABLE mission_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  status mission_status NOT NULL,
  actor_id UUID REFERENCES profiles(id), -- Qui a déclenché ce changement
  actor_role TEXT NOT NULL, -- 'client' ou 'provider'
  comment TEXT, -- Commentaire optionnel
  photo_urls TEXT[], -- Photos preuve (pour completed/validated)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mission_tracking_mission ON mission_tracking(mission_id);
CREATE INDEX idx_mission_tracking_created ON mission_tracking(created_at DESC);
```

### Flow Tracking

#### Étape 1: Deal conclu (ACCEPTED)
```typescript
// Quand demandeur choisit un candidat
const acceptCandidate = async (missionId: string, providerId: string) => {
  // 1. Mettre à jour mission
  await supabase
    .from('missions')
    .update({ 
      status: 'accepted',
      provider_id: providerId,
      accepted_at: new Date()
    })
    .eq('id', missionId);
  
  // 2. Créer entrée tracking
  await supabase
    .from('mission_tracking')
    .insert({
      mission_id: missionId,
      status: 'accepted',
      actor_id: clientId,
      actor_role: 'client',
      comment: `Candidature de ${providerName} acceptée`
    });
  
  // 3. Notifier prestataire
  await sendNotification(providerId, 'Votre candidature a été acceptée ! 🎉');
};
```

#### Étape 2: Démarrage prestation (IN_PROGRESS)
```typescript
// Bouton "Démarrer la prestation" (prestataire)
const startMission = async (missionId: string) => {
  await supabase
    .from('missions')
    .update({ 
      status: 'in_progress',
      started_at: new Date()
    })
    .eq('id', missionId);
  
  await supabase
    .from('mission_tracking')
    .insert({
      mission_id: missionId,
      status: 'in_progress',
      actor_id: providerId,
      actor_role: 'provider',
      comment: 'Prestation démarrée'
    });
};
```

#### Étape 3: Prestataire marque "Terminé" (COMPLETED)
```typescript
// Formulaire avec photos + commentaire
const markCompleted = async (missionId: string, photos: File[], comment: string) => {
  // 1. Upload photos vers Supabase Storage
  const photoUrls = await uploadPhotos(photos, missionId);
  
  // 2. Mettre à jour mission
  await supabase
    .from('missions')
    .update({ 
      status: 'completed',
      completed_at: new Date()
    })
    .eq('id', missionId);
  
  // 3. Tracking avec photos
  await supabase
    .from('mission_tracking')
    .insert({
      mission_id: missionId,
      status: 'completed',
      actor_id: providerId,
      actor_role: 'provider',
      comment: comment,
      photo_urls: photoUrls
    });
  
  // 4. Notifier client
  await sendNotification(clientId, 'Prestation terminée ! Veuillez valider 👍');
};
```

#### Étape 4: Client valide (VALIDATED)
```typescript
// Client voit photos + commentaire, puis valide ou conteste
const validateMission = async (missionId: string, rating: number, review: string) => {
  // 1. Mettre à jour mission
  await supabase
    .from('missions')
    .update({ 
      status: 'validated',
      validated_at: new Date(),
      client_rating: rating,
      client_review: review
    })
    .eq('id', missionId);
  
  // 2. Tracking
  await supabase
    .from('mission_tracking')
    .insert({
      mission_id: missionId,
      status: 'validated',
      actor_id: clientId,
      actor_role: 'client',
      comment: `Validé avec ${rating}/5 étoiles`
    });
  
  // 3. Déclencher paiement
  await triggerPayment(missionId);
};
```

### Composant Timeline
```typescript
// components/missions/MissionTimeline.tsx
const MissionTimeline = ({ missionId }: { missionId: string }) => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Charger historique
    const fetchTracking = async () => {
      const { data } = await supabase
        .from('mission_tracking')
        .select('*, actor:profiles(first_name, last_name, avatar_url)')
        .eq('mission_id', missionId)
        .order('created_at', { ascending: false });
      
      setEvents(data);
    };
    
    fetchTracking();
    
    // Real-time subscription
    const subscription = supabase
      .channel(`mission:${missionId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'mission_tracking', filter: `mission_id=eq.${missionId}` },
        (payload) => {
          setEvents([payload.new, ...events]);
        }
      )
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, [missionId]);
  
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <TimelineItem key={event.id} event={event} />
      ))}
    </div>
  );
};
```

---

## 3. 💰 Workflow Validation + Paiement

### Objectif
Sécuriser le paiement : l'argent est bloqué à l'acceptation, puis libéré après validation client.

### Architecture Paiement

#### A. Providers (Côte d'Ivoire)
- **Wave** : API paiement mobile (Orange Money, MTN, Moov)
- **Cinetpay** : Intégration locale
- **Stripe** : Carte bancaire internationale

#### B. Flow Escrow (Séquestre)

```
1. DEAL CONCLU (accepted)
   → Client paie montant mission
   → Argent bloqué en "escrow" (non accessible)
   
2. PRESTATION EN COURS (in_progress)
   → Argent toujours bloqué
   → Aucun retrait possible
   
3. PRESTATAIRE TERMINE (completed)
   → Argent toujours bloqué
   → Attente validation client (48h max)
   
4. CLIENT VALIDE (validated)
   → Argent libéré vers compte prestataire
   → Commission Yo!Voiz déduite (ex: 10%)
   → Prestataire peut retirer
   
5. TIMEOUT VALIDATION (48h sans réponse)
   → Auto-validation
   → Argent libéré automatiquement
```

#### C. Schema SQL - Table payments
```sql
CREATE TYPE payment_status AS ENUM ('pending', 'held', 'released', 'refunded', 'failed');

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Montants
  amount_total NUMERIC NOT NULL, -- Montant total payé par client
  amount_provider NUMERIC NOT NULL, -- Montant revenant au prestataire (après commission)
  commission_amount NUMERIC NOT NULL, -- Commission Yo!Voiz
  commission_rate NUMERIC DEFAULT 0.10, -- 10% par défaut
  
  -- Status
  status payment_status DEFAULT 'pending',
  held_at TIMESTAMP WITH TIME ZONE, -- Quand argent bloqué
  released_at TIMESTAMP WITH TIME ZONE, -- Quand argent libéré
  
  -- Payment provider
  payment_provider TEXT NOT NULL, -- 'wave', 'cinetpay', 'stripe'
  transaction_id TEXT, -- ID transaction externe
  payment_method TEXT, -- 'orange_money', 'mtn', 'card', etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_mission ON payments(mission_id);
CREATE INDEX idx_payments_provider ON payments(provider_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### D. Fonction de paiement
```typescript
// lib/payments/escrow.ts

// 1. Bloquer argent (après acceptation)
export const holdPayment = async (missionId: string, amount: number) => {
  const commission = amount * 0.10; // 10%
  const providerAmount = amount - commission;
  
  // Appel API Wave/Cinetpay pour paiement
  const transactionId = await waveAPI.charge({
    amount,
    phone: clientPhone,
    description: `Mission ${missionId}`
  });
  
  // Enregistrer en BDD
  await supabase
    .from('payments')
    .insert({
      mission_id: missionId,
      client_id: clientId,
      provider_id: providerId,
      amount_total: amount,
      amount_provider: providerAmount,
      commission_amount: commission,
      status: 'held',
      held_at: new Date(),
      payment_provider: 'wave',
      transaction_id: transactionId
    });
};

// 2. Libérer argent (après validation)
export const releasePayment = async (missionId: string) => {
  // Récupérer payment
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('mission_id', missionId)
    .single();
  
  // Virement vers prestataire
  await waveAPI.transfer({
    amount: payment.amount_provider,
    recipient: providerWalletId,
    description: `Paiement mission ${missionId}`
  });
  
  // Mettre à jour status
  await supabase
    .from('payments')
    .update({ 
      status: 'released',
      released_at: new Date()
    })
    .eq('id', payment.id);
  
  // Notifier prestataire
  await sendNotification(providerId, `💰 ${payment.amount_provider} FCFA reçus !`);
};

// 3. Rembourser (en cas d'annulation)
export const refundPayment = async (missionId: string, reason: string) => {
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('mission_id', missionId)
    .single();
  
  await waveAPI.refund({
    transaction_id: payment.transaction_id,
    amount: payment.amount_total,
    reason
  });
  
  await supabase
    .from('payments')
    .update({ status: 'refunded' })
    .eq('id', payment.id);
};
```

#### E. Auto-validation timeout (Edge Function)
```typescript
// supabase/functions/auto-validate-missions/index.ts

Deno.serve(async () => {
  // Trouver missions completed depuis +48h sans validation
  const { data: missions } = await supabase
    .from('missions')
    .select('*')
    .eq('status', 'completed')
    .lt('completed_at', new Date(Date.now() - 48 * 60 * 60 * 1000));
  
  for (const mission of missions) {
    // Auto-valider
    await supabase
      .from('missions')
      .update({ 
        status: 'validated',
        validated_at: new Date(),
        auto_validated: true
      })
      .eq('id', mission.id);
    
    // Libérer paiement
    await releasePayment(mission.id);
    
    // Notifier les deux parties
    await sendNotification(mission.client_id, 'Mission auto-validée (48h écoulées)');
    await sendNotification(mission.provider_id, 'Paiement reçu (auto-validation)');
  }
  
  return new Response(JSON.stringify({ validated: missions.length }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Cron job: toutes les heures
// supabase functions deploy auto-validate-missions --schedule "0 * * * *"
```

---

## 4. 📱 Interface Utilisateur

### Pages à créer

#### A. Page Mission Detail (`/missions/[id]`)
```typescript
// Affichage conditionnel selon status
- PUBLISHED: Liste candidats + Bouton "Accepter"
- ACCEPTED: Info prestataire + Timeline + Chat
- IN_PROGRESS: Bouton prestataire "Marquer terminé"
- COMPLETED: Photos preuve + Bouton client "Valider"
- VALIDATED: Résumé + Note + Review
```

#### B. Composant StatusBadge
```typescript
const getStatusBadge = (status: MissionStatus) => {
  const config = {
    published: { color: 'blue', icon: '📢', text: 'Publiée' },
    accepted: { color: 'green', icon: '🤝', text: 'Acceptée' },
    in_progress: { color: 'orange', icon: '⚡', text: 'En cours' },
    completed: { color: 'purple', icon: '✅', text: 'Terminée' },
    validated: { color: 'green', icon: '🎉', text: 'Validée' },
    paid: { color: 'green', icon: '💰', text: 'Payée' }
  };
  
  return <Badge color={config[status].color}>
    {config[status].icon} {config[status].text}
  </Badge>;
};
```

#### C. Formulaire Validation Client
```typescript
// components/missions/ValidationForm.tsx
- Note 1-5 étoiles
- Textarea review
- Checkbox "Conforme à la demande"
- Bouton "Valider et payer" (vert, gros)
- Lien "Signaler un problème" (rouge, discret)
```

---

## 5. 🚀 Ordre d'implémentation

### Phase 1: Tracking (1-2 jours)
1. Créer table `mission_tracking`
2. Enum `MissionStatus` dans types.ts
3. Composant `MissionTimeline`
4. Boutons d'action (Démarrer, Terminer, Valider)

### Phase 2: Géolocalisation (1 jour)
1. Composant `LocationPicker`
2. Intégrer API Nominatim
3. Ajouter dans formulaire inscription
4. Page Paramètres → "Mettre à jour ma position"

### Phase 3: Paiement (2-3 jours)
1. Choisir provider (Wave recommandé)
2. Créer table `payments`
3. Implémenter `holdPayment()` et `releasePayment()`
4. Edge Function auto-validation
5. Dashboard prestataire (solde, historique)

---

## 6. ⚠️ Points d'attention

### Sécurité
- ❌ JAMAIS stocker clés API côté client
- ✅ Toutes les mutations passent par Edge Functions
- ✅ RLS Supabase pour `payments` (lecture uniquement par client/provider concerné)

### UX
- 📸 Upload photos limité à 5 max, 2MB chacune
- ⏱️ Timeout validation configurable (défaut 48h)
- 🔔 Notifications push à chaque changement status
- 💬 Chat intégré dans page mission

### Légal
- 📄 CGU : clause escrow, commission, délais
- 🇨🇮 Conformité réglementation CI (Mobile Money)
- 📊 Déclaration fiscale commission

---

## 7. 📊 Métriques à suivre

```sql
-- Dashboard admin
SELECT 
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (validated_at - accepted_at))/3600) as avg_duration_hours
FROM missions
WHERE status IN ('accepted', 'in_progress', 'completed', 'validated')
GROUP BY status;

-- Taux de validation
SELECT 
  COUNT(CASE WHEN auto_validated = true THEN 1 END) * 100.0 / COUNT(*) as auto_validation_rate
FROM missions
WHERE status = 'validated';
```

---

**Prochaines étapes** : Quelle phase souhaitez-vous démarrer en premier ? Je recommande **Phase 1 (Tracking)** car c'est la base pour les 2 autres.
