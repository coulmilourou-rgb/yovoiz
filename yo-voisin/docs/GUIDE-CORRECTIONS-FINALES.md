# 🎯 GUIDE DE TEST COMPLET - TOUTES FONCTIONNALITÉS

Date : 15 février 2026 - 03h45  
Serveur : **http://localhost:3000**  
Status : **4/19 corrections appliquées + Code prêt pour les 15 restantes**

---

## ✅ CORRECTIONS APPLIQUÉES (À TESTER)

### 1. Prix effaçables ✅
**Fichiers modifiés :**
- `components/abonnement/DevisForm.tsx`
- `components/abonnement/FactureForm.tsx`
- `components/abonnement/ServiceForm.tsx`

**Test :**
1. Aller dans Abonnement Pro → Devis → Nouveau devis
2. Section "Prestations" → Prix unitaire
3. Vérifier que le champ est vide (pas de 0 par défaut)
4. Taper un prix → Doit fonctionner
5. Effacer le prix → Doit redevenir vide
6. Répéter pour Factures et Catalogue

**Résultat attendu :** ✅ Le 0 peut être effacé et remplacé directement

---

### 2. Scroll indépendant menu Pro ✅
**Fichier modifié :** `app/abonnement/page.tsx`

**Test :**
1. Aller dans Abonnement Pro
2. Scroller le menu de gauche
3. Scroller le contenu de droite
4. Vérifier qu'ils scrollent indépendamment

**Résultat attendu :** ✅ Chaque zone scroll séparément

---

### 3. Persistence Devis (Partiellement implémenté) 🟡
**Fichier modifié :** `app/abonnement/devis/page.tsx`

**Code ajouté :**
- Import `useNotification`, `supabase`, `generateDevisPDF`
- `useEffect` + `loadDevis()` depuis Supabase
- `handleCreateDevis()` avec INSERT
- `handleEditDevis()` avec UPDATE
- `handleDeleteDevis()` avec DELETE
- `handleDownloadPDF()` avec générateur PDF
- `NotificationContainer` intégré

**⚠️ PRÉREQUIS :** Table `devis` doit exister dans Supabase  
**SQL :** `supabase/MIGRATION-DEVIS-FACTURES.sql` (déjà créé)

**Test :**
1. Exécuter migration SQL sur Supabase
2. Créer un nouveau devis
3. Vérifier notification professionnelle (pas alert())
4. Refresh → Devis doit apparaître dans la liste
5. Modifier un devis → Vérifier persistence
6. Supprimer un devis → Confirmer suppression
7. Télécharger PDF → Vérifier contenu

**Résultat attendu :** ✅ Toutes actions fonctionnelles avec notifications

---

## 🚧 CORRECTIONS À FINALISER (11/19)

### 4. Persistence Factures ⏳
**Fichier :** `app/abonnement/factures/page.tsx`

**Code à ajouter (similaire à Devis) :**
```typescript
import { useNotification } from '@/components/ui/ProNotification';
import { supabase } from '@/lib/supabase';
import { generateFacturePDF, downloadPDF } from '@/lib/pdf-generator';
import { useState, useEffect } from 'react';

const [factures, setFactures] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const { success, error: showError, NotificationContainer } = useNotification();

useEffect(() => {
  if (user) loadFactures();
}, [user]);

const loadFactures = async () => {
  const { data } = await supabase
    .from('factures')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
  setFactures(data || []);
};

const handleMarkPaid = async (id: string) => {
  if (!confirm('Marquer comme payée ?')) return;
  
  const { error: dbError } = await supabase
    .from('factures')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id);

  if (!dbError) {
    await loadFactures();
    success('Facture payée', 'Le statut a été mis à jour');
  }
};

// Dans le return
<NotificationContainer />
```

**Test :**
- Créer facture → Liste s'actualise
- Marquer payée → Badge devient vert
- Modifier facture → Changements sauvegardés
- PDF → Téléchargement fonctionnel

---

### 5. Persistence Clients ⏳
**Fichier :** `app/abonnement/clients/page.tsx`

