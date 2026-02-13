'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  phone_verified?: boolean;
  avatar_url?: string;
  bio?: string;
  user_type: 'client' | 'provider' | 'both';
  role: 'demandeur' | 'prestataire' | 'both';
  is_active?: boolean;
  is_banned?: boolean;
  verification_status?: 'pending' | 'submitted' | 'verified' | 'rejected';
  verified_at?: string;
  commune: string;
  quartier?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  total_missions_completed?: number;
  average_rating?: number;
  total_reviews?: number;
  is_premium?: boolean;
  premium_until?: string;
  created_at?: string;
  updated_at?: string;
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
        console.log('🚀 AuthContext - Initialisation...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log('📦 Session récupérée:', currentSession ? '✅ Oui' : '❌ Non');
        if (currentSession) {
          console.log('👤 User ID:', currentSession.user.id);
          console.log('📧 Email:', currentSession.user.email);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          console.log('⚠️ Pas de session - Utilisateur non connecté');
        }
      } catch (error) {
        console.error('❌ Erreur d\'initialisation auth:', error);
      } finally {
        setLoading(false);
        console.log('✅ AuthContext - Initialisation terminée');
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔔 Auth State Change:', event);
        console.log('📦 Nouvelle session:', currentSession ? '✅ Oui' : '❌ Non');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_IN' && currentSession?.user) {
          console.log('✅ Event: SIGNED_IN - Chargement du profil puis redirection');
          
          // Attendre que le profil se charge
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();
          
          if (profileData) {
            const targetRoute = profileData.role === 'prestataire' 
              ? '/dashboard/prestataire' 
              : '/dashboard/client';
            console.log('➡️ Redirection vers:', targetRoute);
            router.push(targetRoute);
          } else {
            // Fallback si pas de profil
            router.push('/dashboard/client');
          }
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('🚪 Event: SIGNED_OUT - Redirection vers /');
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
    try {
      console.log('🔐 SignIn - Début de la connexion...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📦 SignIn - Réponse Supabase:');
      console.log('  - Data:', data);
      console.log('  - Error:', error);
      console.log('  - Session:', data?.session);
      console.log('  - User:', data?.user);

      if (error) {
        console.error('❌ SignIn - Erreur:', error);
        return { error };
      }

      if (data?.session) {
        console.log('✅ SignIn - Session créée, mise à jour du contexte...');
        setSession(data.session);
        setUser(data.user);
        
        // Charger le profil immédiatement
        if (data.user) {
          console.log('🔍 SignIn - Chargement du profil...');
          await fetchProfile(data.user.id);
        }
        
        console.log('✅ SignIn - Contexte mis à jour avec succès');
      } else {
        console.warn('⚠️ SignIn - Pas de session retournée !');
      }

      return { error: null };
    } catch (err) {
      console.error('❌ SignIn - Exception:', err);
      return { error: err as AuthError };
    }
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
