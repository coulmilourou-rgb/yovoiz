'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestEmailPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('welcome_email');

  const emailTypes = [
    { value: 'welcome_email', label: '👋 Email de bienvenue' },
    { value: 'request_validated', label: '🎉 Demande validée' },
    { value: 'new_proposal', label: '💼 Nouvelle proposition' },
    { value: 'new_message', label: '💬 Nouveau message' },
    { value: 'payment_pending', label: '💳 Paiement en attente' },
    { value: 'subscription_activated', label: '🎉 Abonnement PRO activé' },
  ];

  const testData: Record<string, any> = {
    welcome_email: {},
    request_validated: {
      requestId: 'test-123',
      title: 'Nettoyage de maison',
      category: 'Ménage'
    },
    new_proposal: {
      providerName: 'Jean Kouassi',
      amount: 15000,
      message: 'Je suis disponible demain matin',
      negotiationId: 'neg-123'
    },
    new_message: {
      senderName: 'Marie Diallo',
      content: 'Bonjour, je suis intéressée par votre service',
      conversationId: 'conv-123'
    },
    payment_pending: {
      providerName: 'Jean Kouassi',
      amount: 15000,
      paymentId: 'pay-123'
    },
    subscription_activated: {}
  };

  async function sendTestEmail() {
    if (!user?.id) {
      setResult({ error: 'Vous devez être connecté pour tester' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`
          },
          body: JSON.stringify({
            type: selectedType,
            userId: user.id,
            data: testData[selectedType] || {}
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      setResult({
        success: true,
        ...data
      });
    } catch (error: any) {
      setResult({
        error: error.message || 'Erreur réseau'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Test système d'emails
          </h1>
          <p className="text-gray-600 mb-8">
            Tester l'envoi de notifications email via Brevo
          </p>

          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                ⚠️ Vous devez être connecté pour tester l'envoi d'email
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de notification :
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              >
                {emailTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Email de test :</strong> {user.email}
                </p>
              </div>
            )}

            <button
              onClick={sendTestEmail}
              disabled={loading || !user}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? '📤 Envoi en cours...' : '📧 Envoyer l\'email de test'}
            </button>

            {result && (
              <div className={`rounded-lg p-6 ${
                result.error 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                {result.error ? (
                  <>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      ❌ Erreur lors de l'envoi
                    </h3>
                    <p className="text-red-700 mb-4">
                      <strong>Détails :</strong> {result.error}
                    </p>
                    <div className="text-sm text-red-600">
                      <p className="font-semibold mb-1">Vérifiez :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>La variable d'environnement SUPABASE_SERVICE_ROLE_KEY</li>
                        <li>Que l'Edge Function est déployée</li>
                        <li>Les logs Supabase Functions</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      ✅ Email envoyé avec succès !
                    </h3>
                    <div className="space-y-2 text-sm text-green-700">
                      <p><strong>Destinataire :</strong> {result.recipient}</p>
                      {result.messageId && (
                        <p><strong>ID Message :</strong> {result.messageId}</p>
                      )}
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-green-200">
                      <p className="text-xs text-gray-600">
                        💡 Vérifiez votre boîte email (et le dossier spam)
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">📋 Informations système :</p>
              <ul className="space-y-1">
                <li>• 44 types de notifications disponibles</li>
                <li>• Envoi via Brevo (300 emails/jour gratuits)</li>
                <li>• Templates HTML responsive</li>
                <li>• Design Yo!Voiz (Orange + Vert)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
