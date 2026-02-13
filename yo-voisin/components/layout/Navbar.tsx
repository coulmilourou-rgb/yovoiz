'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, Bell, LogOut, User, Home, Briefcase, MessageSquare, Settings,
  FileText, CreditCard, Moon, Clock, ChevronRight, Lock, HelpCircle,
  Shield, UserCircle, Users, Plus, Crown
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  isConnected?: boolean;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  notificationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ isConnected = false, user, notificationCount = 0 }) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [absenceMode, setAbsenceMode] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleAbsenceMode = () => {
    setAbsenceMode(!absenceMode);
    // TODO: Enregistrer dans le profil utilisateur
  };

  const toggleAvailableNow = () => {
    setAvailableNow(!availableNow);
    // TODO: Enregistrer dans le profil utilisateur
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-yo-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        {/* Logo - revient toujours à l'accueil */}
        <Link href="/" className="flex items-center gap-1 font-display font-black text-2xl hover:opacity-80 transition">
          <span className="text-yo-orange">Y</span>
          <svg viewBox="0 0 120 140" width="32" height="37" xmlns="http://www.w3.org/2000/svg" className="inline-block -mt-1">
            {/* Contour noir */}
            <circle cx="60" cy="78" r="56" fill="#2D2D2A"/>
            {/* Cercle orange */}
            <circle cx="60" cy="78" r="52" fill="#F37021"/>
            {/* Reflet */}
            <ellipse cx="42" cy="56" rx="28" ry="22" fill="#FF8C42" opacity="0.4"/>
            
            {/* Yeux */}
            <ellipse cx="42" cy="60" rx="6" ry="8" fill="#2D2D2A"/>
            <ellipse cx="78" cy="60" rx="6" ry="8" fill="#2D2D2A"/>
            
            {/* GRANDE BOUCHE */}
            <path d="M28,78 Q60,123 92,78" fill="#2D2D2A"/>
            <path d="M32,80 Q60,118 88,80" fill="#DC2626"/>
            <rect x="32" y="78" width="56" height="8" rx="2" fill="white"/>
            
            {/* CASQUE JAUNE */}
            <path d="M10,42 C8,14 28,-4 60,-6 C92,-4 112,14 110,42 Z" fill="#FCD34D"/>
            <path d="M32,8 C48,-4 72,-4 88,8 C72,0 48,0 32,8 Z" fill="#FDE68A" opacity="0.7"/>
            <line x1="60" y1="-4" x2="60" y2="40" stroke="#D97706" strokeWidth="3" opacity="0.2"/>
            <path d="M6,42 L2,50 C10,58 30,62 60,62 C90,62 110,58 118,50 L114,42 Z" fill="#D97706"/>
            <rect x="16" y="32" width="88" height="8" rx="4" fill="#F37021"/>
            <rect x="16" y="32" width="88" height="4" rx="2" fill="#FF8C42" opacity="0.5"/>
          </svg>
          <span className="text-yo-orange">!</span>
          <span className="text-yo-green-dark ml-1">Voiz</span>
        </Link>

        {/* Menu de navigation (si connecté) */}
        {isConnected && (
          <div className="hidden md:flex items-center gap-1">
            <Link href="/home" className="px-4 py-2 text-yo-gray-700 hover:bg-yo-gray-100 rounded-lg font-medium transition flex items-center gap-2">
              <Home className="w-4 h-4" />
              Accueil
            </Link>
            <Link href="/missions" className="px-4 py-2 text-yo-gray-700 hover:bg-yo-gray-100 rounded-lg font-medium transition flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Missions
            </Link>
            <Link href="/offreurs" className="px-4 py-2 text-yo-gray-700 hover:bg-yo-gray-100 rounded-lg font-medium transition flex items-center gap-2">
              <Users className="w-4 h-4" />
              Offreurs
            </Link>
            <Link 
              href="/missions/nouvelle" 
              className="px-4 py-2 bg-yo-orange text-white hover:bg-yo-orange-dark rounded-lg font-semibold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Demande
            </Link>
            <Link href="/abonnement" className="px-4 py-2 text-yo-gray-700 hover:bg-yo-gray-100 rounded-lg font-medium transition flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Abonnement
            </Link>
            <Link href="/messages" className="px-4 py-2 text-yo-gray-700 hover:bg-yo-gray-100 rounded-lg font-medium transition flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </Link>
          </div>
        )}

        {/* Barre de recherche (si connecté) */}
        {isConnected && (
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yo-gray-400" />
              <input
                type="text"
                placeholder="Quel service cherches-tu ?"
                className="w-full pl-12 pr-4 py-2.5 bg-yo-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yo-green"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {isConnected && user ? (
            <>
              {/* Notifications */}
              <button className="relative p-2 hover:bg-yo-gray-100 rounded-full transition">
                <Bell className="w-6 h-6 text-yo-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-yo-orange rounded-full" />
                )}
              </button>

              {/* Menu utilisateur */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="hover:opacity-80 transition"
                >
                  <Avatar
                    firstName={user.first_name}
                    lastName={user.last_name}
                    imageUrl={user.avatar_url}
                    size="md"
                  />
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-yo-gray-200 py-2 max-h-[80vh] overflow-y-auto z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-yo-gray-200">
                      <p className="font-bold text-yo-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-yo-gray-500">Mon compte</p>
                    </div>

                    {/* Section: Mon Activité */}
                    <div className="py-2">
                      <div className="px-4 py-2">
                        <p className="text-xs font-bold text-yo-gray-500 uppercase tracking-wide">Mon Activité</p>
                      </div>
                      
                      <Link 
                        href="/mes-demandes"
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-yo-gray-50 transition group"
                        onClick={() => setShowMenu(false)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-yo-gray-600 group-hover:text-yo-green" />
                          <span className="text-yo-gray-700 group-hover:text-yo-gray-900">Mes demandes</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yo-gray-400" />
                      </Link>
                      
                      <Link 
                        href="/mes-paiements"
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-yo-gray-50 transition group"
                        onClick={() => setShowMenu(false)}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-yo-gray-600 group-hover:text-yo-green" />
                          <span className="text-yo-gray-700 group-hover:text-yo-gray-900">Mes paiements reçus</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yo-gray-400" />
                      </Link>

                      {/* Toggle Mode Absence */}
                      <div className="px-4 py-2.5 hover:bg-yo-gray-50 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Moon className="w-4 h-4 text-yo-gray-600" />
                            <div>
                              <p className="text-yo-gray-700">Mode Absence</p>
                              <p className="text-xs text-yo-gray-500">Vous apparaissez hors ligne</p>
                            </div>
                          </div>
                          <button
                            onClick={toggleAbsenceMode}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              absenceMode ? 'bg-yo-orange' : 'bg-yo-gray-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                absenceMode ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Toggle Dispo dans l'heure */}
                      <div className="px-4 py-2.5 hover:bg-yo-gray-50 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-yo-gray-600" />
                            <div>
                              <p className="text-yo-gray-700">Dispo dans l'heure</p>
                              <p className="text-xs text-yo-gray-500">Disponible immédiatement</p>
                            </div>
                          </div>
                          <button
                            onClick={toggleAvailableNow}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              availableNow ? 'bg-yo-green' : 'bg-yo-gray-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                availableNow ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-yo-gray-200 my-2" />

                    {/* Section: Mes informations */}
                    <div className="py-2">
                      <div className="px-4 py-2">
                        <p className="text-xs font-bold text-yo-gray-500 uppercase tracking-wide">Mes informations</p>
                      </div>
                      
                      <Link 
                        href="/profile/informations"
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-yo-gray-50 transition group"
                        onClick={() => setShowMenu(false)}
                      >
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-4 h-4 text-yo-gray-600 group-hover:text-yo-green" />
                          <span className="text-yo-gray-700 group-hover:text-yo-gray-900">Informations personnelles</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yo-gray-400" />
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-yo-gray-200 my-2" />

                    {/* Section: Connexion et Sécurité */}
                    <div className="py-2">
                      <div className="px-4 py-2">
                        <p className="text-xs font-bold text-yo-gray-500 uppercase tracking-wide">Connexion et Sécurité</p>
                      </div>
                      
                      <Link 
                        href="/profile/security"
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-yo-gray-50 transition group"
                        onClick={() => setShowMenu(false)}
                      >
                        <div className="flex items-center gap-3">
                          <Lock className="w-4 h-4 text-yo-gray-600 group-hover:text-yo-green" />
                          <span className="text-yo-gray-700 group-hover:text-yo-gray-900">Identifiants et mot de passe</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yo-gray-400" />
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-yo-gray-200 my-2" />

                    {/* Aide */}
                    <Link 
                      href="/aide"
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-yo-gray-50 transition group"
                      onClick={() => setShowMenu(false)}
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-yo-gray-600 group-hover:text-yo-green" />
                        <span className="text-yo-gray-700 group-hover:text-yo-gray-900">Aide</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-yo-gray-400" />
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-yo-gray-200 my-2" />
                    
                    {/* Déconnexion */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold">Se déconnecter</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/connexion"
                className="px-6 py-2 text-yo-gray-800 hover:bg-yo-gray-100 rounded-full font-semibold transition"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/inscription"
                className="px-6 py-2 bg-yo-green text-white hover:bg-yo-green-dark rounded-full font-semibold transition shadow-yo-md"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
