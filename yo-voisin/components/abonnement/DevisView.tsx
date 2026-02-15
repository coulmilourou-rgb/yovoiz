'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  X, Download, Send, Edit, FileText, 
  Calendar, User, Phone, Mail, MapPin, DollarSign 
} from 'lucide-react';

interface DevisViewProps {
  devis: any;
  onClose: () => void;
  onEdit?: () => void;
  onDownloadPDF?: () => void;
  onSendEmail?: () => void;
}

export default function DevisView({ devis, onClose, onEdit, onDownloadPDF, onSendEmail }: DevisViewProps) {
  const getStatusConfig = (status: string) => {
    const configs: any = {
      draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
      accepted: { label: 'Accepté', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Refusé', color: 'bg-red-100 text-red-800' },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(devis.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">Devis {devis.id}</h2>
              <Badge className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-orange-100 text-sm">
              Client: {devis.client}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info client */}
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Client
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-900">{devis.client}</p>
                {devis.clientEmail && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {devis.clientEmail}
                  </p>
                )}
                {devis.clientPhone && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {devis.clientPhone}
                  </p>
                )}
                {devis.clientAddress && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {devis.clientAddress}
                  </p>
                )}
              </div>
            </Card>

            {/* Info devis */}
            <Card className="p-4 bg-gray-50 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Détails du devis
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">N° de devis:</span>
                  <span className="font-semibold text-gray-900">{devis.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date d'émission:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(devis.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valable jusqu'au:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(devis.validUntil).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-gray-600">Statut:</span>
                  <Badge className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Services / Prestations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              Prestations
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Quantité</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Prix unitaire</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {devis.services && devis.services.map((service: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{service.description || service}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">{service.quantity || 1}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {service.unitPrice ? `${service.unitPrice} FCFA` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                        {service.total ? `${service.total} FCFA` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-orange-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-right font-semibold text-gray-900">
                      Total HT
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-orange-700 text-lg">
                      {devis.amount} FCFA
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {devis.notes && (
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Notes / Conditions</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{devis.notes}</p>
            </Card>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fermer
          </Button>
          <div className="flex gap-3">
            {onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
            )}
            {onDownloadPDF && (
              <Button
                variant="outline"
                onClick={onDownloadPDF}
                className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Download className="w-4 h-4" />
                Télécharger PDF
              </Button>
            )}
            {onSendEmail && (
              <Button
                onClick={onSendEmail}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Send className="w-4 h-4" />
                Envoyer par email
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
