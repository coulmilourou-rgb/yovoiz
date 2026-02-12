'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SignupData } from '@/app/auth/inscription/page';
import { COMMUNES } from '@/lib/constants';

interface Step3Props {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  error: string;
  setError: (error: string) => void;
}

export default function Step3Localisation({
  formData,
  updateFormData,
  goToNextStep,
  goToPrevStep,
  error,
  setError,
}: Step3Props) {
  const validate = () => {
    if (!formData.commune) {
      setError('Veuillez sélectionner votre commune');
      return false;
    }
    if (!formData.quartier.trim()) {
      setError('Veuillez indiquer votre quartier');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validate()) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
          Où habitez-vous ?
        </h2>
        <p className="text-yo-gray-600 text-lg">
          Cette information nous aide à vous connecter avec des voisins proches
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-yo-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-yo-gray-800 mb-2">
            Commune <span className="text-yo-orange">*</span>
          </label>
          <select
            value={formData.commune}
            onChange={(e) => updateFormData({ commune: e.target.value })}
            className="w-full h-12 rounded-yo-md border border-yo-gray-200 bg-white px-4 text-base focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
            required
          >
            <option value="">-- Sélectionnez votre commune --</option>
            {COMMUNES.map((commune) => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-yo-gray-500">
            Choisissez parmi les 14 communes d'Abidjan
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-yo-gray-800 mb-2">
            Quartier <span className="text-yo-orange">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Deux Plateaux, Zone 4, Riviera..."
            value={formData.quartier}
            onChange={(e) => updateFormData({ quartier: e.target.value })}
            className="w-full h-12 rounded-yo-md border border-yo-gray-200 bg-white px-4 text-base placeholder:text-yo-gray-400 focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent"
            required
          />
          <p className="mt-1.5 text-sm text-yo-gray-500">
            Précisez votre quartier pour une meilleure géolocalisation
          </p>
        </div>

        <div className="bg-yo-green-pale border border-yo-green/30 rounded-yo-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div className="flex-1">
              <h4 className="font-bold text-yo-green-dark mb-1">
                Pourquoi ces informations ?
              </h4>
              <p className="text-sm text-yo-gray-700 leading-relaxed">
                Votre localisation nous permet de vous proposer des prestataires à proximité 
                et d'améliorer votre expérience sur Yo! Voiz. Vos données restent confidentielles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-yo-gray-200">
        <Button onClick={goToPrevStep} variant="outline" size="lg">
          <span className="mr-2">←</span>
          Retour
        </Button>
        <Button onClick={handleNext} size="lg" className="min-w-[200px]">
          Continuer
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
}
