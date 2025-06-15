
-- Supprimer les anciennes politiques pour les conducteurs
DROP POLICY IF EXISTS "Drivers can view own profile" ON drivers;
DROP POLICY IF EXISTS "Drivers can update own profile" ON drivers;
DROP POLICY IF EXISTS "Anyone can view available drivers" ON drivers;

-- Créer de nouvelles politiques pour les conducteurs
CREATE POLICY "Drivers can view own profile"
  ON drivers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Drivers can update own profile"
  ON drivers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Drivers can insert own profile"
  ON drivers FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view available drivers"
  ON drivers FOR SELECT
  USING (status = 'available');
