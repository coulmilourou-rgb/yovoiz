-- ================================================
-- CONFIGURATION DES NOTIFICATIONS EMAIL
-- ================================================
-- Ce fichier crée les triggers PostgreSQL pour envoyer
-- automatiquement des emails lors d'événements importants
--
-- Prérequis : Extension http activée
-- Date : 15 Février 2026
-- ================================================

-- Activer l'extension http (nécessaire pour les webhooks)
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
DECLARE
  function_url TEXT;
  api_key TEXT;
BEGIN
  -- URL de la Edge Function (à remplacer par votre URL Supabase)
  function_url := 'https://hfrmctsvpszqdizritoe.supabase.co/functions/v1/send-email-notification';
  
  -- Clé API (à stocker dans les secrets Supabase)
  -- npx supabase secrets set EMAIL_FUNCTION_KEY=your-key
  api_key := current_setting('app.email_function_key', true);
  
  -- Appel HTTP POST vers la Edge Function
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || api_key
    ),
    body := jsonb_build_object(
      'type', notification_type,
      'userId', user_id,
      'data', notification_data
    )::text
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log l'erreur mais ne bloque pas la transaction principale
  RAISE WARNING 'Erreur envoi email notification: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TRIGGER 1 : DEMANDE VALIDÉE PAR LE BACK OFFICE
-- ================================================
CREATE OR REPLACE FUNCTION notify_request_validated()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le statut passe de 'pending' à 'published'
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
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
-- TRIGGER 2 : NOUVELLE PROPOSITION REÇUE
-- ================================================
CREATE OR REPLACE FUNCTION notify_new_proposal()
RETURNS TRIGGER AS $$
DECLARE
  request_owner_id UUID;
  provider_name TEXT;
BEGIN
  -- Récupérer l'ID du propriétaire de la demande
  SELECT r.client_id INTO request_owner_id
  FROM requests r
  WHERE r.id = NEW.request_id;
  
  -- Récupérer le nom du prestataire
  SELECT p.first_name || ' ' || p.last_name INTO provider_name
  FROM profiles p
  WHERE p.id = NEW.provider_id;
  
  -- Envoyer notification au client
  IF request_owner_id IS NOT NULL THEN
    PERFORM call_email_notification(
      'new_proposal',
      request_owner_id,
      jsonb_build_object(
        'negotiationId', NEW.id,
        'requestId', NEW.request_id,
        'providerId', NEW.provider_id,
        'providerName', provider_name,
        'amount', NEW.amount,
        'message', NEW.message,
        'createdAt', NEW.created_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS new_proposal_trigger ON negotiations;
CREATE TRIGGER new_proposal_trigger
AFTER INSERT ON negotiations
FOR EACH ROW
WHEN (NEW.type = 'devis' OR NEW.type = 'counter_offer')
EXECUTE FUNCTION notify_new_proposal();

-- ================================================
-- TRIGGER 3 : NOUVEAU MESSAGE REÇU
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
-- TRIGGER 4 : PROFIL VALIDÉ PAR LE BACK OFFICE
-- ================================================
CREATE OR REPLACE FUNCTION notify_profile_verified()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le profil passe de non-vérifié à vérifié
  IF NEW.is_verified = true AND (OLD.is_verified IS NULL OR OLD.is_verified = false) THEN
    PERFORM call_email_notification(
      'profile_verified',
      NEW.id,
      jsonb_build_object(
        'firstName', NEW.first_name,
        'lastName', NEW.last_name,
        'verifiedAt', NOW()
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
-- TRIGGER 5 : TRANSACTION EFFECTUÉE AVEC SUCCÈS
-- ================================================
CREATE OR REPLACE FUNCTION notify_transaction_completed()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
  provider_name TEXT;
BEGIN
  -- Si la transaction est marquée comme complétée
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Récupérer les noms
    SELECT p.first_name || ' ' || p.last_name INTO client_name
    FROM profiles p WHERE p.id = NEW.client_id;
    
    SELECT p.first_name || ' ' || p.last_name INTO provider_name
    FROM profiles p WHERE p.id = NEW.provider_id;
    
    -- Email au CLIENT
    PERFORM call_email_notification(
      'transaction_completed_client',
      NEW.client_id,
      jsonb_build_object(
        'transactionId', NEW.id,
        'reference', NEW.reference,
        'amount', NEW.amount,
        'providerName', provider_name,
        'completedAt', NEW.completed_at
      )
    );
    
    -- Email au PRESTATAIRE
    PERFORM call_email_notification(
      'transaction_completed_provider',
      NEW.provider_id,
      jsonb_build_object(
        'transactionId', NEW.id,
        'reference', NEW.reference,
        'amount', NEW.amount,
        'clientName', client_name,
        'completedAt', NEW.completed_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transaction_completed_trigger ON transactions;
CREATE TRIGGER transaction_completed_trigger
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION notify_transaction_completed();

-- ================================================
-- VÉRIFICATION DE L'INSTALLATION
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Triggers email créés avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Triggers actifs:';
  RAISE NOTICE '  1. request_validated_trigger (requests)';
  RAISE NOTICE '  2. new_proposal_trigger (negotiations)';
  RAISE NOTICE '  3. new_message_trigger (messages)';
  RAISE NOTICE '  4. profile_verified_trigger (profiles)';
  RAISE NOTICE '  5. transaction_completed_trigger (transactions)';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT:';
  RAISE NOTICE '  - Déployer la Edge Function send-email-notification';
  RAISE NOTICE '  - Configurer les secrets Supabase (EMAIL_FUNCTION_KEY)';
  RAISE NOTICE '  - Créer un compte Brevo/SendGrid';
  RAISE NOTICE '  - Tester chaque trigger manuellement';
END $$;
