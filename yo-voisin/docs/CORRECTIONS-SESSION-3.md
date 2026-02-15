# 🔧 LISTE COMPLÈTE DES CORRECTIONS À EFFECTUER

Date : 15 février 2026 - 02h45  
Serveur : **http://localhost:3000**  
Session : Corrections système Pro & UX

---

## ✅ CORRECTIONS DÉJÀ EFFECTUÉES

### 1. ✅ Communes manquantes dans offres de services
- **Fichier :** `app/services/nouvelle-offre/page.tsx`
- **Ajout :** Anyama, Bingerville, Brofodoumé, Songon (total 14 communes)

### 2. ✅ Erreur import Mail/Globe dans Paramètres Pro
- **Fichier :** `app/abonnement/parametres-pro/page.tsx`
- **Fix :** Ajout imports `Mail` et `Globe` depuis lucide-react

### 3. ✅ Composant notification professionnel créé
- **Fichier :** `components/ui/ProNotification.tsx`
- **Fonctionnalités :** Success, Error, Warning, Info avec animations et progress bar

---

## 🚧 CORRECTIONS EN COURS

### PRIORITÉ 1 : Problèmes critiques bloquants

#### 1. Prix non effaçable (0 fixe) dans formulaires
**Fichiers concernés :**
- `components/abonnement/DevisForm.tsx` (Nouveau devis)
- `components/abonnement/FactureForm.tsx` (Nouvelle facture)
- `components/abonnement/ServiceForm.tsx` (Catalogue)

**Problème :** Input type="number" avec value="0" non supprimable  
**Solution :** Utiliser value vide par défaut + placeholder="0"

```typescript
// AVANT
<input type="number" value={currentService.unit_price || 0} />

// APRÈS
<input 
  type="number" 
  value={currentService.unit_price === 0 ? '' : currentService.unit_price} 
  placeholder="0"
/>
```

#### 2. Menu Abonnement Pro - Scroll indépendant
**Fichier :** `app/abonnement/page.tsx`

**Problème :** Scroll du menu gauche lié au contenu droit  
**Solution :** 
```css
/* Menu gauche */
position: sticky;
top: 0;
height: 100vh;
overflow-y: auto;

/* Contenu droit */
overflow-y: auto;
height: 100vh;
```

#### 3. Photo de couverture dans "Voir Ma Page"
**Fichier :** `components/abonnement/ProfilePublicEmbed.tsx`

**Problème :** Cadre dégradé orange→vert fixe  
**Solution :** 
- Ajouter input file pour upload
- Stocker URL dans `profiles.cover_photo`
- Afficher image ou dégradé par défaut

---

### PRIORITÉ 2 : Fonctionnalités non opérationnelles

#### 4. Devis non affiché après création
**Fichier :** `app/abonnement/devis/page.tsx`

**Problème :** 
- Popup "Créé avec succès" mais liste vide
- Pas de refresh après création

**Solution :**
```typescript
const handleCreateDevis = async (data: any) => {
  // ... création
  await loadDevis(); // Recharger la liste
  showNotification('success', 'Devis créé', 'Le devis a été créé avec succès');
};
```

#### 5. Modification devis non persistée
**Fichier :** `app/abonnement/devis/page.tsx`

**Problème :** Popup succès mais changements non sauvegardés  
**Solution :** Ajouter UPDATE Supabase dans handleEditDevis

#### 6. Facture "Marquer payée" ne change pas le statut
**Fichier :** `app/abonnement/factures/page.tsx`

**Problème :** Alerte succès mais status reste "pending"  
**Solution :**
```typescript
const handleMarkPaid = async (id: string) => {
  const { error } = await supabase
    .from('factures')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id);
  
  if (!error) {
    await loadFactures(); // Refresh
    showNotification('success', 'Facture payée', 'Le statut a été mis à jour');
  }
};
```

#### 7. Modifications client non sauvegardées
**Fichier :** `app/abonnement/clients/page.tsx`

**Problème :** Modal modification sans UPDATE  
**Solution :** Ajouter logique UPDATE Supabase

#### 8. Catalogue - Actions non fonctionnelles
**Fichier :** `app/abonnement/catalogue/page.tsx`

**Problèmes :**
- Modifier service : pas de UPDATE
- Dupliquer : pas de INSERT
- Nouveau service : pas de INSERT
- Bouton Supprimer déborde du card

**Solutions :**
- Ajouter handlers Supabase
- Ajuster CSS bouton supprimer

---

### PRIORITÉ 3 : Génération PDF

#### 9. Intégrer générateur PDF pour Devis
**Fichier :** `app/abonnement/devis/page.tsx`

