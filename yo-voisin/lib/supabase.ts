import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

// Client Supabase pour l'application
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // ✅ CRITIQUE: Forcer le stockage en cookies pour que le middleware puisse détecter l'auth
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        // Lire depuis localStorage ET créer un cookie pour le middleware
        const value = localStorage.getItem(key);
        if (value && key.includes('auth-token')) {
          // Créer un cookie qui dure 7 jours
          document.cookie = `sb-auth-token=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
        }
        return value;
      },
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        // Créer AUSSI un cookie pour que le middleware puisse le détecter
        if (key.includes('auth-token')) {
          document.cookie = `sb-auth-token=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
        }
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        // Supprimer le cookie aussi
        if (key.includes('auth-token')) {
          document.cookie = 'sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },
    } : undefined,
  },
});

// Helper pour vérifier la connexion
export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}
