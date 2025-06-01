
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Mail, Lock, User, Phone, FileText, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'rider' as 'rider' | 'driver',
    // Driver specific fields
    licenseNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleType: 'standard' as 'standard' | 'familiale' | 'luxe',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(loginData.email, loginData.password);
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    
    const userData = {
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      phone: signupData.phone,
      role: signupData.role,
    };

    await signUp(signupData.email, signupData.password, userData);
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tropical-50 via-white to-ocean-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tropical-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tropical-50 via-white to-ocean-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-tropical-gradient rounded-lg flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Fasterz</span>
          </div>
          <p className="text-gray-600">Votre VTC en Guyane française</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte Fasterz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-tropical-gradient hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>
                  Rejoignez la communauté Fasterz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label>Type de compte</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setSignupData({ ...signupData, role: 'rider' })}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          signupData.role === 'rider'
                            ? 'border-tropical-500 bg-tropical-50'
                            : 'border-gray-200 hover:border-tropical-300'
                        }`}
                      >
                        <User className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-sm font-medium text-center">Passager</p>
                      </div>
                      <div
                        onClick={() => setSignupData({ ...signupData, role: 'driver' })}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          signupData.role === 'driver'
                            ? 'border-tropical-500 bg-tropical-50'
                            : 'border-gray-200 hover:border-tropical-300'
                        }`}
                      >
                        <Car className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-sm font-medium text-center">Conducteur</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Jean"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Dupont"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+594 6 94 XX XX XX"
                        className="pl-10"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Mot de passe</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Driver-specific fields */}
                  {signupData.role === 'driver' && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium text-gray-900">Informations véhicule</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Numéro de permis</Label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="licenseNumber"
                            placeholder="973ABC123456"
                            className="pl-10"
                            value={signupData.licenseNumber}
                            onChange={(e) => setSignupData({ ...signupData, licenseNumber: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="vehicleMake">Marque</Label>
                          <Input
                            id="vehicleMake"
                            placeholder="Peugeot"
                            value={signupData.vehicleMake}
                            onChange={(e) => setSignupData({ ...signupData, vehicleMake: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleModel">Modèle</Label>
                          <Input
                            id="vehicleModel"
                            placeholder="308"
                            value={signupData.vehicleModel}
                            onChange={(e) => setSignupData({ ...signupData, vehicleModel: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="vehicleYear">Année</Label>
                          <Input
                            id="vehicleYear"
                            placeholder="2020"
                            value={signupData.vehicleYear}
                            onChange={(e) => setSignupData({ ...signupData, vehicleYear: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleColor">Couleur</Label>
                          <Input
                            id="vehicleColor"
                            placeholder="Blanc"
                            value={signupData.vehicleColor}
                            onChange={(e) => setSignupData({ ...signupData, vehicleColor: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehiclePlate">Plaque</Label>
                          <Input
                            id="vehiclePlate"
                            placeholder="973-ABC-01"
                            value={signupData.vehiclePlate}
                            onChange={(e) => setSignupData({ ...signupData, vehiclePlate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-tropical-gradient hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Création...' : 'Créer mon compte'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
