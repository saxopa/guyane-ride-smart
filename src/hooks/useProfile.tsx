
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
      console.log('Fetching profile for user:', user.id);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      console.log('Profile data fetched:', profileData);
      setProfile(profileData);

      // If user is a driver, fetch driver profile
      if (profileData?.role === 'driver') {
        console.log('User is a driver, fetching driver profile...');
        const { data: driverData, error: driverError } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (driverError) {
          console.error('Error fetching driver profile:', driverError);
          // If driver profile doesn't exist, create one with default values
          if (driverError.code === 'PGRST116') {
            console.log('Driver profile not found, creating default profile...');
            const { data: newDriverData, error: createError } = await supabase
              .from('drivers')
              .insert({
                id: user.id,
                license_number: '',
                vehicle_make: '',
                vehicle_model: '',
                vehicle_year: new Date().getFullYear(),
                vehicle_color: '',
                vehicle_plate: '',
                vehicle_type: 'standard',
                status: 'offline',
                rating: 5.0,
                total_rides: 0,
                is_verified: false
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating driver profile:', createError);
            } else {
              console.log('Driver profile created:', newDriverData);
              setDriverProfile(newDriverData);
            }
          }
        } else {
          console.log('Driver profile fetched:', driverData);
          setDriverProfile(driverData);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
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
