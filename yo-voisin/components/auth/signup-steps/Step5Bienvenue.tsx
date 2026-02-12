'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

interface Step5Props {
  role: string;
  name: string;
}

export default function Step5Bienvenue({ role, name }: Step5Props) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
    
    // Redirection automatique vers la page de confirmation email après 3 secondes
    const redirectTimer = setTimeout(() => {
      router.push('/auth/confirm-email');
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const getRoleText = () => {
    switch (role) {
      case 'demandeur':
        return {
          title: 'Demandeur',
          description: 'Vous pouvez maintenant publier vos demandes et trouver des prestataires de confiance',
          nextStep: 'Publier ma première demande',
          icon: '🔍',
        };
      case 'prestataire':
        return {
          title: 'Prestataire',
          description: 'Vous pouvez maintenant répondre aux demandes et développer votre activité',
          nextStep: 'Découvrir les demandes',
          icon: '💼',
        };
      case 'both':
        return {
          title: 'Demandeur & Prestataire',
          description: 'Vous avez accès à toutes les fonctionnalités de la plateforme',
          nextStep: 'Découvrir la plateforme',
          icon: '⭐',
        };
      default:
        return {
          title: 'Bienvenue',
          description: 'Votre compte a été créé avec succès',
          nextStep: 'Continuer',
          icon: '👋',
        };
    }
  };

  const roleInfo = getRoleText();

  return (
    <div className="text-center space-y-8 py-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yo-green to-yo-green-dark rounded-full mx-auto mb-6"
      >
        <CheckCircle2 className="w-14 h-14 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display font-extrabold text-4xl text-yo-green-dark mb-4">
          Félicitations {name} ! 🎉
        </h2>
        <p className="text-xl text-yo-gray-700 mb-2">
          Votre compte Yo! Voiz a été créé avec succès
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yo-green-pale rounded-full">
          <span className="text-2xl">{roleInfo.icon}</span>
          <span className="font-bold text-yo-green-dark">{roleInfo.title}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-lg mx-auto space-y-6"
      >
        <div className="bg-gradient-to-br from-yo-orange-pale to-yo-green-pale rounded-2xl p-8 border border-yo-green/20">
          <p className="text-lg text-yo-gray-700 leading-relaxed">
            {roleInfo.description}
          </p>
        </div>

        <div className="bg-yo-orange/10 border border-yo-orange rounded-yo-lg p-6 text-left">
          <div className="flex items-start gap-4">
            <div className="text-4xl shrink-0">📧</div>
            <div>
              <h4 className="font-bold text-yo-gray-900 mb-2 text-lg">
                ⚠️ Confirmez votre email maintenant
              </h4>
              <p className="text-yo-gray-700 mb-3">
                Un email de confirmation a été envoyé à votre adresse. Vous devez confirmer votre email avant de pouvoir vous connecter.
              </p>
              <p className="text-sm text-yo-gray-600 bg-white rounded-yo-md p-3">
                💡 <strong>Astuce :</strong> Vérifiez aussi vos spams si vous ne voyez pas l&apos;email dans votre boîte de réception.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-white rounded-xl p-5 border border-yo-gray-200">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-bold text-yo-gray-800 mb-1">Compte sécurisé</h4>
            <p className="text-sm text-yo-gray-600">
              Vos données sont protégées et confidentielles
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-yo-gray-200">
            <div className="text-3xl mb-3">🚀</div>
            <h4 className="font-bold text-yo-gray-800 mb-1">Prêt à commencer</h4>
            <p className="text-sm text-yo-gray-600">
              Après confirmation, explorez toutes les fonctionnalités
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
      >
        <Button
          size="lg"
          onClick={() => router.push('/auth/confirm-email')}
          className="min-w-[250px] bg-gradient-to-r from-yo-green to-yo-green-dark hover:from-yo-green-dark hover:to-yo-green"
        >
          <Sparkles className="w-5 h-5" />
          Aller confirmer mon email
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-yo-gray-500 pt-6"
      >
        Redirection automatique dans 3 secondes...
      </motion.p>
    </div>
  );
}
