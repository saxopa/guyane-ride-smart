
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import RideTracking from '@/components/RideTracking';
import LoadingSpinner from '@/components/LoadingSpinner';

const DriverTracking = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return <LoadingSpinner message="Chargement de vos informations..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile || profile.role !== 'driver') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-tropical-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Suivi de course - Conducteur
          </h1>
          <p className="text-gray-600">
            Gérez vos courses en temps réel
          </p>
        </div>
        
        <RideTracking mode="driver" />
      </div>
    </div>
  );
};

export default DriverTracking;
