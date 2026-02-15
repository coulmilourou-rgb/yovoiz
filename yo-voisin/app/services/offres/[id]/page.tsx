'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit, Trash2, MapPin, Clock, DollarSign,
  CheckCircle, Star, Share2, MessageCircle, Calendar,
  Award, Shield, Zap, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';

export default function OffreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, profile } = useAuth();
  const [offre, setOffre] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadOffre();
    }
  }, [params?.id]);

  const loadOffre = async () => {
    try {
      const { data: offreData, error: offreError } = await supabase
        .from('service_offers')
        .select('*')
        .eq('id', params?.id)
        .single();

      if (offreError) throw offreError;
      setOffre(offreData);

      // Charger le profil du prestataire
      if (offreData?.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', offreData.user_id)
          .single();

        setProvider(profileData);
      }
    } catch (error) {
      console.error('Erreur chargement offre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const { error } = await supabase
        .from('service_offers')
        .delete()
        .eq('id', params?.id);

      if (error) throw error;
      
      alert('✅ Offre supprimée avec succès');
      router.push('/services/mes-offres');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const isOwner = user?.id === offre?.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Skeleton width="100%" height={600} />
        </div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-yo-gray-50">
        <Navbar isConnected={!!user} />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Offre introuvable</h2>
            <p className="text-gray-600 mb-6">Cette offre n'existe pas ou a été supprimée</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title={offre.title} 
        description={offre.description}
      />
      <Navbar 
        isConnected={!!user}
        user={profile ? {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={offre.status === 'published' ? 'success' : 'default'}>
                      {offre.status === 'published' ? 'Publiée' : 'Brouillon'}
                    </Badge>
                    {offre.featured && (
                      <Badge className="bg-orange-100 text-orange-800">
                        <Star className="w-3 h-3 mr-1" />
                        En vedette
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-display font-bold text-3xl text-yo-green-dark mb-2">
                    {offre.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {offre.location || 'Zone non spécifiée'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Publié le {new Date(offre.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/services/offres/${offre.id}/edit`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Tarification */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-800 mb-1">Tarif</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {offre.pricing?.toLocaleString('fr-FR') || '0'} FCFA
                    </p>
                    <p className="text-sm text-orange-700">
                      {offre.pricing_type === 'hourly' && '/ heure'}
                      {offre.pricing_type === 'fixed' && 'Prix fixe'}
                      {offre.pricing_type === 'custom' && 'Sur devis'}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-orange-600" />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-bold text-xl text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {offre.description}
                </p>
              </div>

              {/* Services inclus */}
              {offre.services_included && offre.services_included.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-xl text-gray-900 mb-3">Services inclus</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {offre.services_included.map((service: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disponibilité */}
              {offre.availability && (
                <div>
                  <h2 className="font-bold text-xl text-gray-900 mb-3">Disponibilité</h2>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span>{offre.availability}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prestataire */}
            {provider && (
              <Card className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Prestataire</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar 
                    firstName={provider.first_name}
                    lastName={provider.last_name}
                    size="lg"
                    verified={provider.is_verified}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {provider.first_name} {provider.last_name}
                    </h4>
                    {provider.provider_level && (
                      <Badge className="mt-1">
                        <Award className="w-3 h-3 mr-1" />
                        {provider.provider_level}
                      </Badge>
                    )}
                  </div>
                </div>

                {provider.provider_bio && (
                  <p className="text-sm text-gray-600 mb-4">{provider.provider_bio}</p>
                )}

                {!isOwner && (
                  <Button className="w-full" variant="secondary">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                )}

                <Button 
                  className="w-full mt-2" 
                  variant="outline"
                  onClick={() => router.push(`/profile/public/${provider.id}`)}
                >
                  Voir le profil
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            )}

            {/* Caractéristiques */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Caractéristiques</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Réponse</p>
                    <p className="font-semibold text-gray-900">Sous 24h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Paiement</p>
                    <p className="font-semibold text-gray-900">Sécurisé</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {!isOwner && (
              <Card className="p-6">
                <Button className="w-full mb-2" size="lg">
                  Demander un devis
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
