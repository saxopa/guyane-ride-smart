
import { Button } from '@/components/ui/button';
import { MapPin, Car, Clock, Shield } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: (type: 'rider' | 'driver') => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-tropical-50 via-white to-ocean-50"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-tropical-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-ocean-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '-1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu Principal */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-tropical-100 text-tropical-800 px-4 py-2 rounded-full text-sm font-medium">
                🚗 Nouveau en Guyane française
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Votre transport
                <span className="text-transparent bg-tropical-gradient bg-clip-text"> intelligent</span>
                <br />en Guyane
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Déplacez-vous en toute sécurité avec Fasterz, l'application VTC pensée pour la Guyane française. 
                Réservation instantanée, conducteurs vérifiés, tarifs transparents.
              </p>
            </div>

            {/* Statistiques Rapides */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Clock, label: "2min", desc: "Temps d'attente moyen" },
                { icon: Shield, label: "100%", desc: "Conducteurs vérifiés" },
                { icon: MapPin, label: "24/7", desc: "Service disponible" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-tropical-100 rounded-lg mb-2">
                    <stat.icon className="w-6 h-6 text-tropical-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.label}</p>
                  <p className="text-sm text-gray-600">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Boutons d'Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => onGetStarted('rider')}
                className="bg-tropical-gradient hover:opacity-90 transform hover:scale-105 transition-all duration-300 tropical-shadow"
              >
                <Car className="w-5 h-5 mr-2" />
                Commander maintenant
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onGetStarted('driver')}
                className="border-tropical-600 text-tropical-600 hover:bg-tropical-50 transform hover:scale-105 transition-all duration-300"
              >
                Devenir conducteur
              </Button>
            </div>

            {/* Badge de Confiance */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Assurance incluse</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Section Visuelle */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-tropical-500 to-ocean-500 rounded-2xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-4">Interface Fasterz</h3>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="font-medium">🗺️ Géolocalisation en temps réel</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="font-medium">💳 Paiement sécurisé intégré</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="font-medium">⭐ Système de notation</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="font-medium">🤖 Support IA Lovable</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Éléments décoratifs flottants */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-sunset-gradient rounded-full opacity-80 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-ocean-gradient rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
