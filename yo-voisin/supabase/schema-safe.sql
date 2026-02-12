-- ============================================
-- YO! VOIZ - SCHÉMA COMPLET (Version sans conflits)
-- ============================================
-- Version: 2.1
-- Date: 2026-02-12
-- Cette version gère les tables/types existants
-- ============================================

-- EXTENSION NÉCESSAIRES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. ENUMS (Types énumérés) - Avec gestion des existants
-- ============================================

-- Type d'utilisateur
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('client', 'prestataire', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Statut de vérification
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Statut de mission
DO $$ BEGIN
  CREATE TYPE mission_status AS ENUM (
    'draft',
    'published',
    'offers_received',
    'accepted',
    'in_progress',
    'completed',
    'cancelled',
    'disputed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de paiement
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('orange_money', 'mtn_money', 'moov_money', 'wave');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Statut de paiement
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'held');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Statut de litige
DO $$ BEGIN
  CREATE TYPE dispute_status AS ENUM ('open', 'in_review', 'resolved', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de notification
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'mission_new',
    'mission_accepted',
    'mission_completed',
    'message_new',
    'review_new',
    'payment_received',
    'payment_sent',
    'verification_approved',
    'verification_rejected',
    'dispute_opened',
    'promo_code',
    'system'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de signalement
DO $$ BEGIN
  CREATE TYPE report_type AS ENUM ('user', 'review', 'message', 'mission', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Type de document
DO $$ BEGIN
  CREATE TYPE document_type AS ENUM ('cni', 'passport', 'selfie', 'address_proof', 'diploma', 'certificate');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. TABLES PRINCIPALES
-- ============================================

-- Table profiles (étend auth.users de Supabase)
-- On vérifie si elle existe déjà et on ajoute seulement les colonnes manquantes
DO $$ 
BEGIN
  -- Créer la table si elle n'existe pas
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      phone_verified BOOLEAN DEFAULT FALSE,
      avatar_url TEXT,
      bio TEXT,
      user_type user_type NOT NULL DEFAULT 'client',
      is_active BOOLEAN DEFAULT TRUE,
      is_banned BOOLEAN DEFAULT FALSE,
      ban_reason TEXT,
      verification_status verification_status DEFAULT 'pending',
      verified_at TIMESTAMPTZ,
      commune TEXT NOT NULL,
      quartier TEXT,
      address TEXT,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      total_missions_completed INTEGER DEFAULT 0,
      average_rating DECIMAL(3, 2) DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      is_premium BOOLEAN DEFAULT FALSE,
      premium_until TIMESTAMPTZ,
      referral_code TEXT UNIQUE,
      referred_by UUID REFERENCES profiles(id),
      total_referrals INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Ajouter les colonnes manquantes si la table existe
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_missions_completed INTEGER DEFAULT 0;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
  END IF;
END $$;

-- Index pour profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_commune ON profiles(commune);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Table provider_profiles
CREATE TABLE IF NOT EXISTS provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  siret TEXT,
  description TEXT,
  years_experience INTEGER,
  services TEXT[] DEFAULT '{}',
  hourly_rate INTEGER,
  minimum_service_price INTEGER,
  is_available_now BOOLEAN DEFAULT FALSE,
  accepts_urgent_requests BOOLEAN DEFAULT FALSE,
  max_distance_km INTEGER DEFAULT 10,
  portfolio_images TEXT[] DEFAULT '{}',
  response_time_hours DECIMAL(5, 2) DEFAULT 0,
  acceptance_rate DECIMAL(5, 2) DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  level TEXT DEFAULT 'bronze',
  badges TEXT[] DEFAULT '{}',
  total_earnings INTEGER DEFAULT 0,
  pending_earnings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_user_id ON provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_services ON provider_profiles USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_provider_available ON provider_profiles(is_available_now);

-- Table verification_documents
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  status verification_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, document_type)
);

CREATE INDEX IF NOT EXISTS idx_verification_user ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_documents(status);

-- Table service_categories
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  icon_url TEXT,
  color TEXT,
  meta_title TEXT,
  meta_description TEXT,
  average_price INTEGER,
  price_range_min INTEGER,
  price_range_max INTEGER,
  total_missions INTEGER DEFAULT 0,
  active_providers INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON service_categories(is_active);

-- Table missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  commune TEXT NOT NULL,
  quartier TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_urgent BOOLEAN DEFAULT FALSE,
  preferred_date TIMESTAMPTZ,
  flexible_dates BOOLEAN DEFAULT TRUE,
  budget_min INTEGER,
  budget_max INTEGER,
  images TEXT[] DEFAULT '{}',
  status mission_status DEFAULT 'draft',
  assigned_to UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  views_count INTEGER DEFAULT 0,
  offers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missions_client ON missions(client_id);
CREATE INDEX IF NOT EXISTS idx_missions_provider ON missions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_missions_category ON missions(category_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_commune ON missions(commune);
CREATE INDEX IF NOT EXISTS idx_missions_date ON missions(preferred_date);

-- Table offers
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price INTEGER NOT NULL,
  estimated_duration TEXT,
  available_from TIMESTAMPTZ,
  available_to TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  client_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mission_id, provider_id)
);

