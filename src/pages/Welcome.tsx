import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { isTelegramWebApp } from '../telegram';

const Welcome: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen tg-bg text-center transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isMobile ? 'px-6 py-8' : 'px-4'}`}>
      {/* Логотип или иконка */}
      <div className="mb-8 animate-bounce-gentle">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-mobile-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Заголовок */}
      <h1 className={`font-extrabold mb-6 tg-text drop-shadow-sm transition-all duration-700 ${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'}`}>
        {t('welcome')}
      </h1>

      {/* Описание */}
      <p className={`tg-hint mb-10 max-w-md font-medium transition-all duration-700 leading-relaxed ${isMobile ? 'text-base px-2' : 'text-xl md:text-2xl max-w-xl'}`}>
        {t('dashboardDescription')}
      </p>

      {/* Кнопки */}
      <div className={`flex gap-4 mb-8 w-full max-w-sm ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
        <a
          href="/login"
          className={`btn-primary-mobile text-center font-semibold shadow-mobile animate-fade-in ${isMobile ? 'w-full' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          {t('login')}
        </a>
        <a
          href="/register"
          className={`btn-secondary-mobile text-center font-semibold shadow-mobile animate-fade-in ${isMobile ? 'w-full' : ''}`}
          style={{ animationDelay: '0.4s' }}
        >
          {t('register')}
        </a>
      </div>

      {/* Дополнительная информация для Telegram */}
      {isTelegramWebApp() && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-blue-700 font-medium">
            🚀 Добро пожаловать в Telegram Mini App!
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Управляйте своими ботами прямо из Telegram
          </p>
        </div>
      )}

      {/* Футер */}
      <div className="text-gray-400 text-sm font-mono tracking-wider select-none transition-all duration-700 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        © {new Date().getFullYear()}
      </div>

      {/* Индикатор для разработки */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-xs text-yellow-800 font-mono">
          DEV MODE
        </div>
      )}
    </div>
  );
};

export default Welcome; 