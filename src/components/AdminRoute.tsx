import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './common/Button';

interface AdminRouteProps {
  children: React.ReactNode;
  isAuth: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, isAuth, isAdmin, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-xl text-gray-600">
        Проверка прав доступа...
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">🔒 Требуется авторизация</h2>
        <p className="mb-4">Для доступа к админ-панели необходимо войти в систему.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button variant="primary">Войти</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">🔒 Доступ запрещен</h2>
        <p className="mb-4">Для доступа к админ-панели нужны права администратора.</p>
        <p className="text-sm text-gray-500 mb-4">
          Отладка: isAuth={isAuth.toString()}, isAdmin={isAdmin.toString()}
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary">На главную</Button>
          </Link>
          <Button 
            variant="danger"
            onClick={() => {
              localStorage.setItem('test-admin', 'true');
              window.location.reload();
            }}
          >
            🔧 Включить тест-админа
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;