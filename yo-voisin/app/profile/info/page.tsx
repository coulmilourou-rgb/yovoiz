'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, MapPin, Phone, Mail, Briefcase, Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { COMMUNES } from '@/lib/constants';

export default function InformationsPersonnellesPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_naissance: '',
    commune: '',
    address: '',
    bio: '',
    provider_bio: '',
    provider_experience_years: 0
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_naissance: profile.date_naissance || '',
        commune: profile.commune || '',
        address: profile.address || '',
        bio: profile.bio || '',
        provider_bio: profile.provider_bio || '',
        provider_experience_years: profile.provider_experience_years || 0
      });
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    
    // Valider le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Valider la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Créer le bucket 'avatars' s'il n'existe pas (tentative silencieuse)
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      }).catch(() => {}); // Ignorer si le bucket existe déjà

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      await refreshProfile();
      alert('✅ Photo de profil mise à jour !');
    } catch (error: any) {
      console.error('Erreur upload avatar:', error);
      alert('❌ Erreur lors de l\'upload: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Préparer les données de base (colonnes garanties)
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        commune: formData.commune,
        updated_at: new Date().toISOString()
      };

      // Ajouter les colonnes optionnelles seulement si renseignées
      if (formData.address) updateData.address = formData.address;
      if (formData.bio) updateData.bio = formData.bio;
      if (formData.date_naissance) updateData.date_naissance = formData.date_naissance;

      // Colonnes prestataire (peuvent ne pas exister dans certaines installations)
      if (formData.provider_bio) updateData.provider_bio = formData.provider_bio;
      if (formData.provider_experience_years) {
        updateData.provider_experience_years = parseInt(formData.provider_experience_years.toString()) || 0;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      await refreshProfile();
      setSuccess(true);
      alert('✅ Profil mis à jour avec succès !');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      alert('❌ Erreur lors de la mise à jour: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yo-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-primary/5 via-white to-yo-secondary/5">
      <Navbar
        isConnected={true}
        user={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold text-yo-gray-900">
            👤 Informations Personnelles
          </h1>
          <p className="text-yo-gray-600 mt-2">
            Gérez vos informations de profil
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-green-800">Profil mis à jour avec succès !</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo de profil */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-yo-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-yo-primary" />
              Photo de profil
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar preview */}
              <div className="relative">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={`${formData.first_name} ${formData.last_name}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-yo-gray-200"
                  />
                ) : (
                  <Avatar
                    firstName={formData.first_name || 'U'}
                    lastName={formData.last_name || 'N'}
                    imageUrl={undefined}
                    size="xl"
                  />
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Upload button */}
              <div className="flex-1">
                <p className="text-sm text-yo-gray-600 mb-4">
                  Téléchargez une photo de profil pour personnaliser votre compte. 
                  Formats acceptés : JPG, PNG. Taille max : 5MB.
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingAvatar}
                    className="w-full md:w-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingAvatar ? 'Upload en cours...' : 'Choisir une photo'}
                  </Button>
                </label>
              </div>
            </div>
          </Card>

          {/* Informations de base */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-yo-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-yo-primary" />
              Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Prénom *
                </label>
                <Input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                  placeholder="Jean"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Nom *
                </label>
                <Input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                  placeholder="Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    placeholder="0701020304 ou +2250701020304"
                    className="pl-11"
                  />
                </div>
                <p className="text-xs text-yo-gray-500 mt-1">
                  Format: 0701020304 ou +2250701020304
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Date de naissance
                </label>
                <Input
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) => setFormData({...formData, date_naissance: e.target.value})}
                  max={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-yo-gray-500 mt-1">
                  Doit avoir au moins 18 ans
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Commune *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
                  <select
                    value={formData.commune}
                    onChange={(e) => setFormData({...formData, commune: e.target.value})}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-primary focus:border-transparent"
                  >
                    <option value="">Sélectionner...</option>
                    {COMMUNES.map(commune => (
                      <option key={commune} value={commune}>{commune}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                Adresse complète
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Rue, quartier, repères..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                Bio (présentation courte)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
                maxLength={500}
                placeholder="Présentez-vous en quelques mots..."
                className="w-full px-4 py-3 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-primary focus:border-transparent"
              />
              <p className="text-xs text-yo-gray-500 mt-1">
                {formData.bio.length}/500 caractères
              </p>
            </div>
          </Card>

          {/* Informations prestataire (si applicable) */}
          {profile.role !== 'requester' && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-yo-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-yo-primary" />
                Informations Prestataire
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                    Bio professionnelle
                  </label>
                  <textarea
                    value={formData.provider_bio}
                    onChange={(e) => setFormData({...formData, provider_bio: e.target.value})}
                    rows={4}
                    maxLength={1000}
                    placeholder="Décrivez votre expérience, compétences, équipements..."
                    className="w-full px-4 py-3 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-primary focus:border-transparent"
                  />
                  <p className="text-xs text-yo-gray-500 mt-1">
                    {formData.provider_bio.length}/1000 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                    Années d'expérience
                  </label>
                  <Input
                    type="number"
                    value={formData.provider_experience_years}
                    onChange={(e) => setFormData({...formData, provider_experience_years: parseInt(e.target.value) || 0})}
                    min="0"
                    max="50"
                    placeholder="0"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-yo-orange hover:bg-yo-orange-dark text-white disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
