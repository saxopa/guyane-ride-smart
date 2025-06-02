
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Navigation, Star } from 'lucide-react';

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
}

interface RideRequestCardProps {
  request: RideRequest;
  driverLocation?: { lat: number; lng: number };
  onAccept: (rideId: string) => void;
  onDecline: (rideId: string) => void;
  isLoading?: boolean;
}

const RideRequestCard: React.FC<RideRequestCardProps> = ({
  request,
  driverLocation,
  onAccept,
  onDecline,
  isLoading = false
}) => {
  // Calculer la distance entre le conducteur et le point de départ
  const calculateDistance = () => {
    if (!driverLocation) return null;
    
    const R = 6371; // Rayon de la Terre en km
    const dLat = (request.pickup_latitude - driverLocation.lat) * Math.PI / 180;
    const dLon = (request.pickup_longitude - driverLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(driverLocation.lat * Math.PI / 180) * Math.cos(request.pickup_latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  };

  const distanceToPickup = calculateDistance();
  const timeAgo = new Date(Date.now() - new Date(request.created_at).getTime()).getMinutes();

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Standard';
      case 'familiale': return 'Familiale';
      case 'luxe': return 'Luxe';
      default: return type;
    }
  };

  const getVehicleTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'familiale': return 'bg-green-100 text-green-800';
      case 'luxe': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-l-4 border-l-tropical-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getVehicleTypeColor(request.vehicle_type)}>
              {getVehicleTypeLabel(request.vehicle_type)}
            </Badge>
            {distanceToPickup && (
              <Badge variant="outline" className="text-xs">
                <Navigation className="w-3 h-3 mr-1" />
                {distanceToPickup.toFixed(1)} km
              </Badge>
            )}
            <Badge variant="outline" className="text-xs text-gray-500">
              {timeAgo}min
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {request.estimated_price} €
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {request.estimated_duration}min
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Itinéraire */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Départ</p>
                <p className="text-xs text-gray-600">{request.pickup_address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Destination</p>
                <p className="text-xs text-gray-600">{request.destination_address}</p>
              </div>
            </div>
          </div>

          {/* Informations sur la course */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {request.distance.toFixed(1)} km
            </span>
            <span className="flex items-center">
              <Euro className="w-3 h-3 mr-1" />
              ~{(request.estimated_price / request.distance).toFixed(2)} €/km
            </span>
          </div>

          {/* Commentaire du client */}
          {request.rider_comment && (
            <div className="bg-gray-50 p-2 rounded text-xs">
              <p className="font-medium text-gray-700">Note du client :</p>
              <p className="text-gray-600">{request.rider_comment}</p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDecline(request.id)}
              disabled={isLoading}
              className="flex-1"
            >
              Refuser
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept(request.id)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Acceptation...' : 'Accepter'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideRequestCard;
