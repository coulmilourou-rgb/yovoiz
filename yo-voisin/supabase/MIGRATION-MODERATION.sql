-- Script de migration pour le système de modération
-- À exécuter dans Supabase SQL Editor

-- 1. Modifier le type enum pour requests.status (ajouter 'pending' et 'rejected')
-- Note: Si l'enum existe déjà, il faut le recréer
DO $$ 
BEGIN
    -- Supprimer l'ancienne contrainte si elle existe
    ALTER TABLE requests DROP CONSTRAINT IF EXISTS requests_status_check;
    
    -- Ajouter nouvelle contrainte avec tous les statuts
    ALTER TABLE requests 
    ADD CONSTRAINT requests_status_check 
    CHECK (status IN ('pending', 'published', 'in_progress', 'completed', 'cancelled', 'disputed', 'rejected'));
    
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Contrainte déjà modifiée ou erreur: %', SQLERRM;
END $$;

-- 2. Modifier service_offers.status
DO $$ 
BEGIN
    ALTER TABLE service_offers DROP CONSTRAINT IF EXISTS service_offers_status_check;
    
    ALTER TABLE service_offers 
    ADD CONSTRAINT service_offers_status_check 
    CHECK (status IN ('pending', 'active', 'inactive', 'rejected'));
    
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Contrainte service_offers déjà modifiée: %', SQLERRM;
END $$;

