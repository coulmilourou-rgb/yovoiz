'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Download, FileText, Table } from 'lucide-react';

interface ExportModalProps {
  title: string;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel') => void;
}

export default function ExportModal({ title, onClose, onExport }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');

  const handleExport = () => {
    onExport(selectedFormat);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Exporter les données</h2>
            <p className="text-blue-100 text-sm mt-1">{title}</p>
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
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">
              Choisissez le format d'export :
            </p>
            
            <div className="space-y-3">
              {/* Option PDF */}
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedFormat === 'pdf' ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      selectedFormat === 'pdf' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">Format PDF</p>
                      {selectedFormat === 'pdf' && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Sélectionné
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Idéal pour l'impression et le partage. Format universel et professionnel.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      ✓ Mise en page professionnelle<br />
                      ✓ Graphiques inclus<br />
                      ✓ Prêt à imprimer
                    </p>
                  </div>
                </div>
              </button>

              {/* Option Excel */}
              <button
                onClick={() => setSelectedFormat('excel')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedFormat === 'excel'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedFormat === 'excel' ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <Table className={`w-6 h-6 ${
                      selectedFormat === 'excel' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">Format Excel (.xlsx)</p>
                      {selectedFormat === 'excel' && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Sélectionné
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Parfait pour l'analyse et le traitement des données. Modifiable dans Excel.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      ✓ Données éditables<br />
                      ✓ Filtres et tris disponibles<br />
                      ✓ Compatible Excel, Google Sheets, LibreOffice
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <Card className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Note :</strong> L'export inclura toutes les données visibles selon les filtres actifs.
            </p>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter en {selectedFormat === 'pdf' ? 'PDF' : 'Excel'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
