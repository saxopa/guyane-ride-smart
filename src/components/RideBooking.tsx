
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Car, Clock, Euro } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Map from './Map';
import { useRouting } from '@/hooks/useRouting';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const vehicleTypes = [
  { 
    id: 'standard', 
    name: 'Standard', 
    icon: '🚗', 
    description: 'Véhicule 4 places', 
    multiplier: 1 
  },
  { 
    id: 'familiale', 
    name: 'Familiale', 
    icon: '🚙', 
    description: 'Véhicule 7 places', 
    multiplier: 1.25 
  },
  { 
    id: 'luxe', 
    name: 'Luxe', 
    icon: '🚘', 
    description: 'Véhicule haut de gamme', 
    multiplier: 1.5 
  }
];

const RideBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { calculateRoute, geocodeAddress, loading: routeLoading } = useRouting();
  
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('standard');
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const handleAddressSearch = async (address: string, type: 'pickup' | 'destination') => {
    if (!address.trim()) return;
    
    const location = await geocodeAddress(address);
    if (location) {
      const locationData = { ...location, address };
      
      if (type === 'pickup') {
        setPickupLocation(locationData);
      } else {
        setDestinationLocation(locationData);
      }
    } else {
      toast({
        title: "Adresse non trouvée",
        description: "Impossible de localiser cette adresse",
        variant: "destructive"
      });
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number, address: string) => {
    if (!pickupLocation) {
      setPickupLocation({ lat, lng, address });
      setPickupAddress(address);
      toast({
        title: "Point de départ sélectionné",
        description: address
      });
    } else if (!destinationLocation) {
      setDestinationLocation({ lat, lng, address });
      setDestinationAddress(address);
      toast({
        title: "Destination sélectionnée",
        description: address
      });
    }
  };

  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      calculateRoute(pickupLocation, destinationLocation, selectedVehicle as any)
        .then(setRouteInfo);
    }
  }, [pickupLocation, destinationLocation, selectedVehicle]);

  const handleBookRide = async () => {
    if (!user || !pickupLocation || !destinationLocation || !routeInfo) return;

    setIsBooking(true);
    
    try {
      const { data, error } = await supabase
        .from('rides')
        .insert({
          rider_id: user.id,
          pickup_address: pickupLocation.address,
          pickup_latitude: pickupLocation.lat,
          pickup_longitude: pickupLocation.lng,
          destination_address: destinationLocation.address,
          destination_latitude: destinationLocation.lat,
          destination_longitude: destinationLocation.lng,
          vehicle_type: selectedVehicle,
          estimated_price: routeInfo.price,
          estimated_duration: routeInfo.duration,
          distance: routeInfo.distance,
          status: 'requested'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Course demandée !",
        description: "Nous recherchons un conducteur pour vous"
      });

      // Reset form
      setPickupLocation(null);
      setDestinationLocation(null);
      setRouteInfo(null);
      setPickupAddress('');
      setDestinationAddress('');
      
    } catch (error) {
      console.error('Erreur réservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Réserver une course
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup">Point de départ</Label>
              <div className="flex gap-2">
                <Input
                  id="pickup"
                  placeholder="Adresse de départ"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddressSearch(pickupAddress, 'pickup');
                    }
                  }}
                />
                <Button 
                  onClick={() => handleAddressSearch(pickupAddress, 'pickup')}
                  variant="outline"
                  size="icon"
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="flex gap-2">
                <Input
                  id="destination"
                  placeholder="Adresse de destination"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddressSearch(destinationAddress, 'destination');
                    }
                  }}
                />
                <Button 
                  onClick={() => handleAddressSearch(destinationAddress, 'destination')}
                  variant="outline"
                  size="icon"
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Type de véhicule */}
          <div className="space-y-3">
            <Label>Type de véhicule</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {vehicleTypes.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id
                      ? 'border-tropical-500 bg-tropical-50'
                      : 'border-gray-200 hover:border-tropical-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{vehicle.icon}</div>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-gray-500">{vehicle.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informations de l'itinéraire */}
          {routeInfo && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <Navigation className="w-4 h-4" />
                      <span className="font-medium">{routeInfo.distance} km</span>
                    </div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{routeInfo.duration} min</span>
                    </div>
                    <div className="text-sm text-gray-600">Durée</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <Euro className="w-4 h-4" />
                      <span className="font-medium">{routeInfo.price} €</span>
                    </div>
                    <div className="text-sm text-gray-600">Prix estimé</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={handleBookRide}
            disabled={!pickupLocation || !destinationLocation || !routeInfo || isBooking}
            className="w-full bg-tropical-gradient hover:opacity-90"
          >
            {isBooking ? 'Réservation...' : 'Réserver la course'}
          </Button>
        </CardContent>
      </Card>

      {/* Carte */}
      <Card>
        <CardHeader>
          <CardTitle>Carte interactive</CardTitle>
          <p className="text-sm text-gray-600">
            Cliquez sur la carte pour sélectionner vos points de départ et d'arrivée
          </p>
        </CardHeader>
        <CardContent>
          <Map
            className="h-96"
            onLocationSelect={handleMapLocationSelect}
            pickupLocation={pickupLocation}
            destinationLocation={destinationLocation}
            route={routeInfo?.coordinates}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RideBooking;
