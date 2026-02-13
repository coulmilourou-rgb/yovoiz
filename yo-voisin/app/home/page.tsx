'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Attendre que l'authentification soit initialisée
    if (loading) return;

    // Si pas d'utilisateur, rediriger vers connexion
    if (!user) {
      router.push('/auth/connexion');
      return;
    }

    // Si utilisateur mais pas encore de profil, attendre
    if (!profile) {
      return;
    }

    // Rediriger vers le dashboard approprié
    const targetRoute = profile.role === 'prestataire' 
      ? '/dashboard/prestataire' 
      : '/dashboard/client';
    
    router.push(targetRoute);
  }, [user, profile, loading, router]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-yo-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-green mx-auto mb-4"></div>
        <p className="text-yo-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
}
