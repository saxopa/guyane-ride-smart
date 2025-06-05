
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  role: 'rider' | 'driver' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface DriverProfile {
  id: string;
  license_number: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_color: string | null;
  vehicle_plate: string | null;
  vehicle_type: 'standard' | 'familiale' | 'luxe';
  status: 'offline' | 'available' | 'busy';
  current_latitude: number | null;
  current_longitude: number | null;
  rating: number | null;
  total_rides: number | null;
  is_verified: boolean | null;
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

      // Récupérer le profil utilisateur
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

      // Si l'utilisateur est un conducteur, récupérer le profil conducteur
      if (profileData.role === 'driver') {
        console.log('User is a driver, fetching driver profile...');
        const { data: driverData, error: driverError } = await supabase
          .from('drivers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (driverError) {
          console.error('Error fetching driver profile:', driverError);
          // Ne pas bloquer si le profil conducteur n'existe pas encore
          if (driverError.code !== 'PGRST116') {
            throw driverError;
          }
        } else {
          console.log('Driver profile fetched:', driverData);
          setDriverProfile(driverData);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDriverStatus = async (status: 'offline' | 'available' | 'busy') => {
    if (!user || !driverProfile) {
      console.error('No user or driver profile found for status update');
      return { error: 'No driver profile found' };
    }

    try {
      console.log('Updating driver status to:', status);
      
      const { error } = await supabase
        .from('drivers')
        .update({ status })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating driver status:', error);
        throw error;
      }

      // Mettre à jour l'état local
      setDriverProfile({ ...driverProfile, status });
      
      console.log('Driver status updated successfully to:', status);
      
      toast({
        title: "Statut mis à jour",
        description: `Votre statut est maintenant ${status === 'available' ? 'en ligne' : status === 'offline' ? 'hors ligne' : 'occupé'}`,
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    if (!user || !driverProfile) {
      console.error('No user or driver profile found for location update');
      return { error: 'No driver profile found' };
    }

    try {
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
    } catch (error) {
      console.error('Error updating location:', error);
      return { error };
    }
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
