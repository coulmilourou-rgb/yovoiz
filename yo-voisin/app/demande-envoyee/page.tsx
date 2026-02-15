'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home, FileText } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageHead } from '@/components/layout/PageHead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

function DemandeEnvoyeeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const type = searchParams.get('type') || 'demande'; // 'demande' ou 'offre'

  useEffect(() => {
    // Si pas connecté, rediriger
    if (!user) {
      router.push('/auth/connexion');
    }
  }, [user, router]);

  if (!user || !profile) {
    return null;
  }

  const isOffre = type === 'offre';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-gray-50 via-white to-yo-green/5">
      <PageHead 
        title={isOffre ? "Offre envoyée" : "Demande envoyée"} 
        description="Votre publication est en attente de validation par notre équipe."
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

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-12 text-center">
            {/* Icône succès animée */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-yo-green/10 rounded-full mb-6"
            >
              <CheckCircle className="w-16 h-16 text-yo-green" />
            </motion.div>

            {/* Titre */}
            <h1 className="font-display font-bold text-4xl text-yo-gray-900 mb-4">
              {isOffre ? '🎉 Offre envoyée !' : '🎉 Demande envoyée !'}
            </h1>

            {/* Message principal */}
            <p className="text-xl text-yo-gray-700 mb-8 max-w-xl mx-auto">
              {isOffre 
                ? 'Votre offre de service a été soumise avec succès.'
                : 'Votre demande de service a été soumise avec succès.'
              }
            </p>

            {/* Étapes suivantes */}
            <div className="bg-yo-orange/5 border border-yo-orange/20 rounded-lg p-6 mb-8 text-left">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-yo-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-yo-gray-900 mb-2">
                    En attente de validation
                  </h3>
                  <p className="text-yo-gray-700 mb-4">
                    Notre équipe va examiner {isOffre ? 'votre offre' : 'votre demande'} pour s'assurer 
                    qu'elle respecte nos conditions d'utilisation.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yo-green/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-yo-green">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-yo-gray-900">Vérification (quelques minutes)</p>
                        <p className="text-sm text-yo-gray-600">
                          Nous vérifions la conformité du contenu
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yo-green/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-yo-green">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-yo-gray-900">Validation</p>
                        <p className="text-sm text-yo-gray-600">
                          Une fois approuvée, {isOffre ? 'votre offre' : 'votre demande'} sera publiée
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yo-green/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-yo-green">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-yo-gray-900">Notification</p>
                        <p className="text-sm text-yo-gray-600">
                          Vous recevrez une notification dès la publication
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Délai estimé */}
            <div className="bg-yo-primary/5 border border-yo-primary/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-yo-gray-700">
                ⏱️ <strong>Délai habituel :</strong> 5 à 30 minutes en journée (8h-20h)
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/home')}
                className="bg-yo-green hover:bg-yo-green-dark text-white px-8 py-3 shadow-yo-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Button>

              <Button
                onClick={() => router.push(isOffre ? '/services/mes-offres' : '/profile/requests')}
                className="bg-yo-orange hover:bg-yo-orange-dark text-white px-8 py-3 shadow-yo-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                {isOffre ? 'Mes offres' : 'Mes demandes'}
              </Button>
            </div>

            {/* Note de bas de page */}
            <p className="text-xs text-yo-gray-500 mt-8">
              En cas de problème ou de question, contactez notre support : 
              <a href="mailto:support@yovoiz.com" className="text-yo-primary hover:underline ml-1">
                support@yovoiz.com
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function DemandeEnvoyeePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <DemandeEnvoyeeContent />
    </Suspense>
  );
}