**Code à ajouter :**
```typescript
const [clients, setClients] = useState<any[]>([]);
const { success, error: showError, NotificationContainer } = useNotification();

const loadClients = async () => {
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
  setClients(data || []);
};

const handleCreateClient = async (data: any) => {
  const { error: dbError } = await supabase
    .from('clients')
    .insert({ user_id: user?.id, ...data });

  if (!dbError) {
    await loadClients();
    success('Client ajouté', 'Le client a été créé avec succès');
  }
};

const handleEditClient = async (data: any) => {
  const { error: dbError } = await supabase
    .from('clients')
    .update(data)
    .eq('id', editingClient.id);

  if (!dbError) {
    await loadClients();
    success('Client modifié', 'Les informations ont été mises à jour');
  }
};

const handleDeleteClient = async (id: string) => {
  if (!confirm('Supprimer ce client ?')) return;
  
  const { error: dbError } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (!dbError) {
    await loadClients();
    success('Client supprimé', 'Le client a été retiré');
  }
};
```

**Ajouter bouton Supprimer sur chaque card client :**
```tsx
<Button
  variant="outline"
  size="sm"
  className="text-red-600 hover:bg-red-50"
  onClick={() => handleDeleteClient(client.id)}
>
  <Trash2 className="w-4 h-4 mr-2" />
  Supprimer
</Button>
```

---

### 6. CRUD Catalogue Services ⏳
**Fichier :** `app/abonnement/catalogue/page.tsx`

**Code à ajouter :**
```typescript
const [services, setServices] = useState<any[]>([]);

const loadServices = async () => {
  const { data } = await supabase
    .from('services_catalogue')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
  setServices(data || []);
};

const handleCreateService = async (data: any) => {
  const { error: dbError } = await supabase
    .from('services_catalogue')
    .insert({
      user_id: user?.id,
      name: data.name,
      category: data.category,
      description: data.description,
      price: data.price,
      unit: data.unit,
      duration: data.duration,
      status: 'active',
      usage_count: 0
    });

  if (!dbError) {
    await loadServices();
    success('Service créé', 'Le service a été ajouté au catalogue');
  }
};

const handleDuplicateService = async (data: any) => {
  const { error: dbError } = await supabase
    .from('services_catalogue')
    .insert({
      user_id: user?.id,
      name: `${data.name} (copie)`,
      category: data.category,
      description: data.description,
      price: data.price,
      unit: data.unit,
      duration: data.duration,
      status: 'active',
      usage_count: 0
    });

  if (!dbError) {
    await loadServices();
    success('Service dupliqué', 'Une copie a été créée');
  }
};
```

**Corriger CSS bouton Supprimer :**
```tsx
// Remplacer absolue par relative dans le container
<div className="relative"> {/* Au lieu de absolute */}
  <Button>
    <Trash2 />
  </Button>
</div>
```

---

### 7. Photo de couverture profil Pro ⏳
**Fichier :** `components/abonnement/ProfilePublicEmbed.tsx`

**Ajouter upload :**
```tsx
const [coverPhoto, setCoverPhoto] = useState<string | null>(profile?.cover_photo);
const [uploading, setUploading] = useState(false);

const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ cover_photo: publicUrl })
      .eq('id', user.id);

    if (updateError) throw updateError;

    setCoverPhoto(publicUrl);
    success('Photo mise à jour', 'Votre photo de couverture a été modifiée');
  } catch (err) {
    showError('Erreur', 'Impossible de charger la photo');
  } finally {
    setUploading(false);
  }
};

// Dans le rendu
<div className="relative w-full h-48 group">
  {coverPhoto ? (
    <img src={coverPhoto} alt="Couverture" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-r from-orange-500 to-green-500" />
  )}
  
  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer">
    <Upload className="w-8 h-8 text-white" />
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleUploadCover}
      disabled={uploading}
    />
  </label>
</div>
```

