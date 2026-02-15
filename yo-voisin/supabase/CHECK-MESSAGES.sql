-- Vérifier la structure de conversations
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'conversations'
ORDER BY ordinal_position;

-- Vérifier la structure de messages
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;

-- Compter les données
SELECT 'Conversations' AS type, COUNT(*) AS total FROM conversations;
SELECT 'Messages' AS type, COUNT(*) AS total FROM messages;
