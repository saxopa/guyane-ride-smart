
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, CreditCard, Star, Clock, MessageCircle, Navigation, BarChart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Géolocalisation précise",
      description: "Localisation GPS optimisée pour la Guyane avec prise en compte des spécificités locales",
      color: "tropical"
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description: "Conducteurs vérifiés, traçabilité complète des courses et assistance d'urgence",
      color: "ocean"
    },
    {
      icon: CreditCard,
      title: "Paiement flexible",
      description: "Cartes bancaires, espèces, et modes de paiement locaux acceptés",
      color: "sunset"
    },
    {
      icon: Star,
      title: "Système de notation",
      description: "Évaluations bidirectionnelles pour garantir la qualité du service",
      color: "tropical"
    },
    {
      icon: Clock,
      title: "Disponibilité 24/7",
      description: "Service continu adapté aux horaires et besoins de la Guyane",
      color: "ocean"
    },
    {
      icon: MessageCircle,
      title: "Support IA Lovable",
      description: "Assistant intelligent pour un support client personnalisé et efficace",
      color: "sunset"
    },
    {
      icon: Navigation,
      title: "Navigation optimisée",
      description: "Itinéraires intelligents tenant compte du trafic et des conditions locales",
      color: "tropical"
    },
    {
      icon: BarChart,
      title: "Tarification transparente",
      description: "Prix clairs et compétitifs avec estimation précise avant la course",
      color: "ocean"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'tropical':
        return 'text-tropical-600 bg-tropical-100';
      case 'ocean':
        return 'text-ocean-600 bg-ocean-100';
      case 'sunset':
        return 'text-sunset-600 bg-sunset-100';
      default:
        return 'text-tropical-600 bg-tropical-100';
    }
  };

  return (
    <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités innovantes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités qui font de Fasterz l'application VTC 
            la plus avancée de Guyane française
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-none shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 backdrop-blur-sm group"
            >
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-tropical-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section Intelligence Artificielle */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Intelligence Artificielle Lovable
            </h3>
            <p className="text-lg text-gray-600">
              L'IA au service de votre expérience de transport
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Suggestions intelligentes",
                description: "L'IA apprend vos habitudes pour suggérer vos destinations favorites",
                emoji: "🧠"
              },
              {
                title: "Optimisation des trajets",
                description: "Calcul en temps réel des meilleurs itinéraires selon le trafic",
                emoji: "🗺️"
              },
              {
                title: "Support conversationnel",
                description: "Chatbot intelligent pour répondre à vos questions 24/7",
                emoji: "💬"
              }
            ].map((aiFeature, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-white to-tropical-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{aiFeature.emoji}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{aiFeature.title}</h4>
                <p className="text-gray-600">{aiFeature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
