import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import MobileHeader from '../components/MobileHeader';
import { isTelegramWebApp } from '../telegram';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('pageNotFound')} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🤖</div>
            <h1 className="text-3xl font-bold tg-text mb-2">404</h1>
            <h2 className="text-xl font-semibold tg-text mb-4">{t('pageNotFound')}</h2>
            <p className="tg-hint text-sm mb-8 px-4">
              {t('pageNotFoundDescription')}
            </p>
          </div>
          
          <div className="space-y-3">
            <Link to="/dashboard" className="btn-primary-mobile w-full">
              {t('backToHome')}
            </Link>
            <Link to="/bots" className="btn-secondary-mobile w-full">
              {t('manageBots')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-center text-black">
      <div className="mb-8">
        <div className="text-8xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">{t('pageNotFound')}</h2>
        <p className="text-gray-500 mb-8">
          {t('pageNotFoundDescription')}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/dashboard">
          <Button variant="primary">{t('backToHome')}</Button>
        </Link>
        <Link to="/bots">
          <Button variant="secondary">{t('manageBots')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;