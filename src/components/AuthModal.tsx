
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'rider' | 'driver';
}

const AuthModal = ({ isOpen, onClose, type }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    licenseNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleType: 'standard'
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Champs requis",
        description: "Email et mot de passe sont requis",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Attempting login for:', formData.email);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        return;
      }

      onClose();
      
      // Redirection selon le type d'utilisateur
      if (type === 'rider') {
        navigate('/rider');
      } else {
        navigate('/driver');
      }
    } catch (error) {
      console.error('Exception during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast({
        title: "Champs requis",
        description: "Email, mot de passe, prénom et nom sont requis",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Attempting registration for:', formData.email, 'as', type);

    try {
      const userData = {
        role: type,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        ...(type === 'driver' && {
          licenseNumber: formData.licenseNumber,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          vehicleYear: formData.vehicleYear,
          vehicleColor: formData.vehicleColor,
          vehiclePlate: formData.vehiclePlate,
          vehicleType: formData.vehicleType
        })
      };

      const { error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        console.error('Registration error:', error);
        return;
      }

      onClose();
      
      // Redirection selon le type d'utilisateur
      if (type === 'rider') {
        navigate('/rider');
      } else {
        navigate('/driver');
      }
    } catch (error) {
      console.error('Exception during registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === 'rider' ? (
              <User className="w-6 h-6 text-tropical-600" />
            ) : (
              <Car className="w-6 h-6 text-ocean-600" />
            )}
            <span>
              {type === 'rider' ? 'Espace Passager' : 'Espace Conducteur'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {type === 'rider' 
              ? 'Connectez-vous pour commander votre course' 
              : 'Connectez-vous à votre espace conducteur'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full ${
                  type === 'rider' 
                    ? 'bg-tropical-gradient hover:opacity-90' 
                    : 'bg-ocean-gradient hover:opacity-90'
                }`}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phone" 
                    placeholder="06 94 XX XX XX"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="registerEmail" 
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPassword">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="registerPassword" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Créer un mot de passe"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {type === 'driver' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Numéro de permis (optionnel)</Label>
                    <Input 
                      id="licenseNumber" 
                      placeholder="123456789"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Marque (optionnel)</Label>
                      <Input 
                        id="vehicleMake" 
                        placeholder="Peugeot"
                        value={formData.vehicleMake}
                        onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Modèle (optionnel)</Label>
                      <Input 
                        id="vehicleModel" 
                        placeholder="208"
                        value={formData.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-ocean-50 rounded-lg">
                    <p className="text-sm text-ocean-800">
                      <strong>Note :</strong> Vous pourrez compléter les informations de votre véhicule plus tard dans votre profil.
                    </p>
                  </div>
                </>
              )}

              <Button 
                onClick={handleRegister}
                disabled={isLoading}
                className={`w-full ${
                  type === 'rider' 
                    ? 'bg-tropical-gradient hover:opacity-90' 
                    : 'bg-ocean-gradient hover:opacity-90'
                }`}
              >
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                En créant un compte, vous acceptez nos{' '}
                <Button variant="link" className="p-0 h-auto text-xs">
                  conditions d'utilisation
                </Button>{' '}
                et notre{' '}
                <Button variant="link" className="p-0 h-auto text-xs">
                  politique de confidentialité
                </Button>
                .
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
