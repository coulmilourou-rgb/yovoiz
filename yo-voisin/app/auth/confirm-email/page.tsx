'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'waiting' | 'confirming' | 'success' | 'error'>('waiting');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    // Récupérer l'email depuis les paramètres ou le localStorage
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('pending_email_confirmation');
    
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pending_email_confirmation', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }

    // Vérifier si on vient du lien de confirmation
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type === 'email') {
      handleEmailConfirmation(token_hash);
    }
  }, [searchParams]);

  const handleEmailConfirmation = async (token: string) => {
    setStatus('confirming');

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        console.error('Erreur confirmation:', error);
        setStatus('error');
      } else {
        setStatus('success');
        // Nettoyer le localStorage
        localStorage.removeItem('pending_email_confirmation');
        // Rediriger vers la connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/connexion?confirmed=true');
        }, 3000);
      }
    } catch (err) {
      console.error('Exception confirmation:', err);
      setStatus('error');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage('Email introuvable. Veuillez vous réinscrire.');
      return;
    }

    setResending(true);
    setResendMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setResendMessage('Erreur lors de l\'envoi. Réessayez dans quelques minutes.');
      } else {
        setResendMessage('✅ Email renvoyé ! Vérifiez votre boîte de réception.');
      }
    } catch (err) {
      setResendMessage('Une erreur est survenue. Réessayez plus tard.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
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

        {/* Card avec le statut */}
        <Card className="p-8">
          {status === 'waiting' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-yo-orange/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-10 h-10 text-yo-orange" />
              </div>

              <div>
                <h1 className="text-2xl font-display font-bold text-yo-gray-900 mb-2">
                  Vérifiez votre email
                </h1>
                <p className="text-yo-gray-600">
                  Nous avons envoyé un lien de confirmation à :
                </p>
                <p className="text-yo-green font-semibold mt-2">{email || 'votre adresse email'}</p>
              </div>

              <div className="bg-yo-green/5 rounded-yo-md p-4 text-left space-y-2">
                <p className="text-sm text-yo-gray-700 font-semibold">📧 Instructions :</p>
                <ol className="text-sm text-yo-gray-600 space-y-1 list-decimal list-inside">
                  <li>Ouvrez votre boîte de réception</li>
                  <li>Cherchez l&apos;email de Yo! Voiz</li>
                  <li>Cliquez sur le bouton &quot;Confirmer mon email&quot;</li>
                  <li>Revenez ici pour vous connecter</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={resending}
                  variant="outline"
                  className="w-full"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Renvoyer l&apos;email
                    </>
                  )}
                </Button>

                {resendMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm ${resendMessage.includes('✅') ? 'text-yo-green' : 'text-red-600'}`}
                  >
                    {resendMessage}
                  </motion.p>
                )}
              </div>
            </div>
          )}

          {status === 'confirming' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-yo-orange/10 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-yo-orange animate-spin" />
              </div>

              <div>
                <h1 className="text-2xl font-display font-bold text-yo-gray-900 mb-2">
                  Confirmation en cours...
                </h1>
                <p className="text-yo-gray-600">
                  Veuillez patienter pendant que nous vérifions votre email
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-20 h-20 bg-yo-green/10 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-10 h-10 text-yo-green" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-display font-bold text-yo-gray-900 mb-2">
                  Email confirmé ! 🎉
                </h1>
                <p className="text-yo-gray-600">
                  Votre compte est maintenant activé.
                </p>
                <p className="text-sm text-yo-gray-500 mt-2">
                  Redirection automatique vers la connexion...
                </p>
              </div>

              <Button onClick={() => router.push('/auth/connexion')} size="lg" className="w-full">
                <ArrowRight className="w-5 h-5" />
                Aller à la connexion
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>

              <div>
                <h1 className="text-2xl font-display font-bold text-yo-gray-900 mb-2">
                  Erreur de confirmation
                </h1>
                <p className="text-yo-gray-600">
                  Le lien de confirmation est invalide ou expiré.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={resending || !email}
                  className="w-full"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Renvoyer l&apos;email de confirmation
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => router.push('/auth/inscription')}
                  variant="outline"
                  className="w-full"
                >
                  Créer un nouveau compte
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-white/80 text-sm">
            Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams 📬
          </p>
          <Link href="/" className="text-white hover:text-white/90 text-sm font-semibold block">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
