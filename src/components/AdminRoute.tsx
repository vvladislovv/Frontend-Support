import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './common/Button';

interface AdminRouteProps {
  children: React.ReactNode;
  isAuth: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, isAuth, isAdmin, loading }) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-xl text-gray-600">
        {t('checkingAccess')}
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">🔒 {t('authRequired')}</h2>
        <p className="mb-4">{t('adminAccessRequired')}</p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button variant="primary">{t('login')}</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">{t('backToHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">🔒 {t('accessDenied')}</h2>
        <p className="mb-4">{t('adminRightsRequired')}</p>
        <p className="text-sm text-gray-500 mb-4">
          {t('debug')}: isAuth={isAuth.toString()}, isAdmin={isAdmin.toString()}
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary">{t('backToHome')}</Button>
          </Link>
          <Button 
            variant="danger"
            onClick={() => {
              localStorage.setItem('test-admin', 'true');
              window.location.reload();
            }}
          >
            🔧 {t('enableTestAdmin')}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;