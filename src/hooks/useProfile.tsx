
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Profile {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: 'rider' | 'driver' | 'admin';
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface DriverProfile {
  id: string;
  license_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_color: string;
  vehicle_plate: string;
  vehicle_type: 'standard' | 'familiale' | 'luxe';
  status: 'offline' | 'available' | 'busy';
  current_latitude: number;
  current_longitude: number;
  rating: number;
  total_rides: number;
  is_verified: boolean;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setDriverProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // If user is a driver, fetch driver profile
      if (profileData?.role === 'driver') {
        const { data: driverData, error: driverError } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!driverError) {
          setDriverProfile(driverData);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDriverStatus = async (status: 'offline' | 'available' | 'busy') => {
    if (!user || !driverProfile) return { error: 'No driver profile found' };

    const { error } = await supabase
      .from('drivers')
      .update({ status })
      .eq('id', user.id);

    if (!error) {
      setDriverProfile({ ...driverProfile, status });
    }

    return { error };
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    if (!user || !driverProfile) return { error: 'No driver profile found' };

    const { error } = await supabase
      .from('drivers')
      .update({ 
        current_latitude: latitude, 
        current_longitude: longitude 
      })
      .eq('id', user.id);

    if (!error) {
      setDriverProfile({ 
        ...driverProfile, 
        current_latitude: latitude, 
        current_longitude: longitude 
      });
    }

    return { error };
  };

  return {
    profile,
    driverProfile,
    loading,
    updateDriverStatus,
    updateLocation,
    refetch: fetchProfile,
  };
};
