'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Shield, Check, X, Eye, Clock, AlertCircle, 
  FileText, Briefcase, Search, Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ModerationItem {
  id: string;
  content_type: 'request' | 'service_offer';
  content_id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export default function AdminModerationPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<'all' | 'request' | 'service_offer'>('all');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!loading && (!user || !profile || profile.role !== 'admin')) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadModerationQueue();
    }
  }, [profile]);

  const loadModerationQueue = async () => {
    try {
      setLoadingData(true);

      let query = supabase
        .from('moderation_queue')
        .select(`
          *,
          user:profiles!moderation_queue_user_id_fkey(
            first_name,
            last_name,
            phone
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('content_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('Erreur chargement modération:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (itemId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('approve_content', {
        p_moderation_id: itemId,
        p_admin_id: user.id
      });

      if (error) throw error;

      alert('✅ Contenu approuvé avec succès !');
      loadModerationQueue();
    } catch (error: any) {
      console.error('Erreur approbation:', error);
      alert('❌ Erreur: ' + error.message);
    }
  };

  const handleReject = async (itemId: string, reason: string) => {
    if (!user || !reason.trim()) {
      alert('Veuillez indiquer une raison de rejet');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('reject_content', {
        p_moderation_id: itemId,
        p_admin_id: user.id,
        p_reason: reason
      });

      if (error) throw error;

      alert('❌ Contenu rejeté');
      setSelectedItem(null);
      setRejectionReason('');
      loadModerationQueue();
    } catch (error: any) {
      console.error('Erreur rejet:', error);
      alert('❌ Erreur: ' + error.message);
    }
  };

  if (loading || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-yo-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yo-gray-50">
      <PageHead 
        title="Modération Admin" 
        description="Interface d'administration pour modérer les demandes et offres de services."
      />
      <Navbar 
        isConnected={true} 
        user={{
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-yo-primary" />
            <h1 className="font-display font-bold text-4xl text-yo-gray-900">
              Modération
            </h1>
          </div>
          <p className="text-yo-gray-600">
            Gérez les demandes et offres en attente de validation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yo-orange" />
              <div>
                <div className="text-3xl font-bold text-yo-gray-900">{items.length}</div>
                <div className="text-sm text-yo-gray-600">En attente</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-yo-primary" />
              <div>
                <div className="text-3xl font-bold text-yo-gray-900">
                  {items.filter(i => i.content_type === 'request').length}
                </div>
                <div className="text-sm text-yo-gray-600">Demandes</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-yo-green" />
              <div>
                <div className="text-3xl font-bold text-yo-gray-900">
                  {items.filter(i => i.content_type === 'service_offer').length}
                </div>
                <div className="text-sm text-yo-gray-600">Offres</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-yo-gray-600" />
            <div className="flex gap-2">
              {(['all', 'request', 'service_offer'] as const).map((f) => (
                <Button
                  key={f}
                  onClick={() => setFilter(f)}
                  variant={filter === f ? 'default' : 'outline'}
                  className={filter === f ? 'bg-yo-primary text-white' : ''}
                >
                  {f === 'all' ? 'Tout' : f === 'request' ? 'Demandes' : 'Offres'}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Liste */}
        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yo-primary mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-yo-gray-300 mx-auto mb-4" />
            <p className="text-yo-gray-600">Aucun contenu en attente de modération</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between gap-4">
                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={
                          item.content_type === 'request' 
                            ? 'bg-yo-primary/10 text-yo-primary' 
                            : 'bg-yo-green/10 text-yo-green'
                        }>
                          {item.content_type === 'request' ? (
                            <><FileText className="w-3 h-3 mr-1" /> Demande</>
                          ) : (
                            <><Briefcase className="w-3 h-3 mr-1" /> Offre</>
                          )}
                        </Badge>
                        
                        <span className="text-sm text-yo-gray-500">
                          {new Date(item.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-yo-gray-900 mb-2">
                        {item.title}
                      </h3>

                      <p className="text-yo-gray-700 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      {item.user && (
                        <div className="text-sm text-yo-gray-600">
                          👤 Publié par : <strong>{item.user.first_name} {item.user.last_name}</strong>
                          {' • '} 📞 {item.user.phone}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleApprove(item.id)}
                        className="bg-yo-green hover:bg-yo-green-dark text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>

                      <Button
                        onClick={() => setSelectedItem(item)}
                        variant="outline"
                        className="border-yo-red text-yo-red hover:bg-yo-red hover:text-white"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          // TODO: Ouvrir modal détails
                          alert('Détails à implémenter');
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Rejet */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="max-w-lg w-full p-6">
            <h2 className="font-bold text-2xl text-yo-gray-900 mb-4">
              Rejeter ce contenu
            </h2>

            <p className="text-yo-gray-700 mb-4">
              <strong>{selectedItem.title}</strong>
            </p>

            <label className="block mb-2 font-semibold text-yo-gray-900">
              Raison du rejet *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Expliquez pourquoi ce contenu est rejeté..."
              className="w-full border border-yo-gray-300 rounded-lg p-3 mb-4 min-h-[120px]"
              required
            />

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSelectedItem(null);
                  setRejectionReason('');
                }}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleReject(selectedItem.id, rejectionReason)}
                className="flex-1 bg-yo-red hover:bg-yo-red-dark text-white"
              >
                Confirmer le rejet
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
