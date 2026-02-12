-- ============================================
-- YO! VOIZ - INSTALLATION COMPLÈTE PROPRE
-- ============================================
-- Version: 3.0 FINALE
-- Date: 2026-02-12
-- Installation sur base de données vide
-- ============================================

-- Extensions PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TYPES ENUM
-- ============================================

CREATE TYPE user_type AS ENUM ('client', 'prestataire', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE mission_status AS ENUM ('draft', 'published', 'offers_received', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE payment_method AS ENUM ('orange_money', 'mtn_money', 'moov_money', 'wave');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'held');
CREATE TYPE dispute_status AS ENUM ('open', 'in_review', 'resolved', 'closed');
CREATE TYPE notification_type AS ENUM ('mission_new', 'mission_accepted', 'mission_completed', 'message_new', 'review_new', 'payment_received', 'payment_sent', 'verification_approved', 'verification_rejected', 'dispute_opened', 'promo_code', 'system');
CREATE TYPE report_type AS ENUM ('user', 'review', 'message', 'mission', 'other');
CREATE TYPE document_type AS ENUM ('cni', 'passport', 'selfie', 'address_proof', 'diploma', 'certificate');

-- ============================================
-- 2. TABLE PROFILES
-- ============================================

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
  referred_by UUID,
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_commune ON profiles(commune);
CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);

-- FK circulaire après création de la table
ALTER TABLE profiles ADD CONSTRAINT profiles_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES profiles(id);

-- ============================================
-- 3. TABLES SIMPLES (sans FK complexes)
-- ============================================

CREATE TABLE service_categories (
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

CREATE INDEX idx_categories_slug ON service_categories(slug);
CREATE INDEX idx_categories_active ON service_categories(is_active);

CREATE TABLE provider_profiles (
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

CREATE INDEX idx_provider_user_id ON provider_profiles(user_id);
CREATE INDEX idx_provider_services ON provider_profiles USING GIN(services);
CREATE INDEX idx_provider_available ON provider_profiles(is_available_now);

CREATE TABLE verification_documents (
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

CREATE INDEX idx_verification_user ON verification_documents(user_id);
CREATE INDEX idx_verification_status ON verification_documents(status);

-- ============================================
-- 4. TABLE MISSIONS
-- ============================================

CREATE TABLE missions (
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

CREATE INDEX idx_missions_client ON missions(client_id);
CREATE INDEX idx_missions_provider ON missions(assigned_to);
CREATE INDEX idx_missions_category ON missions(category_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_commune ON missions(commune);
CREATE INDEX idx_missions_date ON missions(preferred_date);

-- ============================================
-- 5. TABLES DÉPENDANT DE MISSIONS
-- ============================================

CREATE TABLE offers (
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

CREATE INDEX idx_offers_mission ON offers(mission_id);
CREATE INDEX idx_offers_provider ON offers(provider_id);
CREATE INDEX idx_offers_status ON offers(status);

CREATE TABLE payments (
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

CREATE INDEX idx_payments_mission ON payments(mission_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_receiver ON payments(receiver_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

CREATE TABLE withdrawals (
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

CREATE INDEX idx_withdrawals_provider ON withdrawals(provider_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);

CREATE TABLE reviews (
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

CREATE INDEX idx_reviews_mission ON reviews(mission_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE TABLE conversations (
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

CREATE INDEX idx_conversations_p1 ON conversations(participant_1);
CREATE INDEX idx_conversations_p2 ON conversations(participant_2);
CREATE INDEX idx_conversations_mission ON conversations(mission_id);

CREATE TABLE messages (
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

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

CREATE TABLE notifications (
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

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

CREATE TABLE disputes (
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

CREATE INDEX idx_disputes_mission ON disputes(mission_id);
CREATE INDEX idx_disputes_opened_by ON disputes(opened_by);
CREATE INDEX idx_disputes_status ON disputes(status);

CREATE TABLE reports (
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

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================
-- 6. TABLES SUPPLÉMENTAIRES
-- ============================================

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_provider ON favorites(provider_id);

CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  UNIQUE(provider_id, day_of_week, start_time)
);

CREATE INDEX idx_availability_provider ON provider_availability(provider_id);

CREATE TABLE promo_codes (
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

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);

CREATE TABLE promo_code_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  discount_applied INTEGER NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, mission_id)
);

CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  related_mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_loyalty_user ON loyalty_points(user_id);

CREATE TABLE user_loyalty_summary (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_points_earned INTEGER DEFAULT 0,
  total_points_spent INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
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

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

CREATE TABLE user_sessions (
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

CREATE INDEX idx_sessions_user ON user_sessions(user_id);

-- ============================================
-- 7. FONCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code_on_insert BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

-- ============================================
-- 8. DONNÉES INITIALES
-- ============================================

INSERT INTO service_categories (slug, name, description, emoji, color, average_price, price_range_min, price_range_max) VALUES
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
('garde', 'Garde enfants', 'Baby-sitting', '👶', '#FECACA', 3000, 2000, 8000);

-- ============================================
-- 9. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Published missions viewable" ON missions FOR SELECT USING (status IN ('published', 'offers_received'));
CREATE POLICY "Users can create missions" ON missions FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own missions" ON missions FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = assigned_to);
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE id = messages.conversation_id AND (participant_1 = auth.uid() OR participant_2 = auth.uid()))
);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FIN - MESSAGE DE CONFIRMATION
-- ============================================

DO $$ BEGIN
  RAISE NOTICE '✅✅✅ Installation Yo! Voiz RÉUSSIE ! ✅✅✅';
  RAISE NOTICE '';
  RAISE NOTICE '📊 RÉSUMÉ :';
  RAISE NOTICE '  ✓ 19 tables créées';
  RAISE NOTICE '  ✓ 9 types ENUM créés';
  RAISE NOTICE '  ✓ 15 catégories de services insérées';
  RAISE NOTICE '  ✓ Triggers et fonctions activés';
  RAISE NOTICE '  ✓ Row Level Security configuré';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Base de données prête pour le développement !';
END $$;
