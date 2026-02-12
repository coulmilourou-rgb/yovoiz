'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input-v2';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ConnexionPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError('Une erreur est survenue. Réessayez.');
        }
        setLoading(false);
        return;
      }

      router.push('/home');
    } catch (err) {
      setError('Une erreur inattendue est survenue');
      setLoading(false);
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
          <p className="text-white/80 mt-2">Connecte-toi à ton compte</p>
        </div>

        {/* Form Card */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-yo-md p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="ton.email@exemple.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />

            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-yo-gray-300 text-yo-green focus:ring-yo-green" />
                <span className="text-yo-gray-600">Se souvenir de moi</span>
              </label>
              <Link href="/auth/mot-de-passe-oublie" className="text-yo-green hover:text-yo-green-dark font-semibold">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-yo-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/auth/inscription" className="text-yo-green hover:text-yo-green-dark font-bold">
              Créer un compte gratuitement
            </Link>
          </div>
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-white/80 hover:text-white text-sm font-semibold">
            ← Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
