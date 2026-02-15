-- ================================================
-- CONFIGURATION DES NOTIFICATIONS EMAIL (VERSION SIMPLIFIÉE)
-- ================================================
-- Triggers adaptés aux tables existantes
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
  RAISE WARNING 'Erreur envoi email notification: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TRIGGER 1 : DEMANDE VALIDÉE
-- ================================================
CREATE OR REPLACE FUNCTION notify_request_validated()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    PERFORM call_email_notification(
      'request_validated',
      NEW.client_id,
      jsonb_build_object(
        'requestId', NEW.id,
        'title', NEW.title,
        'category', NEW.category,
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
  -- Récupérer le nom de l'expéditeur
  SELECT p.first_name || ' ' || p.last_name INTO sender_name
  FROM profiles p
  WHERE p.id = NEW.sender_id;
  
  -- Envoyer notification au destinataire
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
-- TRIGGER 3 : PROFIL VALIDÉ
-- ================================================
CREATE OR REPLACE FUNCTION notify_profile_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status = 'approved' AND (OLD.verification_status IS NULL OR OLD.verification_status != 'approved') THEN
    PERFORM call_email_notification(
      'profile_verified',
      NEW.id,
      jsonb_build_object(
        'firstName', NEW.first_name,
        'lastName', NEW.last_name,
        'verifiedAt', NEW.verified_at
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
-- VÉRIFICATION
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Triggers email créés avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Triggers actifs:';
  RAISE NOTICE '  1. request_validated_trigger (requests)';
  RAISE NOTICE '  2. new_message_trigger (messages)';
  RAISE NOTICE '  3. profile_verified_trigger (profiles)';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Note: Les triggers pour negotiations et transactions';
  RAISE NOTICE '     seront ajoutés quand ces tables seront créées.';
END $$;
