/**
 * Script pour créer un utilisateur TEST dans Supabase
 * 
 * Email: test@yovoiz.com
 * Mot de passe: Test1234!
 * 
 * Exécution: node scripts/create-test-user.js
 */

const { createClient } = require('@supabase/supabase-js');

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Vérifie que .env.local contient NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function createTestUser() {
  console.log('🚀 Création de l\'utilisateur test...\n');
  
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
      // Si l'utilisateur existe déjà, ce n'est pas grave
      if (authError.message.includes('already registered')) {
        console.log('⚠️  L\'utilisateur existe déjà, on continue...\n');
        
        // Connexion pour récupérer l'ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'test@yovoiz.com',
          password: 'Test1234!',
        });

        if (signInError) {
          throw signInError;
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
