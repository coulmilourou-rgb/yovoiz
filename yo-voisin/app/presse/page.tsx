'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Newspaper, Download, Mail, Calendar, 
  TrendingUp, Award, Users, Target
} from 'lucide-react';

export default function PressePage() {
  const { user, profile } = useAuth();

  const communiques = [
    {
      title: 'Yo!Voiz lève 500 millions FCFA pour accélérer son expansion en Côte d\'Ivoire',
      date: '15 Février 2026',
      category: 'Levée de fonds',
      excerpt: 'La plateforme de services de proximité annonce une levée de fonds majeure pour doubler son nombre de prestataires d\'ici fin 2026.',
      file: 'communique-levee-fonds-fev2026.pdf'
    },
    {
      title: 'Lancement de l\'abonnement Pro : nouvelles fonctionnalités pour les prestataires',
      date: '10 Février 2026',
      category: 'Produit',
      excerpt: 'Yo!Voiz dévoile son offre Pro avec tableau de bord analytique, gestion de devis/factures et répertoire clients illimité.',
      file: 'communique-abonnement-pro-fev2026.pdf'
    },
    {
      title: 'Yo!Voiz franchit le cap des 1000 prestataires inscrits',
      date: '1er Janvier 2026',
      category: 'Milestone',
      excerpt: 'Seulement 6 mois après son lancement, la plateforme compte déjà plus de 1000 prestataires actifs sur le Grand Abidjan.',
      file: 'communique-1000-prestataires-jan2026.pdf'
    }
  ];

  const stats = [
    { label: 'Utilisateurs actifs', value: '10,000+', icon: Users },
    { label: 'Prestataires vérifiés', value: '1,000+', icon: Award },
    { label: 'Transactions mensuelles', value: '2,000+', icon: TrendingUp },
    { label: 'Taux de satisfaction', value: '4.8/5', icon: Target }
  ];

  const medias = [
    {
      logo: '📺',
      name: 'RTI 1',
      article: 'Yo!Voiz : La plateforme qui révolutionne les services à domicile',
      date: 'Janvier 2026'
    },
    {
      logo: '📰',
      name: 'Fraternité Matin',
      article: 'Comment Yo!Voiz facilite l\'accès aux services de proximité',
      date: 'Décembre 2025'
    },
    {
      logo: '🌐',
      name: 'Abidjan.net',
      article: 'Startup de la semaine : Yo!Voiz mise sur l\'économie de proximité',
      date: 'Novembre 2025'
    }
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
          <Newspaper className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Espace Presse
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Actualités, communiqués et ressources média
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Yo!Voiz en chiffres
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-yo-orange mx-auto mb-3" />
                  <div className="text-4xl font-black text-yo-orange mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Communiqués de presse */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Communiqués de presse
          </h2>
          <div className="space-y-6">
            {communiques.map((communique, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">{communique.category}</Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {communique.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{communique.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{communique.excerpt}</p>
                  </div>
                  <Button variant="outline" className="whitespace-nowrap">
                    <Download className="w-4 h-4" />
                    Télécharger PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ils parlent de nous */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Ils parlent de nous
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {medias.map((media, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{media.logo}</div>
                <h3 className="font-bold text-lg mb-2">{media.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{media.article}</p>
                <p className="text-xs text-gray-500">{media.date}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kit média */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-8">
            Kit média
          </h2>
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Logos</h3>
                <p className="text-gray-600 mb-4">
                  Téléchargez nos logos en haute résolution (PNG, SVG)
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Télécharger les logos
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Captures d'écran</h3>
                <p className="text-gray-600 mb-4">
                  Images de la plateforme pour vos articles
                </p>
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                  Télécharger les captures
                </Button>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Présentation de l'entreprise</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Yo!Voiz est une plateforme ivoirienne de mise en relation entre particuliers et prestataires 
                de services de proximité. Lancée en juillet 2025, elle compte aujourd'hui plus de 10,000 utilisateurs 
                et 1,000 prestataires vérifiés sur le Grand Abidjan.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Notre mission : faciliter l'accès aux services du quotidien (ménage, plomberie, électricité, etc.) 
                en garantissant qualité, sécurité et transparence.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact presse */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Contact presse
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Pour toute demande d'interview ou d'information complémentaire
          </p>
          <div className="space-y-3">
            <p className="text-lg">
              <strong>Email :</strong> presse@yovoiz.com
            </p>
            <p className="text-lg">
              <strong>Téléphone :</strong> +225 XX XX XX XX XX
            </p>
            <p className="text-sm opacity-80 mt-6">
              Réponse garantie sous 24h ouvrées
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
