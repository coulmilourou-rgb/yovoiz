'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Timeout de 5 secondes - si le profil ne se charge pas, rediriger vers dashboard/client par défaut
    const timeout = setTimeout(() => {
      if (!profile && user) {
        console.warn('⏱️ Timeout atteint - Redirection vers /dashboard/client par défaut');
        setTimeoutReached(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [profile, user]);

  useEffect(() => {
    // Attendre que l'authentification soit initialisée
    if (loading) return;

    // Si pas d'utilisateur, rediriger vers connexion
    if (!user) {
      console.log('🔒 Pas d\'utilisateur - Redirection vers /auth/connexion');
      router.push('/auth/connexion');
      return;
    }

    // Si timeout atteint, rediriger vers dashboard client par défaut
    if (timeoutReached && user) {
      console.log('⚠️ Profil non chargé après timeout - Redirection forcée vers /dashboard/client');
      router.push('/dashboard/client');
      return;
    }

    // Si profil chargé, rediriger vers le dashboard approprié
    if (profile) {
      const targetRoute = profile.role === 'prestataire' 
        ? '/dashboard/prestataire' 
        : '/dashboard/client';
      
      console.log('✅ Profil chargé - Redirection vers:', targetRoute);
      router.push(targetRoute);
    }
  }, [user, profile, loading, timeoutReached, router]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-yo-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-green mx-auto mb-4"></div>
        <p className="text-yo-gray-600">Redirection en cours...</p>
        {timeoutReached && (
          <p className="text-sm text-yo-gray-500 mt-2">Connexion en cours...</p>
        )}
      </div>
    </div>
  );
}
