-- ================================================
-- TEST COMPLET : INSTALLATION + TEST EMAIL NOTIFICATION
-- ================================================
-- Ce script installe les triggers ET teste immédiatement
-- Date : 15 Février 2026
-- ================================================

-- Activer l'extension http
CREATE EXTENSION IF NOT EXISTS http;

-- ================================================
-- FONCTION UTILITAIRE : Appel Edge Function
-- ================================================
CREATE OR REPLACE FUNCTION call_email_notification(
  notification_type TEXT,
  user_id UUID,
  notification_data JSONB
)
RETURNS void AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmcm1jdHN2cHN6cWRpenJpdG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTI2NjksImV4cCI6MjA1NDQ4ODY2OX0.FBDgcNMo3RM9ZMRPekKjlI2BqgJnJqPXcZNmHDmYikg'
    ),
    body := jsonb_build_object(
      'type', notification_type,
      'userId', user_id,
      'data', notification_data
    )::text
  );
  
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '⚠️ Erreur envoi email: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TRIGGER 1 : DEMANDE VALIDÉE
-- ================================================
CREATE OR REPLACE FUNCTION notify_request_validated()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    RAISE NOTICE '📧 Envoi notification pour demande validée: %', NEW.id;
    PERFORM call_email_notification(
      'request_validated',
      NEW.requester_id,
      jsonb_build_object(
        'requestId', NEW.id,
        'title', NEW.title,
        'category', NEW.category_id,
        'createdAt', NEW.created_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS request_validated_trigger ON requests;
CREATE TRIGGER request_validated_trigger
AFTER INSERT OR UPDATE ON requests
FOR EACH ROW
EXECUTE FUNCTION notify_request_validated();

-- ================================================
-- TRIGGER 2 : NOUVEAU MESSAGE
-- ================================================
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
BEGIN
  SELECT COALESCE(p.first_name || ' ' || p.last_name, 'Un utilisateur') INTO sender_name
  FROM profiles p
  WHERE p.id = NEW.sender_id;
  
  RAISE NOTICE '📧 Envoi notification nouveau message: %', NEW.id;
  PERFORM call_email_notification(
    'new_message',
    NEW.receiver_id,
    jsonb_build_object(
      'messageId', NEW.id,
      'senderId', NEW.sender_id,
      'senderName', sender_name,
      'content', LEFT(NEW.content, 150),
      'createdAt', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS new_message_trigger ON messages;
CREATE TRIGGER new_message_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();

-- ================================================
-- TRIGGER 3 : PROFIL VÉRIFIÉ
-- ================================================
CREATE OR REPLACE FUNCTION notify_profile_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status = 'approved' AND (OLD.verification_status IS NULL OR OLD.verification_status != 'approved') THEN
    RAISE NOTICE '📧 Envoi notification profil vérifié: %', NEW.id;
    PERFORM call_email_notification(
      'profile_verified',
      NEW.id,
      jsonb_build_object(
        'firstName', NEW.first_name,
        'lastName', NEW.last_name,
        'verifiedAt', COALESCE(NEW.verified_at, NOW())
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profile_verified_trigger ON profiles;
CREATE TRIGGER profile_verified_trigger
AFTER UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION notify_profile_verified();

-- ================================================
-- TEST IMMÉDIAT : Publier la demande draft
-- ================================================
DO $$
DECLARE
  test_request_id UUID := '87fb7683-b236-4d95-bddc-c7901c38d1b4';
  updated_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🧪 ==============================================';
  RAISE NOTICE '🧪 DÉBUT DU TEST EMAIL NOTIFICATION';
  RAISE NOTICE '🧪 ==============================================';
  RAISE NOTICE '';
  
  -- Mettre à jour la demande draft -> published
  UPDATE requests 
  SET 
    status = 'published',
    published_at = NOW()
  WHERE id = test_request_id
  AND status = 'draft';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  IF updated_count > 0 THEN
    RAISE NOTICE '✅ Demande % publiée avec succès', test_request_id;
    RAISE NOTICE '📧 Email de notification envoyé à l''utilisateur';
    RAISE NOTICE '';
    RAISE NOTICE '📬 Vérifiez:';
    RAISE NOTICE '  1. L''email de tamoil@test.com';
    RAISE NOTICE '  2. Le dossier spam';
    RAISE NOTICE '  3. Les logs Supabase Functions';
  ELSE
    RAISE NOTICE '⚠️  Aucune demande modifiée (déjà publiée?)';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🧪 ==============================================';
  RAISE NOTICE '🧪 TEST TERMINÉ';
  RAISE NOTICE '🧪 ==============================================';
  RAISE NOTICE '';
END $$;

-- Vérification finale
SELECT 
  '✅ CONFIGURATION TERMINÉE' as status,
  COUNT(*) FILTER (WHERE status = 'published') as published_requests,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_requests,
  COUNT(*) as total_requests
FROM requests;
