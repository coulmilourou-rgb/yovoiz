-- =====================================================
-- SCRIPT OTP SIMPLIFIÉ - Version Sans Erreur
-- Copiez TOUT ce script et exécutez-le dans Supabase
-- =====================================================

-- Étape 1 : Créer la table otp_codes
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Étape 2 : Créer les index
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);

-- Étape 3 : Fonction pour générer un code OTP
CREATE OR REPLACE FUNCTION generate_otp_code(p_phone VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  v_code VARCHAR(6);
BEGIN
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::VARCHAR, 6, '0');
  
  UPDATE otp_codes
  SET used = true
  WHERE phone = p_phone
    AND used = false
    AND expires_at > NOW();
  
  INSERT INTO otp_codes (phone, code, expires_at)
  VALUES (p_phone, v_code, NOW() + INTERVAL '10 minutes');
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Étape 4 : Fonction pour vérifier un code OTP
CREATE OR REPLACE FUNCTION verify_otp_code(p_phone VARCHAR, p_code VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  v_otp RECORD;
  v_is_valid BOOLEAN := false;
BEGIN
  SELECT * INTO v_otp
  FROM otp_codes
  WHERE phone = p_phone
    AND used = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  UPDATE otp_codes
  SET attempts = attempts + 1
  WHERE id = v_otp.id;
  
  IF v_otp.code = p_code THEN
    UPDATE otp_codes
    SET used = true
    WHERE id = v_otp.id;
    
    v_is_valid := true;
  ELSIF v_otp.attempts >= 2 THEN
    UPDATE otp_codes
    SET used = true
    WHERE id = v_otp.id;
  END IF;
  
  RETURN v_is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Étape 5 : Activer RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Étape 6 : Supprimer l'ancienne politique si elle existe
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;

-- Étape 7 : Créer la politique de lecture
CREATE POLICY "Users can view own OTP codes"
  ON otp_codes
  FOR SELECT
  USING (true);

-- =====================================================
-- TEST : Décommentez ces lignes pour tester
-- =====================================================
-- SELECT generate_otp_code('+2250123456789');
-- SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 5;
