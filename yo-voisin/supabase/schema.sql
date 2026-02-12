-- =====================================================
-- YO! VOISIN - SCHEMA SQL COMPLET OPTIMISÉ
-- Base de données Supabase PostgreSQL
-- =====================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TYPES ENUM
-- =====================================================

CREATE TYPE user_role AS ENUM ('requester', 'provider', 'both');
CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'approved', 'rejected');
CREATE TYPE request_status AS ENUM ('draft', 'published', 'in_progress', 'completed', 'cancelled');
CREATE TYPE quote_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE mission_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE payment_status AS ENUM ('pending', 'held_escrow', 'released', 'refunded', 'cancelled');
CREATE TYPE payment_method AS ENUM ('orange_money', 'mtn_momo', 'wave', 'moov_money');
CREATE TYPE dispute_status AS ENUM ('open', 'in_review', 'resolved', 'closed');
CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
CREATE TYPE provider_level AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- =====================================================
-- TABLE: profiles
-- Profils utilisateurs étendus (lié à auth.users)
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'requester',
  
  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  commune VARCHAR(100) NOT NULL,
  address TEXT,
  bio TEXT,
  avatar_url TEXT,
  
  -- Vérification identité (OBLIGATOIRE pour prestataires)
  id_card_number VARCHAR(50) UNIQUE,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  selfie_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  
  -- Prestataire uniquement
  provider_level provider_level DEFAULT 'bronze',
  provider_categories TEXT[], -- IDs des catégories
  provider_bio TEXT,
  provider_experience_years INTEGER DEFAULT 0,
  
  -- Statistiques prestataire
  total_missions INTEGER DEFAULT 0,
  completed_missions INTEGER DEFAULT 0,
  cancelled_missions INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  available_balance DECIMAL(10,2) DEFAULT 0.00,
  
  -- Statistiques demandeur
  total_requests INTEGER DEFAULT 0,
  requester_rating DECIMAL(2,1) DEFAULT 0.0,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT phone_format CHECK (phone ~ '^\+225[0-9]{10}$'),
  CONSTRAINT valid_rating CHECK (average_rating >= 0 AND average_rating <= 5),
  CONSTRAINT valid_balance CHECK (available_balance >= 0)
);

-- Index pour performances
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_commune ON profiles(commune);
CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_profiles_provider_level ON profiles(provider_level);
CREATE INDEX idx_profiles_categories ON profiles USING GIN(provider_categories);
CREATE INDEX idx_profiles_active ON profiles(is_active) WHERE is_active = true;

-- =====================================================
-- TABLE: requests
-- Demandes de service publiées par demandeurs
-- =====================================================

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Détails demande
  category_id VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[], -- URLs des photos
  
  -- Localisation
  commune VARCHAR(100) NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Budget & timing
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  preferred_date DATE,
  preferred_time TIME,
  is_urgent BOOLEAN DEFAULT false,
  
  -- Statut
  status request_status DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Statistiques
  views_count INTEGER DEFAULT 0,
  quotes_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_budget CHECK (budget_max >= budget_min)
);

-- Index
CREATE INDEX idx_requests_requester ON requests(requester_id);
CREATE INDEX idx_requests_category ON requests(category_id);
CREATE INDEX idx_requests_commune ON requests(commune);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_published ON requests(published_at DESC) WHERE status = 'published';
-- Index géographique (nécessite PostGIS - à activer plus tard si besoin)
-- CREATE INDEX idx_requests_location ON requests USING GIST(ll_to_earth(latitude, longitude));

-- =====================================================
-- TABLE: quotes
-- Devis/Candidatures des prestataires
-- =====================================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Détails devis
  proposed_price DECIMAL(10,2) NOT NULL,
  message TEXT NOT NULL,
  estimated_duration INTEGER, -- en heures
  can_start_date DATE,
  
  -- Statut
  status quote_status DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_provider_request UNIQUE(request_id, provider_id),
  CONSTRAINT valid_price CHECK (proposed_price > 0)
);

