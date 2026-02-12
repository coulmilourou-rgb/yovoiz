-- =====================================================
-- AJOUT VERIFICATION SMS/EMAIL + ANTI-DUPLICATION
-- À exécuter APRÈS schema.sql principal
-- =====================================================

-- 1. Ajouter colonnes de vérification dans profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS quartier VARCHAR(100);

-- 2. Créer la table pour les codes OTP
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('phone_verification', 'password_reset')),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_otp_user_id ON otp_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);

-- 3. Fonction pour nettoyer les OTP expirés (à exécuter via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 4. Fonction pour vérifier si un email/téléphone existe déjà
CREATE OR REPLACE FUNCTION check_duplicate_contact(
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL
)
RETURNS TABLE (
  email_exists BOOLEAN,
  phone_exists BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXISTS(SELECT 1 FROM auth.users WHERE email = p_email) AS email_exists,
    EXISTS(SELECT 1 FROM profiles WHERE phone = p_phone) AS phone_exists;
END;
$$ LANGUAGE plpgsql;

-- 5. Fonction pour générer un code OTP à 6 chiffres
CREATE OR REPLACE FUNCTION generate_otp_code(
  p_user_id UUID,
  p_phone VARCHAR(20),
  p_type VARCHAR(20)
)
RETURNS VARCHAR(6) AS $$
DECLARE
  v_code VARCHAR(6);
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Générer code aléatoire 6 chiffres
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  -- Expiration dans 10 minutes
  v_expires_at := NOW() + INTERVAL '10 minutes';
  
  -- Invalider les anciens codes non utilisés pour ce téléphone
  UPDATE otp_codes 
  SET used = true, used_at = NOW()
  WHERE phone = p_phone 
    AND type = p_type 
    AND used = false;
  
  -- Insérer le nouveau code
  INSERT INTO otp_codes (user_id, phone, code, type, expires_at)
  VALUES (p_user_id, p_phone, v_code, p_type, v_expires_at);
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- 6. Fonction pour vérifier un code OTP
CREATE OR REPLACE FUNCTION verify_otp_code(
  p_phone VARCHAR(20),
  p_code VARCHAR(6),
  p_type VARCHAR(20)
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  user_id UUID
) AS $$
DECLARE
  v_otp RECORD;
BEGIN
  -- Chercher le code
  SELECT * INTO v_otp
  FROM otp_codes
  WHERE phone = p_phone
    AND code = p_code
    AND type = p_type
    AND used = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Code non trouvé ou expiré
  IF v_otp IS NULL THEN
    RETURN QUERY SELECT false, 'Code invalide ou expiré'::TEXT, NULL::UUID;
    RETURN;
  END IF;
  
  -- Trop de tentatives
  IF v_otp.attempts >= 3 THEN
    RETURN QUERY SELECT false, 'Trop de tentatives. Demandez un nouveau code'::TEXT, NULL::UUID;
    RETURN;
  END IF;
  
  -- Code valide
  UPDATE otp_codes 
  SET used = true, used_at = NOW()
  WHERE id = v_otp.id;
  
  -- Mettre à jour le profil si vérification téléphone
  IF p_type = 'phone_verification' THEN
    UPDATE profiles 
    SET phone_verified = true, phone_verified_at = NOW()
    WHERE id = v_otp.user_id;
  END IF;
  
  RETURN QUERY SELECT true, 'Code vérifié avec succès'::TEXT, v_otp.user_id;
END;
$$ LANGUAGE plpgsql;

-- 7. RLS (Row Level Security) pour otp_codes
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que leurs propres codes
CREATE POLICY "Users can view own OTP codes"
  ON otp_codes FOR SELECT
  USING (auth.uid() = user_id);

-- Personne ne peut insérer/update directement (via fonctions uniquement)
CREATE POLICY "OTP codes managed by functions"
  ON otp_codes FOR INSERT
  WITH CHECK (false);

-- 8. Commentaires
COMMENT ON TABLE otp_codes IS 'Codes OTP pour vérification SMS et reset password';
COMMENT ON COLUMN profiles.phone_verified IS 'Le numéro de téléphone a été vérifié par OTP';
COMMENT ON COLUMN profiles.email_verified IS 'L''email a été vérifié';
COMMENT ON FUNCTION generate_otp_code IS 'Génère un code OTP à 6 chiffres valable 10 minutes';
COMMENT ON FUNCTION verify_otp_code IS 'Vérifie un code OTP et met à jour le statut de vérification';
COMMENT ON FUNCTION check_duplicate_contact IS 'Vérifie si un email ou téléphone existe déjà';

-- =====================================================
-- FIN
-- =====================================================
