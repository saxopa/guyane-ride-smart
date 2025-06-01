
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Users, Crown, Zap } from 'lucide-react';

const VehicleTypes = () => {
  const vehicles = [
    {
      type: "Standard",
      icon: Car,
      capacity: "4 passagers",
      description: "Véhicules confortables pour vos déplacements quotidiens",
      price: "À partir de 3€",
      features: ["Climatisation", "Paiement carte", "WiFi gratuit"],
      color: "tropical",
      popular: false
    },
    {
      type: "Familial",
      icon: Users,
      capacity: "6-7 passagers",
      description: "Véhicules spacieux pour les familles et groupes",
      price: "À partir de 5€",
      features: ["Grand coffre", "Sièges enfants", "Climatisation renforcée"],
      color: "ocean",
      popular: true
    },
    {
      type: "Luxe",
      icon: Crown,
      capacity: "4 passagers",
      description: "Véhicules haut de gamme pour vos occasions spéciales",
      price: "À partir de 8€",
      features: ["Véhicules premium", "Chauffeur professionnel", "Service VIP"],
      color: "sunset",
      popular: false
    }
  ];

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'tropical':
        return 'from-tropical-500 to-tropical-600';
      case 'ocean':
        return 'from-ocean-500 to-ocean-600';
      case 'sunset':
        return 'from-sunset-500 to-sunset-600';
      default:
        return 'from-tropical-500 to-tropical-600';
    }
  };

  return (
    <section id="vehicles" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Notre flotte de véhicules
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le véhicule qui correspond à vos besoins parmi notre flotte 
            moderne et entretenue régulièrement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <Card 
              key={index} 
              className={`relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 overflow-hidden group ${
                vehicle.popular ? 'ring-2 ring-ocean-400' : ''
              }`}
            >
              {vehicle.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-ocean-500 text-white font-semibold">
                    <Zap className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}

              <div className={`h-32 bg-gradient-to-br ${getGradientClass(vehicle.color)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4">
                  <vehicle.icon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-4 left-4">
                  <h3 className="text-2xl font-bold text-white">{vehicle.type}</h3>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {vehicle.capacity}
                  </CardTitle>
                  <span className="text-2xl font-bold text-gray-900">{vehicle.price}</span>
                </div>
                <CardDescription className="text-gray-600">
                  {vehicle.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Équipements inclus :</h4>
                  <ul className="space-y-2">
                    {vehicle.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <div className={`w-2 h-2 bg-gradient-to-r ${getGradientClass(vehicle.color)} rounded-full mr-3`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section Engagement Qualité */}
        <div className="mt-20 bg-gradient-to-r from-tropical-50 to-ocean-50 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Notre engagement qualité
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { emoji: "🚗", text: "Véhicules entretenus régulièrement" },
              { emoji: "✅", text: "Contrôles techniques à jour" },
              { emoji: "🧽", text: "Nettoyage après chaque course" },
              { emoji: "🔒", text: "Assurance tous risques" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="text-gray-700 font-medium text-center">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleTypes;
