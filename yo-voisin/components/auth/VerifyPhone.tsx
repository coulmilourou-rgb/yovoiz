'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { verifyOTP, resendOTP } from '@/lib/otp';

interface VerifyPhoneProps {
  userId: string;
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function VerifyPhonePage({
  userId,
  phone,
  onVerified,
  onBack,
}: VerifyPhoneProps) {
  const router = useRouter();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown pour resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit si tous les champs sont remplis
    if (value && index === 5 && newCode.every(c => c)) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace : revenir au champ précédent
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    // Focus sur le dernier champ rempli
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    // Auto-submit si 6 chiffres
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || code.join('');

    if (fullCode.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(phone, fullCode);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setError(result.message);
        // Reset le code en cas d'erreur
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      const result = await resendOTP(userId, phone);

      if (result.success) {
        setResendCooldown(60); // 60 secondes de cooldown
        // En dev, afficher le code
        if (result.code) {
          alert(`Code OTP (DEV): ${result.code}`);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-yo-green rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
          Téléphone vérifié ! ✓
        </h2>
        <p className="text-yo-gray-600">
          Votre numéro a été confirmé avec succès
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-yo-gray-600 hover:text-yo-gray-800 font-semibold"
        disabled={loading}
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yo-green-pale rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-yo-green-dark" />
        </div>
        <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
          Vérification du téléphone
        </h2>
        <p className="text-yo-gray-600 text-lg mb-2">
          Un code à 6 chiffres a été envoyé par SMS au
        </p>
        <p className="font-bold text-yo-green-dark text-xl">
          {phone}
        </p>
      </div>

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

      <div className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-semibold text-yo-gray-800 mb-4 text-center">
            Entrez le code reçu par SMS
          </label>
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                className={`
                  w-14 h-14 text-center text-2xl font-bold rounded-yo-lg border-2 
                  transition-all focus:outline-none
                  ${digit 
                    ? 'border-yo-green bg-yo-green-pale text-yo-green-dark' 
                    : 'border-yo-gray-300 bg-white'
                  }
                  ${error ? 'border-red-500' : ''}
                  focus:ring-2 focus:ring-yo-green focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            ))}
          </div>
        </div>

        {/* Resend Button */}
        <div className="text-center">
          <p className="text-sm text-yo-gray-600 mb-3">
            Vous n'avez pas reçu le code ?
          </p>
          <button
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
            className="text-yo-green hover:text-yo-green-dark font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 
              ? `Renvoyer dans ${resendCooldown}s` 
              : 'Renvoyer le code'
            }
          </button>
        </div>

        {/* Submit Button */}
        <Button
          onClick={() => handleVerify()}
          size="lg"
          disabled={loading || code.some(c => !c)}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Vérification...
            </>
          ) : (
            'Vérifier le code'
          )}
        </Button>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-yo-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">💡 Conseil :</p>
          <ul className="space-y-1 text-xs">
            <li>• Le code expire dans 10 minutes</li>
            <li>• Vérifiez vos messages SMS</li>
            <li>• Le code peut prendre jusqu'à 2 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
