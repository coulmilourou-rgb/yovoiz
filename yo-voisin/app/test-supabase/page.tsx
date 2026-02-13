'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test 1: Vérifier la configuration
      console.log('Test 1: Configuration');
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

      // Test 2: Vérifier la session actuelle
      console.log('\nTest 2: Session actuelle');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session:', session);
      console.log('Erreur:', sessionError);

      // Test 3: Tenter une connexion (DÉSACTIVÉ - à faire manuellement)
      console.log('\nTest 3: Connexion test - IGNORÉ (faites-le via /auth/connexion)');
      const data = null;
      const error = null;

      // Test 4: Vérifier localStorage
      console.log('\nTest 4: LocalStorage');
      const keys = Object.keys(localStorage);
      console.log('Clés localStorage:', keys);
      keys.forEach(key => {
        if (key.includes('supabase')) {
          console.log(`${key}:`, localStorage.getItem(key));
        }
      });

      setResult({
        session: session,
        loginData: data,
        loginError: error,
        localStorageKeys: keys.filter(k => k.includes('supabase'))
      });

    } catch (error) {
      console.error('Erreur test:', error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Supabase Auth</h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : 'Lancer le test'}
        </button>

        {result && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Résultats :</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h3 className="font-bold mb-2">Instructions :</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Cliquez sur "Lancer le test"</li>
            <li>Ouvrez la console (F12)</li>
            <li>Regardez les logs détaillés</li>
            <li>Vérifiez si des cookies/localStorage sont créés</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
