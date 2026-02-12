import { supabase, checkSupabaseConnection } from './supabase';

export async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase...\n');
  
  const isConnected = await checkSupabaseConnection();
  
  if (isConnected) {
    console.log('✅ Connexion Supabase réussie !');
    console.log('📦 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    return true;
  } else {
    console.error('❌ Échec de connexion Supabase');
    console.error('Vérifiez que :');
    console.error('1. Le schéma SQL a bien été exécuté dans Supabase');
    console.error('2. Les variables .env.local sont correctes');
    console.error('3. Le projet Supabase est actif');
    return false;
  }
}

export async function getSupabaseStats() {
  try {
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const { count: requestsCount } = await supabase
      .from('requests')
      .select('*', { count: 'exact', head: true });
    
    console.log('\n📊 Statistiques Supabase :');
    console.log(`   - Profils : ${profilesCount || 0}`);
    console.log(`   - Demandes : ${requestsCount || 0}`);
    
    return {
      profiles: profilesCount || 0,
      requests: requestsCount || 0,
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error);
    return null;
  }
}
