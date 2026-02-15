'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createNegotiation } from '@/lib/negotiations';

interface ProposeQuoteModalProps {
  missionId: string;
  missionTitle: string;
  clientId: string;
  providerId: string;
  onClose: () => void;
  onSuccess: (negotiationId: string) => void;
}

export const ProposeQuoteModal = ({
  missionId,
  missionTitle,
  clientId,
  providerId,
  onClose,
  onSuccess
}: ProposeQuoteModalProps) => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const parsedAmount = parseInt(amount);

      if (isNaN(parsedAmount) || parsedAmount < 500) {
        throw new Error('Montant minimum : 500 FCFA');
      }

      if (parsedAmount > 1000000) {
        throw new Error('Montant maximum : 1 000 000 FCFA');
      }

      console.log('ðŸš FCFA CrÃ©ation nÃ©gociation:', {
        missionId,
        clientId,
        providerId,
        initialAmount: parsedAmount
      });

      const negotiation = await createNegotiation({
        missionId,
        clientId,
        providerId,
        initialAmount: parsedAmount,
        message
      });

      console.log('âœ… NÃ©gociation crÃ©Ã©e:', negotiation.id);

      // Rediriger vers la page de nÃ©gociation
      onSuccess(negotiation.id);
      router.push(`/negotiations/${negotiation.id}`);
    } catch (err: any) {
      console.error('âŒ Erreur proposition devis:', err);
      setError(err.message || 'Erreur lors de l\'envoi du devis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full"
      >
        <Card className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yo-gray-900 mb-2">
                ðŸ’° Proposer un devis
              </h2>
              <p className="text-sm text-yo-gray-600">
                Pour : {missionTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-yo-gray-400 hover:text-yo-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Montant */}
            <div>
              <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                Montant de votre devis (FCFA) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 15000"
                  min="500"
                  max="1000000"
                  required
                  className="pl-12 text-lg font-bold"
                />
              </div>
              <p className="text-xs text-yo-gray-500 mt-1">
                Min: 500 FCFA â FCFA¢ Max: 1 000 000 FCFA
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-yo-gray-700 mb-2">
                Message d'accompagnement (optionnel)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-yo-gray-400" />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez votre tarif, votre expÃ©rience, dÃ©lai de rÃ©alisation..."
                  rows={4}
                  maxLength={500}
                  className="w-full pl-12 pr-4 py-3 border border-yo-gray-300 rounded-lg focus:ring-2 focus:ring-yo-primary focus:border-transparent"
                />
              </div>
              <p className="text-xs text-yo-gray-500 mt-1">
                {message.length}/500 caractÃ¨res
              </p>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">
                ðŸ“‹ Comment Ã§a marche ?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>â FCFA¢ Le client aura 72h pour rÃ©pondre</li>
                <li>â FCFA¢ Il peut accepter, nÃ©gocier ou refuser</li>
                <li>â FCFA¢ Maximum 10 tours de nÃ©gociation</li>
                <li>â FCFA¢ Une fois acceptÃ©, le paiement est bloquÃ©</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !amount}
                className="flex-1 bg-yo-primary hover:bg-yo-primary-dark text-white font-bold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Envoyer le devis
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};
