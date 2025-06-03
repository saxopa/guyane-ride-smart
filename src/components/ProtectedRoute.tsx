import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'rider' | 'driver' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (!authLoading && !profileLoading && user) {
      if (requiredRole && profile?.role !== requiredRole) {
        console.log(`User role ${profile?.role} does not match required role ${requiredRole}, redirecting`);
        switch (profile?.role) {
          case 'driver':
            navigate('/driver');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/rider');
            break;
        }
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate, requiredRole]);

  if (authLoading || profileLoading) {
    return <LoadingSpinner message="Chargement..." />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;