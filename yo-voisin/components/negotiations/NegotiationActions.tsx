'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { counterProposal, acceptProposal, rejectProposal } from '@/lib/negotiations';
import type { Negotiation } from '@/lib/types/negotiations';

interface NegotiationActionsProps {
  negotiation: Negotiation;
  currentUserId: string;
  onSuccess: () => void;
}

export const NegotiationActions = ({
  negotiation,
  currentUserId,
  onSuccess
}: NegotiationActionsProps) => {
  const [action, setAction] = useState<'none' | 'counter' | 'reject'>('none');
  const [newAmount, setNewAmount] = useState(negotiation.current_amount.toString());
  const [message, setMessage] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // DÃ©terminer si c'est mon tour
  const isClient = currentUserId === negotiation.client_id;
  const isMyTurn = (
    (negotiation.current_proposer === 'provider' && isClient) ||
    (negotiation.current_proposer === 'client' && !isClient)
  );

  // VÃ©rifier si terminÃ©
  const isFinished = ['accepted', 'rejected', 'expired'].includes(negotiation.status);

  // VÃ©rifier si limite atteinte
  const maxRoundsReached = negotiation.round_count >= negotiation.max_rounds;

  // Calculer temps restant
  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const expires = new Date(negotiation.expires_at).getTime();
    const diff = expires - now;

    if (diff <= 0) return 'ExpirÃ©';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j ${hours % 24}h`;
    }

    return `${hours}h ${minutes}min`;
  };

  const handleAccept = async () => {
    if (!isMyTurn || isFinished) return;

    setLoading(true);
    setError('');

    try {
      await acceptProposal({
        negotiationId: negotiation.id,
        userId: currentUserId
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'acceptation');
    } finally {
      setLoading(false);
    }
  };

  const handleCounter = async () => {
    if (!isMyTurn || isFinished || maxRoundsReached) return;

    setLoading(true);
    setError('');

    try {
      const amount = parseInt(newAmount);

      if (isNaN(amount) || amount < 500) {
        throw new Error('Montant minimum : 500 FCFA');
      }

      if (amount > 1000000) {
        throw new Error('Montant maximum : 1 000 000 FCFA');
      }

      await counterProposal({
        negotiationId: negotiation.id,
        newAmount: amount,
        message,
        userId: currentUserId
      });

      setAction('none');
      setMessage('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la contre-proposition');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!isMyTurn || isFinished) return;

    setLoading(true);
    setError('');

    try {
      await rejectProposal({
        negotiationId: negotiation.id,
        userId: currentUserId,
        reason: rejectReason
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du refus');
    } finally {
      setLoading(false);
    }
  };

  // Ã‰tat terminÃ©
  if (isFinished) {
    return (
      <Card className={`p-6 text-center ${
        negotiation.status === 'accepted' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="text-6xl mb-4">
          {negotiation.status === 'accepted' ? 'ðŸŽ‰' : negotiation.status === 'rejected' ? 'âŒ' : 'â°'}
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {negotiation.status === 'accepted' && 'NÃ©gociation acceptÃ©e !'}
          {negotiation.status === 'rejected' && 'NÃ©gociation refusÃ©e'}
          {negotiation.status === 'expired' && 'NÃ©gociation expirÃ©e'}
        </h3>
        <p className="text-yo-gray-600">
          {negotiation.status === 'accepted' && `Montant final : ${negotiation.current_amount.toLocaleString()} FCFA`}
          {negotiation.status === 'rejected' && negotiation.rejection_reason}
          {negotiation.status === 'expired' && 'Le dÃ©lai de 72h est dÃ©passÃ©'}
        </p>
      </Card>
    );
  }

  // Pas mon tour
  if (!isMyTurn) {
    return (
      <Card className="p-6 bg-yo-gray-50 border-yo-gray-200">
        <div className="text-center">
          <div className="text-5xl mb-4">â³</div>
          <h3 className="text-xl font-bold text-yo-gray-900 mb-2">
            En attente de rÃ©ponse
          </h3>
          <p className="text-yo-gray-600">
            {isClient ? 'Le prestataire' : 'Le client'} Ã©tudie votre proposition
          </p>
          <div className="mt-4 text-sm text-yo-gray-500">
            Expire dans {getTimeRemaining()}
          </div>
        </div>
      </Card>
    );
  }

  // Actions disponibles
  return (
    <div className="space-y-4">
      {/* Alerte si proche de la limite */}
      {negotiation.round_count >= 7 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-900">Limite de rounds proche</p>
            <p className="text-sm text-amber-700">
              {negotiation.max_rounds - negotiation.round_count} tours restants. 
              Pensez Ã  accepter ou refuser pour finaliser.
            </p>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Montant actuel */}
      <Card className="p-6 bg-gradient-to-br from-yo-primary/5 to-transparent">
        <div className="text-center">
          <p className="text-sm text-yo-gray-600 mb-2">Proposition actuelle</p>
          <div className="flex items-center justify-center gap-2">
            <DollarSign className="w-8 h-8 text-yo-primary" />
            <p className="text-4xl font-bold text-yo-gray-900">
              {negotiation.current_amount.toLocaleString()}
            </p>
            <span className="text-xl text-yo-gray-600">FCFA</span>
          </div>
          <p className="text-xs text-yo-gray-500 mt-2">
            Expire dans {getTimeRemaining()}
          </p>
        </div>
      </Card>

      {/* Actions principales */}
      {action === 'none' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={handleAccept}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold"
          >
            <Check className="w-6 h-6 mr-2" />
            Accepter
          </Button>

          <Button
            onClick={() => setAction('counter')}
            disabled={loading || maxRoundsReached}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-bold"
          >
            <TrendingUp className="w-6 h-6 mr-2" />
            NÃ©gocier
          </Button>

          <Button
            onClick={() => setAction('reject')}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-bold"
          >
            <X className="w-6 h-6 mr-2" />
            Refuser
          </Button>
        </div>
      )}

      {/* Formulaire contre-proposition */}
      {action === 'counter' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-xl font-bold text-yo-gray-900 mb-4">
              ðŸ’¬ Votre contre-proposition
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Nouveau montant (FCFA) *
                </label>
                <Input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Ex: 15000"
                  min="500"
                  max="1000000"
                  className="text-lg font-bold"
                />
                <p className="text-xs text-yo-gray-500 mt-1">
                  Min: 500 FCFA â FCFA¢ Max: 1 000 000 FCFA
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Message explicatif (optionnel)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez pourquoi vous proposez ce montant..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-primary focus:border-transparent"
                />
                <p className="text-xs text-yo-gray-500 mt-1">
                  {message.length}/500 caractÃ¨res
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCounter}
                  disabled={loading || !newAmount}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold"
                >
                  {loading ? 'Envoi...' : 'Envoyer la proposition'}
                </Button>
                <Button
                  onClick={() => {
                    setAction('none');
                    setMessage('');
                    setError('');
                  }}
                  disabled={loading}
                  variant="outline"
                  className="px-6"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Formulaire refus */}
      {action === 'reject' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-red-50 border-red-200">
            <h3 className="text-xl font-bold text-yo-gray-900 mb-4">
              âŒ Refuser la proposition
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                  Raison du refus (optionnel)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous refusez cette proposition..."
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-yo-gray-500 mt-1">
                  {rejectReason.length}/300 caractÃ¨res
                </p>
              </div>

              <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  âš ï¸ <strong>Attention :</strong> Cette action est dÃ©finitive et mettra fin Ã  la nÃ©gociation.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 font-bold"
                >
                  {loading ? 'Refus...' : 'Confirmer le refus'}
                </Button>
                <Button
                  onClick={() => {
                    setAction('none');
                    setRejectReason('');
                    setError('');
                  }}
                  disabled={loading}
                  variant="outline"
                  className="px-6"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
