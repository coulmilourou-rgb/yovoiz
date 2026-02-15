# Configuration Cron pour expire-negotiations

Cette Edge Function doit être déployée sur Supabase et configurée en cron.

## Déploiement

```bash
# Se connecter à Supabase
supabase login

# Déployer la fonction
supabase functions deploy expire-negotiations --project-ref YOUR_PROJECT_REF

# Vérifier le déploiement
supabase functions list
```

## Configuration Cron

Dans le dashboard Supabase:
1. Aller dans **Database** > **Cron Jobs** (pg_cron extension)
2. Créer un nouveau cron job:

```sql
-- Exécuter toutes les heures
SELECT cron.schedule(
  'expire-negotiations-hourly',
  '0 * * * *', -- Toutes les heures à 0 minutes
  $$
  SELECT 
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/expire-negotiations',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := '{}'::jsonb
    ) AS request_id;
  $$
);
```

## Alternative: pg_cron via SQL

Si pg_cron n'est pas disponible dans l'UI, exécuter directement:

```sql
-- 1. Activer l'extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Créer le cron job
SELECT cron.schedule(
  'expire-negotiations-hourly',
  '0 * * * *',
  $$
  UPDATE negotiations
  SET 
    status = 'expired',
    updated_at = NOW()
  WHERE 
    status IN ('pending', 'countered')
    AND expires_at < NOW();
  $$
);

-- 3. Vérifier les jobs actifs
SELECT * FROM cron.job;

-- 4. Voir l'historique d'exécution
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

## Test manuel

```bash
# Test local (avec Supabase CLI)
curl -X POST http://localhost:54321/functions/v1/expire-negotiations \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"

# Test production
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/expire-negotiations \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

## Monitoring

Logs disponibles dans:
- Supabase Dashboard > Edge Functions > expire-negotiations > Logs
- Supabase Dashboard > Database > Cron Jobs > Job run details

## Notes

- La fonction s'exécute **toutes les heures**
- Elle met à jour SEULEMENT les négociations avec `expires_at < NOW()` et `status IN ('pending', 'countered')`
- Les notifications sont TODO (nécessite table `notifications`)
- Temps d'exécution typique: < 2 secondes pour 100 négociations

## Variables d'environnement requises

Supabase injecte automatiquement:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Pas de configuration manuelle nécessaire.
