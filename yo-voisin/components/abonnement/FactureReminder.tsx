'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, AlertCircle, Mail } from 'lucide-react';

interface FactureReminderProps {
  facture: any;
  onClose: () => void;
  onSend: (reminderData: any) => void;
}

export default function FactureReminder({ facture, onClose, onSend }: FactureReminderProps) {
  const daysOverdue = Math.floor((new Date().getTime() - new Date(facture.due_date || facture.dueDate).getTime()) / (1000 * 60 * 60 * 24));
  
  // Email pré-rempli depuis la DB
  const clientEmail = facture.client_email || '';
  
  const [reminderData, setReminderData] = useState({
    to: clientEmail,
    subject: `⚠️ Relance facture ${facture.reference} - Paiement en attente`,
    message: `Bonjour ${facture.client_name || facture.client},\n\nNous vous rappelons que la facture ${facture.reference} d'un montant de ${facture.total?.toLocaleString('fr-FR') || facture.amount} FCFA est en attente de paiement.\n\n${daysOverdue > 0 ? `Cette facture est en retard de ${daysOverdue} jour(s).\n\n` : ''}Merci de bien vouloir procéder au règlement dans les meilleurs délais.\n\nCordialement,\nVotre prestataire Yo!Voiz`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(reminderData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white my-8">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Envoyer une relance</h2>
              <p className="text-orange-100 text-sm mt-1">
                Facture {facture.id} - {facture.client}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {/* Alerte retard */}
            {daysOverdue > 0 && (
              <Card className="p-3 bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Facture en retard</p>
                    <p className="text-xs text-red-700 mt-1">
                      Retard de <strong>{daysOverdue} jour(s)</strong> depuis le {new Date(facture.dueDate).toLocaleDateString('fr-FR')}.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Note messagerie */}
            <Card className="p-3 bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Envoi via messagerie Yo!Voiz</p>
                  <p className="text-xs text-blue-700 mt-1">
                    La relance sera envoyée directement dans la messagerie du client sur la plateforme.
                  </p>
                </div>
              </div>
            </Card>

            {/* Objet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objet du message *
              </label>
              <Input
                type="text"
                required
                value={reminderData.subject}
                onChange={(e) => setReminderData({ ...reminderData, subject: e.target.value })}
                placeholder="Objet du message"
                className="text-sm"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message de relance *
              </label>
              <textarea
                required
                value={reminderData.message}
                onChange={(e) => setReminderData({ ...reminderData, message: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Votre message..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Ce message sera visible dans la messagerie du client
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-sm"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Envoyer la relance
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