-- Index
CREATE INDEX idx_quotes_request ON quotes(request_id);
CREATE INDEX idx_quotes_provider ON quotes(provider_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at DESC);

-- =====================================================
-- TABLE: missions
-- Services acceptés et en cours d'exécution
-- =====================================================

CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE RESTRICT,
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE RESTRICT,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Détails mission
  final_price DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(4,2) DEFAULT 10.00, -- %
  commission_amount DECIMAL(10,2) GENERATED ALWAYS AS (final_price * commission_rate / 100) STORED,
  provider_amount DECIMAL(10,2) GENERATED ALWAYS AS (final_price - (final_price * commission_rate / 100)) STORED,
  
  -- Dates
  scheduled_date DATE,
  scheduled_time TIME,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Statut
  status mission_status DEFAULT 'pending',
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES profiles(id),
  
  -- Preuve de réalisation
  completion_photos TEXT[],
  completion_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_price CHECK (final_price > 0),
  CONSTRAINT valid_commission CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

-- Index
CREATE INDEX idx_missions_request ON missions(request_id);
CREATE INDEX idx_missions_provider ON missions(provider_id);
CREATE INDEX idx_missions_requester ON missions(requester_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_scheduled ON missions(scheduled_date, scheduled_time);

-- =====================================================
-- TABLE: payments
-- Transactions et système escrow
-- =====================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE RESTRICT,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Montants
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  provider_amount DECIMAL(10,2) NOT NULL,
  
  -- Méthode paiement
  payment_method payment_method NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  
  -- Intégration CinetPay
  cinetpay_transaction_id VARCHAR(100) UNIQUE,
  cinetpay_payment_token VARCHAR(200),
  cinetpay_payment_url TEXT,
  
  -- Statut & escrow
  status payment_status DEFAULT 'pending',
  held_at TIMESTAMPTZ, -- Date de blocage escrow
  auto_release_at TIMESTAMPTZ, -- Auto-libération après 48h
  released_at TIMESTAMPTZ,
  released_by UUID REFERENCES profiles(id),
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_amounts CHECK (amount = commission + provider_amount)
);

-- Index
CREATE INDEX idx_payments_mission ON payments(mission_id);
CREATE INDEX idx_payments_provider ON payments(provider_id);
CREATE INDEX idx_payments_requester ON payments(requester_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_cinetpay ON payments(cinetpay_transaction_id);
CREATE INDEX idx_payments_auto_release ON payments(auto_release_at) WHERE status = 'held_escrow';

-- =====================================================
-- TABLE: messages
-- Messagerie sécurisée avec filtrage anti-désintermédiation
-- =====================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenu
  content TEXT NOT NULL,
  filtered_content TEXT, -- Contenu après filtrage
  has_blocked_content BOOLEAN DEFAULT false,
  blocked_patterns TEXT[], -- Patterns détectés (numéros, emails)
  
  -- Pièces jointes
  attachments TEXT[],
  
  -- Statut
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_system_message BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT different_users CHECK (sender_id != recipient_id)
);

-- Index
CREATE INDEX idx_messages_mission ON messages(mission_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- =====================================================
-- TABLE: reviews
-- Notations bidirectionnelles (prestataire <-> demandeur)
-- =====================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Notation
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  tags TEXT[], -- IDs des tags (ponctuel, professionnel, etc.)
  
  -- Réponse
  response TEXT,
  response_at TIMESTAMPTZ,
  
  -- Metadata
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_review UNIQUE(mission_id, reviewer_id),
  CONSTRAINT different_users CHECK (reviewer_id != reviewee_id)
);

