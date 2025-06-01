
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Car, MapPin, Clock, Star, Euro, Navigation, User, MessageCircle, BarChart3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);

  const todayStats = {
    rides: 8,
    earnings: 156,
    hours: 6.5,
    rating: 4.9
  };

  const pendingRides = [
    { id: 1, from: 'Centre-ville Cayenne', to: 'Aéroport Félix Eboué', distance: '12 km', fare: '15€', passenger: 'Marie L.' },
    { id: 2, from: 'Rémire-Montjoly', to: 'Cayenne', distance: '8 km', fare: '12€', passenger: 'Jean D.' }
  ];

  const recentRides = [
    { id: 1, from: 'Matoury', to: 'Kourou', completed: '14:30', fare: '25€', rating: 5 },
    { id: 2, from: 'Cayenne', to: 'Rémire-Montjoly', completed: '13:15', fare: '12€', rating: 5 },
    { id: 3, from: 'Centre-ville', to: 'Aéroport', completed: '11:45', fare: '15€', rating: 4 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-tropical-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-ocean-gradient rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Espace Conducteur</h1>
                <p className="text-sm text-gray-600">Marc Dubois • Peugeot 308</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Hors ligne</span>
                <Switch 
                  checked={isOnline} 
                  onCheckedChange={setIsOnline}
                  className="data-[state=checked]:bg-tropical-500"
                />
                <span className="text-sm text-gray-600">En ligne</span>
              </div>
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
          {/* Section principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut en ligne */}
            <Card className={`border-none shadow-xl ${isOnline ? 'bg-tropical-50' : 'bg-gray-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-tropical-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {isOnline ? 'Vous êtes en ligne' : 'Vous êtes hors ligne'}
                      </h3>
                      <p className="text-gray-600">
                        {isOnline ? 'Prêt à recevoir des demandes de course' : 'Activez pour recevoir des courses'}
                      </p>
                    </div>
                  </div>
                  {isOnline && (
                    <Badge className="bg-tropical-500 text-white">
                      Actif
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Carte simulée */}
            <Card className="border-none shadow-xl">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-ocean-100 to-tropical-100 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-700">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">Votre position</p>
                      <p className="text-sm">Cayenne, Guyane française</p>
                    </div>
                  </div>
                  {/* Votre position */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-ocean-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                  </div>
                  {/* Points de demande simulés */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-sunset-500 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-6 left-6 w-3 h-3 bg-tropical-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Zone d'activité</h3>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Centrer
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {isOnline ? 'Recherche de passagers à proximité...' : 'Passez en ligne pour voir les demandes'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Demandes de course */}
            {isOnline && (
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                    <Car className="w-5 h-5 mr-2 text-ocean-600" />
                    Demandes de course
                  </CardTitle>
                  <CardDescription>
                    Nouvelles demandes dans votre zone
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingRides.map((ride) => (
                    <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:border-ocean-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-ocean-600" />
                            </div>
                            <span className="font-medium text-gray-900">{ride.passenger}</span>
                            <Badge variant="outline">{ride.distance}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{ride.from}</p>
                          <p className="text-sm text-gray-600">→ {ride.to}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-2xl font-bold text-ocean-600">{ride.fare}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Refuser
                            </Button>
                            <Button size="sm" className="bg-ocean-gradient hover:opacity-90">
                              Accepter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingRides.length === 0 && (
                    <div className="text-center py-8">
                      <Car className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Aucune demande en ce moment</p>
                      <p className="text-sm text-gray-500">Restez en ligne pour recevoir des courses</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques du jour */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-tropical-50 rounded-lg">
                    <p className="text-2xl font-bold text-tropical-600">{todayStats.rides}</p>
                    <p className="text-sm text-gray-600">Courses</p>
                  </div>
                  <div className="text-center p-3 bg-ocean-50 rounded-lg">
                    <p className="text-2xl font-bold text-ocean-600">{todayStats.earnings}€</p>
                    <p className="text-sm text-gray-600">Revenus</p>
                  </div>
                  <div className="text-center p-3 bg-sunset-50 rounded-lg">
                    <p className="text-2xl font-bold text-sunset-600">{todayStats.hours}h</p>
                    <p className="text-sm text-gray-600">En ligne</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{todayStats.rating}</p>
                    <p className="text-sm text-gray-600">Note</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir les stats complètes
                </Button>
              </CardContent>
            </Card>

            {/* Profil conducteur */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Votre profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-ocean-gradient rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Marc Dubois</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.9 • 324 courses</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Véhicule:</span>
                    <span className="text-sm font-medium">Peugeot 308</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plaque:</span>
                    <span className="text-sm font-medium">AB-123-CD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Statut:</span>
                    <Badge className="bg-tropical-500 text-white">Vérifié</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>

            {/* Courses récentes */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Courses récentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentRides.map((ride) => (
                  <div key={ride.id} className="border-l-4 border-ocean-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{ride.from}</p>
                        <p className="text-gray-600 text-sm">→ {ride.to}</p>
                        <p className="text-xs text-gray-500">{ride.completed}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{ride.fare}</p>
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
                  Questions techniques ? Notre IA vous aide !
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-sunset-gradient hover:opacity-90">
                  💬 Support technique
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
