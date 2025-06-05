
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

interface NavigationProps {
  onAuthClick?: (type: 'rider' | 'driver') => void;
}

const Navigation = ({ onAuthClick }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const loading = authLoading || profileLoading;

  const handleAuthClick = (type: 'rider' | 'driver') => {
    try {
      if (onAuthClick) {
        onAuthClick(type);
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error in handleAuthClick:', error);
      navigate('/auth');
    }
  };

  const handleDashboardNavigation = () => {
    try {
      if (profile?.role === 'driver') {
        navigate('/driver');
      } else if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/rider');
      }
    } catch (error) {
      console.error('Error in handleDashboardNavigation:', error);
      navigate('/rider');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error in handleSignOut:', error);
      navigate('/');
    }
  };

  // Obtenir le nom d'affichage de l'utilisateur
  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (profile?.first_name) {
      return profile.first_name;
    } else if (profile?.email) {
      return profile.email.split('@')[0];
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  // Obtenir l'affichage du rôle utilisateur
  const getUserRoleDisplay = () => {
    if (profile?.role === 'driver') return 'Conducteur';
    if (profile?.role === 'admin') return 'Administrateur';
    return 'Passager';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-tropical-gradient rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Fasterz</span>
            <span className="text-sm bg-tropical-100 text-tropical-800 px-2 py-1 rounded-full">Guyane</span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-tropical-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#vehicles" className="text-gray-600 hover:text-tropical-600 transition-colors">
              Véhicules
            </a>
            <a href="#contact" className="text-gray-600 hover:text-tropical-600 transition-colors">
              Contact
            </a>
            
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            ) : user && profile ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    Bonjour, {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRoleDisplay()}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleDashboardNavigation}
                  className="border-tropical-600 text-tropical-600 hover:bg-tropical-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleAuthClick('driver')}
                  className="border-tropical-600 text-tropical-600 hover:bg-tropical-50"
                >
                  Devenir conducteur
                </Button>
                <Button 
                  onClick={() => handleAuthClick('rider')}
                  className="bg-tropical-gradient hover:opacity-90"
                >
                  Commander
                </Button>
              </>
            )}
          </div>

          {/* Menu Mobile Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-in">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-tropical-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#vehicles" className="text-gray-600 hover:text-tropical-600 transition-colors">
                Véhicules
              </a>
              <a href="#contact" className="text-gray-600 hover:text-tropical-600 transition-colors">
                Contact
              </a>
              
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
              ) : user && profile ? (
                <>
                  <div className="text-sm border-b border-gray-200 pb-2">
                    <div className="font-medium text-gray-900">
                      Bonjour, {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getUserRoleDisplay()}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleDashboardNavigation}
                    className="border-tropical-600 text-tropical-600 hover:bg-tropical-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Tableau de bord
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleAuthClick('driver')}
                    className="border-tropical-600 text-tropical-600 hover:bg-tropical-50"
                  >
                    Devenir conducteur
                  </Button>
                  <Button 
                    onClick={() => handleAuthClick('rider')}
                    className="bg-tropical-gradient hover:opacity-90"
                  >
                    Commander
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
