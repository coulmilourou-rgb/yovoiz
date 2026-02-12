'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, RefreshCw, CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Note : Supabase envoie automatiquement un email de confirmation lors de l'inscription
      // Pour renvoyer, on peut utiliser l'API
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      setSuccess(true);
    } catch (err) {
      setError('Impossible de renvoyer l\'email. Réessayez dans quelques minutes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light py-12 px-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-black text-3xl">
            <span className="text-yo-orange">Y</span>
            <svg viewBox="0 0 120 140" width="36" height="42" xmlns="http://www.w3.org/2000/svg" className="inline-block -mt-1">
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
            <span className="text-yo-orange">!</span>
            <span className="text-white ml-1">Voiz</span>
          </Link>
        </div>

        <Card className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="w-20 h-20 bg-yo-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-yo-orange" />
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
              Vérifiez votre email
            </h1>

            {/* Description */}
            <p className="text-yo-gray-600 mb-2">
              Nous avons envoyé un email de confirmation à :
            </p>
            <p className="text-yo-green-dark font-semibold text-lg mb-6">
              {user?.email || 'votre adresse email'}
            </p>

            {/* Instructions */}
            <div className="bg-yo-green/10 rounded-lg p-4 mb-6 text-left">
              <p className="text-yo-gray-700 text-sm mb-3">
                📧 <strong>Vérifiez votre boîte de réception</strong> et cliquez sur le lien de confirmation pour activer votre compte.
              </p>
              <p className="text-yo-gray-600 text-xs">
                💡 Pensez à vérifier vos <strong>spams</strong> ou <strong>courriers indésirables</strong> si vous ne voyez pas l'email.
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yo-green/20 border border-yo-green rounded-lg p-4 mb-6 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-yo-green flex-shrink-0" />
                <p className="text-yo-green-dark text-sm font-medium">
                  Email envoyé avec succès ! Vérifiez votre boîte de réception.
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={loading || success}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Envoi...' : success ? 'Email envoyé !' : 'Renvoyer l\'email'}
              </Button>

              <Link href="/">
                <Button variant="ghost" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-yo-gray-500 text-xs mt-6">
              Besoin d'aide ? Contactez-nous à <a href="mailto:support@yovoiz.com" className="text-yo-green-dark font-semibold hover:underline">support@yovoiz.com</a>
            </p>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}
