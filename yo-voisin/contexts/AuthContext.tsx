'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  user_type?: 'client' | 'provider' | 'both';
  full_name?: string;
  phone?: string;
  commune?: string;
  quartier?: string;
  address_details?: string;
  avatar_url?: string;
  bio?: string;
  verification_status?: 'pending' | 'submitted' | 'verified' | 'rejected';
  email_verified?: boolean;
  phone_verified?: boolean;
  profile_completed?: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isVerified: boolean;
  canPublishRequest: boolean;
  canApplyToRequest: boolean;
  canSendMessage: boolean;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Chargement du profil pour:', userId);
      console.log('📡 Début de la requête Supabase...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📦 Réponse Supabase reçue');
      console.log('📊 Data:', data);
      console.log('❌ Error:', error);

      if (error) {
        console.error('❌ Erreur chargement profil - Code:', error.code);
        console.error('❌ Erreur chargement profil - Message:', error.message);
        console.error('❌ Erreur chargement profil - Details:', error.details);
        console.error('❌ Erreur chargement profil - Hint:', error.hint);
        
        // Si le profil n'existe pas, créer un profil minimal
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profil introuvable, création d\'un profil par défaut...');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              first_name: 'Utilisateur',
              last_name: 'Nouveau',
              phone: '0000000000',
              user_type: 'client',
              role: 'demandeur',
              commune: 'Abidjan'
            })
            .select()
            .single();
          
          console.log('📦 Résultat création profil:', newProfile);
          console.log('❌ Erreur création:', insertError);
          
          if (newProfile) {
            console.log('✅ Profil créé:', newProfile);
            setProfile(newProfile);
            return;
          }
        }
        
        console.error('❌ fetchProfile échoue, setProfile(null)');
        setProfile(null);
        return;
      }

      if (!data) {
        console.error('⚠️ Pas de data retournée mais pas d\'erreur non plus !');
        setProfile(null);
        return;
      }

      console.log('✅ Profil chargé avec succès:', data);
      setProfile(data);
    } catch (error) {
      console.error('❌ Exception lors du chargement du profil:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_IN') {
          router.refresh();
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          router.push('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      // ✅ Configuration de l'URL de redirection pour l'email de confirmation
      const siteUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://yovoiz.vercel.app';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/confirm-email`,
          data: {
            user_type: userData.user_type || 'client',
            full_name: userData.full_name || '',
            phone: userData.phone || '',
            commune: userData.commune || '',
            quartier: userData.quartier || '',
            phone_verified: true,
            profile_completed: true,
          },
        },
      });

      if (error) {
        console.error('❌ Erreur signUp Supabase:', error);
        return { error };
      }

      console.log('✅ Inscription réussie - Email de confirmation envoyé à:', email);
      console.log('📧 Vérifiez votre boîte de réception (et spam)');
      
      return { error: null };
    } catch (error) {
      console.error('❌ Exception signUp:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Non authentifié') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Demande de réinitialisation pour:', email);
      console.log('URL de redirection:', `${window.location.origin}/auth/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      console.log('Résultat resetPasswordForEmail:', { error });

      if (error) {
        console.error('Erreur Supabase:', error);
      }

      return { error };
    } catch (error) {
      console.error('Exception dans resetPassword:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Helpers de vérification
  const isVerified = profile?.verification_status === 'verified';
  const canPublishRequest = isVerified; // Seuls les vérifiés peuvent publier
  const canApplyToRequest = isVerified; // Seuls les vérifiés peuvent postuler
  const canSendMessage = isVerified; // Seuls les vérifiés peuvent envoyer des messages

  const value = {
    user,
    profile,
    session,
    loading,
    isVerified,
    canPublishRequest,
    canApplyToRequest,
    canSendMessage,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
