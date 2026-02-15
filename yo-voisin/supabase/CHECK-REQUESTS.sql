-- Afficher la structure de la table requests
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'requests'
ORDER BY ordinal_position;
