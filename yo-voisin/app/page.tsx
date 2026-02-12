'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { CATEGORIES, COMMUNES } from '@/lib/constants';
import { 
  Search, Wrench, Lock, CheckCircle, Star, 
  MapPin, ChevronDown, Play, TrendingUp,
  Users, Shield, Award, Clock, MessageCircle,
  Phone, Mail, Facebook, Instagram, Twitter,
  HeartHandshake, Sparkles, ArrowRight, ChevronRight,
  Zap, Target
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar isConnected={false} />

      {/* HERO SECTION AMÉLIORÉ */}
      <HeroSection />

      {/* STATISTIQUES DE CONFIANCE */}
      <StatsSection />

      {/* DEMANDES RÉCENTES */}
      <RecentRequestsSection />

      {/* COMMENT ÇA MARCHE */}
      <HowItWorksSection />

      {/* TOP PRESTATAIRES */}
      <TopProvidersSection />

      {/* POURQUOI YO! VOISIN */}
      <WhyYoVoisinSection />

      {/* SERVICES POPULAIRES */}
      <CategoriesSection />

      {/* AVANTAGES COMPÉTITIFS */}
      <CompetitiveAdvantagesSection />

      {/* TÉMOIGNAGES */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* PARTENAIRES ET CERTIFICATIONS */}
      <PartnersSection />

      {/* CTA FINAL */}
      <FinalCTASection />

      {/* FOOTER */}
      <Footer />
    </main>
  );
}

