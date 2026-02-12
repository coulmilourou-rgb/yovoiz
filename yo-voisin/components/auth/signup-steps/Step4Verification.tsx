'use client';

import { useState } from 'react';
import { Upload, FileImage, Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SignupData } from '@/app/auth/inscription/page';

interface Step4Props {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  goToPrevStep: () => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string;
  setError: (error: string) => void;
}

export default function Step4Verification({
  formData,
  updateFormData,
  goToPrevStep,
  onSubmit,
  loading,
  error,
  setError,
}: Step4Props) {
  const [cniFile, setCniFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [skipVerification, setSkipVerification] = useState(false);

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
    if (!skipVerification && (!cniFile || !selfieFile)) {
      setError('Veuillez uploader votre CNI et votre selfie, ou passer cette étape');
      return;
    }

    setError('');
    
    // TODO: Upload files to Supabase Storage
    // For now, we just proceed with the signup
    await onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-display font-extrabold text-3xl text-yo-green-dark mb-3">
          Vérification d'identité
        </h2>
        <p className="text-yo-gray-600 text-lg">
          Renforcez la confiance en vérifiant votre identité
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-yo-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* CNI Upload */}
        <div>
          <label className="block text-sm font-semibold text-yo-gray-800 mb-3">
            📄 Carte Nationale d'Identité (CNI)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleCniChange}
              className="hidden"
              id="cni-upload"
              disabled={loading || skipVerification}
            />
            <label
              htmlFor="cni-upload"
              className={`
                flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-yo-lg cursor-pointer
                transition-all
                ${cniFile 
                  ? 'border-yo-green bg-yo-green-pale' 
                  : 'border-yo-gray-300 bg-white hover:border-yo-green hover:bg-yo-green-pale/50'
                }
                ${(loading || skipVerification) && 'opacity-50 cursor-not-allowed'}
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
                  <p className="font-semibold text-yo-gray-700">
                    Cliquez pour uploader votre CNI
                  </p>
                  <p className="text-sm text-yo-gray-500 mt-1">
                    PNG, JPG ou JPEG (max 5 Mo)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Selfie Upload */}
        <div>
          <label className="block text-sm font-semibold text-yo-gray-800 mb-3">
            📸 Photo Selfie avec CNI
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleSelfieChange}
              className="hidden"
              id="selfie-upload"
              disabled={loading || skipVerification}
            />
            <label
              htmlFor="selfie-upload"
              className={`
                flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-yo-lg cursor-pointer
                transition-all
                ${selfieFile 
                  ? 'border-yo-green bg-yo-green-pale' 
                  : 'border-yo-gray-300 bg-white hover:border-yo-green hover:bg-yo-green-pale/50'
                }
                ${(loading || skipVerification) && 'opacity-50 cursor-not-allowed'}
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
                  <p className="font-semibold text-yo-gray-700">
                    Prenez un selfie avec votre CNI
                  </p>
                  <p className="text-sm text-yo-gray-500 mt-1">
                    PNG, JPG ou JPEG (max 5 Mo)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Skip Option */}
        <div className="bg-yo-orange-pale border border-yo-orange/30 rounded-yo-lg p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={skipVerification}
              onChange={(e) => {
                setSkipVerification(e.target.checked);
                if (e.target.checked) {
                  setCniFile(null);
                  setSelfieFile(null);
                  setError('');
                }
              }}
              className="mt-1 w-5 h-5 rounded border-yo-gray-300 text-yo-orange focus:ring-yo-orange"
              disabled={loading}
            />
            <div className="flex-1">
              <p className="font-semibold text-yo-gray-800 mb-1">
                Vérifier mon identité plus tard
              </p>
              <p className="text-sm text-yo-gray-600 leading-relaxed">
                Vous pourrez compléter la vérification depuis votre profil. 
                <strong className="text-yo-orange"> Note:</strong> Certains services nécessitent une identité vérifiée.
              </p>
            </div>
          </label>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-yo-lg p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div className="flex-1">
              <h4 className="font-bold text-blue-900 mb-2">
                Pourquoi vérifier mon identité ?
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Augmente votre crédibilité auprès des autres utilisateurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Accédez à plus de services et fonctionnalités</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Renforce la sécurité de toute la communauté</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-yo-gray-200">
        <Button onClick={goToPrevStep} variant="outline" size="lg" disabled={loading}>
          <span className="mr-2">←</span>
          Retour
        </Button>
        <Button onClick={handleSubmit} size="lg" disabled={loading} className="min-w-[200px]">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Création du compte...
            </>
          ) : (
            <>
              Créer mon compte
              <span className="ml-2">✓</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
