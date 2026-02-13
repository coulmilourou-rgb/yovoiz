-- Table: service_offers
-- Description: Offres de services créées par les prestataires

CREATE TABLE IF NOT EXISTS service_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations de base
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Tarification
  pricing_type TEXT NOT NULL CHECK (pricing_type IN ('hourly', 'fixed')),
  price_hourly NUMERIC,
  price_fixed_min NUMERIC,
  price_fixed_max NUMERIC,
  
  -- Zones d'intervention
  communes TEXT[] NOT NULL DEFAULT '{}',
  quartiers TEXT[] DEFAULT '{}',
  
  -- Disponibilités
  available_days TEXT[] NOT NULL DEFAULT '{}',
  available_hours_start TIME NOT NULL DEFAULT '08:00',
  available_hours_end TIME NOT NULL DEFAULT '18:00',
  
  -- Portfolio
  photos TEXT[] DEFAULT '{}',
  
  -- Statut
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'rejected')),
  
  -- Métriques
  views_count INTEGER DEFAULT 0,
  requests_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_service_offers_provider ON service_offers(provider_id);
CREATE INDEX idx_service_offers_category ON service_offers(category);
CREATE INDEX idx_service_offers_status ON service_offers(status);
CREATE INDEX idx_service_offers_created ON service_offers(created_at DESC);

-- Index GIN pour recherche dans tableaux
CREATE INDEX idx_service_offers_communes ON service_offers USING GIN (communes);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_service_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_service_offers_updated_at
  BEFORE UPDATE ON service_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_service_offers_updated_at();

-- RLS (Row Level Security)
ALTER TABLE service_offers ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture publique des offres actives
CREATE POLICY "Lecture publique offres actives"
  ON service_offers
  FOR SELECT
  USING (status = 'active');

-- Policy: Prestataire peut voir toutes ses offres
CREATE POLICY "Prestataire lit ses offres"
  ON service_offers
  FOR SELECT
  USING (auth.uid() = provider_id);

-- Policy: Prestataire peut créer ses offres
CREATE POLICY "Prestataire crée ses offres"
  ON service_offers
  FOR INSERT
  WITH CHECK (auth.uid() = provider_id);

-- Policy: Prestataire peut modifier ses offres
CREATE POLICY "Prestataire modifie ses offres"
  ON service_offers
  FOR UPDATE
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

-- Policy: Prestataire peut supprimer ses offres
CREATE POLICY "Prestataire supprime ses offres"
  ON service_offers
  FOR DELETE
  USING (auth.uid() = provider_id);

-- Commentaires
COMMENT ON TABLE service_offers IS 'Offres de services créées par les prestataires';
COMMENT ON COLUMN service_offers.pricing_type IS 'Type tarification: hourly (horaire) ou fixed (forfait)';
COMMENT ON COLUMN service_offers.communes IS 'Liste communes intervention (array)';
COMMENT ON COLUMN service_offers.available_days IS 'Jours disponibles (lundi, mardi, etc.)';
COMMENT ON COLUMN service_offers.photos IS 'URLs photos portfolio (max 5)';
COMMENT ON COLUMN service_offers.views_count IS 'Nombre de vues de l''offre';
COMMENT ON COLUMN service_offers.requests_count IS 'Nombre de demandes reçues';
