'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CGUPage() {
  const { user, profile } = useAuth();

  const sections = [
    {
      title: '1. Objet',
      content: `Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités et conditions d'utilisation de la plateforme Yo!Voiz, accessible à l'adresse yovoiz.com. La plateforme permet la mise en relation entre des particuliers (ci-après "Clients") et des prestataires de services (ci-après "Prestataires") dans la région d'Abidjan, Côte d'Ivoire.`
    },
    {
      title: '2. Acceptation des conditions',
      content: `L'utilisation de la plateforme Yo!Voiz implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services. Yo!Voiz se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification significative par email ou notification sur la plateforme.`
    },
    {
      title: '3. Inscription et compte utilisateur',
      content: `3.1. Pour utiliser Yo!Voiz, vous devez créer un compte en fournissant des informations exactes, à jour et complètes.

3.2. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte.

3.3. Vous vous engagez à ne pas créer de faux compte, ne pas usurper l'identité d'autrui et ne pas utiliser la plateforme à des fins illégales ou non autorisées.

3.4. Yo!Voiz se réserve le droit de suspendre ou supprimer tout compte en cas de violation des CGU.`
    },
    {
      title: '4. Services proposés',
      content: `4.1. Yo!Voiz est une plateforme de mise en relation. Nous ne sommes pas employeur, ni client, ni prestataire des services proposés.

4.2. Les Clients peuvent publier des demandes de services gratuitement.

4.3. Les Prestataires peuvent s'inscrire gratuitement et souscrire à un abonnement Pro optionnel pour bénéficier de fonctionnalités avancées.

4.4. La plateforme ne garantit pas la conclusion d'un contrat entre Clients et Prestataires.`
    },
    {
      title: '5. Obligations des utilisateurs',
      content: `5.1. Clients :
- Fournir des informations exactes dans les demandes de services
- Respecter les Prestataires et communiquer de façon courtoise
- Payer les services convenus selon les modalités définies
- Valider la réalisation du service une fois terminé

5.2. Prestataires :
- Fournir des services de qualité conformes aux demandes
- Respecter les délais et tarifs convenus
- Disposer des qualifications et assurances nécessaires
- Respecter les Clients et leurs biens`
    },
    {
      title: '6. Tarification et paiement',
      content: `6.1. Les tarifs des services sont librement fixés entre Clients et Prestataires.

6.2. Yo!Voiz prélève une commission de 5% sur chaque transaction pour couvrir les frais de paiement sécurisé.

6.3. L'abonnement Pro pour les Prestataires est de 15,000 FCFA/mois ou 150,000 FCFA/an.

6.4. Les paiements sont effectués via des moyens sécurisés (Mobile Money, carte bancaire).

6.5. Le paiement au Prestataire est libéré uniquement après validation du service par le Client.`
    },
    {
      title: '7. Annulation et remboursement',
      content: `7.1. Un Client peut annuler une demande avant l'acceptation d'un devis sans frais.

7.2. Après acceptation, une annulation peut entraîner des frais selon les modalités convenues avec le Prestataire.

7.3. En cas de litige, Yo!Voiz agit comme médiateur mais ne peut garantir un remboursement.

7.4. Les abonnements Pro sont remboursables au prorata sous 14 jours suivant la souscription.`
    },
    {
      title: '8. Responsabilité',
      content: `8.1. Yo!Voiz ne peut être tenu responsable de la qualité des services fournis par les Prestataires.

8.2. Yo!Voiz ne garantit pas la fiabilité, l'exactitude ou l'exhaustivité des informations fournies par les utilisateurs.

8.3. En cas de dommages matériels ou corporels, la responsabilité incombe directement au Prestataire.

8.4. Yo!Voiz met tout en œuvre pour assurer la sécurité de la plateforme mais ne peut garantir l'absence totale de bugs ou d'interruptions.`
    },
    {
      title: '9. Propriété intellectuelle',
      content: `Tous les éléments de la plateforme Yo!Voiz (logo, textes, images, design) sont protégés par le droit d'auteur. Toute reproduction, même partielle, sans autorisation écrite est interdite.`
    },
    {
      title: '10. Données personnelles',
      content: `Les données personnelles collectées sont traitées conformément à notre Politique de Confidentialité. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.`
    },
    {
      title: '11. Résiliation',
      content: `Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil. Yo!Voiz se réserve le droit de suspendre ou supprimer un compte en cas de violation des CGU.`
    },
    {
      title: '12. Droit applicable et litiges',
      content: `Les présentes CGU sont soumises au droit ivoirien. Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis aux tribunaux compétents d'Abidjan, Côte d'Ivoire.`
    },
    {
      title: '13. Contact',
      content: `Pour toute question concernant ces CGU, vous pouvez nous contacter :
- Email : support@yovoiz.com
- Téléphone : +225 XX XX XX XX XX
- Adresse : Abidjan, Côte d'Ivoire`
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
            <FileText className="w-16 h-16 text-yo-orange mx-auto mb-6" />
            <h1 className="font-display font-black text-4xl md:text-5xl mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-gray-600 text-lg">
              Dernière mise à jour : 1er Février 2026
            </p>
          </div>

          {/* Important Notice */}
          <Card className="p-6 mb-8 bg-yo-orange/5 border-l-4 border-yo-orange">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yo-orange flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Important</h3>
                <p className="text-gray-700 leading-relaxed">
                  En utilisant Yo!Voiz, vous acceptez les présentes Conditions Générales d'Utilisation. 
                  Veuillez les lire attentivement avant d'utiliser nos services.
                </p>
              </div>
            </div>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-yo-orange flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </Card>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-12 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Ces conditions générales d'utilisation sont effectives à compter du 1er février 2026.
              <br />
              Yo!Voiz se réserve le droit de les modifier à tout moment.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