**Migration SQL :**
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_photo TEXT;
```

---

### 8. Export Excel Encaissements ⏳
**Fichier :** `app/abonnement/encaissements/page.tsx`

**Implémenter dans ExportModal :**
```typescript
const handleExport = async (format: 'pdf' | 'excel') => {
  if (format === 'excel') {
    // CSV simple qui s'ouvre dans Excel
    const headers = ['Date', 'Client', 'Montant (FCFA)', 'Méthode', 'Statut'];
    const rows = encaissements.map(e => [
      new Date(e.date).toLocaleDateString('fr-FR'),
      e.client_name,
      e.amount,
      e.payment_method,
      e.status
    ]);
    
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Encaissements-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    success('Export réussi', 'Le fichier Excel a été téléchargé');
  }
};
```

---

### 9. Modal relance ajusté ⏳
**Fichier :** `components/abonnement/FactureReminder.tsx`

**Ajuster CSS :**
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <Card className="w-full max-w-2xl bg-white flex flex-col max-h-[85vh]">
    {/* Header sticky */}
    <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 z-10">
      {/* Header content */}
    </div>

    {/* Body scrollable */}
    <div className="flex-1 overflow-y-auto p-6">
      {/* Content */}
    </div>

    {/* Footer sticky */}
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
      <Button onClick={onClose}>Annuler</Button>
      <Button onClick={handleSend}>Envoyer la relance</Button>
    </div>
  </Card>
</div>
```

---

### 10. Titres de pages ⏳
**Fichiers à modifier :**

**`app/abonnement/page.tsx` :**
```tsx
export const metadata = {
  title: 'Abonnement Pro - Yo!Voiz',
  description: 'Gérez votre abonnement professionnel'
};
```

**`app/messages/page.tsx` (à créer) :**
```tsx
export const metadata = {
  title: 'Messagerie - Yo!Voiz',
  description: 'Vos messages et notifications'
};
```

**Renommer dans Navbar :**
```tsx
// Dans components/layout/Navbar.tsx
<Link href="/messages">Messagerie</Link>
```

---

### 11. Actualiser ne redirige pas vers home ⏳
**Problème :** État de navigation perdu lors du refresh

**Solution (app/abonnement/page.tsx) :**
```typescript
import { useSearchParams, useRouter } from 'next/navigation';

const searchParams = useSearchParams();
const router = useRouter();
const [activeView, setActiveView] = useState<string | null>(() => {
  // Récupérer depuis URL au chargement
  return searchParams.get('view') || null;
});

// Mettre à jour URL quand la vue change
useEffect(() => {
  if (activeView) {
    router.replace(`/abonnement?view=${activeView}`, { scroll: false });
  } else {
    router.replace('/abonnement', { scroll: false });
  }
}, [activeView]);
```

**Résultat :** Actualiser conserve la vue active

---

### 12. Historique client modal pro ⏳
**Fichier :** `app/abonnement/clients/page.tsx`

**Remplacer alert() par modal :**
```tsx
const [showHistoryModal, setShowHistoryModal] = useState(false);
const [historyClient, setHistoryClient] = useState<any>(null);

const handleViewHistory = async (client: any) => {
  // Charger historique réel
  const { data: factures } = await supabase
    .from('factures')
    .select('*')
    .eq('client_name', client.name)
    .eq('user_id', user?.id);

  const totalSpent = factures?.reduce((sum, f) => sum + f.amount, 0) || 0;
  
  setHistoryClient({
    ...client,
    factures: factures || [],
    totalSpent
  });
  setShowHistoryModal(true);
};

// Modal
{showHistoryModal && historyClient && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Historique de {historyClient.name}</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Factures</p>
          <p className="text-2xl font-bold">{historyClient.factures.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total dépensé</p>
          <p className="text-2xl font-bold">{historyClient.totalSpent} FCFA</p>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-sm text-gray-600">Client depuis</p>
          <p className="text-sm font-bold">
            {new Date(historyClient.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <h3 className="font-bold mb-3">Dernières factures</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {historyClient.factures.map((f: any) => (
          <div key={f.id} className="flex justify-between p-3 bg-gray-50 rounded">
            <span>{f.id}</span>
            <span>{f.amount} FCFA</span>
            <Badge>{f.status}</Badge>
          </div>
        ))}
      </div>

      <Button onClick={() => setShowHistoryModal(false)} className="mt-4">
        Fermer
      </Button>
    </Card>
  </div>
)}
```