CREATE INDEX IF NOT EXISTS idx_offers_mission ON offers(mission_id);
CREATE INDEX IF NOT EXISTS idx_offers_provider ON offers(provider_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

-- Table payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  commission_amount INTEGER DEFAULT 0,
  net_amount INTEGER NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT UNIQUE,
  payment_proof_url TEXT,
  is_held BOOLEAN DEFAULT FALSE,
  held_until TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded BOOLEAN DEFAULT FALSE,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_mission ON payments(mission_id);
CREATE INDEX IF NOT EXISTS idx_payments_payer ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_receiver ON payments(receiver_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);

-- Table withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  payment_method payment_method NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  transaction_id TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_provider ON withdrawals(provider_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Table reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID UNIQUE NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewed_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  is_flagged BOOLEAN DEFAULT FALSE,
  is_moderated BOOLEAN DEFAULT FALSE,
  moderation_reason TEXT,
  provider_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_mission ON reviews(mission_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Table conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  unread_count_1 INTEGER DEFAULT 0,
  unread_count_2 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_conversations_mission ON conversations(mission_id);

-- Table messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  is_flagged BOOLEAN DEFAULT FALSE,
  contains_phone BOOLEAN DEFAULT FALSE,
  contains_email BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Table notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  related_mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  related_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Table disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID UNIQUE NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES profiles(id),
  against UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status dispute_status DEFAULT 'open',
  assigned_to_admin UUID REFERENCES profiles(id),
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  refund_amount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disputes_mission ON disputes(mission_id);
CREATE INDEX IF NOT EXISTS idx_disputes_opened_by ON disputes(opened_by);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);

-- Table reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  report_type report_type NOT NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  reported_message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  reported_mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Table favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_provider ON favorites(provider_id);

-- Table provider_availability
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  UNIQUE(provider_id, day_of_week, start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_provider ON provider_availability(provider_id);

-- Table promo_codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value INTEGER NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_amount INTEGER,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  first_mission_only BOOLEAN DEFAULT FALSE,
  specific_categories UUID[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);

-- Table promo_code_uses
CREATE TABLE IF NOT EXISTS promo_code_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  discount_applied INTEGER NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, mission_id)
);

-- Table loyalty_points
CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  related_mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_points(user_id);

-- Table user_loyalty_summary
CREATE TABLE IF NOT EXISTS user_loyalty_summary (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_points_earned INTEGER DEFAULT 0,
  total_points_spent INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- Table user_sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  device_info TEXT,
  browser TEXT,
  os TEXT,
  ip_address INET,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);

-- ============================================
-- 3. FONCTIONS UTILITAIRES
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at (avec vérification d'existence)
DO $$ BEGIN
  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Fonction pour générer un code de parrainage unique
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le code de parrainage
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER set_referral_code_on_insert BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_referral_code();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 4. DONNÉES INITIALES (seulement si vide)
-- ============================================

INSERT INTO service_categories (slug, name, description, emoji, color, average_price, price_range_min, price_range_max)
SELECT * FROM (VALUES
  ('menage', 'Ménage', 'Nettoyage & entretien', '🧹', '#E8F5ED', 5000, 3000, 10000),
  ('gouvernante', 'Gouvernante', 'Aide à domicile', '👩‍🍳', '#FEF3C7', 40000, 30000, 60000),
  ('bricolage', 'Bricolage', 'Petits travaux', '🔧', '#FFF0E5', 8000, 5000, 15000),
  ('livraison', 'Livraison', 'Courses & colis', '🚚', '#E0F2FE', 2000, 1000, 5000),
  ('reparation', 'Réparations', 'Électricité & plomberie', '⚡', '#F3E8FF', 15000, 10000, 30000),
  ('manutention', 'Manutention', 'Déménagement', '📦', '#ECFDF5', 20000, 15000, 50000),
  ('jardinage', 'Jardinage', 'Entretien jardin', '🌿', '#ECFDF5', 7000, 5000, 12000),
  ('couture', 'Couture', 'Retouches & création', '🧵', '#FFF0E5', 5000, 3000, 15000),
  ('cours', 'Cours particuliers', 'Soutien scolaire', '📚', '#E0F2FE', 10000, 5000, 20000),
  ('cuisine', 'Cuisine', 'Traiteur & chef', '🍳', '#FEF3C7', 25000, 15000, 50000),
  ('evenementiel', 'Événementiel', 'Animation & déco', '🎉', '#F3E8FF', 30000, 20000, 100000),
  ('informatique', 'Informatique', 'Dépannage PC', '💻', '#E0F2FE', 12000, 8000, 25000),
  ('beaute', 'Beauté', 'Coiffure & soins', '💇‍♀️', '#FCE7F3', 8000, 5000, 20000),
  ('auto', 'Auto & Moto', 'Mécanique & lavage', '🚗', '#FFF0E5', 15000, 10000, 30000),
  ('garde', 'Garde enfants', 'Baby-sitting', '👶', '#FECACA', 3000, 2000, 8000)
) AS t(slug, name, description, emoji, color, average_price, price_range_min, price_range_max)
WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE service_categories.slug = t.slug);

-- ============================================
-- 5. RLS - Activer sur toutes les tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_loyalty_summary ENABLE ROW LEVEL SECURITY;

-- Policies de base (les autres seront ajoutées selon les besoins)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Missions are viewable by everyone" ON missions;
CREATE POLICY "Missions are viewable by everyone" 
  ON missions FOR SELECT 
  USING (status IN ('published', 'offers_received'));

DROP POLICY IF EXISTS "Users can create missions" ON missions;
CREATE POLICY "Users can create missions" 
  ON missions FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can update own missions" ON missions;
CREATE POLICY "Users can update own missions" 
  ON missions FOR UPDATE 
  USING (auth.uid() = client_id OR auth.uid() = assigned_to);

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- Message de confirmation
DO $$ BEGIN
  RAISE NOTICE 'Schema Yo! Voiz installé avec succès! 19 tables créées.';
END $$;
