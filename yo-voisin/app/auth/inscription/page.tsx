'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StepIndicator } from '@/components/auth/StepIndicator';

// Import des étapes
import Step1Role from '@/components/auth/signup-steps/Step1Role';
import Step2Infos from '@/components/auth/signup-steps/Step2Infos';
import Step2_5VerifyPhone from '@/components/auth/signup-steps/Step2_5VerifyPhone';
import Step3Localisation from '@/components/auth/signup-steps/Step3Localisation';
import Step4Verification from '@/components/auth/signup-steps/Step4Verification';
import Step5Bienvenue from '@/components/auth/signup-steps/Step5Bienvenue';

const STEPS = [
  { number: 1, title: 'Rôle', description: 'Qui êtes-vous ?' },
  { number: 2, title: 'Infos', description: 'Vos coordonnées' },
  { number: 3, title: 'Localisation', description: 'Où habitez-vous ?' },
  { number: 4, title: 'Vérification', description: 'CNI + Selfie' },
  { number: 5, title: 'Bienvenue', description: 'C\'est terminé !' },
];

export interface SignupData {
  role: 'demandeur' | 'prestataire' | 'both' | '';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  commune: string;
  quartier: string;
  cni_url?: string;
  selfie_url?: string;
  phoneVerified?: boolean;
}

export default function InscriptionPage() {
  const router = useRouter();
  const { signUp, user, profile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user && profile) {
      router.push('/home');
    }
  }, [user, profile, router]);

  const [formData, setFormData] = useState<SignupData>({
    role: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    commune: '',
    quartier: '',
  });

  const updateFormData = (data: Partial<SignupData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      
      console.log('📝 Données inscription:', {
        email: formData.email,
        role: formData.role,
        user_type: formData.role,
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: fullName,
        phone: formData.phone,
        commune: formData.commune,
        quartier: formData.quartier,
      });

      const signUpData = {
        user_type: formData.role as 'client' | 'provider' | 'both',
        full_name: fullName,
        phone: formData.phone,
        commune: formData.commune,
        quartier: formData.quartier,
      };
      
      console.log('🚀 Envoi à signUp:', signUpData);
      
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        signUpData
      );

      if (signUpError) {
        console.error('❌ Erreur Supabase signUp:', signUpError);
        console.error('❌ Message:', signUpError.message);
        console.error('❌ Code:', signUpError.status);
        
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError(`Erreur: ${signUpError.message}`);
        }
        setLoading(false);
        return;
      }

      console.log('✅ Inscription réussie !');
      
      // Sauvegarder l'email pour la page de confirmation
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_email_confirmation', formData.email);
      }

      goToNextStep();
    } catch (err) {
      console.error('❌ Exception inscription:', err);
      setError(`Erreur technique: ${err instanceof Error ? err.message : 'Inconnue'}`);
      setLoading(false);
    }
  };

  const renderStep = () => {
    const props = {
      formData,
      updateFormData,
      goToNextStep,
      goToPrevStep,
      error,
      setError,
    };

    switch (currentStep) {
      case 1:
        return <Step1Role {...props} />;
      case 2:
        return <Step2Infos {...props} />;
      case 3:
        return <Step3Localisation {...props} />;
      case 4:
        return <Step4Verification {...props} onSubmit={handleSubmit} loading={loading} />;
      case 5:
        return <Step5Bienvenue role={formData.role} name={formData.first_name} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light py-12 px-6">
      <div className="max-w-4xl mx-auto">
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
          <p className="text-white/80 mt-2 font-semibold">Créer mon compte gratuitement</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Step Content */}
        <Card className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Footer Links */}
        {currentStep < 4 && (
          <div className="mt-6 text-center space-y-3">
            <p className="text-white/80 text-sm">
              Déjà un compte ?{' '}
              <Link href="/auth/connexion" className="text-white font-bold hover:underline">
                Se connecter
              </Link>
            </p>
            <Link href="/" className="block text-white/60 hover:text-white text-sm font-semibold">
              ← Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
