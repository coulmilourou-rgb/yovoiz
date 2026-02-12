/**
 * Script simplifié pour créer un utilisateur TEST dans Supabase
 * 
 * Email: test@yovoiz.com
 * Mot de passe: Test1234!
 * 
 * Exécution: node scripts/create-test-user-simple.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Lire les variables d'environnement depuis .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Fichier .env.local non trouvé');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });

  return env;
}

async function createTestUser() {
  console.log('🚀 Création de l\'utilisateur test...\n');
  
  const env = loadEnv();
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Variables d\'environnement manquantes dans .env.local');
    console.error('Vérifie que .env.local contient:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // 1. Inscription de l'utilisateur
    console.log('📝 Étape 1: Inscription de l\'utilisateur...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@yovoiz.com',
      password: 'Test1234!',
      options: {
        data: {
          full_name: 'Utilisateur Test Yo! Voiz',
          phone: '+2250700000000',
        },
      },
    });

    if (authError) {
      // Si l'utilisateur existe déjà
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        console.log('⚠️  L\'utilisateur existe déjà, tentative de connexion...\n');
        
        // Connexion pour récupérer l'ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'test@yovoiz.com',
          password: 'Test1234!',
        });

        if (signInError) {
          console.error('❌ Impossible de se connecter:', signInError.message);
          console.log('\n💡 L\'utilisateur existe probablement avec un autre mot de passe.');
          console.log('Options:');
          console.log('1. Supprime l\'utilisateur test@yovoiz.com via le Dashboard Supabase');
          console.log('2. Ou utilise un autre email dans le script');
          process.exit(1);
        }

        const userId = signInData.user.id;
        console.log('✅ Utilisateur connecté:', userId);
        await updateProfile(supabase, userId);
        return;
      } else {
        throw authError;
      }
    }

    const userId = authData.user?.id;
    
    if (!userId) {
      throw new Error('Impossible de récupérer l\'ID utilisateur');
    }

    console.log('✅ Utilisateur créé avec l\'ID:', userId);
    console.log('');

    // 2. Créer/Mettre à jour le profil
    await updateProfile(supabase, userId);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('\n📋 Stack:', error);
    process.exit(1);
  }
}

async function updateProfile(supabase, userId) {
  console.log('📝 Étape 2: Création/mise à jour du profil...');

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: 'Utilisateur Test Yo! Voiz',
      phone: '+2250700000000',
      commune: 'Cocody',
      quartier: 'Riviera Palmeraie',
      address_details: 'Adresse de test pour développement',
      verification_status: 'verified',
      email_verified: true,
      phone_verified: true,
      profile_completed: true,
      user_type: 'client',
    }, {
      onConflict: 'id',
    });

  if (profileError) {
    console.error('❌ Erreur création profil:', profileError);
    throw profileError;
  }

  console.log('✅ Profil créé/mis à jour');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('✨ UTILISATEUR TEST CRÉÉ AVEC SUCCÈS !');
  console.log('');
  console.log('📧 Email:        test@yovoiz.com');
  console.log('🔒 Mot de passe: Test1234!');
  console.log('');
  console.log('Tu peux maintenant te connecter sur:');
  console.log('🌐 http://localhost:3001/auth/connexion');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Exécution
createTestUser();
