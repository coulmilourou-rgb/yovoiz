-- =====================================================
-- ACTIVATION POSTGIS ET INDEX GÉOGRAPHIQUE
-- À exécuter APRÈS le schéma principal
-- =====================================================

-- 1. Activer l'extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================================================
-- AJOUT COLONNES GÉOGRAPHIQUES AUX TABLES
-- =====================================================

-- Ajouter colonnes GPS aux profiles (prestataires)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

-- 2. Créer les index géographiques
CREATE INDEX IF NOT EXISTS idx_requests_location 
ON requests 
USING GIST(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326))
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_location 
ON profiles 
USING GIST(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326))
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. Fonction helper pour recherche par proximité
CREATE OR REPLACE FUNCTION nearby_requests(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  commune VARCHAR,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.commune,
    ROUND(
      CAST(
        ST_Distance(
          ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
          ST_SetSRID(ST_MakePoint(r.longitude, r.latitude), 4326)::geography
        ) / 1000 AS NUMERIC
      ), 2
    ) as distance_km
  FROM requests r
  WHERE r.latitude IS NOT NULL 
    AND r.longitude IS NOT NULL
    AND r.status = 'published'
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(r.longitude, r.latitude), 4326)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- 4. Fonction helper pour calculer distance entre 2 points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(
    CAST(
      ST_Distance(
        ST_SetSRID(ST_MakePoint(lon1, lat1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)::geography
      ) / 1000 AS NUMERIC
    ), 2
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DONNÉES DE TEST : Coordonnées GPS des communes
-- =====================================================

-- Coordonnées GPS approximatives des principales communes d'Abidjan
-- (à utiliser comme référence pour les tests)

COMMENT ON COLUMN requests.latitude IS 'Latitude GPS (WGS84)';
COMMENT ON COLUMN requests.longitude IS 'Longitude GPS (WGS84)';

-- Exemples de coordonnées par commune (centres approximatifs):
-- Cocody: 5.3600, -4.0083
-- Marcory: 5.2850, -3.9850
-- Plateau: 5.3267, -4.0267
-- Yopougon: 5.3450, -4.1183
-- Abobo: 5.4217, -4.0200
-- Koumassi: 5.2900, -3.9400
-- Treichville: 5.2850, -4.0050
-- Adjamé: 5.3550, -4.0317
-- Port-Bouët: 5.2617, -3.9150

-- =====================================================
-- TESTS ET VÉRIFICATIONS
-- =====================================================

-- Vérifier que PostGIS est bien installé
SELECT PostGIS_version();

-- Tester la fonction de proximité (exemple avec Cocody)
-- SELECT * FROM nearby_requests(5.3600, -4.0083, 10);

-- Tester le calcul de distance entre 2 points
-- SELECT calculate_distance(5.3600, -4.0083, 5.2850, -3.9850) as distance_km;

-- =====================================================
-- FIN
-- =====================================================

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';
