# FIX: Gérer mon périmètre d'intervention

## Problème

**Erreur** : "Erreur lors de la sauvegarde" lors de l'enregistrement des préférences de périmètre d'intervention.

**Cause** : La colonne `availability_hours` (JSONB) n'existe pas dans la table `profiles`.

---

## Solution

### Étape 1: Exécuter le script SQL (OBLIGATOIRE)

1. Aller sur https://supabase.com/dashboard
2. Sélectionner le projet **Yo!Voiz**
3. Aller dans **SQL Editor**
4. Copier-coller le contenu du fichier : `supabase/ADD-AVAILABILITY-HOURS.sql`
5. Cliquer sur **Run** (▶️)

**Résultat attendu** :
```
✅ Colonne availability_hours ajoutée
✅ Migration terminée !
```

### Étape 2: Vérifier dans le dashboard

1. Aller dans **Table Editor** → `profiles`
2. Vérifier la présence de la colonne `availability_hours` (type: jsonb)

---

## Modifications du code

### Fichier : `app/profile/perimeter/page.tsx`

#### 1. Chargement robuste des données (lignes 83-114)

**Avant** :
```typescript
// Ne chargeait pas les jours/horaires
if (data) {
  setCommunesSelectionnees(data.service_zones || []);
  setCategoriesSelectionnees(data.categories || []);
}
```

**Après** :
```typescript
if (data) {
  setCommunesSelectionnees(data.service_zones || []);
  setCategoriesSelectionnees(data.categories || []);
  
  // Parsing robuste de availability_hours
  if (data.availability_hours) {
    const avail = typeof data.availability_hours === 'string' 
      ? JSON.parse(data.availability_hours) 
      : data.availability_hours;
    
    setJoursDisponibles(avail.jours || []);
    setHorairesDisponibles(avail.horaires || []);
    if (avail.rayon) setRayonIntervention(avail.rayon);
  }
}
```

#### 2. Sauvegarde avec validation et gestion d'erreur (lignes 148-198)

**Améliorations** :
- ✅ Validation : Au moins 1 commune et 1 catégorie requises
- ✅ Ajout conditionnel de `availability_hours` (seulement si renseigné)
- ✅ Logging console détaillé pour débogage
- ✅ Messages d'erreur explicites avec `error.message`

**Code** :
```typescript
const handleSave = async () => {
  // Validation
  if (communesSelectionnees.length === 0) {
    alert('⚠️ Veuillez sélectionner au moins une commune');
    return;
  }

  if (categoriesSelectionnees.length === 0) {
    alert('⚠️ Veuillez sélectionner au moins une catégorie');
    return;
  }

  const updateData: any = {
    service_zones: communesSelectionnees,
    categories: categoriesSelectionnees,
  };

  // Ajouter availability_hours seulement si jours/horaires sélectionnés
  if (joursDisponibles.length > 0 || horairesDisponibles.length > 0) {
    updateData.availability_hours = {
      jours: joursDisponibles,
      horaires: horairesDisponibles,
      rayon: rayonIntervention
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', profile.id);

  if (error) throw error;
  
  alert('✅ Sauvegardé avec succès !');
};
```

---

## Structure de la table `profiles`

### Colonnes utilisées pour le périmètre :

| Colonne | Type | Description |
|---------|------|-------------|
| `service_zones` | TEXT[] | Communes d'intervention (ex: ["Yopougon", "Abobo"]) |
| `categories` | TEXT[] | Catégories de services (ex: ["Plomberie", "Électricité"]) |
| `availability_hours` | JSONB | Jours/horaires de disponibilité (voir format ci-dessous) |

### Format de `availability_hours` :

```json
{
  "jours": ["lundi", "mardi", "mercredi"],
  "horaires": ["morning", "afternoon"],
  "rayon": 10
}
```

**Champs** :
- `jours` : Array de jours de la semaine (lundi à dimanche)
- `horaires` : Array de plages horaires (morning, afternoon, evening)
- `rayon` : Rayon d'intervention en km (optionnel)

---

## Test

### Procédure de test :

1. **Se connecter** à l'application
2. **Aller dans** : Menu utilisateur → "Gérer mon périmètre"
3. **Remplir** :
   - ✅ Sélectionner au moins 1 commune (ex: Yopougon)
   - ✅ Sélectionner au moins 1 catégorie (ex: Plomberie)
   - (Optionnel) Sélectionner jours et horaires
   - (Optionnel) Ajuster le rayon d'intervention (5-100 km)
4. **Cliquer** sur "Enregistrer mes préférences"

### Résultats attendus :

**✅ Succès** :
```
✅ Périmètre d'intervention sauvegardé avec succès !
```

**❌ Validation échouée** (normal si champs vides) :
```
⚠️ Veuillez sélectionner au moins une commune
OU
⚠️ Veuillez sélectionner au moins une catégorie de service
```

**❌ Erreur technique** :
```
❌ Erreur lors de la sauvegarde: [message d'erreur]

Vérifiez la console pour plus de détails.
```

→ Si cette erreur persiste, vérifier :
- La console du navigateur (F12) → onglet Console
- Les logs de la console → Rechercher "❌ Erreur Supabase:"

---

## Dépannage

### Erreur : "Column 'availability_hours' does not exist"

**Solution** : La colonne n'a pas été créée.
→ Exécuter le script SQL `ADD-AVAILABILITY-HOURS.sql`

### Erreur : "Invalid input syntax for type json"

**Cause** : Format JSON invalide.
**Solution** : Le code corrigé gère maintenant le format automatiquement.

### Aucune erreur mais les données ne se sauvegardent pas

**Vérification** :
1. Ouvrir la console du navigateur (F12)
2. Vérifier le message : `💾 Données à sauvegarder:`
3. Vérifier dans Supabase Dashboard → Table Editor → `profiles`
4. Chercher votre profil et vérifier les colonnes `service_zones`, `categories`, `availability_hours`

---

## Prochaines étapes

Une fois la sauvegarde fonctionnelle :

1. ✅ Les communes sélectionnées seront utilisées pour filtrer les demandes affichées
2. ✅ Les catégories sélectionnées détermineront les types de demandes visibles
3. ✅ Les horaires de disponibilité seront affichés sur le profil public
4. ✅ Le rayon d'intervention limitera les demandes géographiquement

---

## Colonnes requises dans `profiles` (checklist)

- [x] `service_zones` (TEXT[]) - Existe dans schema.sql ligne 70
- [x] `categories` (TEXT[]) - Existe dans schema.sql ligne 71
- [ ] `availability_hours` (JSONB) - ⚠️ À créer avec le script SQL

---

## Support

Si le problème persiste après avoir suivi ce guide :
1. Vérifier que le script SQL a été exécuté sans erreur
2. Vérifier les logs dans la console navigateur (F12)
3. Copier le message d'erreur complet depuis la console
4. Vérifier dans Supabase → Logs → API Logs
