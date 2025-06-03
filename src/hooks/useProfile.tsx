
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

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

      // Fetch user profile with improved error handling
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // If profile doesn't exist, create one
        if (profileError.code === 'PGRST116' || profileError.message?.includes('no rows returned')) {
          console.log('Profile not found, creating default profile...');
          const { data: newProfileData, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              role: 'rider'
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            toast({
              title: "Erreur",
              description: "Impossible de créer le profil utilisateur",
              variant: "destructive",
            });
          } else {
            console.log('Profile created:', newProfileData);
            setProfile(newProfileData);
          }
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de récupérer le profil utilisateur",
            variant: "destructive",
          });
        }
      } else if (profileData) {
        console.log('Profile data fetched:', profileData);
        setProfile(profileData);

        // If user is a driver, fetch driver profile
        if (profileData.role === 'driver') {
          console.log('User is a driver, fetching driver profile...');
          const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (driverError) {
            console.error('Error fetching driver profile:', driverError);
            // If driver profile doesn't exist, create one with default values
            if (driverError.code === 'PGRST116' || driverError.message?.includes('no rows returned')) {
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
                toast({
                  title: "Erreur",
                  description: "Impossible de créer le profil conducteur",
                  variant: "destructive",
                });
              } else {
                console.log('Driver profile created:', newDriverData);
                setDriverProfile(newDriverData);
              }
            }
          } else if (driverData) {
            console.log('Driver profile fetched:', driverData);
            setDriverProfile(driverData);
          }
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

      // Update local state
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
