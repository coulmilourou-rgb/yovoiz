'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Upload, FileText, CheckCircle, 
  AlertCircle, User, Mail, Phone, MapPin, Loader2
} from 'lucide-react';

interface JobOffer {
  id: string;
  title: string;
  department: string;
  employment_type: string;
}

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  
  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    location: profile?.commune || '',
    motivation_message: ''
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadJobOffer();
  }, [params.id]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.commune || ''
      }));
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [profile, user]);

  async function loadJobOffer() {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('id, title, department, employment_type')
        .eq('id', params.id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setOffer(data);
    } catch (error) {
      console.error('Erreur chargement offre:', error);
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name) newErrors.first_name = 'Prénom requis';
    if (!formData.last_name) newErrors.last_name = 'Nom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.phone) newErrors.phone = 'Téléphone requis';
    if (!formData.location) newErrors.location = 'Commune requise';
    if (!cvFile) newErrors.cv = 'CV requis (PDF uniquement)';
    
    if (cvFile && cvFile.type !== 'application/pdf') {
      newErrors.cv = 'Le CV doit être au format PDF';
    }
    if (coverLetterFile && coverLetterFile.type !== 'application/pdf') {
      newErrors.coverLetter = 'La lettre de motivation doit être au format PDF';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function uploadFile(file: File, prefix: string): Promise<string> {
    const fileName = `${prefix}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('job-applications')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('job-applications')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // 1. Upload CV
      const cvUrl = await uploadFile(cvFile!, 'cv');
      
      // 2. Upload cover letter (optional)
      let coverLetterUrl = null;
      if (coverLetterFile) {
        coverLetterUrl = await uploadFile(coverLetterFile, 'cover_letter');
      }

      // 3. Insert application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          job_offer_id: params.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          cv_url: cvUrl,
          cover_letter_url: coverLetterUrl,
          motivation_message: formData.motivation_message || null
        });

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Redirect après 3 secondes
      setTimeout(() => {
        router.push('/carrieres');
      }, 3000);

    } catch (error: any) {
      console.error('Erreur soumission:', error);
      setErrors({ submit: 'Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar 
          isConnected={!!user} 
          user={profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url
          } : undefined}
        />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar 
          isConnected={!!user} 
          user={profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url
          } : undefined}
        />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Offre introuvable</h1>
          <Button onClick={() => router.push('/carrieres')}>
            Retour aux offres
          </Button>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar 
          isConnected={!!user} 
          user={profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url
          } : undefined}
        />
        <div className="max-w-3xl mx-auto px-4 py-24">
          <Card className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Candidature envoyée !</h1>
            <p className="text-lg text-gray-600 mb-6">
              Merci pour votre candidature au poste de <strong>{offer.title}</strong>.
            </p>
            <p className="text-gray-600 mb-8">
              Notre équipe RH examinera votre dossier et vous contactera dans les plus brefs délais.
            </p>
            <Button onClick={() => router.push('/carrieres')}>
              Retour aux offres
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="max-w-3xl mx-auto px-4 py-24">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card className="p-8 mb-6">
          <h1 className="text-3xl font-black mb-2">Postuler</h1>
          <p className="text-gray-600">
            Poste : <strong>{offer.title}</strong> - {offer.department}
          </p>
        </Card>

        <form onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <Card className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations personnelles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Jean"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Kouassi"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean.kouassi@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+225 07 00 00 00 00"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Commune *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Cocody"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documents
            </h2>

            {/* CV */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV (PDF) *
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-yo-orange transition ${
                    errors.cv ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {cvFile ? cvFile.name : 'Cliquez pour télécharger votre CV'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF uniquement, max 10 MB</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCvFile(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.cv && (
                <p className="text-red-500 text-sm mt-1">{errors.cv}</p>
              )}
            </div>

            {/* Cover Letter (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lettre de motivation (PDF) - Facultatif
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-yo-orange transition ${
                    errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {coverLetterFile ? coverLetterFile.name : 'Cliquez pour télécharger votre lettre'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF uniquement, max 10 MB</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCoverLetterFile(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>
              )}
            </div>
          </Card>

          {/* Message de motivation */}
          <Card className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">Message de motivation (facultatif)</h2>
            <textarea
              value={formData.motivation_message}
              onChange={(e) => setFormData({ ...formData, motivation_message: e.target.value })}
              rows={6}
              placeholder="Pourquoi ce poste vous intéresse-t-il ? Qu'apporteriez-vous à l'équipe ?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yo-orange focus:border-transparent"
            />
          </Card>

          {/* Submit */}
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-yo-orange hover:bg-orange-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer ma candidature'
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
