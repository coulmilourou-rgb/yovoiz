import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook personnalisé pour protéger les pages qui nécessitent une authentification.
 * Redirige vers /auth/connexion seulement si :
 * - Le chargement est terminé
 * - Il n'y a vraiment pas d'utilisateur
 * - Il n'y a pas de profil chargé
 * 
 * Cela évite les redirections intempestives lors du refresh de token.
 */
export function useRequireAuth() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Ne rediriger que si :
    // 1. Le chargement auth est terminé
    // 2. Il n'y a vraiment pas d'utilisateur
    // 3. Il n'y a pas de profil (double vérification)
    if (!loading && !user && !profile) {
      console.log('🔒 Accès non autorisé - redirection vers connexion');
      router.push('/auth/connexion');
    }
  }, [user, profile, loading, router]);

  return { user, profile, loading };
}
