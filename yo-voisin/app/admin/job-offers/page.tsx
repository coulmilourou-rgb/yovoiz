'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase, Plus, Edit, Trash2, Eye, EyeOff,
  Users, Clock, CheckCircle, X, Loader2
} from 'lucide-react';

interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary_range: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface JobApplication {
  id: string;
  job_offer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  cv_url: string;
  cover_letter_url: string | null;
  motivation_message: string | null;
  status: string;
  created_at: string;
}

export default function AdminJobOffersPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/home');
      return;
    }
    loadData();
  }, [profile]);

  async function loadData() {
    await Promise.all([loadOffers(), loadApplications()]);
    setLoading(false);
  }

  async function loadOffers() {
    const { data } = await supabase
      .from('job_offers')
      .select('*')
      .order('created_at', { ascending: false });
    setOffers(data || []);
  }

  async function loadApplications() {
    const { data } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    setApplications(data || []);
  }

  async function handleDeleteOffer(id: string) {
    if (!confirm('Supprimer cette offre ? Les candidatures associées seront aussi supprimées.')) return;

    const { error } = await supabase
      .from('job_offers')
      .delete()
      .eq('id', id);

    if (!error) {
      loadOffers();
    }
  }

  async function handleTogglePublish(offer: JobOffer) {
    const { error } = await supabase
      .from('job_offers')
      .update({ is_published: !offer.is_published })
      .eq('id', offer.id);

    if (!error) {
      loadOffers();
    }
  }

  function openNewOfferModal() {
    setEditingOffer({
      id: '',
      title: '',
      department: '',
      location: 'Abidjan, Cocody',
      employment_type: 'CDI',
      description: '',
      responsibilities: [''],
      requirements: [''],
      skills: [''],
      salary_range: '',
      is_published: false,
      published_at: null,
      created_at: new Date().toISOString()
    });
    setShowModal(true);
  }

  function openEditModal(offer: JobOffer) {
    setEditingOffer(offer);
    setShowModal(true);
  }

  async function handleSaveOffer() {
    if (!editingOffer) return;

    setSaving(true);

    try {
      const cleanOffer = {
        title: editingOffer.title,
        department: editingOffer.department,
        location: editingOffer.location,
        employment_type: editingOffer.employment_type,
        description: editingOffer.description,
        responsibilities: editingOffer.responsibilities.filter(r => r.trim()),
        requirements: editingOffer.requirements.filter(r => r.trim()),
        skills: editingOffer.skills.filter(s => s.trim()),
        salary_range: editingOffer.salary_range || null,
        is_published: editingOffer.is_published
      };

      if (editingOffer.id) {
        // Update
        await supabase
          .from('job_offers')
          .update(cleanOffer)
          .eq('id', editingOffer.id);
      } else {
        // Create
        await supabase
          .from('job_offers')
          .insert(cleanOffer);
      }

      setShowModal(false);
      loadOffers();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  }

  function viewApplications(offerId: string) {
    setSelectedOffer(offerId);
    setShowApplicationsModal(true);
  }

  const getApplicationsByOffer = (offerId: string) => 
    applications.filter(app => app.job_offer_id === offerId);

  if (profile?.role !== 'admin') return null;
  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des offres d'emploi</h1>
          <p className="text-gray-600">{offers.length} offres • {applications.length} candidatures</p>
        </div>
        <Button onClick={openNewOfferModal} className="bg-yo-orange hover:bg-orange-600">
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle offre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <Briefcase className="w-8 h-8 text-yo-orange mb-2" />
          <p className="text-3xl font-bold">{offers.length}</p>
          <p className="text-sm text-gray-600">Offres totales</p>
        </Card>
        <Card className="p-6">
          <Eye className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-3xl font-bold">{offers.filter(o => o.is_published).length}</p>
          <p className="text-sm text-gray-600">Offres publiées</p>
        </Card>
        <Card className="p-6">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold">{applications.length}</p>
          <p className="text-sm text-gray-600">Candidatures reçues</p>
        </Card>
        <Card className="p-6">
          <Clock className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-3xl font-bold">
            {applications.filter(a => a.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600">À traiter</p>
        </Card>
      </div>

      {/* Liste des offres */}
      <div className="space-y-4">
        {offers.map((offer) => {
          const offerApplications = getApplicationsByOffer(offer.id);
          return (
            <Card key={offer.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{offer.title}</h3>
                    <Badge variant="secondary">{offer.department}</Badge>
                    <Badge className="bg-yo-green text-white">{offer.employment_type}</Badge>
                    {offer.is_published ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Eye className="w-3 h-3 mr-1" />
                        Publiée
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Brouillon
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{offer.location}</span>
                    <span>•</span>
                    <span>{offerApplications.length} candidature{offerApplications.length > 1 ? 's' : ''}</span>
                    {offer.salary_range && (
                      <>
                        <span>•</span>
                        <span>{offer.salary_range}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {offerApplications.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewApplications(offer.id)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      {offerApplications.length}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={offer.is_published ? 'outline' : 'default'}
                    onClick={() => handleTogglePublish(offer)}
                  >
                    {offer.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(offer)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteOffer(offer.id)} className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Créer/Modifier Offre */}
      {showModal && editingOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingOffer.id ? 'Modifier l\'offre' : 'Nouvelle offre'}
                </h2>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium mb-2">Titre du poste *</label>
                  <Input
                    value={editingOffer.title}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="Ex: Développeur Full-Stack Senior"
                  />
                </div>

                {/* Département + Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Département *</label>
                    <Input
                      value={editingOffer.department}
                      onChange={(e) => setEditingOffer({ ...editingOffer, department: e.target.value })}
                      placeholder="Tech, Design, Support..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de contrat *</label>
                    <select
                      value={editingOffer.employment_type}
                      onChange={(e) => setEditingOffer({ ...editingOffer, employment_type: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                {/* Localisation + Salaire */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Localisation *</label>
                    <Input
                      value={editingOffer.location}
                      onChange={(e) => setEditingOffer({ ...editingOffer, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fourchette salariale</label>
                    <Input
                      value={editingOffer.salary_range || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, salary_range: e.target.value })}
                      placeholder="Ex: 800 000 - 1 200 000 FCFA/mois"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={editingOffer.description}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Décrivez le poste..."
                  />
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium mb-2">Responsabilités</label>
                  {editingOffer.responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={resp}
                        onChange={(e) => {
                          const newResp = [...editingOffer.responsibilities];
                          newResp[index] = e.target.value;
                          setEditingOffer({ ...editingOffer, responsibilities: newResp });
                        }}
                        placeholder="Ex: Développer de nouvelles fonctionnalités..."
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newResp = editingOffer.responsibilities.filter((_, i) => i !== index);
                          setEditingOffer({ ...editingOffer, responsibilities: newResp });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setEditingOffer({ ...editingOffer, responsibilities: [...editingOffer.responsibilities, ''] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium mb-2">Prérequis</label>
                  {editingOffer.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={req}
                        onChange={(e) => {
                          const newReq = [...editingOffer.requirements];
                          newReq[index] = e.target.value;
                          setEditingOffer({ ...editingOffer, requirements: newReq });
                        }}
                        placeholder="Ex: Minimum 5 ans d'expérience..."
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newReq = editingOffer.requirements.filter((_, i) => i !== index);
                          setEditingOffer({ ...editingOffer, requirements: newReq });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setEditingOffer({ ...editingOffer, requirements: [...editingOffer.requirements, ''] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">Compétences techniques</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingOffer.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                        <Input
                          value={skill}
                          onChange={(e) => {
                            const newSkills = [...editingOffer.skills];
                            newSkills[index] = e.target.value;
                            setEditingOffer({ ...editingOffer, skills: newSkills });
                          }}
                          className="w-32 h-6 text-sm px-2 py-0"
                        />
                        <button
                          onClick={() => {
                            const newSkills = editingOffer.skills.filter((_, i) => i !== index);
                            setEditingOffer({ ...editingOffer, skills: newSkills });
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setEditingOffer({ ...editingOffer, skills: [...editingOffer.skills, ''] })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                {/* Publier */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={editingOffer.is_published}
                    onChange={(e) => setEditingOffer({ ...editingOffer, is_published: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label className="font-medium">Publier cette offre immédiatement</label>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleSaveOffer} disabled={saving} className="flex-1 bg-yo-orange hover:bg-orange-600">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Candidatures */}
      {showApplicationsModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowApplicationsModal(false)}>
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Candidatures - {offers.find(o => o.id === selectedOffer)?.title}
                </h2>
                <Button variant="ghost" onClick={() => setShowApplicationsModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {getApplicationsByOffer(selectedOffer).map((app) => (
                  <Card key={app.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{app.first_name} {app.last_name}</h3>
                        <p className="text-sm text-gray-600">{app.email} • {app.phone}</p>
                        <p className="text-sm text-gray-500">{app.location}</p>
                      </div>
                      <Badge className={
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                    {app.motivation_message && (
                      <p className="text-sm text-gray-700 mb-4 italic">"{app.motivation_message}"</p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(app.cv_url, '_blank')}>
                        Télécharger CV
                      </Button>
                      {app.cover_letter_url && (
                        <Button size="sm" variant="outline" onClick={() => window.open(app.cover_letter_url!, '_blank')}>
                          Télécharger Lettre
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
