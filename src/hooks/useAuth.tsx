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
  updateProfile: (data: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

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
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
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

      // Fetch user profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer votre profil",
          variant: "destructive",
        });
        return { error: profileError };
      }

      console.log('User signed in successfully:', { user, profile });

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
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
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
        throw new Error('No user data returned from signup');
      }

      console.log('User created successfully:', authData.user);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          title: "Erreur de création du profil",
          description: profileError.message,
          variant: "destructive",
        });
        return { error: profileError };
      }

      console.log('Profile created successfully');

      // If user is a driver, create driver profile
      if (userData.role === 'driver') {
        console.log('Creating driver profile with data:', userData);
        
        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            id: authData.user.id,
            license_number: userData.licenseNumber,
            vehicle_make: userData.vehicleMake,
            vehicle_model: userData.vehicleModel,
            vehicle_year: parseInt(userData.vehicleYear),
            vehicle_color: userData.vehicleColor,
            vehicle_plate: userData.vehiclePlate,
            vehicle_type: userData.vehicleType || 'standard',
            status: 'offline',
            rating: 5,
            total_rides: 0,
            is_verified: false
          });

        if (driverError) {
          console.error('Error creating driver profile:', driverError);
          toast({
            title: "Erreur de création du profil conducteur",
            description: driverError.message,
            variant: "destructive",
          });
          return { error: driverError };
        }

        console.log('Driver profile created successfully');
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
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
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erreur de mise à jour",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été sauvegardées.",
        });
      }

      return { error };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: "Erreur de mise à jour",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
      return { error };
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
      updateProfile,
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