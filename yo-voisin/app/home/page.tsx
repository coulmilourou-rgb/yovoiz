'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationBanner } from '@/components/auth/VerificationBanner';
import { RequireVerification } from '@/components/auth/RequireVerification';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Plus, MapPin, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/connexion');
      return;
    }

    // Rediriger vers le dashboard approprié selon le rôle
    if (!loading && profile) {
      if (profile.role === 'demandeur' || profile.role === 'client') {
        router.push('/dashboard/client');
      } else if (profile.role === 'prestataire' || profile.role === 'provider') {
        router.push('/dashboard/prestataire');
      } else if (profile.role === 'both') {
        // Par défaut, rediriger vers le dashboard client pour les utilisateurs "both"
        // Ils pourront naviguer entre les deux depuis la navbar
        router.push('/dashboard/client');
      }
    }
  }, [user, loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-green"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <Navbar isConnected={true} />
      
      {/* Bannière de vérification */}
      <VerificationBanner />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-4xl text-yo-green-dark mb-2">
            Bienvenue {profile.first_name} ! 👋
          </h1>
          <p className="text-yo-gray-600 text-lg">
            {profile.role === 'demandeur' && 'Que cherches-tu aujourd\'hui ?'}
            {profile.role === 'prestataire' && 'Découvre les nouvelles demandes'}
            {profile.role === 'both' && 'Explorez les demandes ou publiez la vôtre'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <RequireVerification action="publier une demande">
            <Card className="p-6 hover:shadow-yo-lg transition cursor-pointer">
              <div className="w-12 h-12 bg-yo-orange-pale rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-yo-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Publier une demande</h3>
              <p className="text-sm text-yo-gray-600">Trouvez un prestataire pour votre besoin</p>
            </Card>
          </RequireVerification>

          <Card className="p-6 hover:shadow-yo-lg transition cursor-pointer">
            <div className="w-12 h-12 bg-yo-green-pale rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-yo-green-dark" />
            </div>
            <h3 className="font-bold text-lg mb-2">Parcourir les services</h3>
            <p className="text-sm text-yo-gray-600">Découvrez tous les services disponibles</p>
          </Card>

          <Card className="p-6 hover:shadow-yo-lg transition cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Près de chez vous</h3>
            <p className="text-sm text-yo-gray-600">Services dans {profile.commune}</p>
          </Card>
        </div>

        {/* Demandes populaires */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-extrabold text-2xl text-yo-green-dark">
              Demandes populaires
            </h2>
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <RequireVerification key={i} action="répondre à une demande">
                <Card className="p-6 hover:shadow-yo-lg transition cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="success">Ménage</Badge>
                    <span className="text-xs text-yo-gray-400">Il y a 2h</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    Besoin d'aide pour le ménage hebdomadaire
                  </h3>
                  <p className="text-sm text-yo-gray-600 mb-4">
                    Appartement 3 pièces à nettoyer chaque samedi matin...
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-yo-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>Cocody</span>
                    </div>
                    <span className="font-bold text-yo-orange">15.000 - 20.000 FCFA</span>
                  </div>
                </Card>
              </RequireVerification>
            ))}
          </div>
        </div>

        {/* Stats si prestataire */}
        {(profile.role === 'prestataire' || profile.role === 'both') && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-yo-green mx-auto mb-3" />
              <p className="text-3xl font-bold text-yo-green-dark mb-1">0</p>
              <p className="text-sm text-yo-gray-600">Candidatures envoyées</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">💰</div>
              <p className="text-3xl font-bold text-yo-green-dark mb-1">0 FCFA</p>
              <p className="text-sm text-yo-gray-600">Revenus totaux</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">⭐</div>
              <p className="text-3xl font-bold text-yo-green-dark mb-1">0.0</p>
              <p className="text-sm text-yo-gray-600">Note moyenne</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-3">🏆</div>
              <p className="text-3xl font-bold text-yo-green-dark mb-1">Bronze</p>
              <p className="text-sm text-yo-gray-600">Niveau actuel</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
