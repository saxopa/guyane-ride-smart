
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Car, Clock, Star, Navigation, CreditCard, History, User, MessageCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('standard');
  const [rideStatus, setRideStatus] = useState<'idle' | 'searching' | 'matched' | 'ongoing'>('idle');

  const vehicleTypes = [
    { id: 'standard', name: 'Standard', price: '3-8€', time: '2-5 min', icon: Car },
    { id: 'family', name: 'Familial', price: '5-12€', time: '3-7 min', icon: Car },
    { id: 'luxury', name: 'Luxe', price: '8-20€', time: '5-10 min', icon: Car }
  ];

  const recentRides = [
    { id: 1, from: 'Centre-ville Cayenne', to: 'Aéroport Félix Eboué', date: '23 Nov', price: '15€', rating: 5 },
    { id: 2, from: 'Rémire-Montjoly', to: 'Cayenne', date: '22 Nov', price: '12€', rating: 5 },
    { id: 3, from: 'Matoury', to: 'Kourou', date: '21 Nov', price: '25€', rating: 4 }
  ];

  const handleBookRide = () => {
    setRideStatus('searching');
    // Simulation de recherche de conducteur
    setTimeout(() => {
      setRideStatus('matched');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tropical-50 via-white to-ocean-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-tropical-gradient rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bonjour, Jean !</h1>
                <p className="text-sm text-gray-600">Où souhaitez-vous aller ?</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section principale - Réservation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte simulée */}
            <Card className="border-none shadow-xl">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-tropical-100 to-ocean-100 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-700">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">Carte interactive</p>
                      <p className="text-sm">Géolocalisation en temps réel</p>
                    </div>
                  </div>
                  {/* Points de départ et arrivée simulés */}
                  <div className="absolute top-4 left-4 bg-tropical-500 w-4 h-4 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 bg-ocean-500 w-4 h-4 rounded-full"></div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Champs de saisie */}
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-tropical-600" />
                      <Input 
                        placeholder="Point de départ (géolocalisation automatique)"
                        className="pl-10"
                        defaultValue="123 Rue de la République, Cayenne"
                      />
                    </div>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-ocean-600" />
                      <Input 
                        placeholder="Où souhaitez-vous aller ?"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sélection du véhicule */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Choisir un véhicule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {vehicleTypes.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedVehicle === vehicle.id
                              ? 'border-tropical-500 bg-tropical-50'
                              : 'border-gray-200 hover:border-tropical-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <vehicle.icon className="w-6 h-6 text-gray-700" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{vehicle.name}</p>
                              <p className="text-sm text-gray-600">{vehicle.time}</p>
                            </div>
                            <p className="font-semibold text-gray-900">{vehicle.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bouton de réservation */}
                  {rideStatus === 'idle' && (
                    <Button 
                      onClick={handleBookRide}
                      className="w-full bg-tropical-gradient hover:opacity-90 text-lg font-semibold py-6"
                    >
                      <Car className="w-5 h-5 mr-2" />
                      Réserver maintenant
                    </Button>
                  )}

                  {rideStatus === 'searching' && (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-tropical-100 rounded-full mb-4">
                        <div className="w-8 h-8 border-4 border-tropical-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="font-semibold text-gray-900">Recherche d'un conducteur...</p>
                      <p className="text-sm text-gray-600">Temps d'attente estimé : 2-5 minutes</p>
                    </div>
                  )}

                  {rideStatus === 'matched' && (
                    <div className="bg-tropical-50 rounded-lg p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-tropical-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Marc Dubois</p>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.9 • Peugeot 308 • AB-123-CD</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Arrivée dans</p>
                          <p className="font-bold text-tropical-600">3 min</p>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" className="flex-1">
                          📞 Appeler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profil rapide */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Votre profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-tropical-gradient rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jean Dupont</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8 • 47 courses</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Paiements
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <User className="w-4 h-4 mr-1" />
                    Profil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Courses récentes */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Courses récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentRides.map((ride) => (
                  <div key={ride.id} className="border-l-4 border-tropical-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{ride.from}</p>
                        <p className="text-gray-600 text-sm">→ {ride.to}</p>
                        <p className="text-xs text-gray-500">{ride.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{ride.price}</p>
                        <div className="flex items-center">
                          {[...Array(ride.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-3">
                  Voir tout l'historique
                </Button>
              </CardContent>
            </Card>

            {/* Support IA */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-sunset-50 to-sunset-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-sunset-600" />
                  Assistant Lovable
                </CardTitle>
                <CardDescription>
                  Besoin d'aide ? Notre IA est là pour vous !
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-sunset-gradient hover:opacity-90">
                  💬 Ouvrir le chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
