import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from './Login/useLogin';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import MobileHeader from '../components/MobileHeader';
import { isTelegramWebApp } from '../telegram';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

interface LoginProps {
  onAuth: (profile: Profile) => void;
}

const Login: React.FC<LoginProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  } = useLogin(onAuth);

  // Проверяем, авторизован ли пользователь
  useEffect(() => {
    const token = localStorage.getItem('token');
    const cookieToken = document.cookie
      .split(';')
      .find(row => row.trim().startsWith('auth_token='))
      ?.split('=')[1];
    
    // Если есть токен в localStorage или cookies, перенаправляем на dashboard
    if (token || cookieToken) {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title="Вход" showBack={true} />
        
        <div className="px-6 py-8">
          {/* Логотип */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-mobile">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Тестовые данные */}
          <div className="card-mobile mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Тестовые данные:</p>
                <p className="text-sm text-blue-600">Email: test@example.com</p>
                <p className="text-sm text-blue-600">Password: password</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium tg-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Введите email"
                className={`input-mobile ${error && (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium tg-text">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Введите пароль"
                className={`input-mobile ${error && !password ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-mobile w-full shadow-mobile"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Вход...
                </div>
              ) : (
                'Войти'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm tg-hint mb-4">Нет аккаунта?</p>
            <Link
              to="/register"
              className="btn-secondary-mobile w-full shadow-mobile"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-blue-100 mt-40">
        <div className="flex items-center mb-6">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <h2 className="text-2xl font-bold text-center text-gray-700 flex-1">Вход</h2>
        </div>
        
        {/* Показываем правильные данные для входа */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">Тестовые данные:</p>
          <p className="text-sm text-blue-600">Email: test@example.com</p>
          <p className="text-sm text-blue-600">Password: password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-500">Email</label>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="Email" 
              className={error && (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) ? 'border-red-500' : ''} 
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-500">Пароль</label>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="Пароль" 
              className={error && !password ? 'border-red-500' : ''} 
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 mt-2 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg" 
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Нет аккаунта? <Link to="/register" className="text-blue-600 hover:underline font-semibold">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 