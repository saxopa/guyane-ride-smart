
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Sign in successful:', data);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Fasterz !",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      console.log('Starting signup process with data:', { email, userData });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userData.role,
            first_name: userData.first_name,
            last_name: userData.last_name,
          },
        },
      });

      if (authError) {
        console.error('Auth error during signup:', authError);
        toast({
          title: "Erreur d'inscription",
          description: authError.message,
          variant: "destructive",
        });
        return { error: authError };
      }

      if (!authData.user) {
        console.error('No user data returned from signup');
        toast({
          title: "Erreur d'inscription",
          description: "Aucune donnée utilisateur retournée",
          variant: "destructive",
        });
        return { error: new Error('No user data returned') };
      }

      console.log('User created successfully:', authData.user);

      // Wait a bit for the profile to be created by the trigger
      await new Promise(resolve => setTimeout(resolve, 2000));

      // If user is a driver, create driver profile after authentication
      if (userData.role === 'driver') {
        console.log('Creating driver profile for user:', authData.user.id);
        
        // Verify user session is established
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log('No session found, waiting for authentication...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        try {
          const { error: driverError } = await supabase
            .from('drivers')
            .insert({
              id: authData.user.id,
              license_number: userData.licenseNumber || null,
              vehicle_make: userData.vehicleMake || null,
              vehicle_model: userData.vehicleModel || null,
              vehicle_year: userData.vehicleYear ? parseInt(userData.vehicleYear) : null,
              vehicle_color: userData.vehicleColor || null,
              vehicle_plate: userData.vehiclePlate || null,
              vehicle_type: userData.vehicleType || 'standard',
              status: 'offline',
              rating: 5.0,
              total_rides: 0,
              is_verified: false
            });

          if (driverError) {
            console.error('Error creating driver profile:', driverError);
            toast({
              title: "Profil créé avec avertissement",
              description: "Votre compte a été créé mais le profil conducteur doit être complété dans les paramètres.",
              variant: "default",
            });
          } else {
            console.log('Driver profile created successfully');
            toast({
              title: "Inscription réussie",
              description: "Votre compte conducteur a été créé avec succès !",
            });
          }
        } catch (driverProfileError) {
          console.error('Exception creating driver profile:', driverProfileError);
          toast({
            title: "Profil créé avec avertissement",
            description: "Votre compte a été créé mais le profil conducteur doit être complété dans les paramètres.",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès !",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Fasterz !",
      });
    } catch (error) {
      console.error('Error in signOut:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
