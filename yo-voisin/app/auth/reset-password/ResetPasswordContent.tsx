'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input-v2';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Vérifier le token au chargement
  useEffect(() => {
    const checkToken = () => {
      const type = searchParams.get('type');
      const token = searchParams.get('token') || searchParams.get('access_token');
      
      console.log('Vérification token:', { type, hasToken: !!token });
      
      if (type === 'recovery' && token) {
        console.log('Token de récupération valide détecté');
        setIsValidToken(true);
      } else {
        console.error('Pas de token de récupération valide');
        setIsValidToken(false);
        setError('Lien de réinitialisation invalide ou expiré. Veuillez redemander un nouveau lien.');
      }
    };

    checkToken();
  }, [searchParams]);

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Faible', color: 'text-red-600', bg: 'bg-red-600' };
      case 2:
        return { text: 'Moyen', color: 'text-yellow-600', bg: 'bg-yellow-600' };
      case 3:
        return { text: 'Bon', color: 'text-blue-600', bg: 'bg-blue-600' };
      case 4:
        return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-600' };
      default:
        return { text: '', color: '', bg: '' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password) {
      setError('Le mot de passe est requis');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      console.log('Tentative de mise à jour du mot de passe...');
      const { error: updateError } = await updatePassword(password);

      console.log('Résultat updatePassword:', { updateError });

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        setError(`Impossible de réinitialiser le mot de passe: ${updateError.message}`);
        setLoading(false);
        return;
      }

      console.log('Mot de passe mis à jour avec succès');
      setSuccess(true);

      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/auth/connexion');
      }, 3000);
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Une erreur inattendue est survenue');
      setLoading(false);
    }
  };

  const strength = getPasswordStrengthLabel();

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
          {/* Message si token invalide */}
          {isValidToken === false ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="font-display font-bold text-2xl text-yo-green-dark mb-3">
                Lien invalide ou expiré
              </h2>
              <p className="text-yo-gray-600 mb-6">
                Ce lien de réinitialisation n'est plus valide. Les liens expirent après 1 heure.
              </p>
              <Link href="/auth/mot-de-passe-oublie">
                <Button className="w-full">
                  Demander un nouveau lien
                </Button>
              </Link>
            </motion.div>
          ) : !success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yo-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-yo-orange" />
                </div>
                <h1 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
                  Nouveau mot de passe
                </h1>
                <p className="text-yo-gray-600">
                  Choisissez un mot de passe sécurisé pour votre compte.
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
                {/* Nouveau mot de passe */}
                <div>
                  <Input
                    label="Nouveau mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Au moins 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    icon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-yo-gray-400 hover:text-yo-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />
                  {/* Force du mot de passe */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength ? strength.bg : 'bg-yo-gray-200'
                            } transition-all`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${strength.color} font-medium`}>
                        Force : {strength.text}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Confirmer mot de passe */}
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-yo-gray-400 hover:text-yo-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || passwordStrength < 2 || isValidToken !== true}
                >
                  {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </Button>
              </form>
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
                Mot de passe réinitialisé !
              </h2>
              <p className="text-yo-gray-600 mb-6">
                Votre mot de passe a été mis à jour avec succès.
              </p>
              <p className="text-yo-gray-500 text-sm mb-8">
                Redirection vers la page de connexion dans 3 secondes...
              </p>

              <Link href="/auth/connexion">
                <Button className="w-full">
                  Aller à la connexion
                </Button>
              </Link>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
