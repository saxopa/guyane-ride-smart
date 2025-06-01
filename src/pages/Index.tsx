
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Shield, Star, Clock, Phone, Mail, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import VehicleTypes from '@/components/VehicleTypes';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'rider' | 'driver'>('rider');

  const handleGetStarted = (type: 'rider' | 'driver') => {
    setAuthType(type);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tropical-50 via-white to-ocean-50">
      <Navigation onAuthClick={handleGetStarted} />
      
      <HeroSection onGetStarted={handleGetStarted} />
      
      <FeaturesSection />
      
      <VehicleTypes />
      
      {/* Section Statistiques */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fasterz en chiffres
            </h2>
            <p className="text-lg text-gray-600">
              La confiance de nos utilisateurs guyanais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10,000+", label: "Utilisateurs actifs" },
              { icon: Car, value: "500+", label: "Conducteurs partenaires" },
              { icon: MapPin, value: "50,000+", label: "Courses réalisées" },
              { icon: Star, value: "4.8/5", label: "Note moyenne" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-tropical-gradient rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-lg text-gray-600">
              Des témoignages authentiques de la communauté Fasterz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dubois",
                role: "Passagère",
                comment: "Service rapide et fiable, parfait pour mes déplacements quotidiens à Cayenne !",
                rating: 5
              },
              {
                name: "Jean-Claude Martin",
                role: "Conducteur",
                comment: "Interface intuitive, paiements rapides. Une excellente plateforme pour travailler.",
                rating: 5
              },
              {
                name: "Sophie Leroy",
                role: "Passagère",
                comment: "Sécurité et ponctualité au rendez-vous. Je recommande Fasterz les yeux fermés !",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authType}
      />
    </div>
  );
};

export default Index;
