'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Send, Mail, Paperclip } from 'lucide-react';

interface DevisSendEmailProps {
  devis: any;
  onClose: () => void;
  onSend: (emailData: any) => void;
}

export default function DevisSendEmail({ devis, onClose, onSend }: DevisSendEmailProps) {
  // Email pré-rempli et non modifiable (récupéré depuis la DB)
  const clientEmail = devis.client_email || '';
  
  const [emailData, setEmailData] = useState({
    to: clientEmail,
    subject: `📄 Devis ${devis.reference} - ${devis.client_name}`,
    message: `Bonjour ${devis.client_name},\n\nVeuillez trouver ci-joint le devis ${devis.reference} pour un montant de ${devis.total?.toLocaleString('fr-FR')} FCFA.\n\nDate d'expiration : ${devis.expiry_date ? new Date(devis.expiry_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\nVotre prestataire Yo!Voiz`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(emailData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Envoyer le devis par email</h2>
              <p className="text-orange-100 text-sm mt-1">
                Devis {devis.id} - {devis.client}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-4">
            {/* Destinataire - Email non modifiable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Destinataire (email client)
              </label>
              <Input
                type="email"
                required
                value={emailData.to}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="email@client.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                ℹ️ L'email est automatiquement récupéré depuis le profil client
              </p>
            </div>

            {/* Objet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objet de l'email *
              </label>
              <Input
                type="text"
                required
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Objet de l'email"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                placeholder="Votre message..."
              />
            </div>

            {/* Pièce jointe info */}
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <Paperclip className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Pièce jointe</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Le devis sera automatiquement joint en PDF à cet email
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    📎 Devis-{devis.id}.pdf ({Math.floor(Math.random() * 200 + 100)} Ko)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer le devis
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
