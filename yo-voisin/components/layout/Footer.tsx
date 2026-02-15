'use client';

import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-yo-green-dark text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-display font-black text-3xl mb-4">
              <span className="text-yo-orange">Yo!</span> Voiz
            </div>
            <p className="text-white/70 mb-4">
              Services entre voisins à Abidjan
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens */}
          <div>
            <h3 className="font-bold mb-4">Plateforme</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="/comment-ca-marche" className="hover:text-white transition">Comment ça marche</a></li>
              <li><a href="/devenir-prestataire" className="hover:text-white transition">Devenir prestataire</a></li>
              <li><a href="/categories" className="hover:text-white transition">Catégories</a></li>
              <li><a href="/tarifs" className="hover:text-white transition">Tarifs</a></li>
              <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Légal & Sécurité</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="/conditions-generales" className="hover:text-white transition">CGU</a></li>
              <li><a href="/confidentialite" className="hover:text-white transition">Politique de confidentialité</a></li>
              <li><a href="/mentions-legales" className="hover:text-white transition">Mentions légales</a></li>
              <li><a href="/charte-confiance" className="hover:text-white transition">Charte de confiance</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+2250707000000" className="hover:text-white transition">+225 07 07 00 00 00</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@yovoiz.ci" className="hover:text-white transition">contact@yovoiz.ci</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm text-center md:text-left">
            © 2026 Yo! Voiz — Fait avec ❤️ à Abidjan, Côte d'Ivoire 🇨🇮
            <br className="md:hidden" />
            <span className="hidden md:inline"> • </span>
            <span className="text-xs">Plateforme 100% ivoirienne de services entre voisins</span>
          </p>
          <div className="flex gap-6 text-white/70 text-sm">
            <a href="/presse" className="hover:text-white transition">Presse</a>
            <a href="/carrieres" className="hover:text-white transition">Carrières</a>
            <a href="/partenaires" className="hover:text-white transition">Partenaires</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
