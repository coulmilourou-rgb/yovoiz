'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function DebugCookiesPage() {
  const [cookies, setCookies] = useState<string[]>([]);

  useEffect(() => {
    // Récupérer tous les cookies
    const allCookies = document.cookie.split(';').map(c => c.trim());
    setCookies(allCookies);
  }, []);

  const refreshCookies = () => {
    const allCookies = document.cookie.split(';').map(c => c.trim());
    setCookies(allCookies);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🍪 Debug Cookies</h1>
        
        <Button onClick={refreshCookies} className="mb-4">
          Rafraîchir
        </Button>

        <div className="bg-gray-800 rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold mb-4">Cookies actuels ({cookies.length})</h2>
          {cookies.length === 0 ? (
            <p className="text-gray-400">Aucun cookie trouvé</p>
          ) : (
            cookies.map((cookie, index) => (
              <div key={index} className="bg-gray-700 rounded p-3 font-mono text-sm break-all">
                {cookie}
              </div>
            ))
          )}
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
          <h3 className="text-yellow-400 font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ouvrez cette page en navigation privée</li>
            <li>Connectez-vous sur <code>/auth/connexion</code></li>
            <li>Revenez sur cette page et cliquez "Rafraîchir"</li>
            <li>Copiez les noms de cookies qui commencent par "sb-"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
