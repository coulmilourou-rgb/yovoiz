-- ================================================
-- MIGRATION: SYSTÈME DE GESTION DES OFFRES D'EMPLOI
-- Date: 15 Février 2026
-- ================================================

-- 1. Table des offres d'emploi
CREATE TABLE IF NOT EXISTS job_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department TEXT NOT NULL, -- Tech, Design, Support, Marketing, etc.
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL, -- CDI, CDD, Stage, Freelance
  description TEXT NOT NULL,
  responsibilities TEXT[], -- Liste des responsabilités
  requirements TEXT[], -- Liste des prérequis
  skills TEXT[], -- Compétences techniques requises
  salary_range TEXT, -- Ex: "800 000 - 1 200 000 FCFA"
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des candidatures
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
  
  -- Informations personnelles
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  
  -- Documents
  cv_url TEXT NOT NULL, -- URL du CV dans Supabase Storage
  cover_letter_url TEXT, -- URL lettre de motivation (facultatif)
  
  -- Message de motivation
  motivation_message TEXT,
  
  -- Statut
  status TEXT DEFAULT 'pending', -- pending, reviewed, shortlisted, rejected, hired
  notes TEXT, -- Notes internes pour l'admin
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index pour performance
CREATE INDEX IF NOT EXISTS idx_job_offers_published ON job_offers(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_offers_expires ON job_offers(expires_at) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_job_applications_offer ON job_applications(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications(created_at DESC);

-- 4. Storage bucket pour CV et lettres de motivation
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-applications', 'job-applications', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Policies pour job_offers (lecture publique des offres publiées)
CREATE POLICY "Lecture publique offres publiées" ON job_offers
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin full access job_offers" ON job_offers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 6. Policies pour job_applications (créer = public, lire = admin)
CREATE POLICY "Tout le monde peut postuler" ON job_applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin lecture candidatures" ON job_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin modification candidatures" ON job_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 7. Policies Storage pour job-applications
CREATE POLICY "Upload CV public" ON storage.objects
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (bucket_id = 'job-applications');

CREATE POLICY "Admin peut lire CV" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'job-applications' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 8. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_job_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_offers_updated_at
  BEFORE UPDATE ON job_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_job_updated_at();

CREATE TRIGGER job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_updated_at();

-- 9. Fonction pour définir published_at automatiquement
CREATE OR REPLACE FUNCTION set_job_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_offers_published_at
  BEFORE UPDATE ON job_offers
  FOR EACH ROW
  EXECUTE FUNCTION set_job_published_at();

-- 10. Vue pour statistiques admin
CREATE OR REPLACE VIEW job_offers_stats AS
SELECT 
  jo.id,
  jo.title,
  jo.department,
  jo.is_published,
  jo.created_at,
  COUNT(ja.id) AS total_applications,
  COUNT(CASE WHEN ja.status = 'pending' THEN 1 END) AS pending_applications,
  COUNT(CASE WHEN ja.status = 'reviewed' THEN 1 END) AS reviewed_applications,
  COUNT(CASE WHEN ja.status = 'shortlisted' THEN 1 END) AS shortlisted_applications
FROM job_offers jo
LEFT JOIN job_applications ja ON ja.job_offer_id = jo.id
GROUP BY jo.id, jo.title, jo.department, jo.is_published, jo.created_at;

-- ================================================
-- DONNÉES DE TEST
-- ================================================

-- Insérer quelques offres de test
INSERT INTO job_offers (
  title, department, location, employment_type, description, 
  responsibilities, requirements, skills, salary_range, is_published, published_at
) VALUES 
(
  'Développeur Full-Stack Senior',
  'Tech',
  'Abidjan, Cocody',
  'CDI',
  'Nous recherchons un(e) développeur(se) Full-Stack expérimenté(e) pour renforcer notre équipe technique et contribuer au développement de notre plateforme innovante.',
  ARRAY[
    'Développer de nouvelles fonctionnalités front-end et back-end',
    'Optimiser les performances de l''application',
    'Participer aux revues de code et au mentorat des juniors',
    'Collaborer avec l''équipe produit pour définir les spécifications',
    'Maintenir et améliorer le code existant'
  ],
  ARRAY[
    'Minimum 5 ans d''expérience en développement web',
    'Expérience confirmée avec React et Node.js',
    'Maîtrise de PostgreSQL et des bases de données relationnelles',
    'Connaissance des pratiques DevOps (CI/CD, Docker)',
    'Excellentes capacités de communication'
  ],
  ARRAY['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Git', 'Docker'],
  '1 200 000 - 1 800 000 FCFA/mois',
  true,
  NOW()
),
(
  'Designer UI/UX',
  'Design',
  'Abidjan, Cocody',
  'CDI',
  'Rejoins notre équipe pour créer des expériences utilisateur exceptionnelles sur notre plateforme web et mobile.',
  ARRAY[
    'Concevoir des interfaces intuitives et esthétiques',
    'Réaliser des études UX et tests utilisateurs',
    'Créer des prototypes interactifs',
    'Maintenir et faire évoluer notre design system',
    'Collaborer étroitement avec les développeurs'
  ],
  ARRAY[
    'Minimum 3 ans d''expérience en design UI/UX',
    'Portfolio démontrant votre expertise',
    'Maîtrise de Figma et Adobe Creative Suite',
    'Connaissance des principes d''accessibilité',
    'Sensibilité mobile-first'
  ],
  ARRAY['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Design System'],
  '800 000 - 1 200 000 FCFA/mois',
  true,
  NOW()
),
(
  'Chargé(e) de Relation Client',
  'Support',
  'Abidjan, Cocody',
  'CDI',
  'Assure le support et la satisfaction de nos utilisateurs en étant leur premier point de contact.',
  ARRAY[
    'Répondre aux questions des utilisateurs par email, téléphone et chat',
    'Résoudre les problèmes techniques de premier niveau',
    'Identifier et remonter les bugs à l''équipe technique',
    'Contribuer à l''amélioration de la base de connaissances',
    'Suivre les indicateurs de satisfaction client'
  ],
  ARRAY[
    'Première expérience en service client ou support (1-2 ans)',
    'Excellentes capacités de communication en français',
    'Empathie et patience',
    'Bonne maîtrise des outils informatiques',
    'Capacité à travailler en équipe'
  ],
  ARRAY['Relation client', 'Communication', 'Résolution de problèmes', 'Empathie', 'Zendesk'],
  '400 000 - 600 000 FCFA/mois',
  true,
  NOW()
),
(
  'Data Analyst - Stage',
  'Data',
  'Abidjan, Cocody / Remote',
  'Stage',
  'Rejoins notre équipe data pour analyser les performances de la plateforme et contribuer à son optimisation.',
  ARRAY[
    'Analyser les données d''utilisation de la plateforme',
    'Créer des dashboards et rapports',
    'Identifier les tendances et insights',
    'Proposer des recommandations data-driven',
    'Automatiser les reporting réguliers'
  ],
  ARRAY[
    'Formation en cours ou récemment diplômé (Data, Statistiques, Informatique)',
    'Bonnes bases en SQL et Python',
    'Connaissance d''Excel avancé',
    'Curiosité et rigueur analytique',
    'Bonus: connaissance de Power BI ou Tableau'
  ],
  ARRAY['Python', 'SQL', 'Excel', 'Data Visualization', 'Statistics', 'Power BI'],
  '200 000 - 300 000 FCFA/mois',
  true,
  NOW()
);

-- ================================================
-- VÉRIFICATION
-- ================================================

SELECT 
  '✅ Tables créées' AS status,
  COUNT(*) FILTER (WHERE is_published = true) AS offres_publiees,
  COUNT(*) AS total_offres
FROM job_offers;
