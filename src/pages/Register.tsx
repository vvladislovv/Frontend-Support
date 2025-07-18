import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from './Register/useRegister';
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

interface RegisterProps {
  onAuth: (profile: Profile) => void;
}

const Register: React.FC<RegisterProps> = ({ onAuth }) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  } = useRegister(onAuth);

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
        <MobileHeader title="Регистрация" showBack={true} />
        
        <div className="px-6 py-8">
          {/* Логотип */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-mobile">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium tg-text">Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Введите ваше имя"
                className={`input-mobile ${error && !name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            
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
                placeholder="Создайте пароль"
                className={`input-mobile ${error && !password ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              <p className="text-xs tg-hint mt-1">Минимум 6 символов</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-mobile w-full shadow-mobile bg-green-500 hover:bg-green-600 active:bg-green-700 focus:ring-green-500"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Регистрация...
                </div>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm tg-hint mb-4">Уже есть аккаунт?</p>
            <Link
              to="/login"
              className="btn-secondary-mobile w-full shadow-mobile"
            >
              Войти
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
          <h2 className="text-2xl font-bold text-center text-gray-700 flex-1">Регистрация</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-500">Имя</label>
            <Input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Имя" className={error && !name ? 'border-red-500' : ''} />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-500">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email" className={error && (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) ? 'border-red-500' : ''} />
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
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded py-2 mt-2 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-400">
          Уже есть аккаунт? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 