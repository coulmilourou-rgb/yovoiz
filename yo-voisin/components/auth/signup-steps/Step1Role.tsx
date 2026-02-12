'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SignupData } from '@/app/auth/inscription/page';

interface Step1Props {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  goToNextStep: () => void;
  error: string;
  setError: (error: string) => void;
}

export default function Step1Role({
  formData,
  updateFormData,
  goToNextStep,
  error,
  setError,
}: Step1Props) {
  const roles = [
    {
      value: 'demandeur' as const,
      icon: User,
      title: 'Demandeur',
      description: 'Je cherche des prestataires pour mes besoins',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      value: 'prestataire' as const,
      icon: Briefcase,
      title: 'Prestataire',
      description: 'Je propose mes services et compétences',
      color: 'from-yo-orange to-yo-orange-dark',
      iconBg: 'bg-yo-orange-pale',
      iconColor: 'text-yo-orange',
    },
    {
      value: 'both' as const,
      icon: Users,
      title: 'Les deux',
      description: 'Je cherche et propose des services',
      color: 'from-yo-green to-yo-green-dark',
      iconBg: 'bg-yo-green-pale',
      iconColor: 'text-yo-green-dark',
    },
  ];

  const handleSelect = (role: 'demandeur' | 'prestataire' | 'both') => {
    updateFormData({ role });
    setError('');
  };

  const handleNext = () => {
    if (!formData.role) {
      setError('Veuillez sélectionner un rôle');
      return;
    }
    goToNextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
          Comment souhaitez-vous utiliser Yo! Voiz ?
        </h2>
        <p className="text-yo-gray-600 text-lg">
          Sélectionnez le rôle qui vous correspond le mieux
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-yo-md p-4 text-center text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = formData.role === role.value;

          return (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => handleSelect(role.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-6 rounded-2xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-yo-green shadow-yo-lg bg-yo-green-pale'
                  : 'border-yo-gray-200 hover:border-yo-gray-300 bg-white'
                }
              `}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-yo-green rounded-full flex items-center justify-center text-white font-bold"
                >
                  ✓
                </motion.div>
              )}

              <div className={`w-14 h-14 rounded-xl ${role.iconBg} flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 ${role.iconColor}`} />
              </div>

              <h3 className="font-bold text-xl text-yo-gray-800 mb-2">
                {role.title}
              </h3>

              <p className="text-yo-gray-600 text-sm leading-relaxed">
                {role.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-yo-gray-200">
        <Button onClick={handleNext} size="lg" className="min-w-[200px]">
          Continuer
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
}