-- Index
CREATE INDEX idx_reviews_mission ON reviews(mission_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_visible ON reviews(is_visible) WHERE is_visible = true;

-- =====================================================
-- TABLE: disputes
-- Gestion des litiges
-- =====================================================

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE RESTRICT,
  payment_id UUID REFERENCES payments(id) ON DELETE RESTRICT,
  opened_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Détails litige
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  
  -- Résolution
  status dispute_status DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id), -- Admin assigné
  admin_notes TEXT,
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- Décision
  refund_amount DECIMAL(10,2),
  penalty_amount DECIMAL(10,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_disputes_mission ON disputes(mission_id);
CREATE INDEX idx_disputes_opened_by ON disputes(opened_by);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_assigned ON disputes(assigned_to);

-- =====================================================
-- TABLE: withdrawals
-- Demandes de retrait des prestataires
-- =====================================================

CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Montant
  amount DECIMAL(10,2) NOT NULL,
  
  -- Méthode retrait
  payment_method payment_method NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  
  -- Traitement
  status withdrawal_status DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES profiles(id),
  
  -- Intégration paiement
  transaction_id VARCHAR(100) UNIQUE,
  transaction_receipt TEXT,
  
  -- Erreur
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_amount CHECK (amount > 0)
);

-- Index
CREATE INDEX idx_withdrawals_provider ON withdrawals(provider_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_created ON withdrawals(created_at DESC);

-- =====================================================
-- TABLE: notifications
-- Notifications push & in-app
-- =====================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenu
  type VARCHAR(50) NOT NULL, -- new_quote, mission_started, payment_released, etc.
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  
  -- Liens
  action_url TEXT,
  related_entity_type VARCHAR(50), -- request, mission, payment, etc.
  related_entity_id UUID,
  
  -- Statut
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- TABLE: admin_logs
-- Logs d'actions administrateur (audit trail)
-- =====================================================

CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  
  -- Action
  action VARCHAR(100) NOT NULL, -- verify_provider, resolve_dispute, ban_user, etc.
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Détails
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_entity ON admin_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at DESC);

-- =====================================================
-- FONCTIONS & TRIGGERS
-- =====================================================

-- Fonction: Mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer trigger sur toutes les tables avec updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Fonction: Calculer le niveau prestataire automatiquement
CREATE OR REPLACE FUNCTION calculate_provider_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed_missions >= 81 AND NEW.average_rating >= 4.5 THEN
    NEW.provider_level = 'platinum';
  ELSIF NEW.completed_missions >= 31 AND NEW.average_rating >= 4.3 THEN
    NEW.provider_level = 'gold';
  ELSIF NEW.completed_missions >= 11 AND NEW.average_rating >= 4.0 THEN
    NEW.provider_level = 'silver';
  ELSE
    NEW.provider_level = 'bronze';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_provider_level 
BEFORE INSERT OR UPDATE OF completed_missions, average_rating ON profiles 
FOR EACH ROW EXECUTE FUNCTION calculate_provider_level();

-- Fonction: Incrémenter compteur de devis
CREATE OR REPLACE FUNCTION increment_quotes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE requests SET quotes_count = quotes_count + 1 WHERE id = NEW.request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotes_increment AFTER INSERT ON quotes FOR EACH ROW EXECUTE FUNCTION increment_quotes_count();

-- Fonction: Mise à jour stats après mission complétée
CREATE OR REPLACE FUNCTION update_stats_on_mission_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Prestataire
    UPDATE profiles 
    SET completed_missions = completed_missions + 1,
        total_missions = total_missions + 1
    WHERE id = NEW.provider_id;
    
    -- Demandeur
    UPDATE profiles 
    SET total_requests = total_requests + 1
    WHERE id = NEW.requester_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER missions_update_stats 
AFTER UPDATE OF status ON missions 
FOR EACH ROW EXECUTE FUNCTION update_stats_on_mission_complete();

