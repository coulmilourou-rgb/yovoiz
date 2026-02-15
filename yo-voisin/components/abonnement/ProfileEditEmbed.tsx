'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNotification } from '@/hooks/useNotification';
import { 
  Camera, 
  Upload, 
  Save, 
  X,
  Image as ImageIcon
} from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function ProfileEditEmbed() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const { success, error: showError, NotificationContainer } = useNotification();
  const [profile, setProfile] = useState<Profile | null>(authProfile);
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Formulaire
  const [bio, setBio] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
      setBio(authProfile.bio || '');
      setCompanyName(authProfile.company_name || '');
      setCompanyDescription(authProfile.company_description || '');
      setWebsite(authProfile.website || '');
      setAddress(authProfile.address || '');
    }
  }, [authProfile]);

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('La taille maximale est de 5MB');
      return;
    }

    setUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-cover-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Créer le bucket 'covers' s'il n'existe pas (tentative silencieuse)
      await supabase.storage.createBucket('covers', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      }).catch(() => {}); // Ignorer si le bucket existe déjà

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      success('Photo de couverture mise à jour avec succès !');
      
      // Rafraîchir le profil
      await refreshProfile();
    } catch (err: any) {
      console.error('Erreur upload couverture:', err);
      showError(`Erreur: ${err.message || 'Impossible de charger la photo de couverture'}`);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('La taille maximale est de 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Créer le bucket 'avatars' s'il n'existe pas (tentative silencieuse)
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      }).catch(() => {}); // Ignorer si le bucket existe déjà

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      success('Photo de profil mise à jour avec succès !');
      await refreshProfile();
    } catch (err: any) {
      console.error('Erreur upload avatar:', err);
      showError(`Erreur: ${err.message || 'Impossible de charger la photo de profil'}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          bio,
          company_name: companyName,
          company_description: companyDescription,
          website,
          address
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      success('Profil mis à jour', 'Vos informations ont été mises à jour avec succès');
      await refreshProfile();
    } catch (err: any) {
      console.error('Erreur mise à jour profil:', err);
      showError('Erreur', err.message || 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <NotificationContainer />
        <Card className="p-6">
          <p className="text-gray-500 text-center">Profil non trouvé</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationContainer />

      {/* Photo de couverture */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-yo-orange via-yo-orange-light to-yo-green">
          {profile.cover_url && (
            <img
              src={profile.cover_url}
              alt="Photo de couverture"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadCover}
              className="hidden"
            />
            <Button
              variant="default"
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
            >
              <Camera className="w-5 h-5 mr-2" />
              {uploadingCover ? 'Chargement...' : 'Modifier la couverture'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Photo de profil */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yo-orange to-yo-green flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadAvatar}
              className="hidden"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadingAvatar ? 'Chargement...' : 'Changer la photo'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Format JPG, PNG ou GIF. Taille maximale 5MB.</p>
      </Card>

      {/* Informations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations publiques</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biographie
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yo-orange"
              placeholder="Parlez de vous..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
            </label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Mon Entreprise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description de l'entreprise
            </label>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yo-orange"
              placeholder="Description de votre entreprise..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site web
            </label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://monsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Rue Example, Abidjan"
            />
          </div>
        </div>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          variant="default"
          className="bg-yo-orange hover:bg-yo-orange-dark text-white"
          onClick={handleSaveProfile}
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
}
