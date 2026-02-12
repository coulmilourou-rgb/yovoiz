'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Upload, FileImage, Camera, Loader2, CheckCircle2, 
  AlertCircle, Shield, Clock, ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function VerificationPage() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  
  const [cniFile, setCniFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5 Mo');
        return;
      }
      setCniFile(file);
      setError('');
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5 Mo');
        return;
      }
      setSelfieFile(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!cniFile || !selfieFile) {
      setError('Veuillez uploader les deux documents');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // TODO: Upload files to Supabase Storage
      // TODO: Update profile verification_status to 'submitted'
      
      // Simuler l'upload pour l'instant
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      await refreshProfile();
      
      setTimeout(() => {
        router.push('/home');
      }, 3000);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'upload');
      setLoading(false);
    }
  };

  // Si déjà vérifié
  if (profile?.verification_status === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-yo-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
            Compte vérifié ! ✓
          </h2>
          <p className="text-yo-gray-600 mb-6">
            Votre identité a été confirmée. Vous avez accès à toutes les fonctionnalités.
          </p>
          <Button onClick={() => router.push('/home')} size="lg" className="w-full">
            Retour au dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Si en cours de vérification
  if (profile?.verification_status === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
            Vérification en cours
          </h2>
          <p className="text-yo-gray-600 mb-6">
            Vos documents sont en cours d'examen. Nous vous notifierons par email dès validation (généralement sous 24-48h).
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-yo-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <strong>Que se passe-t-il maintenant ?</strong>
            </p>
            <ul className="mt-2 space-y-1 text-xs text-blue-700">
              <li>✓ Documents reçus</li>
              <li>⏳ Vérification en cours</li>
              <li>📧 Notification par email</li>
            </ul>
          </div>
          <Button onClick={() => router.push('/home')} variant="outline" size="lg" className="w-full">
            Retour au dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Formulaire de vérification
  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-white/80 flex items-center gap-2 mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>

        <Card className="p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-yo-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
                Documents envoyés ! 🎉
              </h2>
              <p className="text-yo-gray-600 mb-6">
                Vos documents sont en cours de vérification. Vous serez notifié par email.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-yo-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirection...
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yo-orange-pale rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-yo-orange" />
                </div>
                <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
                  Vérification d'identité
                </h2>
                <p className="text-yo-gray-600 text-lg">
                  Uploadez vos documents pour débloquer toutes les fonctionnalités
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-yo-md p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* CNI Upload */}
                <div>
                  <label className="block text-sm font-semibold text-yo-gray-800 mb-3">
                    📄 Carte Nationale d'Identité (CNI) <span className="text-yo-orange">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCniChange}
                    className="hidden"
                    id="cni-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="cni-upload"
                    className={`
                      flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-yo-lg cursor-pointer transition-all
                      ${cniFile ? 'border-yo-green bg-yo-green-pale' : 'border-yo-gray-300 bg-white hover:border-yo-green hover:bg-yo-green-pale/50'}
                      ${loading && 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    {cniFile ? (
                      <div className="text-center">
                        <CheckCircle2 className="w-12 h-12 text-yo-green mx-auto mb-3" />
                        <p className="font-semibold text-yo-green-dark">{cniFile.name}</p>
                        <p className="text-sm text-yo-gray-500 mt-1">
                          {(cniFile.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileImage className="w-12 h-12 text-yo-gray-400 mx-auto mb-3" />
                        <p className="font-semibold text-yo-gray-700">Cliquez pour uploader votre CNI</p>
                        <p className="text-sm text-yo-gray-500 mt-1">PNG, JPG ou JPEG (max 5 Mo)</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Selfie Upload */}
                <div>
                  <label className="block text-sm font-semibold text-yo-gray-800 mb-3">
                    📸 Photo Selfie avec CNI <span className="text-yo-orange">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleSelfieChange}
                    className="hidden"
                    id="selfie-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="selfie-upload"
                    className={`
                      flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-yo-lg cursor-pointer transition-all
                      ${selfieFile ? 'border-yo-green bg-yo-green-pale' : 'border-yo-gray-300 bg-white hover:border-yo-green hover:bg-yo-green-pale/50'}
                      ${loading && 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    {selfieFile ? (
                      <div className="text-center">
                        <CheckCircle2 className="w-12 h-12 text-yo-green mx-auto mb-3" />
                        <p className="font-semibold text-yo-green-dark">{selfieFile.name}</p>
                        <p className="text-sm text-yo-gray-500 mt-1">
                          {(selfieFile.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-yo-gray-400 mx-auto mb-3" />
                        <p className="font-semibold text-yo-gray-700">Prenez un selfie avec votre CNI</p>
                        <p className="text-sm text-yo-gray-500 mt-1">PNG, JPG ou JPEG (max 5 Mo)</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-yo-lg p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔒</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-2">Vos données sont sécurisées</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>✓ Chiffrement SSL de bout en bout</li>
                        <li>✓ Conformité RGPD et lois ivoiriennes</li>
                        <li>✓ Vérification manuelle par notre équipe</li>
                        <li>✓ Documents supprimés après vérification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={loading || !cniFile || !selfieFile}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Soumettre mes documents
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
