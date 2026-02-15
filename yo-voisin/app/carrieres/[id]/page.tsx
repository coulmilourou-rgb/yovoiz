'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, MapPin, Clock, Briefcase, 
  CheckCircle, AlertCircle, DollarSign, Calendar
} from 'lucide-react';

interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary_range: string | null;
  published_at: string;
  expires_at: string | null;
}

export default function JobOfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobOffer();
  }, [params.id]);

  async function loadJobOffer() {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('id', params.id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setOffer(data);
    } catch (error) {
      console.error('Erreur chargement offre:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar 
          isConnected={!!user} 
          user={profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url
          } : undefined}
        />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar 
          isConnected={!!user} 
          user={profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url
          } : undefined}
        />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Offre introuvable</h1>
          <p className="text-gray-600 mb-6">Cette offre n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => router.push('/carrieres')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux offres
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/carrieres')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux offres
        </Button>

        {/* Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black mb-3">{offer.title}</h1>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary">{offer.department}</Badge>
                <Badge className="bg-yo-green text-white">{offer.employment_type}</Badge>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={() => router.push(`/carrieres/${offer.id}/postuler`)}
              className="bg-yo-orange hover:bg-orange-600"
            >
              Postuler à cette offre
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{offer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>{offer.employment_type}</span>
            </div>
            {offer.salary_range && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>{offer.salary_range}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Publié le {new Date(offer.published_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">À propos du poste</h2>
          <p className="text-gray-700 leading-relaxed">{offer.description}</p>
        </Card>

        {/* Responsibilities */}
        {offer.responsibilities && offer.responsibilities.length > 0 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Responsabilités</h2>
            <ul className="space-y-3">
              {offer.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Requirements */}
        {offer.requirements && offer.requirements.length > 0 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Profil recherché</h2>
            <ul className="space-y-3">
              {offer.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Skills */}
        {offer.skills && offer.skills.length > 0 && (
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Compétences techniques</h2>
            <div className="flex flex-wrap gap-3">
              {offer.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-yo-orange to-orange-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Intéressé(e) par ce poste ?
          </h2>
          <p className="mb-6 text-white/90">
            Envoie ta candidature maintenant et rejoins l'équipe Yo!Voiz !
          </p>
          <Button 
            size="lg"
            onClick={() => router.push(`/carrieres/${offer.id}/postuler`)}
            className="bg-white text-yo-orange hover:bg-gray-100"
          >
            Postuler maintenant
          </Button>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
