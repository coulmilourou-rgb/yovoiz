-- =====================================================
-- TABLES PRO : Devis, Factures, Clients, Catalogue
-- =====================================================
-- Tables pour les fonctionnalités Abonnement Pro

-- TABLE: clients (Répertoire clients)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
CREATE POLICY "Users can view their own clients"
ON public.clients FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clients;
CREATE POLICY "Users can insert their own clients"
ON public.clients FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
CREATE POLICY "Users can update their own clients"
ON public.clients FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
CREATE POLICY "Users can delete their own clients"
ON public.clients FOR DELETE
USING (auth.uid() = user_id);

-- TABLE: devis (Devis)
CREATE TABLE IF NOT EXISTS public.devis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  reference VARCHAR(50) UNIQUE,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  client_address TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  issue_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_devis_user_id ON public.devis(user_id);
CREATE INDEX IF NOT EXISTS idx_devis_client_id ON public.devis(client_id);
CREATE INDEX IF NOT EXISTS idx_devis_reference ON public.devis(reference);

-- RLS
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own devis" ON public.devis;
CREATE POLICY "Users can view their own devis"
ON public.devis FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own devis" ON public.devis;
CREATE POLICY "Users can insert their own devis"
ON public.devis FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own devis" ON public.devis;
CREATE POLICY "Users can update their own devis"
ON public.devis FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own devis" ON public.devis;
CREATE POLICY "Users can delete their own devis"
ON public.devis FOR DELETE
USING (auth.uid() = user_id);

-- TABLE: factures (Factures)
CREATE TABLE IF NOT EXISTS public.factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  devis_id UUID REFERENCES public.devis(id) ON DELETE SET NULL,
  reference VARCHAR(50) UNIQUE,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  client_address TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_date DATE,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_factures_user_id ON public.factures(user_id);
CREATE INDEX IF NOT EXISTS idx_factures_client_id ON public.factures(client_id);
CREATE INDEX IF NOT EXISTS idx_factures_reference ON public.factures(reference);

-- RLS
ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own factures" ON public.factures;
CREATE POLICY "Users can view their own factures"
ON public.factures FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own factures" ON public.factures;
CREATE POLICY "Users can insert their own factures"
ON public.factures FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own factures" ON public.factures;
CREATE POLICY "Users can update their own factures"
ON public.factures FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own factures" ON public.factures;
CREATE POLICY "Users can delete their own factures"
ON public.factures FOR DELETE
USING (auth.uid() = user_id);

