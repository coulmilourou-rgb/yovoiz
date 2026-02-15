'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Briefcase, MapPin, Clock, ArrowRight, 
  Heart, Users, TrendingUp, DollarSign
} from 'lucide-react';

interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  skills: string[];
  salary_range: string | null;
  published_at: string;
}

export default function CarrieresPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobOffers();
  }, []);

  async function loadJobOffers() {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Erreur chargement offres:', error);
    } finally {
      setLoading(false);
    }
  }

  const avantages = [
    {
      icon: TrendingUp,
      title: 'Croissance rapide',
      description: 'Rejoins une startup en pleine expansion avec des opportunités d\'évolution'
    },
    {
      icon: Users,
      title: 'Équipe passionnée',
      description: 'Collabore avec des talents motivés et bienveillants'
    },
    {
      icon: Heart,
      title: 'Impact social',
      description: 'Contribue à faciliter l\'accès aux services pour des milliers de personnes'
    },
    {
      icon: MapPin,
      title: 'Basé à Abidjan',
      description: 'Bureaux modernes à Cocody avec possibilité de télétravail'
    }
  ];



  const processus = [
    { step: 1, title: 'Candidature', description: 'Envoie ton CV et lettre de motivation' },
    { step: 2, title: 'Premier entretien', description: 'Échange téléphonique (30 min)' },
    { step: 3, title: 'Test technique', description: 'Cas pratique selon le poste' },
    { step: 4, title: 'Entretien final', description: 'Rencontre avec l\'équipe' },
    { step: 5, title: 'Offre', description: 'Proposition et démarrage' }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-yo-orange to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Rejoins l'équipe Yo!Voiz
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Construisons ensemble la plateforme de services n°1 en Côte d'Ivoire
          </p>
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Pourquoi Yo!Voiz ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {avantages.map((avantage, index) => {
              const Icon = avantage.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-yo-orange mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{avantage.title}</h3>
                  <p className="text-sm text-gray-600">{avantage.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Postes ouverts */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">
            Postes ouverts
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {loading ? 'Chargement...' : `${offers.length} opportunité${offers.length > 1 ? 's' : ''} disponible${offers.length > 1 ? 's' : ''}`}
          </p>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement des offres...</p>
            </div>
          ) : offers.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-600 mb-2">Aucune offre disponible pour le moment</p>
              <p className="text-gray-500">Revenez bientôt ou envoyez-nous une candidature spontanée !</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {offers.map((offer) => (
                <Card key={offer.id} className="p-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push(`/carrieres/${offer.id}`)}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-yo-orange/10 rounded-2xl flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-yo-orange" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">{offer.title}</h3>
                        <Badge variant="secondary">{offer.department}</Badge>
                        <Badge className="bg-yo-green text-white">{offer.employment_type}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {offer.location}
                        </span>
                        {offer.salary_range && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {offer.salary_range}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Publié le {new Date(offer.published_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">{offer.description}</p>
                      {offer.skills && offer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {offer.skills.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                          {offer.skills.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              +{offer.skills.length - 5} autres
                            </span>
                          )}
                        </div>
                      )}
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/carrieres/${offer.id}`);
                      }}>
                        Voir l'offre
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Processus de recrutement */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Notre processus de recrutement
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {processus.map((etape, index) => (
              <div key={index} className="relative">
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-yo-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    {etape.step}
                  </div>
                  <h3 className="font-bold mb-2">{etape.title}</h3>
                  <p className="text-sm text-gray-600">{etape.description}</p>
                </Card>
                {index < processus.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 -right-2 text-yo-orange">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">
            ⏱️ Processus complet en 2-3 semaines
          </p>
        </div>
      </section>

      {/* Culture d'entreprise */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-8">
            Notre culture
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">
                Liberté d'expérimenter et de proposer de nouvelles idées
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">
                Entraide et partage de connaissances au quotidien
              </p>
            </Card>
            <Card className="p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">Excellence</h3>
              <p className="text-sm text-gray-600">
                Exigence et qualité dans tout ce que nous faisons
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Candidature spontanée */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Tu ne trouves pas ton poste ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Envoie-nous une candidature spontanée, nous sommes toujours à la recherche de talents !
          </p>
          <Button size="lg" href="mailto:recrutement@yovoiz.com?subject=Candidature spontanée" className="bg-white text-yo-green hover:bg-gray-100">
            Candidature spontanée
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm opacity-80">
            📧 recrutement@yovoiz.com
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
