'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, DollarSign, TrendingUp, Calendar, 
  Download, Filter, Euro, CheckCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Payment {
  id: string;
  mission_id: string;
  amount: number;
  commission: number;
  provider_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  released_at: string | null;
  mission: {
    request_id: string;
    request: {
      title: string;
      category_id: string;
    };
    requester: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function MesPaiementsPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    total_earned: 0,
    pending: 0,
    released: 0,
    count: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'held_escrow' | 'released'>('all');

  useEffect(() => {
    if (user) {
      loadPayments();
    }
  }, [user, filter]);

  const loadPayments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          mission:missions!inner(
            request_id,
            request:requests(title, category_id),
            requester:profiles!missions_requester_id_fkey(first_name, last_name)
          )
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPayments(data || []);

      // Calculer stats
      const totalEarned = data?.reduce((sum, p) => sum + (p.status === 'released' ? p.provider_amount : 0), 0) || 0;
      const pending = data?.reduce((sum, p) => sum + (p.status === 'held_escrow' ? p.provider_amount : 0), 0) || 0;
      const released = totalEarned;

      setStats({
        total_earned: totalEarned,
        pending,
        released,
        count: data?.length || 0
      });
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-600',
      held_escrow: 'bg-blue-600',
      released: 'bg-green-600',
      refunded: 'bg-red-600',
      cancelled: 'bg-red-600'
    };

    const labels = {
      pending: '⏳ En attente',
      held_escrow: '🔒 Bloqué',
      released: '✅ Versé',
      refunded: '↩️ Remboursé',
      cancelled: '❌ Annulé'
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles] || 'bg-gray-600'} text-white`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
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

      <div className="container mx-auto px-4 py-8">
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
            💰 Mes Paiements Reçus
          </h1>
          <p className="text-yo-gray-600 mt-2">
            Historique de vos gains et paiements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Total gagné</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {stats.total_earned.toLocaleString()} FCFA
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">En attente</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {stats.pending.toLocaleString()} FCFA
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Versé</span>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {stats.released.toLocaleString()} FCFA
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-yo-gray-600">Transactions</span>
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {stats.count}
            </p>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              className={filter === 'all' ? 'bg-yo-primary text-white' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
            <Button
              onClick={() => setFilter('held_escrow')}
              variant={filter === 'held_escrow' ? 'default' : 'outline'}
              className={filter === 'held_escrow' ? 'bg-blue-600 text-white' : ''}
            >
              En attente
            </Button>
            <Button
              onClick={() => setFilter('released')}
              variant={filter === 'released' ? 'default' : 'outline'}
              className={filter === 'released' ? 'bg-green-600 text-white' : ''}
            >
              Versés
            </Button>
          </div>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Liste des paiements */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-yo-gray-900 mb-2">
              Aucun paiement
            </h3>
            <p className="text-yo-gray-600 mb-6">
              Vous n'avez pas encore reçu de paiement
            </p>
            <Button onClick={() => router.push('/missions')}>
              Voir les demandes disponibles
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, idx) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-yo-gray-900">
                          {payment.mission.request.title}
                        </h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      <p className="text-sm text-yo-gray-600">
                        Client : {payment.mission.requester.first_name} {payment.mission.requester.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yo-gray-500 mb-1">Votre part</p>
                      <p className="text-2xl font-bold text-green-600">
                        {payment.provider_amount.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-yo-gray-200">
                    <div>
                      <p className="text-xs text-yo-gray-500 mb-1">Montant total</p>
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4 text-yo-gray-400" />
                        <span className="font-bold text-yo-gray-900">
                          {payment.amount.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-yo-gray-500 mb-1">Commission (10%)</p>
                      <span className="text-sm font-bold text-red-600">
                        - {payment.commission.toLocaleString()} FCFA
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-yo-gray-500 mb-1">Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-yo-gray-400" />
                        <span className="text-sm font-bold">
                          {new Date(payment.released_at || payment.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
