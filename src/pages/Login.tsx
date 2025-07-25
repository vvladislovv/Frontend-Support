import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLogin } from './Login/useLogin';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { isTelegramWebApp } from '../telegram';

interface LoginProps {
  onAuth: (profile: { id: string; email: string; name: string; role: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onAuth }) => {
  const { t } = useTranslation();
  const { email, setEmail, password, setPassword, loading, error, handleSubmit } = useLogin(onAuth);
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tg-text mb-2">{t('loginTitle')}</h1>
            <p className="tg-hint text-sm">{t('enterEmail')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="input-mobile"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="input-mobile"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="ml-2 text-sm tg-text">{t('rememberMe')}</span>
              </label>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-mobile"
            >
              {loading ? t('loggingIn') : t('signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="tg-hint text-sm">
              {t('noAccount')}{' '}
              <Link to="/register" className="text-blue-600 font-medium">
                {t('signUp')}
              </Link>
            </p>
          </div>


        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">{t('loginTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          required
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked={true}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-600">{t('rememberMe')}</span>
          </label>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('loggingIn') : t('signIn')}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          {t('noAccount')}{' '}
          <Link to="/register" className="text-blue-600 underline">
            {t('signUp')}
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;