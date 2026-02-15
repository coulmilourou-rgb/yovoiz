'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Mail, Phone, Globe, FileText, Code } from 'lucide-react';

export default function MentionsLegalesPage() {
  const { user, profile } = useAuth();

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
              Mentions Légales
            </h1>
            <p className="text-gray-600 text-lg">
              Informations légales sur Yo!Voiz
            </p>
          </div>

          {/* Éditeur */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange flex items-center gap-3">
              <Building className="w-6 h-6" />
              1. Éditeur de la plateforme
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Raison sociale :</strong> Yo!Voiz SARL</p>
              <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</p>
              <p><strong>Capital social :</strong> 1,000,000 FCFA</p>
              <p><strong>Siège social :</strong> Abidjan, Cocody, Côte d'Ivoire</p>
              <p><strong>Numéro d'immatriculation :</strong> CI-ABJ-XX-XXXX-X</p>
              <p><strong>Registre du Commerce :</strong> RCCM CI-ABJ-XXXX</p>
              <p><strong>Directeur de la publication :</strong> [Nom du Directeur]</p>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange flex items-center gap-3">
              <Mail className="w-6 h-6" />
              2. Contact
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-yo-orange" />
                <strong>Email :</strong> contact@yovoiz.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-yo-orange" />
                <strong>Téléphone :</strong> +225 XX XX XX XX XX
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-yo-orange" />
                <strong>Site web :</strong> https://yovoiz.com
              </p>
            </div>
          </Card>

          {/* Hébergement */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange flex items-center gap-3">
              <Code className="w-6 h-6" />
              3. Hébergement
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Siège social :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              <p><strong>Site web :</strong> https://vercel.com</p>
              <p className="mt-4"><strong>Base de données :</strong> Supabase Inc.</p>
              <p><strong>Site web :</strong> https://supabase.com</p>
            </div>
          </Card>

          {/* Propriété intellectuelle */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange">
              4. Propriété intellectuelle
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                L'ensemble du contenu présent sur la plateforme Yo!Voiz (textes, images, graphismes, logo, icônes, 
                sons, logiciels, etc.) est la propriété exclusive de Yo!Voiz SARL ou de ses partenaires, 
                et est protégé par les lois ivoiriennes et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des 
                éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation 
                écrite préalable de Yo!Voiz SARL.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera 
                considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions légales en vigueur.
              </p>
            </div>
          </Card>

          {/* Données personnelles */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange">
              5. Données personnelles
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Conformément à la législation ivoirienne sur la protection des données personnelles, 
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données 
                vous concernant.
              </p>
              <p>
                Pour exercer ce droit, vous pouvez nous contacter :
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>Par email : privacy@yovoiz.com</li>
                <li>Par courrier : Yo!Voiz SARL, Abidjan, Cocody, Côte d'Ivoire</li>
              </ul>
              <p>
                Pour plus d'informations sur le traitement de vos données personnelles, 
                consultez notre <a href="/confidentialite" className="text-yo-orange font-semibold hover:underline">Politique de Confidentialité</a>.
              </p>
            </div>
          </Card>

          {/* Cookies */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange">
              6. Cookies
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Le site Yo!Voiz utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines fonctionnalités 
                du site pourraient ne plus être accessibles.
              </p>
              <p>
                Types de cookies utilisés :
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (session, sécurité)</li>
                <li><strong>Cookies analytics :</strong> Mesure d'audience et statistiques (optionnels)</li>
                <li><strong>Cookies de préférence :</strong> Mémorisation de vos choix (langue, préférences)</li>
              </ul>
            </div>
          </Card>

          {/* Responsabilité */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange">
              7. Limitation de responsabilité
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Yo!Voiz SARL ne pourra être tenu responsable des dommages directs et indirects causés au matériel 
                de l'utilisateur, lors de l'accès au site yovoiz.com.
              </p>
              <p>
                Yo!Voiz SARL décline toute responsabilité quant aux éventuels virus pouvant infecter le matériel 
                informatique de l'utilisateur après l'utilisation ou l'accès à ce site.
              </p>
              <p>
                Le site Yo!Voiz est une plateforme de mise en relation. Yo!Voiz n'est pas responsable de la qualité 
                des services fournis par les prestataires, ni des litiges pouvant survenir entre utilisateurs. 
                Yo!Voiz agit uniquement comme intermédiaire.
              </p>
            </div>
          </Card>

          {/* Droit applicable */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange">
              8. Droit applicable et juridiction
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Les présentes mentions légales sont soumises au droit ivoirien.
              </p>
              <p>
                En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents 
                d'Abidjan, Côte d'Ivoire, conformément aux règles de compétence en vigueur.
              </p>
            </div>
          </Card>

          {/* Modification */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-yo-orange">
              9. Modification des mentions légales
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p>
                Yo!Voiz SARL se réserve le droit de modifier à tout moment les présentes mentions légales. 
                L'utilisateur s'engage donc à les consulter régulièrement.
              </p>
              <p className="mt-4 font-semibold">
                Dernière mise à jour : 1er Février 2026
              </p>
            </div>
          </Card>

          {/* Footer Info */}
          <div className="mt-12 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Pour toute question concernant ces mentions légales, contactez-nous à : legal@yovoiz.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
