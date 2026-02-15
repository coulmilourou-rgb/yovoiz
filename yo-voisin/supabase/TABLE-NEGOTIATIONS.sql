-- ============================================
-- SYSTÈME DE NÉGOCIATION DE PRIX
-- Table: negotiations
-- ============================================

-- Enum pour status négociation
DO $$ BEGIN
  CREATE TYPE negotiation_status AS ENUM (
    'pending',      -- En attente réponse
    'accepted',     -- Accepté, paiement en cours
    'rejected',     -- Rejeté définitivement
    'countered',    -- Contre-offre envoyée
    'expired'       -- Expiré (72h sans réponse)
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Table negotiations
CREATE TABLE IF NOT EXISTS negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Historique des propositions (JSONB array)
  proposals JSONB[] NOT NULL DEFAULT '{}',
  
  -- État actuel
  current_proposal_index INTEGER NOT NULL DEFAULT 0,
  current_amount NUMERIC NOT NULL,
  current_proposer TEXT NOT NULL CHECK (current_proposer IN ('client', 'provider')),
  status negotiation_status DEFAULT 'pending',
  
  -- Métadonnées
  round_count INTEGER DEFAULT 1,
  max_rounds INTEGER DEFAULT 10,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '72 hours',
  
  -- Optionnel : raison du refus
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_negotiations_mission ON negotiations(mission_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_offer ON negotiations(offer_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_client ON negotiations(client_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_provider ON negotiations(provider_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_status ON negotiations(status);
CREATE INDEX IF NOT EXISTS idx_negotiations_expires ON negotiations(expires_at) WHERE status = 'pending';

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_negotiations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_negotiations_updated_at ON negotiations;
CREATE TRIGGER trigger_negotiations_updated_at
  BEFORE UPDATE ON negotiations
  FOR EACH ROW
  EXECUTE FUNCTION update_negotiations_updated_at();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;

-- Policy: Les deux parties peuvent lire leurs négociations
DROP POLICY IF EXISTS "Lecture négociations parties" ON negotiations;
CREATE POLICY "Lecture négociations parties"
  ON negotiations
  FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- Policy: Client peut créer négociation (rare, surtout prestataire)
DROP POLICY IF EXISTS "Client crée négociation" ON negotiations;
CREATE POLICY "Client crée négociation"
  ON negotiations
  FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Policy: Prestataire peut créer négociation (cas principal)
DROP POLICY IF EXISTS "Prestataire crée négociation" ON negotiations;
CREATE POLICY "Prestataire crée négociation"
  ON negotiations
  FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Policy: Les deux parties peuvent mettre à jour leurs négociations
DROP POLICY IF EXISTS "Mise à jour négociations parties" ON negotiations;
CREATE POLICY "Mise à jour négociations parties"
  ON negotiations
  FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = provider_id)
  WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);

-- ============================================
-- Fonctions utilitaires
-- ============================================

-- Fonction: Obtenir la dernière proposition
CREATE OR REPLACE FUNCTION get_latest_proposal(nego_id UUID)
RETURNS JSONB AS $$
DECLARE
  nego_data negotiations;
  latest_proposal JSONB;
BEGIN
  SELECT * INTO nego_data FROM negotiations WHERE id = nego_id;
  
  IF nego_data.proposals IS NULL OR array_length(nego_data.proposals, 1) = 0 THEN
    RETURN NULL;
  END IF;
  
  latest_proposal := nego_data.proposals[array_length(nego_data.proposals, 1)];
  RETURN latest_proposal;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Vérifier si négociation est expirée
CREATE OR REPLACE FUNCTION is_negotiation_expired(nego_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  nego_data negotiations;
BEGIN
  SELECT * INTO nego_data FROM negotiations WHERE id = nego_id;
  
  RETURN (nego_data.status = 'pending' AND NOW() > nego_data.expires_at);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Commentaires
-- ============================================

COMMENT ON TABLE negotiations IS 'Négociations de prix entre client et prestataire';
COMMENT ON COLUMN negotiations.proposals IS 'Array JSONB des propositions successives';
COMMENT ON COLUMN negotiations.current_proposer IS 'Qui a fait la dernière proposition (client ou provider)';
COMMENT ON COLUMN negotiations.round_count IS 'Nombre de tours de négociation (max 10)';
COMMENT ON COLUMN negotiations.expires_at IS 'Date expiration proposition actuelle (72h)';

-- ============================================
-- Données de test (optionnel, à supprimer en prod)
-- ============================================

-- Exemple de structure JSONB pour proposals:
-- {
--   "amount": 7500,
--   "proposer": "client",
--   "message": "Pourriez-vous baisser un peu le prix ?",
--   "created_at": "2026-02-13T10:30:00Z",
--   "expires_at": "2026-02-16T10:30:00Z"
-- }
