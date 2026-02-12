'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Shield, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VerificationBanner() {
  const { isVerified, profile } = useAuth();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (isVerified || dismissed) {
    return null;
  }

  const getBannerConfig = () => {
    switch (profile?.verification_status) {
      case 'pending':
        return {
          bg: 'bg-gradient-to-r from-yo-orange-pale to-yellow-50',
          border: 'border-yo-orange',
          icon: <Shield className="w-6 h-6 text-yo-orange" />,
          title: '⚠️ Compte non vérifié',
          message: 'Vérifiez votre identité pour accéder à toutes les fonctionnalités de Yo! Voiz',
          cta: 'Vérifier maintenant',
          ctaVariant: 'secondary' as const,
        };
      case 'submitted':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          border: 'border-blue-400',
          icon: <Clock className="w-6 h-6 text-blue-600" />,
          title: '⏳ Vérification en cours',
          message: 'Votre demande est en cours d\'examen. Nous vous notifierons dès validation.',
          cta: 'Voir le statut',
          ctaVariant: 'outline' as const,
        };
      case 'rejected':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          border: 'border-red-400',
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          title: '❌ Vérification refusée',
          message: 'Vos documents n\'ont pas été acceptés. Veuillez soumettre à nouveau.',
          cta: 'Réessayer',
          ctaVariant: 'secondary' as const,
        };
      default:
        return null;
    }
  };

  const config = getBannerConfig();

  if (!config) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${config.bg} border-l-4 ${config.border} px-6 py-4 shadow-yo-md sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {config.icon}
            <div className="flex-1">
              <h4 className="font-bold text-yo-gray-800 mb-1">{config.title}</h4>
              <p className="text-sm text-yo-gray-700">{config.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={config.ctaVariant}
              onClick={() => router.push('/profile/verification')}
              className="shrink-0"
            >
              {config.cta}
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 hover:bg-black/5 rounded-full transition shrink-0"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-yo-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Version compacte pour mobile
export function VerificationBannerCompact() {
  const { isVerified, profile } = useAuth();
  const router = useRouter();

  if (isVerified) {
    return null;
  }

  return (
    <div className="bg-yo-orange text-white px-4 py-3 text-center text-sm font-semibold">
      <button
        onClick={() => router.push('/profile/verification')}
        className="hover:underline"
      >
        ⚠️ Compte non vérifié - Cliquez ici pour débloquer toutes les fonctionnalités
      </button>
    </div>
  );
}
