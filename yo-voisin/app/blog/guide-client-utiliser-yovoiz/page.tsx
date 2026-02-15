'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, CheckCircle, Star, Clock,
  TrendingUp, Target, Shield, DollarSign, Users,
  Calendar, Search, FileText, MessageCircle, Award,
  Zap, BookOpen, Phone
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function GuideClientPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const steps = [
    {
      number: 1,
      icon: <Users className="w-8 h-8" />,
      title: "Créer ton compte gratuitement",
      color: "orange",
      content: [
        "Clique sur 'S'inscrire' en haut à droite",
        "Remplis tes informations (nom, email, téléphone)",
        "Choisis ta commune (Yopougon, Cocody, Abobo...)",
        "Valide ton compte par email ou SMS",
        "C'est gratuit et ça prend moins de 2 minutes !"
      ],
      tips: "💡 Utilise une adresse email que tu consultes régulièrement pour recevoir les notifications."
    },
    {
      number: 2,
      icon: <FileText className="w-8 h-8" />,
      title: "Publie ta demande de service",
      color: "green",
      content: [
        "Clique sur 'Publier une demande' ou 'Besoin d'un service'",
        "Choisis la catégorie (Ménage, Plomberie, Livraison...)",
        "Décris précisément ce dont tu as besoin",
        "Indique le lieu, la date et l'heure souhaités",
        "Propose un budget (facultatif mais recommandé)"
      ],
      tips: "💡 Plus ta demande est détaillée, plus tu recevras de réponses pertinentes rapidement."
    },
    {
      number: 3,
      icon: <Search className="w-8 h-8" />,
      title: "Reçois et compare les propositions",
      color: "orange",
      content: [
        "Les prestataires de ta zone reçoivent ta demande",
        "Tu reçois leurs devis et propositions par notification",
        "Compare les prix, les notes et les avis clients",
        "Consulte leur profil (expérience, nombre de missions)",
        "Pose des questions via la messagerie si besoin"
      ],
      tips: "💡 Les prestataires avec le badge 'Pro' sont vérifiés et très réactifs."
    },
    {
      number: 4,
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Choisis ton prestataire idéal",
      color: "green",
      content: [
        "Sélectionne le prestataire qui te convient le mieux",
        "Vérifie ses disponibilités et confirme le rendez-vous",
        "Discute des détails finaux via la messagerie",
        "Confirme le tarif et les modalités",
        "Le prestataire reçoit une notification de validation"
      ],
      tips: "💡 Privilégie les prestataires avec plus de 10 missions et une note supérieure à 4.5/5."
    },
    {
      number: 5,
      icon: <DollarSign className="w-8 h-8" />,
      title: "Effectue le paiement sécurisé",
      color: "orange",
      content: [
        "Paie en ligne de manière 100% sécurisée",
        "Méthodes acceptées : Mobile Money, carte bancaire",
        "Ton argent est bloqué sur la plateforme (pas encore versé)",
        "Le prestataire sait que le paiement est garanti",
        "Tu es protégé par notre garantie satisfaction"
      ],
      tips: "💡 Ne paie JAMAIS en dehors de la plateforme. Ton argent n'est versé qu'après validation."
    },
    {
      number: 6,
      icon: <Award className="w-8 h-8" />,
      title: "Valide la prestation et note le prestataire",
      color: "green",
      content: [
        "Une fois le travail terminé, vérifie que tout est OK",
        "Clique sur 'Valider la prestation' dans ton espace",
        "L'argent est automatiquement versé au prestataire",
        "Laisse une note et un avis (aide les futurs clients)",
        "Le prestataire peut aussi te noter"
      ],
      tips: "💡 Tu as 7 jours pour valider. Passé ce délai, la validation est automatique."
    }
  ];

  const faqs = [
    {
      question: "Combien ça coûte d'utiliser Yo!Voiz en tant que client ?",
      answer: "L'inscription et l'utilisation de la plateforme sont 100% gratuites pour les clients. Tu paies uniquement le service demandé au prestataire. Aucun frais caché, aucun abonnement."
    },
    {
      question: "Comment être sûr de la qualité du prestataire ?",
      answer: "Tous les prestataires ont un profil avec leurs notes, avis clients et nombre de missions réalisées. Les prestataires 'Pro' sont vérifiés et ont prouvé leur sérieux. Consulte toujours les avis avant de choisir."
    },
    {
      question: "Que se passe-t-il si le prestataire ne vient pas ?",
      answer: "Si le prestataire annule ou ne se présente pas sans raison valable, tu es intégralement remboursé sous 48h. Le prestataire reçoit une pénalité sur son compte. Contacte le support si besoin."
    },
    {
      question: "Puis-je annuler une demande après validation ?",
      answer: "Oui, tu peux annuler jusqu'à 24h avant l'intervention prévue avec un remboursement complet. Entre 24h et 2h avant, des frais d'annulation de 30% s'appliquent. Moins de 2h avant : pas de remboursement."
    },
    {
      question: "Comment fonctionne la garantie satisfaction ?",
      answer: "Si le travail n'est pas conforme à ce qui était convenu, tu peux ouvrir un litige dans les 48h. Notre équipe examine le dossier et peut décider d'un remboursement partiel ou total selon la situation."
    },
    {
      question: "Puis-je recontacter un prestataire pour une prochaine fois ?",
      answer: "Absolument ! Tu peux sauvegarder tes prestataires préférés dans 'Mes favoris' et les contacter directement pour tes prochains besoins. Tu gagnes du temps et crées une relation de confiance."
    }
  ];

  const tips = [
    { icon: FileText, text: "Décris précisément ton besoin", color: "text-orange-600" },
    { icon: Clock, text: "Sois flexible sur les horaires", color: "text-green-600" },
    { icon: MessageCircle, text: "Communique clairement avec le prestataire", color: "text-blue-600" },
    { icon: Star, text: "Laisse toujours un avis après la mission", color: "text-yellow-600" }
  ];

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Guide Client : Comment utiliser Yo!Voiz" 
        description="Tutoriel complet pour trouver le bon prestataire et réussir sa demande de service"
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

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/blog')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au blog
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-blue-100 text-blue-800">
              <BookOpen className="w-3 h-3 mr-1" />
              Guide Client
            </Badge>
            <span className="text-sm text-gray-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              Mis à jour le 15 février 2026
            </span>
          </div>
          
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-yo-green-dark mb-4">
            Guide Client : Comment utiliser Yo!Voiz en 6 étapes
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Découvre comment trouver le prestataire idéal pour tes besoins en quelques clics. Simple, rapide et sécurisé.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Par l'équipe Yo!Voiz
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Lecture : 6 min
            </span>
          </div>
        </motion.div>

        {/* Quick Tips Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="font-bold text-lg text-blue-900 mb-4">⚡ Conseils essentiels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/80 rounded-lg p-3">
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
                <span className="text-gray-800 font-medium">{tip.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-lg flex items-center justify-center flex-shrink-0 relative`}>
                    <div className={`text-${step.color}-600`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yo-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">
                      {step.title}
                    </h2>
                    <ul className="space-y-2 mb-4">
                      {step.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <p className="text-sm text-gray-700">{step.tips}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-6 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-start gap-2">
                  <Phone className="w-5 h-5 text-yo-orange flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed ml-7">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-br from-green-600 to-green-700 text-white text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            Prêt à publier ta première demande ?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Rejoins les 10.000+ utilisateurs satisfaits sur Yo!Voiz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-700 hover:bg-white/90"
              onClick={() => router.push(user ? '/missions/nouvelle' : '/auth/inscription')}
            >
              {user ? 'Publier une demande' : 'Créer mon compte gratuit'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => router.push('/aide')}
            >
              Contacter le support
            </Button>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
