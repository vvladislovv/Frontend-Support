import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('adminPanel')} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">🔧 {t('adminPanel')}</h1>
            <p className="tg-hint text-sm">{t('systemManagement')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/clients" className="card-mobile group active:scale-95 transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-red-700 mb-1 text-sm">{t('clients')}</h3>
                <p className="text-xs tg-hint leading-tight">{t('userManagement')}</p>
              </div>
            </Link>

            <Link to="/admin/system" className="card-mobile group active:scale-95 transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="font-semibold text-orange-700 mb-1 text-sm">{t('systemLoad')}</h3>
                <p className="text-xs tg-hint leading-tight">{t('systemMonitoring')}</p>
              </div>
            </Link>

            <Link to="/admin/plans" className="card-mobile group active:scale-95 transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="font-semibold text-purple-700 mb-1 text-sm">{t('plans')}</h3>
                <p className="text-xs tg-hint leading-tight">{t('tariffManagement')}</p>
              </div>
            </Link>

            <Link to="/admin/logs" className="card-mobile group active:scale-95 transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1 text-sm">{t('systemLogs')}</h3>
                <p className="text-xs tg-hint leading-tight">{t('systemLogs')}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl mt-20 flex flex-col gap-8 border border-red-100">
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="secondary" className="animate-slide-in">{t('backToMainMenu')}</Button>
        </Link>
      </div>
      <h2 className="text-3xl font-extrabold mb-2 text-red-800 text-center drop-shadow-sm tracking-tight animate-fade-in">
        🔧 {t('adminPanel')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a href="/admin/clients" className="group flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-red-100 animate-fade-in">
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">👥</span>
          <span className="text-lg font-semibold text-red-700 group-hover:underline transition-colors duration-200">{t('clients')}</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">{t('userManagement')}</span>
        </a>
        <a href="/admin/system" className="group flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-orange-100 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">⚙️</span>
          <span className="text-lg font-semibold text-orange-700 group-hover:underline transition-colors duration-200">{t('systemLoad')}</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">{t('systemMonitoring')}</span>
        </a>
        <a href="/admin/plans" className="group flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-purple-100 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">💎</span>
          <span className="text-lg font-semibold text-purple-700 group-hover:underline transition-colors duration-200">{t('plans')}</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">{t('tariffManagement')}</span>
        </a>
        <a href="/admin/logs" className="group flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-gray-100 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">📋</span>
          <span className="text-lg font-semibold text-gray-700 group-hover:underline transition-colors duration-200">{t('systemLogs')}</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">{t('systemLogs')}</span>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;