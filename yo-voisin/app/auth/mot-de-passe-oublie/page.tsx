'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function MotDePasseOubliePage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation email
    if (!email.trim()) {
      setError('L\'email est requis');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      setLoading(false);
      return;
    }

    try {
      console.log('Appel resetPassword avec email:', email);
      const { error: resetError } = await resetPassword(email);

      console.log('Retour de resetPassword:', { resetError });

      if (resetError) {
        console.error('Erreur détaillée:', resetError);
        setError(`Une erreur est survenue: ${resetError.message || 'Vérifiez votre email.'}`);
        setLoading(false);
        return;
      }

      console.log('Email de réinitialisation envoyé avec succès');
      setSuccess(true);
    } catch (err) {
      console.error('Exception:', err);
      setError('Une erreur inattendue est survenue');
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
          {!success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yo-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-yo-orange" />
                </div>
                <h1 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
                  Mot de passe oublié ?
                </h1>
                <p className="text-yo-gray-600">
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </Button>
              </form>

              {/* Back to login */}
              <div className="mt-6 text-center">
                <Link
                  href="/auth/connexion"
                  className="inline-flex items-center gap-2 text-yo-green-dark hover:text-yo-green font-semibold text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              {/* Success Icon */}
              <div className="w-20 h-20 bg-yo-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-yo-green" />
              </div>

              {/* Success Message */}
              <h2 className="font-display font-bold text-2xl text-yo-green-dark mb-3">
                Email envoyé !
              </h2>
              <p className="text-yo-gray-600 mb-2">
                Nous avons envoyé un lien de réinitialisation à :
              </p>
              <p className="text-yo-green-dark font-semibold mb-6">
                {email}
              </p>
              <p className="text-yo-gray-500 text-sm mb-8">
                📧 Vérifiez votre boîte de réception (et vos spams) et cliquez sur le lien pour créer un nouveau mot de passe.
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  Renvoyer l'email
                </Button>
                <Link href="/auth/connexion">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Help text */}
        <p className="text-white/80 text-sm text-center mt-6">
          Pas encore de compte ?{' '}
          <Link href="/auth/inscription" className="font-semibold text-white hover:underline">
            Inscrivez-vous gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
}
