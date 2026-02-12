'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { CATEGORIES } from '@/lib/constants';
import { VideoModal, VideoTrigger } from '@/components/features/VideoModal';
import { LiveChat } from '@/components/features/LiveChat';
import { ScrollToTop } from '@/components/features/ScrollToTop';
import { LiveNotifications } from '@/components/features/LiveNotifications';
import { 
  Search, Wrench, Lock, CheckCircle, Star, 
  MapPin, ChevronDown, Play, TrendingUp,
  Users, Shield, Award, Clock, MessageCircle,
  Phone, Mail, Facebook, Instagram, Smartphone,
  Gift, BookOpen, Trophy, Target, Zap
} from 'lucide-react';

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Navbar isConnected={false} />

      <HeroSection onVideoClick={() => setIsVideoOpen(true)} />
      <StatsSection />
      <VideoSection onVideoClick={() => setIsVideoOpen(true)} />
      <HowItWorksSection />
      <ProviderOfTheMonthSection />
      <TopProvidersSection />
      <WhyYoVoisinSection />
      <PromoSection />
      <CategoriesSection />
      <MobileAppSection />
      <TestimonialsSection />
      <CommunesMapSection />
      <BlogPreviewSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />

      {/* Widgets */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      <LiveChat />
      <ScrollToTop />
      <LiveNotifications />
    </main>
  );
}

// ========== HERO SECTION ==========
function HeroSection({ onVideoClick }: { onVideoClick: () => void }) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCity, setSelectedCity] = useState('Cocody');

  return (
    <section className="relative bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light py-24 px-6 overflow-hidden">
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-yo-orange/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-semibold mb-6"
          >
            <span className="text-2xl">🇨🇮</span>
            <span>100% Ivoirien • Abidjan</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-black text-5xl md:text-7xl text-white mb-6"
          >
            On dit quoi ? 👋
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/90 text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
          >
            Trouve un voisin de confiance pour tous tes services du quotidien à Abidjan
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-white rounded-full shadow-yo-xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-yo-gray-400" />
              <input
                type="text"
                placeholder="Quel service cherches-tu ? (ex: ménage, bricolage...)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full outline-none text-yo-gray-800 placeholder:text-yo-gray-400"
              />
            </div>
            <div className="hidden md:block w-px bg-yo-gray-200" />
            <div className="flex items-center gap-2 px-4 md:w-48">
              <MapPin className="w-5 h-5 text-yo-gray-400" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="outline-none text-yo-gray-800 bg-transparent cursor-pointer w-full"
              >
                <option>Cocody</option>
                <option>Marcory</option>
                <option>Plateau</option>
                <option>Yopougon</option>
                <option>Abobo</option>
              </select>
            </div>
            <Button size="lg" variant="secondary" className="shrink-0">
              Rechercher
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="bg-white text-yo-green-dark hover:bg-white/90">
            <Wrench className="w-5 h-5" />
            Devenir prestataire
          </Button>
          <button 
            onClick={onVideoClick}
            className="flex items-center gap-2 text-white hover:text-white/80 transition"
          >
            <Play className="w-5 h-5" />
            <span className="font-semibold">Voir comment ça marche</span>
          </button>
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

function StatItem({ number, suffix, label, icon }: any) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useState(() => {
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
  });

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

// ========== VIDEO SECTION ==========
function VideoSection({ onVideoClick }: { onVideoClick: () => void }) {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Découvre Yo! Voiz en 2 minutes
          </h2>
          <p className="text-yo-gray-500 text-lg">Tout ce que tu dois savoir, expliqué simplement</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <VideoTrigger onClick={onVideoClick} />
        </motion.div>
      </div>
    </section>
  );
}

// ========== HOW IT WORKS ==========
function HowItWorksSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
              className="bg-yo-gray-50 rounded-yo-lg shadow-yo-sm p-6 text-center hover:shadow-yo-md transition-all hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{step.emoji}</div>
              <div className="inline-block w-10 h-10 bg-yo-green text-white rounded-full flex items-center justify-center font-bold mb-3">
                {index + 1}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-yo-gray-500 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== PROVIDER OF THE MONTH ==========
function ProviderOfTheMonthSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-br from-yo-orange via-yo-orange-dark to-yo-orange-light text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
        backgroundSize: '40px 40px',
      }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full mb-6">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">Prestataire du mois</span>
          </div>
          <h2 className="font-display font-black text-5xl mb-4">
            Aminata K. - La Reine du Ménage 👑
          </h2>
          <p className="text-xl text-white/90">120 missions • Note 5.0/5 • 100% de satisfaction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-yo-xl p-8 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-shrink-0">
            <Avatar firstName="Aminata" lastName="K." size="xl" verified />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-lg mb-6 leading-relaxed">
              "Depuis que j'ai rejoint Yo! Voiz il y a 8 mois, ma vie a changé. Je gagne bien, les clients sont respectueux et le paiement Mobile Money c'est trop pratique. Merci Yo! Voiz ! 🙏"
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Badge variant="status" className="bg-white/20 text-white">⭐ 5.0/5</Badge>
              <Badge variant="status" className="bg-white/20 text-white">120 missions</Badge>
              <Badge variant="status" className="bg-white/20 text-white">Cocody</Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ========== TOP PROVIDERS ==========
function TopProvidersSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const providers = [
    { name: 'Aminata K.', service: 'Ménage', rating: 5.0, missions: 120, commune: 'Cocody', badge: 'OR', verified: true },
    { name: 'Ibrahim T.', service: 'Bricolage', rating: 4.9, missions: 89, commune: 'Marcory', badge: 'OR', verified: true },
    { name: 'Fatou D.', service: 'Livraison', rating: 4.8, missions: 156, commune: 'Plateau', badge: 'PLATINE', verified: true },
    { name: 'Kouassi M.', service: 'Plomberie', rating: 4.9, missions: 67, commune: 'Yopougon', badge: 'ARGENT', verified: true },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Nos meilleurs voisins
          </h2>
          <p className="text-yo-gray-500 text-lg">Des professionnels vérifiés et notés par la communauté</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-yo-xl transition-all hover:-translate-y-2 cursor-pointer">
                <div className="flex justify-center mb-4">
                  <Avatar 
                    firstName={provider.name.split(' ')[0]} 
                    lastName={provider.name.split(' ')[1]} 
                    size="lg" 
                    verified={provider.verified}
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{provider.name}</h3>
                <p className="text-yo-gray-500 text-sm mb-3">{provider.service}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yo-orange text-yo-orange" />
                  <span className="font-bold text-yo-green-dark">{provider.rating}</span>
                  <span className="text-yo-gray-400 text-sm">({provider.missions} missions)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-yo-gray-400" />
                  <span className="text-sm text-yo-gray-500">{provider.commune}</span>
                </div>
                <Badge variant="status" className="mt-3">{provider.badge}</Badge>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline">
            Voir tous les prestataires
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ========== WHY YO VOISIN ==========
function WhyYoVoisinSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const features = [
    {
      icon: Shield,
      title: 'Sécurité garantie',
      desc: 'Vérification CNI + selfie obligatoire pour tous les prestataires',
      color: 'text-yo-green',
      bgColor: 'bg-yo-green-pale',
    },
    {
      icon: Lock,
      title: 'Paiement sécurisé',
      desc: 'Système escrow : ton argent est protégé jusqu\'à la fin du service',
      color: 'text-yo-orange',
      bgColor: 'bg-yo-orange-pale',
    },
    {
      icon: Users,
      title: '100% ivoirien',
      desc: 'Créé à Abidjan, pour les Abidjanais, par des Ivoiriens',
      color: 'text-yo-green',
      bgColor: 'bg-yo-green-pale',
    },
    {
      icon: Award,
      title: 'Système de niveaux',
      desc: 'Bronze, Argent, Or, Platine : seuls les meilleurs montent',
      color: 'text-yo-orange',
      bgColor: 'bg-yo-orange-pale',
    },
    {
      icon: MessageCircle,
      title: 'Messagerie sécurisée',
      desc: 'Chat intégré avec filtrage anti-désintermédiation',
      color: 'text-yo-green',
      bgColor: 'bg-yo-green-pale',
    },
    {
      icon: Clock,
      title: 'Support réactif',
      desc: 'Notre équipe répond en moins de 2h en semaine',
      color: 'text-yo-orange',
      bgColor: 'bg-yo-orange-pale',
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
            Pourquoi choisir Yo! Voiz ?
          </h2>
          <p className="text-yo-gray-500 text-lg">La plateforme la plus sûre d'Abidjan</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-yo-lg shadow-yo-sm p-6 hover:shadow-yo-md transition-all"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-yo-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== PROMO SECTION ==========
function PromoSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-r from-yo-green to-yo-green-light text-white relative overflow-hidden">
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-yo-orange/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-yo-orange px-6 py-2 rounded-full mb-6">
            <Gift className="w-5 h-5" />
            <span className="font-bold">OFFRE DE LANCEMENT</span>
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl mb-6">
            -20% sur ton 1er service ! 🎉
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Inscris-toi maintenant et reçois un code promo de <strong>-20%</strong> à utiliser sur ton premier service. Offre limitée aux 500 premiers inscrits !
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-yo-lg p-6 inline-block mb-8">
            <p className="text-sm text-white/80 mb-2">Code promo :</p>
            <div className="flex items-center gap-3">
              <div className="bg-white text-yo-green-dark px-8 py-3 rounded-lg font-mono font-black text-2xl tracking-wider">
                YOVOISIN20
              </div>
              <Button variant="secondary" size="sm">
                Copier
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-yo-green hover:bg-white/90">
              M'inscrire maintenant
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              En savoir plus
            </Button>
          </div>
        </motion.div>
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
            Services populaires
          </h2>
          <p className="text-yo-gray-500 text-lg">Plus de 15 catégories disponibles</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.slice(0, 10).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="text-center hover:shadow-yo-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-bold text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-yo-gray-400">{category.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Button variant="outline" size="lg">
            Voir toutes les catégories
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ========== MOBILE APP SECTION ==========
function MobileAppSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-br from-yo-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-yo-green-pale px-4 py-2 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-yo-green" />
              <span className="text-yo-green font-semibold text-sm">Bientôt disponible</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-6">
              L'app mobile arrive ! 📱
            </h2>
            <p className="text-yo-gray-600 text-lg mb-8 leading-relaxed">
              Télécharge l'application <strong>Yo! Voiz</strong> et accède à tous tes services en un clic. Notifications en temps réel, chat intégré, paiement Mobile Money ultra-rapide.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Notifications push pour chaque nouveau devis',
                'Chat en temps réel avec tes voisins',
                'Paiement Mobile Money en 1 clic',
                'Suivi GPS du prestataire en direct',
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-yo-green flex-shrink-0 mt-0.5" />
                  <span className="text-yo-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-black/80">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button size="lg" className="bg-yo-green text-white hover:bg-yo-green-dark">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-yo-green to-yo-green-light rounded-yo-xl p-12 text-center shadow-yo-xl">
              <div className="text-8xl mb-4">📱</div>
              <p className="text-white text-2xl font-bold mb-2">Bientôt sur iOS & Android</p>
              <p className="text-white/80">Inscris-toi pour être notifié du lancement</p>
              <div className="mt-6 flex gap-2">
                <input
                  type="email"
                  placeholder="ton-email@exemple.com"
                  className="flex-1 px-4 py-3 rounded-lg outline-none"
                />
                <Button variant="secondary">
                  Notifie-moi
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ========== TESTIMONIALS ==========
function TestimonialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const testimonials = [
    {
      name: 'Mariam S.',
      role: 'Cliente',
      commune: 'Cocody',
      rating: 5,
      text: "J'ai trouvé une femme de ménage en 30 minutes ! Le système de paiement Mobile Money c'est trop facile. Je recommande à 100% 🔥",
    },
    {
      name: 'Youssouf K.',
      role: 'Prestataire Plombier',
      commune: 'Marcory',
      rating: 5,
      text: "Depuis que je suis sur Yo! Voiz, je reçois 3-4 demandes par jour. Le paiement est sécurisé, les clients sont sérieux. Top !",
    },
    {
      name: 'Adjoua F.',
      role: 'Cliente',
      commune: 'Plateau',
      rating: 5,
      text: "Super plateforme ! J'ai fait réparer ma télé, repeindre mon salon et trouver un livreur. Tout est passé par Yo! Voiz 👍",
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-yo-gray-500 text-lg">Des milliers d'Abidjanais satisfaits</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-yo-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar 
                    firstName={testimonial.name.split(' ')[0]} 
                    lastName={testimonial.name.split(' ')[1]} 
                    size="md" 
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-yo-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yo-orange text-yo-orange" />
                  ))}
                </div>
                <p className="text-yo-gray-600 mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-2 text-sm text-yo-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{testimonial.commune}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== COMMUNES MAP SECTION ==========
function CommunesMapSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const communes = [
    { name: 'Cocody', count: 234, color: 'bg-yo-green' },
    { name: 'Marcory', count: 189, color: 'bg-yo-green-light' },
    { name: 'Plateau', count: 156, color: 'bg-yo-orange' },
    { name: 'Yopougon', count: 298, color: 'bg-yo-orange-dark' },
    { name: 'Abobo', count: 276, color: 'bg-yo-green-dark' },
    { name: 'Koumassi', count: 145, color: 'bg-yo-green' },
    { name: 'Treichville', count: 167, color: 'bg-yo-orange-light' },
    { name: 'Adjamé', count: 198, color: 'bg-yo-green-light' },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Partout à Abidjan 📍
          </h2>
          <p className="text-yo-gray-500 text-lg">Des prestataires vérifiés dans toutes les communes</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {communes.map((commune, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-yo-lg shadow-yo-sm p-6 text-center hover:shadow-yo-md transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 ${commune.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{commune.name}</h3>
              <p className="text-yo-gray-500 text-sm">{commune.count} prestataires</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-yo-gray-500 mb-4">Ta commune n'est pas listée ?</p>
          <Button variant="outline" size="lg">
            Nous contacter
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ========== BLOG PREVIEW ==========
function BlogPreviewSection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  const articles = [
    {
      title: '5 conseils pour choisir le bon prestataire',
      category: 'Guide',
      date: '12 Fév 2024',
      readTime: '5 min',
      emoji: '💡',
    },
    {
      title: 'Comment devenir un super voisin sur Yo! Voiz',
      category: 'Conseils',
      date: '10 Fév 2024',
      readTime: '4 min',
      emoji: '⭐',
    },
    {
      title: 'Les services les plus demandés à Abidjan',
      category: 'Tendances',
      date: '08 Fév 2024',
      readTime: '3 min',
      emoji: '📊',
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-yo-green-pale px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-yo-green" />
            <span className="text-yo-green font-semibold text-sm">Blog</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Conseils & Actualités
          </h2>
          <p className="text-yo-gray-500 text-lg">Tout pour réussir sur Yo! Voiz</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-yo-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="text-5xl mb-4">{article.emoji}</div>
                <Badge variant="status" className="mb-3">{article.category}</Badge>
                <h3 className="font-bold text-lg mb-3 leading-tight">{article.title}</h3>
                <div className="flex items-center gap-4 text-sm text-yo-gray-400">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Button variant="outline" size="lg">
            Voir tous les articles
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ========== FAQ ==========
function FAQSection() {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment fonctionne Yo! Voiz ?",
      a: "C'est simple : tu publies ta demande, des prestataires vérifiés te répondent avec des devis, tu choisis le meilleur, tu paies en Mobile Money de manière sécurisée, et tu notes le prestataire après le service.",
    },
    {
      q: "Est-ce que c'est gratuit ?",
      a: "Oui, l'inscription et la publication de demandes sont 100% gratuites. Nous prenons une petite commission (10%) sur chaque transaction pour maintenir la plateforme et assurer la sécurité.",
    },
    {
      q: "Comment sont vérifiés les prestataires ?",
      a: "Tous les prestataires doivent fournir une pièce d'identité (CNI) valide et un selfie pour vérification. Nous vérifions manuellement chaque inscription avant validation.",
    },
    {
      q: "Comment fonctionne le paiement Mobile Money ?",
      a: "Tu paies via Orange Money, MTN MoMo ou Wave. L'argent est bloqué dans un système escrow et n'est libéré au prestataire qu'après confirmation du service réalisé.",
    },
    {
      q: "Que faire en cas de problème ?",
      a: "Tu peux ouvrir un litige depuis ton espace. Notre équipe arbitre et peut bloquer le paiement ou rembourser selon la situation. Le support répond sous 2h en semaine.",
    },
    {
      q: "Comment devenir prestataire ?",
      a: "Clique sur 'Devenir prestataire', inscris-toi avec ta CNI + selfie, attends la validation (24-48h), et commence à recevoir des demandes dans ta zone !",
    },
  ];

  return (
    <section ref={ref} className="py-20 px-6 bg-yo-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
            Questions fréquentes
          </h2>
          <p className="text-yo-gray-500 text-lg">Tout ce que tu dois savoir</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-yo-md transition-shadow"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-lg flex-1">{faq.q}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-yo-gray-400 flex-shrink-0" />
                  </motion.div>
                </div>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-yo-gray-600 mt-3 leading-relaxed">{faq.a}</p>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-yo-gray-500 mb-4">Tu as d'autres questions ?</p>
          <Button variant="outline" size="lg">
            Contacte-nous
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// ========== FINAL CTA ==========
function FinalCTASection() {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-20 px-6 bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-orange text-white relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="font-display font-black text-5xl md:text-6xl mb-6">
            Rejoins la communauté !
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Plus de <strong>800 Abidjanais</strong> utilisent déjà Yo! Voiz chaque jour. Pourquoi pas toi ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-yo-green hover:bg-white/90">
              <Users className="w-5 h-5" />
              M'inscrire gratuitement
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Wrench className="w-5 h-5" />
              Devenir prestataire
            </Button>
          </div>
          <p className="text-white/70 text-sm">
            ✅ Inscription gratuite • ✅ Paiement sécurisé • ✅ Support 7j/7
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="bg-yo-green-dark text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 120 140" width="36" height="42" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="78" r="56" fill="#2D2D2A"/>
                <circle cx="60" cy="78" r="52" fill="#F37021"/>
                <ellipse cx="42" cy="56" rx="28" ry="22" fill="#FF8C42" opacity="0.4"/>
                <ellipse cx="42" cy="60" rx="6" ry="8" fill="#2D2D2A"/>
                <ellipse cx="78" cy="60" rx="6" ry="8" fill="#2D2D2A"/>
                <path d="M28,78 Q60,123 92,78" fill="#2D2D2A"/>
                <path d="M32,80 Q60,118 88,80" fill="#DC2626"/>
                <rect x="32" y="78" width="56" height="8" rx="2" fill="white"/>
                <path d="M10,42 C8,14 28,-4 60,-6 C92,-4 112,14 110,42 Z" fill="#FCD34D"/>
                <path d="M32,8 C48,-4 72,-4 88,8 C72,0 48,0 32,8 Z" fill="#FDE68A" opacity="0.7"/>
                <line x1="60" y1="-4" x2="60" y2="40" stroke="#D97706" strokeWidth="3" opacity="0.2"/>
                <path d="M6,42 L2,50 C10,58 30,62 60,62 C90,62 110,58 118,50 L114,42 Z" fill="#D97706"/>
                <rect x="16" y="32" width="88" height="8" rx="4" fill="#F37021"/>
                <rect x="16" y="32" width="88" height="4" rx="2" fill="#FF8C42" opacity="0.5"/>
              </svg>
              <span className="font-display font-black text-2xl">Yo! Voiz</span>
            </div>
            <p className="text-white/70 text-sm mb-4">
              La plateforme #1 de services entre voisins à Abidjan 🇨🇮
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-white transition">Devenir prestataire</a></li>
              <li><a href="#" className="hover:text-white transition">Catégories</a></li>
              <li><a href="#" className="hover:text-white transition">Tarifs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white transition">Nous contacter</a></li>
              <li><a href="#" className="hover:text-white transition">Signaler un problème</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition">CGU</a></li>
              <li><a href="#" className="hover:text-white transition">CGV</a></li>
              <li><a href="#" className="hover:text-white transition">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm">
              © 2026 Yo! Voiz. Tous droits réservés. Fabriqué avec ❤️ à Abidjan.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>🇨🇮 100% Ivoirien</span>
              <span>•</span>
              <span>📱 Support 7j/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