-- TABLE: catalogue (Catalogue d'articles/services)
CREATE TABLE IF NOT EXISTS public.catalogue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'unité', -- unité, heure, jour, mètre, etc.
  category VARCHAR(100),
  tax_rate DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_catalogue_user_id ON public.catalogue(user_id);
CREATE INDEX IF NOT EXISTS idx_catalogue_category ON public.catalogue(category);

-- RLS
ALTER TABLE public.catalogue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own catalogue" ON public.catalogue;
CREATE POLICY "Users can view their own catalogue"
ON public.catalogue FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own catalogue" ON public.catalogue;
CREATE POLICY "Users can insert their own catalogue"
ON public.catalogue FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own catalogue" ON public.catalogue;
CREATE POLICY "Users can update their own catalogue"
ON public.catalogue FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own catalogue" ON public.catalogue;
CREATE POLICY "Users can delete their own catalogue"
ON public.catalogue FOR DELETE
USING (auth.uid() = user_id);

-- TABLE: encaissements (Historique des encaissements)
CREATE TABLE IF NOT EXISTS public.encaissements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facture_id UUID REFERENCES public.factures(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- cash, card, bank_transfer, mobile_money, etc.
  payment_date DATE DEFAULT CURRENT_DATE,
  reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_encaissements_user_id ON public.encaissements(user_id);
CREATE INDEX IF NOT EXISTS idx_encaissements_facture_id ON public.encaissements(facture_id);
CREATE INDEX IF NOT EXISTS idx_encaissements_payment_date ON public.encaissements(payment_date);

-- RLS
ALTER TABLE public.encaissements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own encaissements" ON public.encaissements;
CREATE POLICY "Users can view their own encaissements"
ON public.encaissements FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own encaissements" ON public.encaissements;
CREATE POLICY "Users can insert their own encaissements"
ON public.encaissements FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own encaissements" ON public.encaissements;
CREATE POLICY "Users can update their own encaissements"
ON public.encaissements FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own encaissements" ON public.encaissements;
CREATE POLICY "Users can delete their own encaissements"
ON public.encaissements FOR DELETE
USING (auth.uid() = user_id);

-- FONCTIONS: Génération automatique de références

-- Fonction pour générer une référence de devis
CREATE OR REPLACE FUNCTION generate_devis_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'DEV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('devis_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS devis_seq;

DROP TRIGGER IF EXISTS trigger_generate_devis_reference ON public.devis;
CREATE TRIGGER trigger_generate_devis_reference
BEFORE INSERT ON public.devis
FOR EACH ROW
EXECUTE FUNCTION generate_devis_reference();

-- Fonction pour générer une référence de facture
CREATE OR REPLACE FUNCTION generate_facture_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'FACT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('facture_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS facture_seq;

DROP TRIGGER IF EXISTS trigger_generate_facture_reference ON public.factures;
CREATE TRIGGER trigger_generate_facture_reference
BEFORE INSERT ON public.factures
FOR EACH ROW
EXECUTE FUNCTION generate_facture_reference();

-- VÉRIFICATION
SELECT 
  '=== TABLES PRO CRÉÉES ===' as section,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('clients', 'devis', 'factures', 'catalogue', 'encaissements')
ORDER BY table_name;

-- RAPPORT FINAL
DO $$
DECLARE
  table_clients BOOLEAN;
  table_devis BOOLEAN;
  table_factures BOOLEAN;
  table_catalogue BOOLEAN;
  table_encaissements BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') INTO table_clients;
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'devis') INTO table_devis;
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'factures') INTO table_factures;
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'catalogue') INTO table_catalogue;
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'encaissements') INTO table_encaissements;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════╗';
  RAISE NOTICE '║   TABLES ABONNEMENT PRO - INSTALLATION            ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  
  IF table_clients THEN RAISE NOTICE '✅ clients (répertoire clients)'; ELSE RAISE NOTICE '❌ clients'; END IF;
  IF table_devis THEN RAISE NOTICE '✅ devis (gestion devis)'; ELSE RAISE NOTICE '❌ devis'; END IF;
  IF table_factures THEN RAISE NOTICE '✅ factures (gestion factures)'; ELSE RAISE NOTICE '❌ factures'; END IF;
  IF table_catalogue THEN RAISE NOTICE '✅ catalogue (articles/services)'; ELSE RAISE NOTICE '❌ catalogue'; END IF;
  IF table_encaissements THEN RAISE NOTICE '✅ encaissements (historique paiements)'; ELSE RAISE NOTICE '❌ encaissements'; END IF;
  
  RAISE NOTICE '';
  
  IF table_clients AND table_devis AND table_factures AND table_catalogue AND table_encaissements THEN
    RAISE NOTICE '🎉 INSTALLATION RÉUSSIE !';
    RAISE NOTICE '';
    RAISE NOTICE '✨ Fonctionnalités activées:';
    RAISE NOTICE '  • Gestion des devis';
    RAISE NOTICE '  • Gestion des factures';
    RAISE NOTICE '  • Répertoire clients';
    RAISE NOTICE '  • Catalogue d''articles';
    RAISE NOTICE '  • Historique des encaissements';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 RLS activé sur toutes les tables';
    RAISE NOTICE '🔢 Génération automatique des références (DEV-YYYYMMDD-XXXX, FACT-YYYYMMDD-XXXX)';
  ELSE
    RAISE NOTICE '⚠️  INSTALLATION INCOMPLÈTE';
  END IF;
  
  RAISE NOTICE '';
END $$;
