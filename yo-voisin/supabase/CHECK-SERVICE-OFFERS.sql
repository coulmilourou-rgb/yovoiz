-- Afficher la structure de la table service_offers
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'service_offers'
ORDER BY ordinal_position;
