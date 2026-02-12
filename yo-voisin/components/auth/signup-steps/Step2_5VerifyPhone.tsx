'use client';

import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SignupData } from '@/app/auth/inscription/page';

interface Props {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  error: string;
  setError: (error: string) => void;
}

export default function Step2_5VerifyPhone({
  formData,
  updateFormData,
  goToNextStep,
  goToPrevStep,
  error,
  setError,
}: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Envoi automatique du code au chargement
  useEffect(() => {
    if (!codeSent && formData.phone) {
      sendOTP();
    }
  }, []);

  // Gestion du cooldown pour le resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const sendOTP = async () => {
    setResending(true);
    setError('');

    try {
      // Normaliser le téléphone au format international
      const normalizedPhone = formData.phone.startsWith('+225') 
        ? formData.phone 
        : `+225${formData.phone.replace(/\s/g, '')}`;

      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Impossible d\'envoyer le code');
        setResending(false);
        return;
      }

      setCodeSent(true);
      setCooldown(60); // 60 secondes avant de pouvoir renvoyer

      // En DEV, afficher le code (uniquement si l'API le renvoie)
      if (data.code) {
        alert(`📱 CODE OTP (DEV): ${data.code}`);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setResending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Prendre uniquement le dernier caractère
    setOtp(newOtp);

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit si tous les champs sont remplis
    if (newOtp.every(digit => digit !== '') && index === 5) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Backspace : supprimer et revenir au champ précédent
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      
      // Auto-verify après paste
      setTimeout(() => verifyOTP(pastedData), 100);
    }
  };

  const verifyOTP = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      // Normaliser le téléphone au format international
      const normalizedPhone = formData.phone.startsWith('+225') 
        ? formData.phone 
        : `+225${formData.phone.replace(/\s/g, '')}`;

      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Code incorrect');
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      // Marquer le téléphone comme vérifié
      updateFormData({ phoneVerified: true });
      
      // Animation de succès puis passage à l'étape suivante
      setTimeout(() => {
        goToNextStep();
      }, 1000);
    } catch (err) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  // Normaliser pour l'affichage
  const normalizedPhone = formData.phone.startsWith('+225') 
    ? formData.phone 
    : `+225${formData.phone.replace(/\s/g, '')}`;
  const maskedPhone = normalizedPhone.replace(/(\+225)(\d{2})(\d{6})/, '$1 $2 •• •• ••');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-yo-orange/20 rounded-full flex items-center justify-center mx-auto">
          <Smartphone className="w-8 h-8 text-yo-orange" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-yo-green-dark mb-2">
            Vérification du téléphone
          </h2>
          <p className="text-yo-gray-600">
            Un code à 6 chiffres a été envoyé par <span className="font-semibold text-yo-green-dark">WhatsApp</span> au {maskedPhone}
          </p>
        </div>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 my-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={loading}
            className={`w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-all
              ${digit 
                ? 'border-yo-orange bg-yo-orange/10 text-yo-green-dark' 
                : 'border-yo-gray-300 bg-white text-yo-gray-800'}
              focus:outline-none focus:ring-2 focus:ring-yo-orange focus:border-yo-orange
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        >
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {/* Success */}
      {formData.phoneVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yo-green/10 border border-yo-green rounded-lg p-4 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5 text-yo-green" />
          <p className="text-yo-green-dark font-semibold">Téléphone vérifié avec succès !</p>
        </motion.div>
      )}

      {/* Resend */}
      <div className="text-center">
        <p className="text-yo-gray-600 text-sm mb-3">Vous n'avez pas reçu le code sur WhatsApp ?</p>
        <Button
          type="button"
          variant="outline"
          onClick={sendOTP}
          disabled={cooldown > 0 || resending || loading}
          className="border-yo-gray-300 text-yo-gray-700 hover:bg-yo-gray-50"
        >
          <RotateCcw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
          {cooldown > 0 ? `Renvoyer (${cooldown}s)` : resending ? 'Envoi...' : 'Renvoyer le code'}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={goToPrevStep}
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Button
          type="button"
          onClick={() => verifyOTP(otp.join(''))}
          disabled={otp.some(d => d === '') || loading}
        >
          {loading ? 'Vérification...' : 'Vérifier'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Help text */}
      <p className="text-yo-gray-500 text-xs text-center mt-4">
        💡 Vérifiez vos messages WhatsApp. Le code est valide pendant 10 minutes (3 tentatives max).
      </p>
    </motion.div>
  );
}
