'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Shield, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface RequireVerificationProps {
  children: ReactNode;
  action?: string; // ex: "publier une demande", "postuler", "envoyer un message"
  fallback?: ReactNode;
  showModal?: boolean;
}

export function RequireVerification({
  children,
  action = 'effectuer cette action',
  fallback,
  showModal = false,
}: RequireVerificationProps) {
  const { isVerified, profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yo-green"></div>
      </div>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  // Utilisateur non vérifié
  if (fallback) {
    return <>{fallback}</>;
  }

  // Affichage par défaut : message de blocage
  const getStatusMessage = () => {
    switch (profile?.verification_status) {
      case 'pending':
        return {
          title: 'Vérification requise',
          message: 'Vous devez vérifier votre identité pour ' + action,
          icon: <Shield className="w-12 h-12 text-yo-orange" />,
          cta: 'Vérifier mon identité',
        };
      case 'submitted':
        return {
          title: 'Vérification en cours',
          message: 'Votre demande de vérification est en cours d\'examen. Vous pourrez ' + action + ' une fois votre compte vérifié.',
          icon: <Clock className="w-12 h-12 text-blue-600" />,
          cta: 'Voir le statut',
        };
      case 'rejected':
        return {
          title: 'Vérification refusée',
          message: 'Votre demande de vérification a été refusée. Veuillez soumettre à nouveau vos documents pour ' + action,
          icon: <AlertTriangle className="w-12 h-12 text-red-600" />,
          cta: 'Réessayer',
        };
      default:
        return {
          title: 'Compte non vérifié',
          message: 'Cette action nécessite un compte vérifié',
          icon: <Lock className="w-12 h-12 text-yo-gray-400" />,
          cta: 'Vérifier mon compte',
        };
    }
  };

  const status = getStatusMessage();

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">{status.icon}</div>
          <h3 className="font-display font-extrabold text-2xl text-yo-green-dark mb-3">
            {status.title}
          </h3>
          <p className="text-yo-gray-600 mb-6">{status.message}</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Retour
            </Button>
            <Button
              onClick={() => router.push('/profile/verification')}
              className="flex-1"
            >
              {status.cta}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-8 text-center max-w-2xl mx-auto">
      <div className="mb-6">{status.icon}</div>
      <h3 className="font-display font-extrabold text-2xl text-yo-green-dark mb-3">
        {status.title}
      </h3>
      <p className="text-yo-gray-600 mb-6 text-lg">{status.message}</p>
      
      <div className="bg-yo-orange-pale border border-yo-orange/30 rounded-yo-lg p-5 mb-6">
        <h4 className="font-bold text-yo-gray-800 mb-2">
          Pourquoi vérifier mon identité ?
        </h4>
        <ul className="text-sm text-yo-gray-700 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-yo-orange">✓</span>
            <span>Publier et répondre aux demandes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yo-orange">✓</span>
            <span>Envoyer des messages et devis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yo-orange">✓</span>
            <span>Recevoir et effectuer des paiements</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yo-orange">✓</span>
            <span>Gagner la confiance de la communauté</span>
          </li>
        </ul>
      </div>

      <Button
        size="lg"
        onClick={() => router.push('/profile/verification')}
        className="min-w-[250px]"
      >
        <Shield className="w-5 h-5" />
        {status.cta}
      </Button>
    </Card>
  );
}

// Hook helper pour vérifier rapidement
export function useRequireVerification() {
  const { isVerified, profile } = useAuth();

  const checkVerification = (action: string = 'cette action') => {
    if (!isVerified) {
      throw new Error(`Vérification requise pour ${action}`);
    }
  };

  return {
    isVerified,
    verificationStatus: profile?.verification_status || 'pending',
    checkVerification,
  };
}
