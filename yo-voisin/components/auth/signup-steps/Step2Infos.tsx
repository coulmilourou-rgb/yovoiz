'use client';

import { useState } from 'react';
import { AlertCircle, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input-v2';
import { SignupData } from '@/app/auth/inscription/page';
import { checkDuplicateContact } from '@/lib/otp';

interface Step2Props {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  error: string;
  setError: (error: string) => void;
}

export default function Step2Infos({
  formData,
  updateFormData,
  goToNextStep,
  goToPrevStep,
  error,
  setError,
}: Step2Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [checking, setChecking] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    updateFormData({ password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const validate = () => {
    if (!formData.first_name.trim()) {
      setError('Le prénom est requis');
      return false;
    }
    if (!formData.last_name.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email invalide');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Le téléphone est requis');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Numéro de téléphone invalide (10 chiffres)');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setError('');
    if (!validate()) return;

    // Vérifier les doublons
    setChecking(true);
    try {
      const { emailExists, phoneExists } = await checkDuplicateContact(
        formData.email,
        formData.phone
      );

      if (emailExists) {
        setError('Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.');
        setChecking(false);
        return;
      }

      if (phoneExists) {
        setError('Ce numéro de téléphone est déjà utilisé. Utilisez un autre numéro.');
        setChecking(false);
        return;
      }

      goToNextStep();
    } catch (err) {
      setError('Erreur lors de la vérification. Réessayez.');
    } finally {
      setChecking(false);
    }
  };

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

  const strength = getPasswordStrengthLabel();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
          Vos informations personnelles
        </h2>
        <p className="text-yo-gray-600 text-lg">
          Remplissez les champs ci-dessous pour créer votre compte
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-yo-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Prénom"
            placeholder="Kouassi"
            value={formData.first_name}
            onChange={(e) => updateFormData({ first_name: e.target.value })}
            required
          />
          <Input
            label="Nom"
            placeholder="Kouamé"
            value={formData.last_name}
            onChange={(e) => updateFormData({ last_name: e.target.value })}
            required
          />
        </div>

        <Input
          type="email"
          label="Email"
          placeholder="ton.email@exemple.ci"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          helperText="Vous recevrez un email de confirmation"
          required
        />

        <Input
          type="tel"
          label="Téléphone"
          placeholder="07 12 34 56 78"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          helperText="Format : 10 chiffres (ex: 0712345678)"
          required
        />

        <div>
          <Input
            type="password"
            label="Mot de passe"
            placeholder="Minimum 8 caractères"
            value={formData.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />

          {formData.password && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-yo-gray-500">Force du mot de passe :</span>
                <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
              </div>
              <div className="h-2 bg-yo-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.bg}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-yo-gray-600">
                <li className="flex items-center gap-2">
                  {formData.password.length >= 8 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-yo-gray-300" />
                  )}
                  Au moins 8 caractères
                </li>
                <li className="flex items-center gap-2">
                  {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-yo-gray-300" />
                  )}
                  Majuscules et minuscules
                </li>
                <li className="flex items-center gap-2">
                  {/\d/.test(formData.password) ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-yo-gray-300" />
                  )}
                  Au moins un chiffre
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-yo-gray-200">
        <Button onClick={goToPrevStep} variant="outline" size="lg">
          <span className="mr-2">←</span>
          Retour
        </Button>
        <Button onClick={handleNext} size="lg" className="min-w-[200px]" disabled={checking}>
          {checking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              Continuer
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
