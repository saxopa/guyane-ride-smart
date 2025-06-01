
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Car, 
  Euro, 
  BarChart3, 
  MapPin, 
  Clock, 
  Star, 
  AlertTriangle,
  Settings,
  MessageCircle,
  TrendingUp,
  Calendar,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const stats = {
    totalUsers: 10547,
    activeDrivers: 432,
    dailyRides: 1284,
    revenue: 15420,
    avgRating: 4.8,
    incidents: 3
  };

  const recentActivities = [
    { id: 1, type: 'ride', description: 'Course complétée: Cayenne → Aéroport', time: '2 min', status: 'success' },
    { id: 2, type: 'driver', description: 'Nouveau conducteur vérifié: Jean Martin', time: '5 min', status: 'info' },
    { id: 3, type: 'incident', description: 'Signalement course #1234', time: '12 min', status: 'warning' },
    { id: 4, type: 'payment', description: 'Paiement de 25€ traité', time: '15 min', status: 'success' }
  ];

  const topDrivers = [
    { name: 'Marc Dubois', rides: 89, rating: 4.9, earnings: '2,140€' },
    { name: 'Sophie Martin', rides: 76, rating: 4.8, earnings: '1,890€' },
    { name: 'Pierre Leroy', rides: 71, rating: 4.9, earnings: '1,750€' },
    { name: 'Marie Dupont', rides: 68, rating: 4.7, earnings: '1,680€' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-tropical-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-r from-tropical-500 to-ocean-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration Fasterz</h1>
                <p className="text-sm text-gray-600">Tableau de bord de gestion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-tropical-500 text-white">Admin</Badge>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {[
            { 
              title: 'Utilisateurs totaux', 
              value: stats.totalUsers.toLocaleString(), 
              icon: Users, 
              color: 'tropical',
              change: '+12%' 
            },
            { 
              title: 'Conducteurs actifs', 
              value: stats.activeDrivers, 
              icon: Car, 
              color: 'ocean',
              change: '+8%' 
            },
            { 
              title: 'Courses aujourd\'hui', 
              value: stats.dailyRides.toLocaleString(), 
              icon: MapPin, 
              color: 'sunset',
              change: '+15%' 
            },
            { 
              title: 'Revenus du jour', 
              value: `${stats.revenue.toLocaleString()}€`, 
              icon: Euro, 
              color: 'tropical',
              change: '+22%' 
            },
            { 
              title: 'Note moyenne', 
              value: stats.avgRating, 
              icon: Star, 
              color: 'yellow',
              change: '+0.1' 
            },
            { 
              title: 'Incidents', 
              value: stats.incidents, 
              icon: AlertTriangle, 
              color: 'red',
              change: '-2' 
            }
          ].map((stat, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs ${
                      stat.change.includes('+') ? 'text-green-600' : 
                      stat.change.includes('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change} vs hier
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stat.color === 'tropical' ? 'bg-tropical-100 text-tropical-600' :
                    stat.color === 'ocean' ? 'bg-ocean-100 text-ocean-600' :
                    stat.color === 'sunset' ? 'bg-sunset-100 text-sunset-600' :
                    stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="drivers">Conducteurs</TabsTrigger>
            <TabsTrigger value="rides">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activité récente */}
              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Activité récente
                  </CardTitle>
                  <CardDescription>
                    Dernières activités sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top conducteurs */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Top conducteurs
                  </CardTitle>
                  <CardDescription>
                    Meilleurs performeurs du mois
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topDrivers.map((driver, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{driver.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span>{driver.rides} courses</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              {driver.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">{driver.earnings}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Graphique de revenus simulé */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Revenus des 7 derniers jours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-tropical-100 to-ocean-100 rounded-lg flex items-end justify-around p-6">
                  {[12400, 15200, 13800, 16900, 14300, 18500, 15420].map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-tropical-500 to-ocean-500 rounded-t-md mb-2"
                        style={{ 
                          height: `${(value / 20000) * 200}px`,
                          width: '40px'
                        }}
                      ></div>
                      <p className="text-xs text-gray-600">{value}€</p>
                      <p className="text-xs text-gray-500">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Administration des comptes passagers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Interface de gestion des utilisateurs</p>
                  <p className="text-sm text-gray-500">Fonctionnalité à implémenter</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Gestion des conducteurs</CardTitle>
                <CardDescription>
                  Administration et vérification des conducteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Interface de gestion des conducteurs</p>
                  <p className="text-sm text-gray-500">Vérification des documents, approbations, etc.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rides" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Gestion des courses</CardTitle>
                <CardDescription>
                  Suivi et administration des courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Interface de gestion des courses</p>
                  <p className="text-sm text-gray-500">Historique, incidents, remboursements, etc.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Analytics et rapports</CardTitle>
                <CardDescription>
                  Analyses détaillées et métriques de performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Interface d'analytics avancée</p>
                  <p className="text-sm text-gray-500">Rapports, KPIs, analyses prédictives avec IA Lovable</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
