import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRegister } from './Register/useRegister';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { isTelegramWebApp } from '../telegram';

interface RegisterProps {
  onAuth: (profile: { id: string; email: string; name: string; role: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onAuth }) => {
  const { t } = useTranslation();
  const { name, setName, email, setEmail, password, setPassword, loading, error, handleSubmit } = useRegister(onAuth);
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tg-text mb-2">{t('registerTitle')}</h1>
            <p className="tg-hint text-sm">{t('enterName')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterName')}
                className="input-mobile"
                required
              />
            </div>
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
                placeholder={t('createPassword')}
                className="input-mobile"
                required
                minLength={6}
              />
              <p className="text-xs tg-hint mt-1">{t('minimumChars')}</p>
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
              {loading ? t('registering') : t('signUp')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="tg-hint text-sm">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blue-600 font-medium">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">{t('registerTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('enterName')}
          required
        />
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
          placeholder={t('createPassword')}
          required
          minLength={6}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('registering') : t('signUp')}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-blue-600 underline">
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;