// ========== RECENT REQUESTS SECTION ==========
function RecentRequestsSection() {
  const requests = [
    {
      title: 'Ménage complet appartement 3 pièces',
      commune: 'Cocody',
      category: 'Ménage',
      budget: '15.000 - 20.000 FCFA',
      time: 'Il y a 12 min',
      proposals: 8,
      urgent: true,
    },
    {
      title: 'Réparation fuite robinet cuisine',
      commune: 'Marcory',
      category: 'Plomberie',
      budget: '10.000 - 15.000 FCFA',
      time: 'Il y a 34 min',
      proposals: 5,
      urgent: false,
    },
    {
      title: 'Cours de soutien maths lycée',
      commune: 'Plateau',
      category: 'Soutien scolaire',
      budget: '25.000 FCFA/mois',
      time: 'Il y a 1h',
      proposals: 12,
      urgent: false,
    },
  ];

  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-16 px-6 bg-white border-y border-yo-gray-200">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-2">
              Dernières demandes publiées
            </h2>
            <p className="text-yo-gray-500">Des voisins cherchent un prestataire maintenant</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            Voir toutes les demandes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requests.map((request, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-yo-lg transition-all cursor-pointer hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={request.urgent ? 'success' : 'default'}>
                    {request.urgent ? '🔥 Urgent' : request.category}
                  </Badge>
                  <span className="text-xs text-yo-gray-400">{request.time}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{request.title}</h3>
                <div className="flex items-center gap-2 text-sm text-yo-gray-500 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{request.commune}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-yo-gray-200">
                  <span className="font-bold text-yo-orange">{request.budget}</span>
                  <span className="text-sm text-yo-gray-500">{request.proposals} propositions</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 md:hidden"
        >
          <Button variant="outline" className="w-full">
            Voir toutes les demandes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ========== HERO SECTION ==========
function HeroSection() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(COMMUNES[6]); // Cocody par défaut

  return (
    <section className="relative bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light py-24 px-6 overflow-hidden">
      {/* Cercles décoratifs animés */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-yo-orange/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-80 h-80 bg-yo-orange/5 rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Badge 100% Ivoirien */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-semibold mb-6"
          >
            <span className="text-2xl">🇨🇮</span>
            <span>100% Ivoirien • Abidjan</span>
          </motion.div>

          {/* Titre principal avec animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-black text-5xl md:text-7xl text-white mb-6 leading-tight"
          >
            On dit quoi ? 👋
            <br />
            <span className="text-yo-orange">Ton voisin est là !</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/90 text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Trouve un voisin de confiance pour <strong>tous tes services du quotidien</strong> à Abidjan
            <br />
            <span className="text-lg text-white/80">Ménage • Bricolage • Cours • Livraisons • Et bien plus !</span>
          </motion.p>
        </div>

        {/* Barre de recherche améliorée */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            {/* Service */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-yo-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Quel service cherches-tu ? (ex: ménage, bricolage...)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full outline-none text-yo-gray-800 placeholder:text-yo-gray-400 text-base"
              />
            </div>

            {/* Séparateur */}
            <div className="hidden md:block w-px bg-yo-gray-200 my-2" />

            {/* Commune */}
            <div className="flex items-center gap-2 px-4 py-2 md:w-48">
              <MapPin className="w-5 h-5 text-yo-gray-400 shrink-0" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="outline-none text-yo-gray-800 bg-transparent cursor-pointer w-full font-medium"
              >
                {COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-yo-gray-400" />
            </div>

            {/* Bouton */}
            <Button size="lg" variant="secondary" className="shrink-0 font-bold shadow-yo-md hover:shadow-yo-lg transition-all">
              Rechercher
            </Button>
          </div>

          {/* Suggestions rapides */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            <span className="text-white/70 text-sm">Populaires :</span>
            {['Ménage', 'Plomberie', 'Cours particuliers', 'Déménagement'].map((term) => (
              <button
                key={term}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full backdrop-blur-sm transition"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* CTAs secondaires */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="bg-white text-yo-green-dark hover:bg-white/90 shadow-xl hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
            Devenir prestataire
          </Button>
          <button className="flex items-center gap-2 text-white hover:text-white/80 transition group">
            <div className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-md transition group-hover:scale-110">
              <Play className="w-5 h-5 ml-1" />
            </div>
            <span className="font-semibold">Voir comment ça marche</span>
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6 mt-12 text-white/80 text-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-yo-orange" />
            <span>Inscription 100% gratuite</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yo-orange" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yo-orange" />
            <span>Profils vérifiés</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ========== STATS SECTION ==========
function StatsSection() {
  return (
    <section className="py-12 bg-white border-b border-yo-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem number={847} suffix="+" label="Utilisateurs actifs" />
          <StatItem number={1240} suffix="+" label="Services réalisés" />
          <StatItem number={4.8} suffix="/5" label="Note moyenne" icon="⭐" />
          <StatItem number={98} suffix="%" label="Satisfaction client" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ number, suffix, label, icon }: { number: number; suffix: string; label: string; icon?: string }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = number;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, number]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-black text-4xl text-yo-green mb-2">
        {icon && <span className="mr-1">{icon}</span>}
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-yo-gray-500 text-sm">{label}</div>
    </div>
  );
}

// ========== HOW IT WORKS ==========
function HowItWorksSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Simple comme bonjour
          </h2>
          <p className="text-yo-gray-500 text-lg">En 4 étapes seulement</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { emoji: '📝', title: 'Décris ton besoin', desc: 'Publie ta demande en 2 minutes' },
            { emoji: '📩', title: 'Reçois des devis', desc: 'Les voisins qualifiés te répondent' },
            { emoji: '💰', title: 'Paie en sécurité', desc: 'Mobile Money avec escrow' },
            { emoji: '⭐', title: 'Note ton voisin', desc: 'Construis la communauté' },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StepCard number={String(index + 1)} {...step} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, emoji, title, desc }: { number: string; emoji: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-yo-lg shadow-yo-md p-6 text-center hover:shadow-yo-lg transition-all hover:-translate-y-1">
      <div className="text-5xl mb-4">{emoji}</div>
      <div className="inline-block w-10 h-10 bg-yo-green text-white rounded-full flex items-center justify-center font-bold mb-3">
        {number}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-yo-gray-500 text-sm">{desc}</p>
    </div>
  );
}

// ========== TOP PROVIDERS ==========
function TopProvidersSection() {
  const providers = [
    { name: 'Aminata', initial: 'A', service: 'Ménage', rating: 4.9, missions: 87, hourly: 5000, verified: true },
    { name: 'Kouassi', initial: 'K', service: 'Bricolage', rating: 4.8, missions: 64, hourly: 8000, verified: true },
    { name: 'Fatou', initial: 'F', service: 'Gouvernante', rating: 5.0, missions: 120, hourly: 6000, verified: true },
  ];

  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Prestataires populaires
          </h2>
          <p className="text-yo-gray-500 text-lg">Vérifiés et notés par la communauté</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {providers.map((provider, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProviderCard {...provider} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProviderCard({ name, initial, service, rating, missions, hourly, verified }: any) {
  return (
    <Card className="hover:-translate-y-2 transition-all cursor-pointer">
      <div className="flex items-start gap-4 mb-4">
        <Avatar firstName={name} lastName="K." size="lg" verified={verified} />
        <div className="flex-1">
          <h3 className="font-bold text-lg">{name} K.</h3>
          <p className="text-yo-gray-500 text-sm">{service}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-yo-orange text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{rating}</span>
            </div>
            <span className="text-yo-gray-400 text-sm">• {missions} missions</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-yo-gray-200">
        <span className="font-bold text-yo-orange">{hourly.toLocaleString()} FCFA/h</span>
        <Badge variant="verified">Disponible</Badge>
      </div>
    </Card>
  );
}

// ========== WHY YO VOISIN ==========
function WhyYoVoisinSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Paiement 100% sécurisé',
      desc: 'Ton argent est en escrow jusqu\'à validation. Protection totale contre les arnaques.',
      color: 'text-yo-orange',
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: 'Profils vérifiés CNI + Selfie',
      desc: 'Chaque utilisateur est vérifié avec sa CNI et un selfie. Zéro faux profil.',
      color: 'text-yo-green',
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: 'Avis 100% authentiques',
      desc: 'Seuls les vrais clients peuvent noter. Notation bidirectionnelle.',
      color: 'text-yo-orange',
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: 'Réponse rapide',
      desc: 'Reçois des devis en moins de 2 heures. Les prestataires sont réactifs.',
      color: 'text-yo-green',
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Pourquoi Yo! Voiz ?
          </h2>
          <p className="text-yo-gray-500 text-lg">La confiance avant tout</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-yo-lg shadow-yo-md p-8 hover:shadow-yo-xl transition-shadow"
            >
              <div className={`${feature.color} mb-4`}>{feature.icon}</div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-yo-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== CATEGORIES ==========
function CategoriesSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            14 catégories de services
          </h2>
          <p className="text-yo-gray-500 text-lg">Des voisins qualifiés dans tous les domaines</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: any }) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer hover:scale-110 transition-transform">
      <div
        className="w-16 h-16 rounded-yo-md flex items-center justify-center text-3xl shadow-yo-sm hover:shadow-yo-md transition-shadow"
        style={{ backgroundColor: category.color }}
      >
        {category.emoji}
      </div>
      <span className="text-xs font-semibold text-yo-gray-600 text-center leading-tight">
        {category.label}
      </span>
    </div>
  );
}

// ========== COMPETITIVE ADVANTAGES SECTION ==========
function CompetitiveAdvantagesSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const advantages = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Réactivité garantie',
      description: 'Temps de réponse moyen : 1h30',
      stats: '95% de réponses en moins de 2h',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Matching intelligent',
      description: 'Algorithme de proximité GPS',
      stats: 'Prestataires dans un rayon de 5km',
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: 'Communauté locale',
      description: '100% voisins ivoiriens vérifiés',
      stats: 'Confiance et solidarité',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Qualité certifiée',
      description: 'Système de badges et niveaux',
      stats: 'Bronze → Argent → Or → Platine',
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-br from-yo-green-dark to-yo-green">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-white mb-4">
            Ce qui nous rend uniques
          </h2>
          <p className="text-white/80 text-lg">
            La première plateforme pensée pour les Ivoiriens
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-yo-lg p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-yo-orange mb-4">{advantage.icon}</div>
              <h3 className="font-bold text-lg text-white mb-2">{advantage.title}</h3>
              <p className="text-white/80 text-sm mb-3">{advantage.description}</p>
              <div className="text-xs text-yo-orange font-semibold pt-3 border-t border-white/20">
                {advantage.stats}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== TESTIMONIALS ==========
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Awa',
      role: 'Cliente à Cocody',
      avatar: 'A',
      rating: 5,
      text: 'C\'est gnaman ! J\'ai trouvé une femme de ménage super pro en 1 heure. Le paiement Mobile Money c\'est trop pratique.',
    },
    {
      name: 'Ibrahim',
      role: 'Client à Marcory',
      avatar: 'I',
      rating: 5,
      text: 'Mon robinet fuyait depuis 3 jours. En 2h chrono, un plombier était chez moi. Service rapide et sécurisé !',
    },
    {
      name: 'Kouassi',
      role: 'Prestataire à Yopougon',
      avatar: 'K',
      rating: 5,
      text: 'Je gagne bien ma vie grâce à Yo! Voiz. Les paiements sont toujours à l\'heure. Je recommande à 100%.',
    },
  ];

  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-green-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-white mb-4">
            Ils nous font confiance
          </h2>
          <div className="flex items-center justify-center gap-2 text-yo-orange text-2xl">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-current" />
            ))}
            <span className="text-white ml-2">4.8/5 • 847 avis</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-yo-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar firstName={testimonial.avatar} lastName="." size="md" />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-yo-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 text-yo-orange mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-yo-gray-600 text-sm leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== FAQ ==========
function FAQSection() {
  const faqs = [
    {
      q: 'Comment fonctionne le paiement sécurisé ?',
      a: 'Ton argent est bloqué en escrow jusqu\'à ce que tu valides le service. Si problème, tu es remboursé à 100%.',
    },
    {
      q: 'Comment vérifiez-vous les prestataires ?',
      a: 'Chaque prestataire doit fournir sa CNI + un selfie. Notre équipe vérifie manuellement sous 24-48h.',
    },
    {
      q: 'Quels moyens de paiement acceptez-vous ?',
      a: 'Orange Money, MTN MoMo, Wave et Moov Money. Tous les paiements Mobile Money ivoiriens.',
    },
    {
      q: 'Y a-t-il des frais cachés ?',
      a: 'Aucun frais pour les demandeurs. Les prestataires paient une commission de 10-15% selon leur niveau.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-gray-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Questions fréquentes
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-white rounded-yo-lg p-6 text-left hover:shadow-yo-md transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg pr-4">{faq.q}</h3>
                  <ChevronDown
                    className={`w-6 h-6 text-yo-green transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-yo-gray-600 leading-relaxed">{faq.a}</p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== PARTNERS SECTION ==========
function PartnersSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-16 px-6 bg-white border-t border-yo-gray-200">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-4">
            Nos partenaires de confiance
          </h2>
          <p className="text-yo-gray-500">Solutions de paiement sécurisées et certifications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center"
        >
          {[
            { name: 'Orange Money', logo: '🟠' },
            { name: 'MTN MoMo', logo: '🟡' },
            { name: 'Wave', logo: '💙' },
            { name: 'Moov Money', logo: '🔵' },
            { name: 'CinetPay', logo: '💳' },
          ].map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-yo-gray-50 rounded-yo-lg hover:bg-yo-gray-100 transition-colors"
            >
              <div className="text-4xl mb-2">{partner.logo}</div>
              <span className="text-sm font-semibold text-yo-gray-600">{partner.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-12 pt-8 border-t border-yo-gray-200"
        >
          <Badge variant="verified" className="text-base px-4 py-2">
            🛡️ Données sécurisées SSL
          </Badge>
          <Badge variant="default" className="text-base px-4 py-2">
            ✅ Conforme RGPD
          </Badge>
          <Badge variant="default" className="text-base px-4 py-2">
            🇨🇮 Entreprise ivoirienne
          </Badge>
          <Badge variant="default" className="text-base px-4 py-2">
            ⚡ Support 7j/7
          </Badge>
        </motion.div>
      </div>
    </section>
  );
}

// ========== FINAL CTA ==========
function FinalCTASection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-24 px-6 bg-gradient-to-br from-yo-orange via-yo-orange-dark to-yo-orange-light text-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="font-display font-black text-5xl mb-6">
          Prêt à trouver ton voisin ?
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Rejoins les <strong>847 utilisateurs</strong> qui font déjà confiance à Yo! Voiz
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-yo-orange hover:bg-white/90 text-lg">
            <Users className="w-5 h-5" />
            S'inscrire gratuitement
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
            <MessageCircle className="w-5 h-5" />
            Nous contacter
          </Button>
        </div>
        <p className="mt-6 text-white/70 text-sm">
          ✓ Inscription gratuite • ✓ Sans engagement • ✓ Support 7j/7
        </p>
      </motion.div>
    </section>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="bg-yo-green-dark text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-display font-black text-3xl mb-4">
              <span className="text-yo-orange">Yo!</span> Voisin
            </div>
            <p className="text-white/70 mb-4">
              Services entre voisins à Abidjan
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens */}
          <div>
            <h3 className="font-bold mb-4">Plateforme</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-white transition">Devenir prestataire</a></li>
              <li><a href="#" className="hover:text-white transition">Catégories</a></li>
              <li><a href="#" className="hover:text-white transition">Tarifs</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Légal & Sécurité</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition">CGU</a></li>
              <li><a href="#" className="hover:text-white transition">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
              <li><a href="#" className="hover:text-white transition">Charte de confiance</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+2250707000000" className="hover:text-white transition">+225 07 07 00 00 00</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@yovoisin.ci" className="hover:text-white transition">contact@yovoisin.ci</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm text-center md:text-left">
            © 2026 Yo! Voiz — Fait avec ❤️ à Abidjan, Côte d'Ivoire 🇨🇮
            <br className="md:hidden" />
            <span className="hidden md:inline"> • </span>
            <span className="text-xs">Plateforme 100% ivoirienne de services entre voisins</span>
          </p>
          <div className="flex gap-6 text-white/70 text-sm">
            <a href="#" className="hover:text-white transition">Presse</a>
            <a href="#" className="hover:text-white transition">Carrières</a>
            <a href="#" className="hover:text-white transition">Partenaires</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
