
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'rider' | 'driver';
}

const AuthModal = ({ isOpen, onClose, type }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (action: 'login' | 'register') => {
    setIsLoading(true);
    
    // Simulation d'authentification
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      
      toast({
        title: action === 'login' ? 'Connexion réussie' : 'Compte créé avec succès',
        description: `Bienvenue sur Fasterz ! Redirection vers votre tableau de bord...`,
      });

      // Redirection selon le type d'utilisateur
      if (type === 'rider') {
        navigate('/rider');
      } else {
        navigate('/driver');
      }
    }, 1500);
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
                <Label htmlFor="email">Email ou téléphone</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    placeholder="votre@email.com ou 06 XX XX XX XX"
                    className="pl-10"
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
                onClick={() => handleAuth('login')}
                disabled={isLoading}
                className={`w-full ${
                  type === 'rider' 
                    ? 'bg-tropical-gradient hover:opacity-90' 
                    : 'bg-ocean-gradient hover:opacity-90'
                }`}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Mot de passe oublié ?
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Dupont" />
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
                <div className="p-4 bg-ocean-50 rounded-lg">
                  <p className="text-sm text-ocean-800">
                    <strong>Note :</strong> En tant que conducteur, vous devrez fournir 
                    vos documents (permis, assurance, contrôle technique) après l'inscription.
                  </p>
                </div>
              )}

              <Button 
                onClick={() => handleAuth('register')}
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

        {/* Méthodes alternatives de connexion */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              SMS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