**À faire :**
```typescript
import { generateDevisPDF, downloadPDF } from '@/lib/pdf-generator';

const handleDownloadPDF = async (devis: any) => {
  const pdfBlob = await generateDevisPDF({
    ...devis,
    provider: {
      name: profile.company_name || `${profile.first_name} ${profile.last_name}`,
      company: profile.company_name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address
    }
  });
  
  downloadPDF(pdfBlob, `Devis-${devis.id}.pdf`);
  showNotification('success', 'PDF généré', 'Le devis a été téléchargé');
};
```

#### 10. Intégrer générateur PDF pour Factures
**Même principe que devis**

#### 11. Export Excel/PDF Encaissements
**Fichier :** `app/abonnement/encaissements/page.tsx`

**À faire :**
- PDF : Utiliser generateEncaissementsPDF
- Excel : Utiliser generateEncaissementsExcel

---

### PRIORITÉ 4 : Système de messagerie interne

#### 12. Envoi devis/factures via plateforme
**Nouveau système à créer :**

**Table messages :**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id),
  to_user_id UUID REFERENCES profiles(id),
  subject TEXT,
  body TEXT,
  message_type TEXT, -- 'message', 'devis', 'facture', 'relance'
  attached_doc_type TEXT, -- 'devis', 'facture'
  attached_doc_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Fonction d'envoi :**
```typescript
const sendDevisToClient = async (devisId: string, clientId: string) => {
  const { error } = await supabase
    .from('messages')
    .insert({
      from_user_id: user.id,
      to_user_id: clientId,
      subject: 'Nouveau devis reçu',
      body: 'Vous avez reçu un nouveau devis. Consultez-le dans votre messagerie.',
      message_type: 'devis',
      attached_doc_type: 'devis',
      attached_doc_id: devisId
    });
  
  if (!error) {
    showNotification('success', 'Devis envoyé', 'Le client recevra une notification');
  }
};
```

#### 13. Relance facture via messagerie (pas email)
**Même système que devis avec message_type='relance'**

---

### PRIORITÉ 5 : UX & Navigation

#### 14. Modal relance trop grande
**Fichier :** `components/abonnement/FactureReminder.tsx`

**Problème :** Bouton "Envoyer" caché  
**Solution :**
```tsx
<div className="max-h-[80vh] overflow-y-auto">
  {/* Contenu */}
</div>
<div className="sticky bottom-0 bg-white border-t p-4">
  {/* Boutons */}
</div>
```

#### 15. Historique client popup non pro
**Fichier :** `app/abonnement/clients/page.tsx`

**Remplacer alert() par modal professionnel**

#### 16. "Nouveau devis depuis client" non fonctionnel
**Ouvrir DevisForm avec pré-remplissage client**

#### 17. Actualiser page redirige vers home
**Problème :** État de navigation perdu  
**Solution :** Utiliser localStorage ou URL state

#### 18. Renommer titres de pages
**Fichiers :**
- `app/abonnement/page.tsx` → "Abonnement Pro"
- `app/messages/page.tsx` → "Messagerie" (à créer)

#### 19. Voir offre actuelle (Grille tarifaire)
**Fichier :** `app/abonnement/tarifs/page.tsx`

**Afficher modal avec détails de l'abonnement actuel**

---

## 📋 CHECKLIST FINALE

### Devis
- [ ] Prix effaçable (0 → vide)
- [ ] Créer devis → affichage liste
- [ ] Modifier devis → sauvegarde réelle
- [ ] Télécharger PDF → génération
- [ ] Envoyer au client → messagerie
- [ ] Popup professionnels
- [ ] Infos prestataire visibles

### Factures
- [ ] Prix effaçable
- [ ] Marquer payée → UPDATE status
- [ ] Relance → modal ajusté + messagerie
- [ ] Télécharger PDF → génération
- [ ] Popup professionnels

### Encaissements
- [ ] Export PDF fonctionnel
- [ ] Export Excel fonctionnel

### Clients
- [ ] Modifier → UPDATE réel
- [ ] Supprimer → DELETE avec bouton
- [ ] Historique → modal pro
- [ ] Nouveau devis → pré-rempli

### Catalogue
- [ ] Nouveau service → INSERT
- [ ] Modifier → UPDATE
- [ ] Dupliquer → INSERT copy
- [ ] Supprimer → bouton CSS + DELETE
- [ ] Prix effaçable

### Abonnement Pro
- [ ] Photo couverture
- [ ] Scroll indépendant menu/contenu
- [ ] Voir offre actuelle
- [ ] Gérer périmètre

### Navigation & UX
- [ ] Actualiser ne redirige pas home
- [ ] Titres pages corrects
- [ ] Messages renommé Messagerie

---

## 🎯 ORDRE D'EXÉCUTION

1. **Corrections CSS urgentes** (scroll, boutons, modals)
2. **Prix effaçables** (3 fichiers)
3. **Génération PDF** (devis + factures)
4. **Persistence données** (CREATE, UPDATE, DELETE réels)
5. **Système messagerie** (table + fonctions)
6. **UX finale** (titres, navigation)

---

**Serveur : http://localhost:3000**  
**Session ID : 2848**
