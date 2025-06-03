
import { useState } from 'react';

interface RoutePoint {
  lat: number;
  lng: number;
}

interface RouteResult {
  distance: number; // en kilomètres
  duration: number; // en minutes
  coordinates: [number, number][];
  price: number; // prix estimé en euros
}

export const useRouting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async (
    pickup: RoutePoint,
    destination: RoutePoint,
    vehicleType: 'standard' | 'familiale' | 'luxe' = 'standard'
  ): Promise<RouteResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Utilisation de l'API OSRM (gratuite et open source)
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error('Erreur lors du calcul de l\'itinéraire');
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distance = route.distance / 1000; // conversion en km
        const duration = route.duration / 60; // conversion en minutes
        
        // Calcul du prix basé sur la distance et le type de véhicule
        const basePrice = 2.5; // prix de base en euros
        const pricePerKm = vehicleType === 'luxe' ? 1.8 : vehicleType === 'familiale' ? 1.5 : 1.2;
        const price = Math.max(basePrice + (distance * pricePerKm), 5); // prix minimum 5€
        
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] // inversion lat/lng
        );

        return {
          distance: Math.round(distance * 100) / 100,
          duration: Math.round(duration),
          coordinates,
          price: Math.round(price * 100) / 100
        };
      }
      
      throw new Error('Aucun itinéraire trouvé');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur calcul itinéraire:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async (address: string): Promise<RoutePoint | null> => {
    try {
      // Suppression de la géorestriction pour permettre les tests partout
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=fr`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur géocodage:', error);
      return null;
    }
  };

  return {
    calculateRoute,
    geocodeAddress,
    loading,
    error
  };
};