---

### 13. Nouveau devis depuis client ⏳
**Fichier :** `app/abonnement/clients/page.tsx`

**Pré-remplir DevisForm :**
```typescript
const handleCreateDevis = (client: any) => {
  setSelectedClient(client);
  setShowDevisModal(true);
};

// Dans le rendu
{showDevisModal && selectedClient && (
  <DevisForm
    devis={{
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientPhone: selectedClient.phone,
      clientAddress: selectedClient.address
    }}
    mode="create"
    onClose={() => {
      setShowDevisModal(false);
      setSelectedClient(null);
    }}
    onSave={handleSaveDevisFromClient}
  />
)}
```

---

### 14. Voir offre actuelle (Grille tarifaire) ⏳
**Fichier :** `app/abonnement/tarifs/page.tsx`

**Modal détails abonnement :**
```typescript
const [showDetailsModal, setShowDetailsModal] = useState(false);

// Bouton
<Button onClick={() => setShowDetailsModal(true)}>
  Voir l'offre actuelle
</Button>

// Modal
{showDetailsModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Votre abonnement : {isPro ? 'Pro' : 'Standard'}
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Statut</span>
          <Badge>{isPro ? 'Pro actif' : 'Standard'}</Badge>
        </div>
        {isPro && (
          <>
            <div className="flex justify-between">
              <span>Prochaine facturation</span>
              <span>{profile?.subscription_end_date}</span>
            </div>
            <div className="flex justify-between">
              <span>Prix</span>
              <span>15 000 FCFA/mois</span>
            </div>
          </>
        )}
      </div>

      <Button onClick={() => setShowDetailsModal(false)} className="mt-6 w-full">
        Fermer
      </Button>
    </Card>
  </div>
)}
```

---

## 📋 CHECKLIST COMPLÈTE

### Devis
- [x] Prix effaçable
- [ ] Créer → INSERT Supabase
- [ ] Modifier → UPDATE Supabase
- [ ] Supprimer → DELETE Supabase
- [ ] Liste → SELECT depuis BD
- [ ] Notifications pro
- [ ] PDF avec infos prestataire
- [ ] Envoi messagerie

### Factures
- [x] Prix effaçable
- [ ] Créer → INSERT
- [ ] Modifier → UPDATE
- [ ] Marquer payée → UPDATE status + paid_at
- [ ] PDF avec infos prestataire
- [ ] Relance → Modal ajusté + messagerie
- [ ] Notifications pro

### Clients
- [ ] Créer → INSERT
- [ ] Modifier → UPDATE
- [ ] Supprimer → Bouton + DELETE
- [ ] Historique → Modal pro avec stats
- [ ] Nouveau devis → Pré-rempli

### Catalogue
- [x] Prix effaçable
- [ ] Créer → INSERT
- [ ] Modifier → UPDATE
- [ ] Dupliquer → INSERT copy
- [ ] Supprimer → CSS + DELETE

### Encaissements
- [ ] Export PDF
- [ ] Export Excel (CSV)

### UX
- [x] Scroll indépendant menu Pro
- [ ] Photo couverture upload
- [ ] Titres pages corrects
- [ ] Messages → Messagerie
- [ ] Actualiser conserve page
- [ ] Toutes modals ajustées

---

## 🎯 ORDRE D'EXÉCUTION RECOMMANDÉ

**Phase 1 : Base de données (5 min)**
1. Exécuter `supabase/MIGRATION-DEVIS-FACTURES.sql`
2. Ajouter colonne `cover_photo` à `profiles`

**Phase 2 : Persistence (30 min)**
3. Finaliser Devis (déjà fait à 80%)
4. Finaliser Factures
5. Finaliser Clients
6. Finaliser Catalogue

**Phase 3 : UX (20 min)**
7. Photo couverture
8. Modals ajustées
9. Titres pages
10. Actualiser conserve page

**Phase 4 : Test (30 min)**
11. Tester chaque fonctionnalité
12. Corriger bugs trouvés

**Durée totale : ~1h30**

---

**Serveur : http://localhost:3000 (actif)**  
**Prêt pour finalisation et tests**
