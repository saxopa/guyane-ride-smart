import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RideRequest {
  id: string;
  pickup_address: string;
  destination_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  estimated_price: number;
  estimated_duration: number;
  distance: number;
  vehicle_type: string;
  rider_comment?: string;
  created_at: string;
  rider_id: string;
}

export const useRideRequests = (driverLocation?: { lat: number; lng: number }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingRide, setAcceptingRide] = useState<string | null>(null);
  // État pour suivre la course active du conducteur
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);

  // Fonction pour calculer la distance entre deux points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fonction pour récupérer les demandes de course
  const fetchRideRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching ride requests...');

      const { data: rides, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'requested') // Uniquement les courses en attente de conducteur
        .is('driver_id', null) // Sans conducteur assigné
        .order('created_at', { ascending: false });

      // DEBUG : Affiche le user connecté
      console.log('DEBUG user:', user);
      // DEBUG : Affiche toutes les courses récupérées
      console.log('DEBUG rides from supabase (no filter):', rides);
      if (rides && rides.length > 0) {
        rides.forEach((ride, idx) => {
          console.log(`DEBUG ride[${idx}]`, ride);
        });
      }
      if (error) {
        console.error('Error fetching ride requests:', error);
        throw error;
      }
      console.log('Ride requests fetched:', rides);

      // Correction : n'appliquer le filtre distance QUE si driverLocation est défini ET valide
      let filteredRides = rides || [];
      if (driverLocation && driverLocation.lat && driverLocation.lng) {
        const maxDistance = 15; // Distance maximale en km
        filteredRides = (rides || []).filter(ride => {
          const distance = calculateDistance(
            driverLocation.lat,
            driverLocation.lng,
            ride.pickup_latitude,
            ride.pickup_longitude
          );
          return distance <= maxDistance;
        });
        console.log(`Filtered ${filteredRides.length} rides within ${maxDistance}km`);
      }
      setRequests(filteredRides);
    } catch (error) {
      console.error('Error in fetchRideRequests:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Accepter une course
  const acceptRide = async (rideId: string) => {
    if (!user) return;

    try {
      setAcceptingRide(rideId);
      console.log('Accepting ride:', rideId);

      const { error } = await supabase
        .from('rides')
        .update({ 
          driver_id: user.id,
          status: 'accepted'
        })
        .eq('id', rideId)
        .eq('status', 'requested'); // S'assurer que la course est toujours disponible

      if (error) {
        throw error;
      }

      // Mettre à jour le statut du conducteur à "busy"
      const { error: driverError } = await supabase
        .from('drivers')
        .update({ status: 'busy' })
        .eq('id', user.id);

      if (driverError) {
        console.error('Error updating driver status:', driverError);
      }

      toast({
        title: "Course acceptée",
        description: "Vous avez accepté la course avec succès",
      });

      // Retirer la demande de la liste
      setRequests(prev => prev.filter(req => req.id !== rideId));

    } catch (error) {
      console.error('Error accepting ride:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la course",
        variant: "destructive"
      });
    } finally {
      setAcceptingRide(null);
    }
  };

  // Refuser une course (la retire juste de la liste pour ce conducteur)
  const declineRide = (rideId: string) => {
    setRequests(prev => prev.filter(req => req.id !== rideId));
    toast({
      title: "Course refusée",
      description: "La course a été retirée de votre liste",
    });
  };

  // Fonction pour récupérer la course active
  const fetchActiveRide = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', user.id)
      .in('status', ['accepted', 'in_progress'])
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (!error && data) {
      setActiveRide(data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActiveRide();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Écoute en temps réel (optionnel, peut être supprimée si on veut strictement du manuel)
    const subscription = supabase
      .channel('ride_requests_driver')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'rides', filter: 'status=eq.requested' },
        (payload) => {
          // Optionnel : notification visuelle
          // fetchRideRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, driverLocation]);

  return {
    requests,
    loading,
    acceptingRide,
    activeRide,
    acceptRide,
    declineRide,
    refetch: fetchRideRequests
  };
};