-- 3. Créer table moderation_queue (file d'attente de modération)
CREATE TABLE IF NOT EXISTS moderation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Type de contenu
    content_type TEXT NOT NULL CHECK (content_type IN ('request', 'service_offer', 'review', 'profile')),
    content_id UUID NOT NULL,
    
    -- Auteur
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Statut modération
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Détails
    title TEXT,
    description TEXT,
    
    -- Modérateur
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index
    CONSTRAINT unique_moderation_item UNIQUE (content_type, content_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_user_id ON moderation_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON moderation_queue(created_at DESC);

-- 4. Function: Créer automatiquement une entrée de modération lors d'une nouvelle demande
CREATE OR REPLACE FUNCTION create_moderation_entry_request()
RETURNS TRIGGER AS $$
BEGIN
    -- Seulement si status = 'pending'
    IF NEW.status = 'pending' THEN
        INSERT INTO moderation_queue (
            content_type,
            content_id,
            user_id,
            title,
            description,
            status
        )
        VALUES (
            'request',
            NEW.id,
            NEW.requester_id,
            NEW.title,
            NEW.description,
            'pending'
        )
        ON CONFLICT (content_type, content_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger pour requests
DROP TRIGGER IF EXISTS trigger_moderation_request ON requests;
CREATE TRIGGER trigger_moderation_request
    AFTER INSERT ON requests
    FOR EACH ROW
    EXECUTE FUNCTION create_moderation_entry_request();

-- 6. Function: Créer automatiquement une entrée de modération pour service_offers
CREATE OR REPLACE FUNCTION create_moderation_entry_service_offer()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'pending' THEN
        INSERT INTO moderation_queue (
            content_type,
            content_id,
            user_id,
            title,
            description,
            status
        )
        VALUES (
            'service_offer',
            NEW.id,
            NEW.provider_id,
            NEW.title,
            NEW.description,
            'pending'
        )
        ON CONFLICT (content_type, content_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger pour service_offers
DROP TRIGGER IF EXISTS trigger_moderation_service_offer ON service_offers;
CREATE TRIGGER trigger_moderation_service_offer
    AFTER INSERT ON service_offers
    FOR EACH ROW
    EXECUTE FUNCTION create_moderation_entry_service_offer();

-- 8. Function: Approuver un contenu (appelée par admin)
CREATE OR REPLACE FUNCTION approve_content(
    p_moderation_id UUID,
    p_admin_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_content_type TEXT;
    v_content_id UUID;
    v_result JSONB;
BEGIN
    -- Récupérer les infos de modération
    SELECT content_type, content_id 
    INTO v_content_type, v_content_id
    FROM moderation_queue
    WHERE id = p_moderation_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Modération introuvable ou déjà traitée');
    END IF;
    
    -- Mettre à jour selon le type
    IF v_content_type = 'request' THEN
        UPDATE requests 
        SET status = 'published', published_at = NOW()
        WHERE id = v_content_id;
        
    ELSIF v_content_type = 'service_offer' THEN
        UPDATE service_offers 
        SET status = 'active'
        WHERE id = v_content_id;
    END IF;
    
    -- Marquer comme approuvé
    UPDATE moderation_queue
    SET status = 'approved',
        reviewed_by = p_admin_id,
        reviewed_at = NOW()
    WHERE id = p_moderation_id;
    
    RETURN jsonb_build_object('success', true, 'content_id', v_content_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Function: Rejeter un contenu
CREATE OR REPLACE FUNCTION reject_content(
    p_moderation_id UUID,
    p_admin_id UUID,
    p_reason TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_content_type TEXT;
    v_content_id UUID;
BEGIN
    SELECT content_type, content_id 
    INTO v_content_type, v_content_id
    FROM moderation_queue
    WHERE id = p_moderation_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Modération introuvable');
    END IF;
    
    -- Mettre à jour le statut
    IF v_content_type = 'request' THEN
        UPDATE requests 
        SET status = 'rejected'
        WHERE id = v_content_id;
        
    ELSIF v_content_type = 'service_offer' THEN
        UPDATE service_offers 
        SET status = 'rejected'
        WHERE id = v_content_id;
    END IF;
    
    -- Marquer comme rejeté
    UPDATE moderation_queue
    SET status = 'rejected',
        reviewed_by = p_admin_id,
        reviewed_at = NOW(),
        rejection_reason = p_reason
    WHERE id = p_moderation_id;
    
    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. RLS (Row Level Security) pour moderation_queue
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- Admin peut tout voir
CREATE POLICY "Admins can view all moderation queue"
    ON moderation_queue FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Users peuvent voir leurs propres entrées
CREATE POLICY "Users can view their own moderation entries"
    ON moderation_queue FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- 11. Notification: Créer notification lors de l'approbation
CREATE OR REPLACE FUNCTION notify_content_approved()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (
            user_id,
            type,
            title,
            body,
            data
        )
        VALUES (
            NEW.user_id,
            'content_approved',
            CASE 
                WHEN NEW.content_type = 'request' THEN '✅ Demande approuvée'
                WHEN NEW.content_type = 'service_offer' THEN '✅ Offre approuvée'
                ELSE '✅ Contenu approuvé'
            END,
            CASE 
                WHEN NEW.content_type = 'request' THEN 'Votre demande a été validée et est maintenant visible publiquement.'
                WHEN NEW.content_type = 'service_offer' THEN 'Votre offre a été validée et est maintenant active.'
                ELSE 'Votre contenu a été approuvé.'
            END,
            jsonb_build_object(
                'content_type', NEW.content_type,
                'content_id', NEW.content_id
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_approved ON moderation_queue;
CREATE TRIGGER trigger_notify_approved
    AFTER UPDATE ON moderation_queue
    FOR EACH ROW
    WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
    EXECUTE FUNCTION notify_content_approved();

-- 12. Notification: Rejeter
CREATE OR REPLACE FUNCTION notify_content_rejected()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (
            user_id,
            type,
            title,
            body,
            data
        )
        VALUES (
            NEW.user_id,
            'content_rejected',
            '❌ Contenu rejeté',
            'Votre publication a été rejetée. Raison: ' || COALESCE(NEW.rejection_reason, 'Non spécifiée'),
            jsonb_build_object(
                'content_type', NEW.content_type,
                'content_id', NEW.content_id,
                'reason', NEW.rejection_reason
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_rejected ON moderation_queue;
CREATE TRIGGER trigger_notify_rejected
    AFTER UPDATE ON moderation_queue
    FOR EACH ROW
    WHEN (NEW.status = 'rejected' AND OLD.status = 'pending')
    EXECUTE FUNCTION notify_content_rejected();

-- Succès!
SELECT 'Migration système de modération terminée ✅' AS message;
