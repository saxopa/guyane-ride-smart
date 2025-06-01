
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle, Clock, Globe } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-tropical-50 via-white to-ocean-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans votre expérience Fasterz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Phone,
                  title: "Téléphone",
                  description: "Support 24/7 disponible",
                  contact: "+594 5 94 XX XX XX",
                  color: "tropical"
                },
                {
                  icon: Mail,
                  title: "Email",
                  description: "Réponse sous 24h",
                  contact: "contact@fasterz.gf",
                  color: "ocean"
                },
                {
                  icon: MapPin,
                  title: "Adresse",
                  description: "Siège social",
                  contact: "123 Avenue de la Liberté, 97300 Cayenne",
                  color: "sunset"
                },
                {
                  icon: MessageCircle,
                  title: "Chat IA",
                  description: "Assistant Lovable disponible",
                  contact: "Support instantané dans l'app",
                  color: "tropical"
                }
              ].map((contact, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                      contact.color === 'tropical' ? 'bg-tropical-100 text-tropical-600' :
                      contact.color === 'ocean' ? 'bg-ocean-100 text-ocean-600' :
                      'bg-sunset-100 text-sunset-600'
                    }`}>
                      <contact.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {contact.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900">{contact.contact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Horaires d'ouverture */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-tropical-100 text-tropical-600 p-3 rounded-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Horaires de support
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Notre équipe est disponible pour vous aider
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Support téléphonique</h4>
                    <p className="text-gray-600">Lundi - Dimanche : 24h/24</p>
                    <p className="text-gray-600">Urgences : 24h/24, 7j/7</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Support email</h4>
                    <p className="text-gray-600">Lundi - Vendredi : 8h - 18h</p>
                    <p className="text-gray-600">Week-end : 9h - 17h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-gradient-to-br from-tropical-500 to-tropical-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Rejoignez Fasterz
                </CardTitle>
                <CardDescription className="text-tropical-100">
                  Devenez partenaire de la révolution du transport en Guyane
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-tropical-600 hover:bg-tropical-50"
                >
                  Devenir conducteur
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white/10"
                >
                  Partenariat entreprise
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-ocean-600" />
                  Spécifiquement pour la Guyane
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tropical-500 rounded-full mr-3"></div>
                    Interface en français
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tropical-500 rounded-full mr-3"></div>
                    Tarifs adaptés au marché local
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tropical-500 rounded-full mr-3"></div>
                    Connaissance du territoire
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-tropical-500 rounded-full mr-3"></div>
                    Support client local
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
