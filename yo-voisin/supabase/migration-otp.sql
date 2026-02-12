-- =====================================================
-- SCRIPT DE MIGRATION : Système OTP
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. Créer la table otp_codes
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index pour performance
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);

-- 3. Fonction : Générer un code OTP
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

-- 4. Fonction : Vérifier un code OTP
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

-- 5. Activer RLS (Row Level Security)
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- 6. Politique : Lecture seule pour tous
-- Supprimer la politique si elle existe déjà
DROP POLICY IF EXISTS "Users can view own OTP codes" ON otp_codes;

-- Créer la nouvelle politique
CREATE POLICY "Users can view own OTP codes"
  ON otp_codes
  FOR SELECT
  USING (true);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Pour vérifier que tout fonctionne, testez avec :
-- SELECT generate_otp_code('+2250123456789');
-- SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 5;
