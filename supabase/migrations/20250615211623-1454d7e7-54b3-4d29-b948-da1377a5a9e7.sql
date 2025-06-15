
-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS rides CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Supprimer les types existants si ils existent
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS vehicle_type CASCADE;
DROP TYPE IF EXISTS ride_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS driver_status CASCADE;

-- Créer les types énumérés
CREATE TYPE user_role AS ENUM ('rider', 'driver', 'admin');
CREATE TYPE vehicle_type AS ENUM ('standard', 'familiale', 'luxe');
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE driver_status AS ENUM ('offline', 'available', 'busy');

-- Créer la table des profils utilisateurs
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'rider',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créer la table des conducteurs
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  license_number TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_color TEXT,
  vehicle_plate TEXT,
  vehicle_type vehicle_type NOT NULL DEFAULT 'standard',
  status driver_status NOT NULL DEFAULT 'offline',
  current_latitude NUMERIC(10,8),
  current_longitude NUMERIC(11,8),
  rating NUMERIC(3,2) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créer la table des courses
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES profiles(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_address TEXT NOT NULL,
  pickup_latitude NUMERIC(10,8) NOT NULL,
  pickup_longitude NUMERIC(11,8) NOT NULL,
  destination_address TEXT NOT NULL,
  destination_latitude NUMERIC(10,8) NOT NULL,
  destination_longitude NUMERIC(11,8) NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  status ride_status NOT NULL DEFAULT 'requested',
  estimated_price NUMERIC(10,2),
  final_price NUMERIC(10,2),
  estimated_duration INTEGER,
  actual_duration INTEGER,
  distance NUMERIC(8,2),
  rider_rating INTEGER CHECK (rider_rating >= 1 AND rider_rating <= 5),
  driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
  rider_comment TEXT,
  driver_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Créer la table des paiements
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créer la table des tickets de support
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  ride_id UUID REFERENCES rides(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créer la table des notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Créer les index pour les performances
CREATE INDEX idx_rides_rider ON rides(rider_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_location ON drivers(current_latitude, current_longitude);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_at);

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les profils
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Politiques RLS pour les conducteurs
CREATE POLICY "Drivers can view own profile"
  ON drivers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Drivers can update own profile"
  ON drivers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view available drivers"
  ON drivers FOR SELECT
  USING (status = 'available');

-- Politiques RLS pour les courses
CREATE POLICY "Riders can view own rides"
  ON rides FOR SELECT
  USING (rider_id = auth.uid());

CREATE POLICY "Drivers can view own rides"
  ON rides FOR SELECT
  USING (driver_id = auth.uid());

CREATE POLICY "Drivers can view available rides"
  ON rides FOR SELECT
  USING (
    status = 'requested' AND
    driver_id IS NULL AND
    EXISTS (
      SELECT 1 FROM drivers
      WHERE id = auth.uid() AND status = 'available'
    )
  );

CREATE POLICY "Riders can create rides"
  ON rides FOR INSERT
  WITH CHECK (rider_id = auth.uid());

CREATE POLICY "Users can update own rides"
  ON rides FOR UPDATE
  USING (rider_id = auth.uid() OR driver_id = auth.uid());

-- Politiques RLS pour les paiements
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rides
      WHERE rides.id = ride_id
      AND (rides.rider_id = auth.uid() OR rides.driver_id = auth.uid())
    )
  );

-- Politiques RLS pour les tickets de support
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Politiques RLS pour les notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction trigger pour créer automatiquement les profils
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'rider')
  );
  RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement les profils
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
