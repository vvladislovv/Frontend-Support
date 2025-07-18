import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuth: boolean;
  loading: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuth, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-xl text-gray-600">
        Проверка авторизации...
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;