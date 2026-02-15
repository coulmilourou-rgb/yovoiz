'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Handshake, Building2, TrendingUp, Users, 
  Award, Target, CheckCircle, ArrowRight,
  Zap, Globe, HeartHandshake
} from 'lucide-react';

export default function PartenairesPage() {
  const { user, profile } = useAuth();

  const typesPartenariats = [
    {
      icon: Building2,
      title: 'Partenaires Entreprises',
      description: 'Intégrez Yo!Voiz pour offrir des services à vos employés (ménage, plomberie, etc.)',
      benefits: [
        'Accès dédié pour vos collaborateurs',
        'Tarifs préférentiels négociés',
        'Suivi et reporting mensuel',
        'Support prioritaire'
      ],
      cta: 'Devenir partenaire entreprise'
    },
    {
      icon: Award,
      title: 'Partenaires Formation',
      description: 'Centres de formation et écoles pour former les prestataires de demain',
      benefits: [
        'Accès gratuit pour vos étudiants',
        'Plateforme de mise en pratique',
        'Opportunités de stage',
        'Co-branding sur les profils'
      ],
      cta: 'Partenariat formation'
    },
    {
      icon: Globe,
      title: 'Partenaires Technologiques',
      description: 'Solutions tech complémentaires (paiement, assurance, logistique)',
      benefits: [
        'Intégration API',
        'Co-marketing',
        'Partage de données (anonymisées)',
        'Opportunités de croissance'
      ],
      cta: 'Partenariat tech'
    }
  ];

  const partenairesActuels = [
    {
      logo: '🏦',
      name: 'Orange Money',
      category: 'Paiement',
      description: 'Solution de paiement mobile pour des transactions sécurisées'
    },
    {
      logo: '🏢',
      name: 'MTN Mobile Money',
      category: 'Paiement',
      description: 'Service de transfert d\'argent mobile leader en Côte d\'Ivoire'
    },
    {
      logo: '🛡️',
      name: 'AXA Assurances',
      category: 'Assurance',
      description: 'Protection et couverture pour les prestataires professionnels'
    },
    {
      logo: '🎓',
      name: 'ESATIC',
      category: 'Formation',
      description: 'École supérieure de technologie pour former les talents tech'
    },
    {
      logo: '📱',
      name: 'Moov Money',
      category: 'Paiement',
      description: 'Plateforme de mobile money en pleine expansion'
    },
    {
      logo: '🏗️',
      name: 'CFPPA',
      category: 'Formation',
      description: 'Centre de formation professionnelle pour artisans et techniciens'
    }
  ];

  const avantages = [
    {
      icon: TrendingUp,
      title: 'Croissance mutuelle',
      description: 'Accédez à notre base de 10,000+ utilisateurs actifs'
    },
    {
      icon: Users,
      title: 'Réseau qualifié',
      description: 'Profils vérifiés et communauté engagée'
    },
    {
      icon: Zap,
      title: 'Innovation continue',
      description: 'Plateforme en constante évolution avec nouvelles fonctionnalités'
    },
    {
      icon: HeartHandshake,
      title: 'Impact social',
      description: 'Contribuez à l\'économie locale et à l\'emploi'
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
          <Handshake className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-display font-black text-5xl md:text-6xl mb-6">
            Devenez Partenaire
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Ensemble, développons l'économie des services en Côte d'Ivoire
          </p>
        </div>
      </section>

      {/* Types de partenariats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Types de partenariats
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {typesPartenariats.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                  <Icon className="w-12 h-12 text-yo-orange mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{type.description}</p>
                  <ul className="space-y-2 mb-6">
                    {type.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-yo-green flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button href="mailto:partenariats@yovoiz.com" variant="outline" className="w-full">
                    {type.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nos partenaires actuels */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {partenairesActuels.length} partenaires stratégiques
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {partenairesActuels.map((partenaire, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{partenaire.logo}</div>
                <h3 className="text-xl font-bold mb-2">{partenaire.name}</h3>
                <div className="inline-block bg-yo-orange/10 text-yo-orange px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {partenaire.category}
                </div>
                <p className="text-sm text-gray-600">{partenaire.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages partenariat */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Pourquoi devenir partenaire ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {avantages.map((avantage, index) => {
              const Icon = avantage.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-yo-green mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{avantage.title}</h3>
                  <p className="text-sm text-gray-600">{avantage.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Cas d'usage concrets
          </h2>
          <div className="space-y-8">
            <Card className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-yo-orange/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-yo-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Entreprise X + Yo!Voiz</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Une entreprise de 500 employés a intégré Yo!Voiz pour offrir des services de conciergerie 
                    (ménage, plomberie, électricité) à ses collaborateurs. Résultat : satisfaction employé +40%, 
                    réduction absentéisme de 15%.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-yo-green font-semibold">
                    <span>✓ 500 utilisateurs activés</span>
                    <span>✓ 1,200 services réalisés</span>
                    <span>✓ 4.9/5 satisfaction</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-yo-green/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-yo-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">École Y + Yo!Voiz</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Un centre de formation en plomberie utilise Yo!Voiz comme plateforme de mise en pratique pour 
                    ses étudiants. Les élèves acquièrent de l'expérience réelle et trouvent des clients dès la fin 
                    de leur formation.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-yo-green font-semibold">
                    <span>✓ 120 étudiants formés</span>
                    <span>✓ 80% trouvent un emploi</span>
                    <span>✓ 300+ missions réalisées</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Fintech Z + Yo!Voiz</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Intégration de la solution de paiement mobile Z pour faciliter les transactions. 
                    Résultat : taux de conversion paiement +60%, fraude réduite de 90%.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-yo-green font-semibold">
                    <span>✓ 5,000 transactions/mois</span>
                    <span>✓ 0.1% fraude</span>
                    <span>✓ Paiement en 2 clics</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">
            Comment devenir partenaire ?
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yo-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Contactez-nous</h3>
                <p className="text-gray-600">
                  Envoyez-nous un email à partenariats@yovoiz.com avec une brève présentation de votre organisation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yo-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Échange initial</h3>
                <p className="text-gray-600">
                  Appel de 30 min pour comprendre vos besoins et présenter nos solutions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yo-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Proposition sur-mesure</h3>
                <p className="text-gray-600">
                  Nous concevons une offre adaptée à vos objectifs et contraintes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yo-orange text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Signature et lancement</h3>
                <p className="text-gray-600">
                  Accord contractuel et déploiement du partenariat sous 2-4 semaines
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-yo-green to-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Construisons ensemble l'avenir
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez notre équipe partenariats pour discuter des opportunités de collaboration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" href="mailto:partenariats@yovoiz.com" className="bg-white text-yo-green hover:bg-gray-100">
              Nous contacter
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" href="/presse" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
              Télécharger notre dossier
            </Button>
          </div>
          <p className="mt-8 text-sm opacity-80">
            📧 partenariats@yovoiz.com • 📞 +225 XX XX XX XX XX
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
