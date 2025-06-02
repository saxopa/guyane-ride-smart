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
  const [acceptedRide, setAcceptedRide] = useState<RideRequest | null>(null);

  // Récupérer les demandes de course disponibles
  const fetchRideRequests = async () => {
    try {
      setLoading(true);
      const { data: rides, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'requested')
        .is('driver_id', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      let filteredRides = rides || [];
      if (driverLocation && driverLocation.lat && driverLocation.lng) {
        const R = 6371;
        filteredRides = filteredRides.filter(ride => {
          const dLat = (ride.pickup_latitude - driverLocation.lat) * Math.PI / 180;
          const dLon = (ride.pickup_longitude - driverLocation.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(driverLocation.lat * Math.PI / 180) * Math.cos(ride.pickup_latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c <= 15;
        });
      }
      setRequests(filteredRides);
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible de charger les demandes de course", variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la course acceptée par le conducteur
  const fetchAcceptedRide = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .maybeSingle();
      if (error) throw error;
      setAcceptedRide(data || null);
    } catch (error) {
      setAcceptedRide(null);
    } finally {
      setLoading(false);
    }
  };

  // Accepter une course
  const acceptRide = async (rideId: string) => {
    if (!user) return;
    setAcceptingRide(rideId);
    try {
      const { error } = await supabase
        .from('rides')
        .update({ driver_id: user.id, status: 'accepted' })
        .eq('id', rideId)
        .eq('status', 'requested');
      if (error) throw error;
      toast({ title: 'Course acceptée', description: 'Vous avez accepté la course avec succès' });
      await fetchAcceptedRide();
      await fetchRideRequests();
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible d'accepter la course", variant: 'destructive' });
    } finally {
      setAcceptingRide(null);
    }
  };

  // Refuser une course (juste côté UI)
  const declineRide = (rideId: string) => {
    setRequests(prev => prev.filter(req => req.id !== rideId));
    toast({ title: 'Course refusée', description: 'La course a été retirée de votre liste' });
  };

  // Initial fetch au montage
  useEffect(() => {
    fetchRideRequests();
    fetchAcceptedRide();
    // Pas de polling automatique
  }, [user, driverLocation]);

  return {
    requests,
    loading,
    acceptingRide,
    acceptRide,
    declineRide,
    refetch: fetchRideRequests,
    acceptedRide,
    refetchAccepted: fetchAcceptedRide
  };
};
