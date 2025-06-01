
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Menu, X } from 'lucide-react';

interface NavigationProps {
  onAuthClick: (type: 'rider' | 'driver') => void;
}

const Navigation = ({ onAuthClick }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
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
            <Button 
              variant="outline" 
              onClick={() => onAuthClick('driver')}
              className="border-tropical-600 text-tropical-600 hover:bg-tropical-50"
            >
              Devenir conducteur
            </Button>
            <Button 
              onClick={() => onAuthClick('rider')}
              className="bg-tropical-gradient hover:opacity-90"
            >
              Commander
            </Button>
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
              <Button 
                variant="outline" 
                onClick={() => onAuthClick('driver')}
                className="border-tropical-600 text-tropical-600 hover:bg-tropical-50"
              >
                Devenir conducteur
              </Button>
              <Button 
                onClick={() => onAuthClick('rider')}
                className="bg-tropical-gradient hover:opacity-90"
              >
                Commander
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
