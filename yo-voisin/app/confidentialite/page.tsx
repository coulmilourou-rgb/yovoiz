'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, Target, Clock, Cookie, Globe, Mail } from 'lucide-react';

export default function ConfidentialitePage() {
  const { user, profile } = useAuth();

  const sections = [
    {
      icon: Database,
      title: '1. Données collectées',
      content: `Nous collectons les données suivantes :

**Lors de l'inscription :**
- Nom et prénom
- Adresse email
- Numéro de téléphone
- Commune de résidence
- Date de naissance

**Lors de l'utilisation :**
- Demandes de services publiées
- Messages échangés sur la plateforme
- Historique des transactions
- Avis et évaluations
- Photos de profil et documents

**Données techniques :**
- Adresse IP
- Type de navigateur
- Système d'exploitation
- Cookies et données de navigation`
    },
    {
      icon: Target,
      title: '2. Utilisation des données',
      content: `Vos données sont utilisées pour :

- Créer et gérer votre compte
- Mettre en relation Clients et Prestataires
- Traiter les transactions et paiements
- Améliorer nos services et l'expérience utilisateur
- Envoyer des notifications importantes
- Prévenir la fraude et assurer la sécurité
- Respecter nos obligations légales

Nous ne vendons jamais vos données personnelles à des tiers.`
    },
    {
      icon: Lock,
      title: '3. Protection des données',
      content: `Yo!Voiz met en œuvre les mesures suivantes pour protéger vos données :

- Chiffrement SSL/TLS pour toutes les communications
- Serveurs sécurisés avec accès restreint
- Authentification à deux facteurs disponible
- Surveillance continue contre les intrusions
- Sauvegardes régulières et sécurisées
- Personnel formé à la protection des données

En cas de faille de sécurité, nous vous informerons dans les meilleurs délais.`
    },
    {
      icon: Eye,
      title: '4. Partage des données',
      content: `Vos données peuvent être partagées dans les cas suivants :

**Avec d'autres utilisateurs :**
- Votre nom, photo et avis sont visibles publiquement
- Les Prestataires voient vos demandes dans votre zone
- Après acceptation d'un devis, coordonnées échangées

**Avec des prestataires de services :**
- Processeurs de paiement (Mobile Money, cartes bancaires)
- Services d'hébergement cloud sécurisés
- Outils d'analyse et de statistiques (données anonymisées)

**Pour raisons légales :**
- Sur demande des autorités compétentes
- Pour protéger nos droits et notre sécurité`
    },
    {
      icon: UserCheck,
      title: '5. Vos droits',
      content: `Conformément à la législation ivoirienne, vous disposez des droits suivants :

✓ **Droit d'accès** : Consulter toutes vos données personnelles

✓ **Droit de rectification** : Corriger vos informations inexactes

✓ **Droit de suppression** : Supprimer votre compte et vos données

✓ **Droit d'opposition** : Refuser certaines utilisations de vos données

✓ **Droit à la portabilité** : Récupérer vos données dans un format standard

Pour exercer ces droits, contactez-nous à : privacy@yovoiz.com`
    },
    {
      icon: Clock,
      title: '6. Conservation des données',
      content: `Nous conservons vos données selon les durées suivantes :

- **Compte actif** : Tant que votre compte est actif
- **Après suppression** : 30 jours (sauvegarde de sécurité)
- **Transactions** : 5 ans (obligations légales)
- **Données marketing** : 3 ans sans interaction

Vous pouvez demander la suppression anticipée de vos données à tout moment.`
    },
    {
      icon: Cookie,
      title: '7. Cookies',
      content: `Yo!Voiz utilise des cookies pour :

**Cookies essentiels** (obligatoires) :
- Maintenir votre session connectée
- Sécuriser la plateforme
- Mémoriser vos préférences

**Cookies analytics** (optionnels) :
- Comprendre l'utilisation de la plateforme
- Améliorer l'expérience utilisateur
- Mesurer les performances

Vous pouvez gérer vos préférences cookies dans les paramètres de votre navigateur.`
    },
    {
      icon: Globe,
      title: '8. Transferts internationaux',
      content: `Vos données sont stockées principalement en Côte d'Ivoire. Certains prestataires techniques peuvent être basés hors de Côte d'Ivoire (hébergement cloud, outils analytics). Dans ce cas, nous nous assurons qu'ils respectent des standards de sécurité équivalents.`
    },
    {
      icon: AlertCircle,
      title: '9. Modifications de la politique',
      content: `Yo!Voiz se réserve le droit de modifier cette Politique de Confidentialité à tout moment. 

Vous serez informé de toute modification importante par :
- Email de notification
- Notification sur la plateforme
- Bannière d'information

La version actualisée sera toujours disponible sur cette page.`
    },
    {
      icon: Mail,
      title: '10. Contact',
      content: `Pour toute question concernant vos données personnelles :

**Délégué à la Protection des Données**
Email : privacy@yovoiz.com
Téléphone : +225 XX XX XX XX XX
Adresse : Abidjan, Côte d'Ivoire

Nous nous engageons à répondre sous 48 heures ouvrées.`
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar 
        isConnected={!!user} 
        user={profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url
        } : undefined}
      />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-yo-green mx-auto mb-6" />
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-gray-600 text-lg">
              Dernière mise à jour : 1er Février 2026
            </p>
          </div>

          {/* Important Notice */}
          <Card className="p-6 mb-8 bg-yo-green/5 border-l-4 border-yo-green">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-yo-green flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Votre vie privée est importante</h3>
                <p className="text-gray-700 leading-relaxed">
                  Chez Yo!Voiz, nous prenons la protection de vos données personnelles très au sérieux. 
                  Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                </p>
              </div>
            </div>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-yo-green flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    {section.title}
                  </h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-12 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Cette politique de confidentialité est effective à compter du 1er février 2026.
              <br />
              En utilisant Yo!Voiz, vous acceptez les termes de cette politique.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
