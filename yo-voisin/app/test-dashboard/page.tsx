'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';

export default function TestDashboard() {
  const { user, profile, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yo-green-dark via-yo-green to-yo-green-light">
      <Navbar isConnected={!!user} />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-yo-green-dark mb-6">
            🎉 Connexion Réussie !
          </h1>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="font-bold text-green-800 mb-2">État de chargement :</h2>
              <p className="text-green-700">Loading: {loading ? '⏳ Oui' : '✅ Non'}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-bold text-blue-800 mb-2">Utilisateur :</h2>
              {user ? (
                <div className="text-blue-700 space-y-1">
                  <p>✅ User connecté</p>
                  <p>ID: {user.id}</p>
                  <p>Email: {user.email}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ Pas d'utilisateur</p>
              )}
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h2 className="font-bold text-purple-800 mb-2">Profil :</h2>
              {profile ? (
                <div className="text-purple-700 space-y-1">
                  <p>✅ Profil chargé</p>
                  <p>Nom: {profile.first_name} {profile.last_name}</p>
                  <p>Type: {profile.user_type}</p>
                  <p>Rôle: {profile.role}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ Pas de profil</p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <a 
                href="/home" 
                className="px-6 py-3 bg-yo-green text-white rounded-lg font-semibold hover:bg-yo-green-dark transition"
              >
                Aller vers /home
              </a>
              <a 
                href="/" 
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Retour accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
