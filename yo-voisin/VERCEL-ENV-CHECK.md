# Vérification Variables d'Environnement Vercel

## ⚠️ VÉRIFIER MAINTENANT

Aller sur : https://vercel.com/milourou-coulibalys-projects/yo-voiz/settings/environment-variables

### Variables OBLIGATOIRES :

```
NEXT_PUBLIC_SUPABASE_URL = https://hfrmctsvpszqdizritoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vérifications :

1. ✅ Les 2 variables existent
2. ✅ Pas d'espaces avant/après
3. ✅ Appliquées à tous les environnements (Production, Preview, Development)
4. ✅ URL commence bien par `https://`
5. ✅ La clé ANON_KEY est complète (très longue)

### Si Modifications :

1. Sauvegarder
2. **Redeploy** le projet (Settings → Deployments → ... → Redeploy)

---

## Test Alternatif : Vérifier Si Supabase Répond

Sur `/test-dashboard`, ouvrez la console et tapez :

```javascript
const { data, error } = await supabase.from('profiles').select('*').eq('id', '270013f1-2386-4601-a37f-4007ac213795').single();
console.log('Data:', data);
console.log('Error:', error);
```

Cela testera directement Supabase dans le navigateur.