-- Fonction: Filtrage anti-désintermédiation
CREATE OR REPLACE FUNCTION filter_message_content()
RETURNS TRIGGER AS $$
DECLARE
  patterns TEXT[] := ARRAY[
    '\+225\d{10}',              -- Numéros Côte d'Ivoire
    '\d{10}',                   -- 10 chiffres consécutifs
    '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', -- Emails
    'whatsapp',
    'telegram',
    'facebook',
    'mon (numero|numéro|contact)',
    'appelle(-| )?moi',
    'contacte(-| )?moi'
  ];
  pattern TEXT;
  blocked TEXT[] := '{}';
BEGIN
  NEW.filtered_content := NEW.content;
  NEW.has_blocked_content := false;
  
  FOREACH pattern IN ARRAY patterns LOOP
    IF NEW.content ~* pattern THEN
      NEW.has_blocked_content := true;
      blocked := array_append(blocked, pattern);
      NEW.filtered_content := regexp_replace(
        NEW.filtered_content, 
        pattern, 
        '[CONTENU MASQUÉ]', 
        'gi'
      );
    END IF;
  END LOOP;
  
  NEW.blocked_patterns := blocked;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_filter 
BEFORE INSERT ON messages 
FOR EACH ROW EXECUTE FUNCTION filter_message_content();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies: profiles (lecture publique, écriture propriétaire)
CREATE POLICY "Profiles visible par tous" ON profiles FOR SELECT USING (true);
CREATE POLICY "Propriétaire peut mettre à jour son profil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies: requests
CREATE POLICY "Demandes publiées visibles par tous" ON requests FOR SELECT USING (status = 'published' OR requester_id = auth.uid());
CREATE POLICY "Propriétaire peut créer/modifier ses demandes" ON requests FOR ALL USING (requester_id = auth.uid());

-- Policies: quotes
CREATE POLICY "Devis visibles par demandeur et prestataire" ON quotes FOR SELECT USING (
  request_id IN (SELECT id FROM requests WHERE requester_id = auth.uid())
  OR provider_id = auth.uid()
);
CREATE POLICY "Prestataire peut créer des devis" ON quotes FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "Demandeur peut accepter/rejeter" ON quotes FOR UPDATE USING (
  request_id IN (SELECT id FROM requests WHERE requester_id = auth.uid())
);

-- Policies: missions
CREATE POLICY "Missions visibles par participants" ON missions FOR SELECT USING (
  requester_id = auth.uid() OR provider_id = auth.uid()
);

-- Policies: payments
CREATE POLICY "Paiements visibles par participants" ON payments FOR SELECT USING (
  requester_id = auth.uid() OR provider_id = auth.uid()
);

-- Policies: messages
CREATE POLICY "Messages visibles par expéditeur et destinataire" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);
CREATE POLICY "Utilisateur peut envoyer des messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Policies: reviews
CREATE POLICY "Avis publics visibles" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Utilisateur peut créer des avis" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Policies: withdrawals
CREATE POLICY "Prestataire voit ses retraits" ON withdrawals FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "Prestataire peut demander un retrait" ON withdrawals FOR INSERT WITH CHECK (provider_id = auth.uid());

-- Policies: notifications
CREATE POLICY "Utilisateur voit ses notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Utilisateur peut marquer comme lu" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- VUES UTILITAIRES
-- =====================================================

-- Vue: Dashboard prestataire
CREATE VIEW provider_dashboard AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.provider_level,
  p.average_rating,
  p.completed_missions,
  p.available_balance,
  COUNT(DISTINCT m.id) FILTER (WHERE m.status IN ('pending', 'in_progress')) as active_missions,
  COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'pending') as pending_quotes
FROM profiles p
LEFT JOIN missions m ON m.provider_id = p.id
LEFT JOIN quotes q ON q.provider_id = p.id
GROUP BY p.id;

-- Vue: Dashboard demandeur
CREATE VIEW requester_dashboard AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.requester_rating,
  p.total_requests,
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'published') as active_requests,
  COUNT(DISTINCT m.id) FILTER (WHERE m.status IN ('pending', 'in_progress')) as active_missions
