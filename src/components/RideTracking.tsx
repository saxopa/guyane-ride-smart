
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, MessageCircle, Star, Navigation } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Map from './Map';

interface Driver {
  first_name: string;
  last_name: string;
  phone: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_plate: string;
  rating: number;
}

interface Ride {
  id: string;
  pickup_address: string;
  destination_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  status: string;
  estimated_price: number;
  distance: number;
  estimated_duration: number;
  driver?: Driver;
}

const RideTracking = () => {
  const { user } = useAuth();
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCurrentRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:drivers(
            vehicle_make,
            vehicle_model,
            vehicle_plate,
            rating,
            profiles!drivers_id_fkey(
              first_name,
              last_name,
              phone
            )
          )
        `)
        .eq('rider_id', user.id)
        .in('status', ['requested', 'accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        // Restructurer les données pour correspondre à l'interface Driver
        const rideData = {
          ...data,
          driver: data.driver ? {
            first_name: data.driver.profiles?.first_name || '',
            last_name: data.driver.profiles?.last_name || '',
            phone: data.driver.profiles?.phone || '',
            vehicle_make: data.driver.vehicle_make || '',
            vehicle_model: data.driver.vehicle_model || '',
            vehicle_plate: data.driver.vehicle_plate || '',
            rating: data.driver.rating || 5
          } : undefined
        };
        setCurrentRide(rideData);
      }
      setLoading(false);
    };

    fetchCurrentRide();

    // Écouter les mises à jour en temps réel
    const subscription = supabase
      .channel('ride_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rides', filter: `rider_id=eq.${user.id}` },
        (payload) => {
          if (payload.new && ['requested', 'accepted', 'in_progress'].includes((payload.new as any).status)) {
            fetchCurrentRide();
          } else if (payload.eventType === 'UPDATE' && (payload.new as any).status === 'completed') {
            setCurrentRide(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested': return 'Recherche de conducteur...';
      case 'accepted': return 'Conducteur en route';
      case 'in_progress': return 'Course en cours';
      default: return status;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  if (!currentRide) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune course en cours
          </h3>
          <p className="text-gray-600">
            Réservez une nouvelle course pour commencer
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut de la course */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course en cours</CardTitle>
            <Badge className={getStatusColor(currentRide.status)}>
              {getStatusText(currentRide.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Départ</p>
                <p className="text-sm text-gray-600">{currentRide.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-sm text-gray-600">{currentRide.destination_address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-medium">{currentRide.distance} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Durée</p>
              <p className="font-medium">{currentRide.estimated_duration} min</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Prix</p>
              <p className="font-medium">{currentRide.estimated_price} €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations conducteur */}
      {currentRide.driver && (
        <Card>
          <CardHeader>
            <CardTitle>Votre conducteur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">
                  {currentRide.driver.first_name} {currentRide.driver.last_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentRide.driver.vehicle_make} {currentRide.driver.vehicle_model}
                </p>
                <p className="text-sm text-gray-600">
                  Plaque: {currentRide.driver.vehicle_plate}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{currentRide.driver.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Carte de suivi */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi en temps réel</CardTitle>
        </CardHeader>
        <CardContent>
          <Map
            className="h-96"
            pickupLocation={{
              lat: currentRide.pickup_latitude,
              lng: currentRide.pickup_longitude,
              address: currentRide.pickup_address
            }}
            destinationLocation={{
              lat: currentRide.destination_latitude,
              lng: currentRide.destination_longitude,
              address: currentRide.destination_address
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RideTracking;
