import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Car, MapPin, Clock, Star, Euro, MessageCircle, Phone, User, LogOut, Navigation, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useRideRequests } from '@/hooks/useRideRequests';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Map from '@/components/Map';
import ChatSystem from '@/components/ChatSystem';
import RideRequestCard from '@/components/RideRequestCard';
import RideTracking from '@/components/RideTracking';
import { useToast } from '@/hooks/use-toast';

const DriverDashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, driverProfile, updateDriverStatus, updateLocation, loading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rides');
  const [isOnline, setIsOnline] = useState(false);
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0 });

  // Récupérer les demandes de course à afficher au conducteur
  const { requests, loading: requestsLoading, acceptRide, declineRide, refetch, acceptedRide, refetchAccepted } = useRideRequests();

  // Courses en cours du conducteur
  const [currentRides, setCurrentRides] = useState([]);
  const [currentRidesLoading, setCurrentRidesLoading] = useState(false);

  // Fonction pour charger les courses en cours
  const fetchCurrentRides = async () => {
    if (!user) return;
    setCurrentRidesLoading(true);
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', user.id)
      .in('status', ['accepted', 'in_progress'])
      .order('created_at', { ascending: false });
    if (!error) setCurrentRides(data || []);
    setCurrentRidesLoading(false);
  };

  useEffect(() => {
    if (driverProfile) {
      setIsOnline(driverProfile.status === 'available');
    }
  }, [driverProfile]);

  useEffect(() => {
    if (!user) return;

    // Écouter les nouvelles demandes de course
    const subscription = supabase
      .channel('ride_requests')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'rides', filter: 'status=eq.requested' },
        (payload) => {
          console.log('Nouvelle demande de course:', payload.new);
          // Notification ou mise à jour de l'interface
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleToggleOnline = async () => {
    if (!driverProfile) {
      toast({
        title: "Configuration nécessaire",
        description: "Votre profil conducteur est en cours de configuration...",
        variant: "destructive"
      });
      return;
    }

    try {
      const newStatus = isOnline ? 'offline' : 'available';
      const { error } = await updateDriverStatus(newStatus);
      
      if (error) {
        throw error;
      }

      if (newStatus === 'available') {
        // Demander la géolocalisation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              await updateLocation(position.coords.latitude, position.coords.longitude);
              setIsOnline(true); // Mettre à jour ici après succès
            },
            (error) => {
              console.error('Erreur géolocalisation:', error);
              toast({
                title: "Erreur de géolocalisation",
                description: "Impossible d'obtenir votre position",
                variant: "destructive"
              });
              setIsOnline(false);
            }
          );
        } else {
          setIsOnline(true);
        }
      } else {
        setIsOnline(false);
      }

      toast({
        title: newStatus === 'available' ? "Vous êtes en ligne" : "Vous êtes hors ligne",
        description: newStatus === 'available' 
          ? "Vous pouvez maintenant recevoir des courses" 
          : "Vous ne recevrez plus de courses",
      });
    } catch (error) {
      console.error('Erreur toggle status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer votre statut",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    if (isOnline && driverProfile) {
      await updateDriverStatus('offline');
    }
    await signOut();
    navigate('/');
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('rides')
      .update({ 
        driver_id: user.id,
        status: 'accepted'
      })
      .eq('id', rideId);

    if (!error) {
      await updateDriverStatus('busy');
    }
  };

  // Show loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-tropical-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tropical-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-tropical-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ocean-gradient rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fasterz Conducteur</h1>
                <p className="text-sm text-gray-600">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={handleToggleOnline}
                  disabled={!driverProfile}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Accueil
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Statut et véhicule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <p className="font-medium">
                    <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {driverProfile ? (isOnline ? 'Disponible' : 'Hors ligne') : 'Configuration...'}
                    </Badge>
                  </p>
                </div>
                <Car className="w-8 h-8 text-ocean-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Note</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{driverProfile?.rating || 5.0}/5</span>
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="font-medium">{driverProfile?.total_rides || 0}</p>
                </div>
                <Navigation className="w-8 h-8 text-ocean-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message si profil en cours de création */}
        {(!driverProfile) ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-center">
                <Car className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2">Configuration du profil conducteur</h3>
                <p className="text-gray-600 mb-4">
                  Votre profil conducteur est en cours de création. Cela peut prendre quelques instants.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Actualiser la page
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Onglets conducteur : PAS d'onglet "Courses" ici */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="current">Courses en cours</TabsTrigger>
            <TabsTrigger value="accepted">Réservation</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
            <TabsTrigger value="earnings">Gains</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Courses en cours</CardTitle>
                <Button onClick={fetchCurrentRides} variant="outline" size="sm" disabled={currentRidesLoading}>
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" style={{ animationPlayState: currentRidesLoading ? 'running' : 'paused' }} /> Rafraîchir
                </Button>
              </CardHeader>
              <CardContent>
                {currentRidesLoading ? (
                  <div className="text-center py-8 text-gray-500">Chargement...</div>
                ) : currentRides.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune course en cours</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentRides.map((ride) => (
                      <RideTracking key={ride.id} mode="driver" ride={ride} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accepted" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course acceptée</CardTitle>
                <Button onClick={refetchAccepted} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" /> Rafraîchir
                </Button>
              </CardHeader>
              <CardContent>
                {acceptedRide ? (
                  <RideTracking mode="driver" ride={acceptedRide} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune course acceptée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votre position</CardTitle>
              </CardHeader>
              <CardContent>
                <Map className="h-96" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-green-600">{earnings.today} €</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Cette semaine</p>
                  <p className="text-2xl font-bold text-green-600">{earnings.week} €</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Ce mois</p>
                  <p className="text-2xl font-bold text-green-600">{earnings.month} €</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du véhicule</CardTitle>
              </CardHeader>
              <CardContent>
                {driverProfile ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Marque</p>
                        <p className="font-medium">{driverProfile.vehicle_make || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Modèle</p>
                        <p className="font-medium">{driverProfile.vehicle_model || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Année</p>
                        <p className="font-medium">{driverProfile.vehicle_year || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Couleur</p>
                        <p className="font-medium">{driverProfile.vehicle_color || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Plaque</p>
                        <p className="font-medium">{driverProfile.vehicle_plate || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium">{driverProfile.vehicle_type || 'Standard'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tropical-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Configuration du profil en cours...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Section de messagerie */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Support conducteur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Urgence conducteur
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat support
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ChatSystem
              recipientId="driver-support"
              recipientName="Support Conducteurs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
