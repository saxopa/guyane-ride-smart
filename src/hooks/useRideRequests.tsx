
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
  estimated_price: number | null;
  estimated_duration: number | null;
  distance: number | null;
  vehicle_type: string;
  rider_comment: string | null;
  created_at: string;
  rider_id: string;
}

export const useRideRequests = () => {
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
      console.log('Fetching ride requests...');
      
      const { data: rides, error } = await supabase
        .from('rides')
        .select('*')
        .is('driver_id', null)
        .eq('status', 'requested')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rides:', error);
        throw error;
      }

      console.log('Fetched rides:', rides);
      setRequests(rides || []);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la course acceptée par le conducteur
  const fetchAcceptedRide = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching accepted ride for driver:', user.id);
      
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching accepted ride:', error);
        throw error;
      }
      
      console.log('Accepted ride:', data);
      setAcceptedRide(data || null);
    } catch (error) {
      console.error('Error in fetchAcceptedRide:', error);
      setAcceptedRide(null);
    } finally {
      setLoading(false);
    }
  };

  // Accepter une course
  const acceptRide = async (rideId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour accepter une course",
        variant: "destructive",
      });
      return;
    }
    
    setAcceptingRide(rideId);
    
    try {
      console.log('Accepting ride:', rideId, 'for driver:', user.id);
      
      const { data, error } = await supabase
        .from('rides')
        .update({ 
          driver_id: user.id, 
          status: 'accepted' 
        })
        .eq('id', rideId)
        .eq('status', 'requested')
        .select()
        .single();

      if (error) {
        console.error('Error accepting ride:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Course déjà acceptée par un autre conducteur');
      }

      console.log('Ride accepted successfully:', data);
      
      toast({
        title: "Course acceptée",
        description: "Vous avez accepté la course avec succès",
      });
      
      // Refetch data
      await Promise.all([
        fetchAcceptedRide(),
        fetchRideRequests()
      ]);
      
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'accepter la course",
        variant: "destructive",
      });
    } finally {
      setAcceptingRide(null);
    }
  };

  // Refuser une course (juste côté UI)
  const declineRide = (rideId: string) => {
    setRequests(prev => prev.filter(req => req.id !== rideId));
    toast({ 
      title: 'Course refusée', 
      description: 'La course a été retirée de votre liste' 
    });
  };

  // Initial fetch au montage
  useEffect(() => {
    if (user) {
      fetchRideRequests();
      fetchAcceptedRide();
    }
  }, [user]);

  // Écouter les nouvelles demandes en temps réel
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for ride requests');
    
    const subscription = supabase
      .channel('ride_requests')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'rides',
          filter: 'status=eq.requested'
        },
        (payload) => {
          console.log('New ride request received:', payload);
          fetchRideRequests();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'rides'
        },
        (payload) => {
          console.log('Ride updated:', payload);
          fetchRideRequests();
          fetchAcceptedRide();
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from ride requests');
      subscription.unsubscribe();
    };
  }, [user]);

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