FROM profiles p
LEFT JOIN requests r ON r.requester_id = p.id
LEFT JOIN missions m ON m.requester_id = p.id
GROUP BY p.id;

-- Vue: Top prestataires
CREATE VIEW top_providers AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  p.commune,
  p.provider_level,
  p.average_rating,
  p.completed_missions,
  p.provider_categories
FROM profiles p
WHERE p.role IN ('provider', 'both')
  AND p.verification_status = 'approved'
  AND p.is_active = true
ORDER BY p.average_rating DESC, p.completed_missions DESC
LIMIT 20;

-- =====================================================
-- TABLE: otp_codes
-- Codes OTP pour vérification SMS
-- =====================================================

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_otp_phone ON otp_codes(phone);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);

-- =====================================================
-- FONCTION: generate_otp_code
-- Génère un nouveau code OTP pour un numéro de téléphone
-- =====================================================

CREATE OR REPLACE FUNCTION generate_otp_code(p_phone VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  v_code VARCHAR(6);
BEGIN
  -- Générer un code à 6 chiffres
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::VARCHAR, 6, '0');
  
  -- Invalider les anciens codes non utilisés pour ce numéro
  UPDATE otp_codes
  SET used = true
  WHERE phone = p_phone
    AND used = false
    AND expires_at > NOW();
  
  -- Insérer le nouveau code (expire dans 10 minutes)
  INSERT INTO otp_codes (phone, code, expires_at)
  VALUES (p_phone, v_code, NOW() + INTERVAL '10 minutes');
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FONCTION: verify_otp_code
-- Vérifie un code OTP (max 3 tentatives)
-- =====================================================

CREATE OR REPLACE FUNCTION verify_otp_code(p_phone VARCHAR, p_code VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  v_otp RECORD;
  v_is_valid BOOLEAN := false;
BEGIN
  -- Récupérer le code le plus récent non utilisé et non expiré
  SELECT * INTO v_otp
  FROM otp_codes
  WHERE phone = p_phone
    AND used = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Si aucun code trouvé
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Incrémenter le nombre de tentatives
  UPDATE otp_codes
  SET attempts = attempts + 1
  WHERE id = v_otp.id;
  
  -- Vérifier si le code est correct
  IF v_otp.code = p_code THEN
    -- Marquer comme utilisé
    UPDATE otp_codes
    SET used = true
    WHERE id = v_otp.id;
    
    v_is_valid := true;
  ELSIF v_otp.attempts >= 2 THEN
    -- Max 3 tentatives (0, 1, 2) → marquer comme utilisé pour bloquer
    UPDATE otp_codes
    SET used = true
    WHERE id = v_otp.id;
  END IF;
  
  RETURN v_is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FONCTION: cleanup_expired_otps
-- Supprime les codes OTP expirés (>24h)
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes
  WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FONCTION: check_duplicate_contact
-- Vérifie si un email ou téléphone existe déjà
-- =====================================================

CREATE OR REPLACE FUNCTION check_duplicate_contact(p_email VARCHAR, p_phone VARCHAR)
RETURNS TABLE(email_exists BOOLEAN, phone_exists BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM auth.users WHERE email = p_email) as email_exists,
    EXISTS(SELECT 1 FROM profiles WHERE phone = p_phone) as phone_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS: otp_codes
-- =====================================================

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Lecture seule pour l'utilisateur (empêche les manipulations directes)
CREATE POLICY "Users can view own OTP codes"
  ON otp_codes
  FOR SELECT
  USING (true);

-- Aucune politique INSERT/UPDATE/DELETE → seules les fonctions SQL peuvent modifier

-- =====================================================
-- DONNÉES INITIALES (SEED)
-- =====================================================

-- Cette section sera remplie après création du premier utilisateur admin

-- =====================================================
-- FIN DU SCHÉMA
-- =====================================================

COMMENT ON DATABASE postgres IS 'Yo! Voisin - Plateforme de services entre voisins à Abidjan';
