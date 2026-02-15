// Edge Function: expire-negotiations
// Supabase Edge Function pour expirer automatiquement les négociations après 72h
// À déployer avec: supabase functions deploy expire-negotiations
// Cron schedule: 0 * * * * (toutes les heures)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Init Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🔍 Recherche des négociations expirées...');

    // Trouver négociations expirées (status pending/countered + expires_at < now)
    const { data: expiredNegotiations, error: fetchError } = await supabase
      .from('negotiations')
      .select('id, mission_id, client_id, provider_id, expires_at')
      .in('status', ['pending', 'countered'])
      .lt('expires_at', new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredNegotiations || expiredNegotiations.length === 0) {
      console.log('✅ Aucune négociation expirée trouvée');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Aucune négociation expirée',
          count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    console.log(`⏰ ${expiredNegotiations.length} négociations expirées trouvées`);

    // Mettre à jour le status à 'expired'
    const { error: updateError } = await supabase
      .from('negotiations')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .in('id', expiredNegotiations.map(n => n.id));

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ ${expiredNegotiations.length} négociations expirées mises à jour`);

    // TODO: Envoyer notifications aux parties
    for (const nego of expiredNegotiations) {
      console.log(`📧 TODO: Notifier client ${nego.client_id} et provider ${nego.provider_id}`);
      
      // Future: Créer notifications dans table notifications
      // await supabase.from('notifications').insert([
      //   {
      //     user_id: nego.client_id,
      //     type: 'negotiation_expired',
      //     title: 'Négociation expirée',
      //     message: 'La négociation a expiré après 72h sans réponse',
      //     link: `/negotiations/${nego.id}`
      //   },
      //   {
      //     user_id: nego.provider_id,
      //     type: 'negotiation_expired',
      //     title: 'Négociation expirée',
      //     message: 'La négociation a expiré après 72h sans réponse',
      //     link: `/negotiations/${nego.id}`
      //   }
      // ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${expiredNegotiations.length} négociations expirées`,
        count: expiredNegotiations.length,
        negotiations: expiredNegotiations.map(n => ({
          id: n.id,
          mission_id: n.mission_id,
          expires_at: n.expires_at
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Erreur expire-negotiations:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erreur inconnue'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
