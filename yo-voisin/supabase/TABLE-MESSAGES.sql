-- =====================================================
-- SYSTÈME DE MESSAGERIE TEMPS RÉEL
-- Conversations + Messages avec Supabase Realtime
-- =====================================================

-- Table: conversations
-- Une conversation entre 2 utilisateurs (demandeur ↔ prestataire)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contexte (optionnel)
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  negotiation_id UUID REFERENCES negotiations(id) ON DELETE SET NULL,
  
  -- Dernier message (pour tri et preview)
  last_message_content TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_by UUID REFERENCES profiles(id),
  
  -- Non lus
  unread_count_user1 INT DEFAULT 0,
  unread_count_user2 INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT unique_users UNIQUE(user1_id, user2_id),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Index
CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_request ON conversations(request_id) WHERE request_id IS NOT NULL;

-- Table: messages
-- Messages individuels dans une conversation
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Contenu
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]', -- [{type: 'image', url: '...'}, ...]
  
  -- Statut
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT non_empty_content CHECK (LENGTH(TRIM(content)) > 0)
);

-- Index
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = false;

-- Fonction: Créer ou récupérer une conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user1_id UUID,
  p_user2_id UUID,
  p_request_id UUID DEFAULT NULL,
  p_mission_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conversation_id UUID;
  v_min_user_id UUID;
  v_max_user_id UUID;
BEGIN
  -- Trier les IDs pour garantir unicité (user1 < user2)
  IF p_user1_id < p_user2_id THEN
    v_min_user_id := p_user1_id;
    v_max_user_id := p_user2_id;
  ELSE
    v_min_user_id := p_user2_id;
    v_max_user_id := p_user1_id;
  END IF;
  
  -- Chercher conversation existante
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE user1_id = v_min_user_id AND user2_id = v_max_user_id;
  
  -- Créer si n'existe pas
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (user1_id, user2_id, request_id, mission_id)
    VALUES (v_min_user_id, v_max_user_id, p_request_id, p_mission_id)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$;

-- Fonction: Mettre à jour les compteurs après envoi message
CREATE OR REPLACE FUNCTION update_conversation_after_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_recipient_id UUID;
  v_is_user1 BOOLEAN;
BEGIN
  -- Déterminer le destinataire
  SELECT 
    CASE 
      WHEN NEW.sender_id = user1_id THEN user2_id 
      ELSE user1_id 
    END,
    NEW.sender_id = user1_id
  INTO v_recipient_id, v_is_user1
  FROM conversations
  WHERE id = NEW.conversation_id;
  
  -- Mettre à jour conversation
  UPDATE conversations
  SET 
    last_message_content = NEW.content,
    last_message_at = NEW.created_at,
    last_message_by = NEW.sender_id,
    unread_count_user1 = CASE 
      WHEN v_is_user1 THEN unread_count_user1 
      ELSE unread_count_user1 + 1 
    END,
    unread_count_user2 = CASE 
      WHEN v_is_user1 THEN unread_count_user2 + 1 
      ELSE unread_count_user2 
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$;

-- Trigger: Auto-update après nouveau message
CREATE TRIGGER trigger_update_conversation_after_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_after_message();

-- Fonction: Marquer messages comme lus
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
  v_is_user1 BOOLEAN;
BEGIN
  -- Marquer les messages non lus de l'autre utilisateur
  UPDATE messages
  SET is_read = true, read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND is_read = false
  RETURNING COUNT(*) INTO v_count;
  
  -- Réinitialiser compteur non lus
  SELECT (user1_id = p_user_id) INTO v_is_user1
  FROM conversations
  WHERE id = p_conversation_id;
  
  UPDATE conversations
  SET 
    unread_count_user1 = CASE WHEN v_is_user1 THEN 0 ELSE unread_count_user1 END,
    unread_count_user2 = CASE WHEN v_is_user1 THEN unread_count_user2 ELSE 0 END
  WHERE id = p_conversation_id;
  
  RETURN COALESCE(v_count, 0);
END;
$$;

-- =====================================================
-- RLS POLICIES - Messagerie
-- =====================================================

-- Conversations: Lecture (user1 ou user2)
CREATE POLICY "Users can view their own conversations"
ON conversations FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Conversations: Création (user1 ou user2)
CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Conversations: Update (user1 ou user2)
CREATE POLICY "Users can update their conversations"
ON conversations FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages: Lecture (membres de la conversation)
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
  )
);

-- Messages: Création (membres de la conversation + sender)
CREATE POLICY "Users can send messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
  )
);

-- Messages: Update (sender uniquement, pour soft delete)
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id);

-- Activer RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- REALTIME - Activer les publications
-- =====================================================

-- Activer Realtime sur les tables
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Commentaires
COMMENT ON TABLE conversations IS 'Conversations privées entre 2 utilisateurs';
COMMENT ON TABLE messages IS 'Messages individuels dans les conversations';
COMMENT ON FUNCTION get_or_create_conversation IS 'Créer ou récupérer une conversation existante';
COMMENT ON FUNCTION mark_messages_as_read IS 'Marquer messages comme lus et réinitialiser compteur';
