import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';
import { getSystemLoad } from '../../api';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  const [systemLoad, setSystemLoad] = useState({ cpu: 0, memory: 0 });
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const load = await getSystemLoad();
      setSystemLoad(load);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const adminSections = [
    {
      title: t('userManagement'),
      description: t('userManagementDescription'),
      icon: '👥',
      path: '/admin/users',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      title: t('tariffManagement'),
      description: t('tariffManagementDescription'),
      icon: '💎',
      path: '/admin/tariffs',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      title: t('systemMonitoring'),
      description: t('systemMonitoringDescription'),
      icon: '⚙️',
      path: '/admin/monitor',
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    },
    {
      title: t('systemLogs'),
      description: t('systemLogsDescription'),
      icon: '📋',
      path: '/admin/logs',
      color: 'bg-gray-50 border-gray-200 text-gray-700'
    }
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('adminPanel')} showBack={true} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">🔧 {t('adminPanel')}</h1>
            <p className="tg-hint text-sm">{t('adminPanelDescription')}</p>
          </div>

          {/* Системная нагрузка */}
          <div className="card-mobile mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">📊 {t('systemLoad')}</h2>
              <button
                onClick={refreshData}
                disabled={loading}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳' : '🔄'} {t('refresh')}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">💻 {t('cpu')}</span>
                  <span className="text-sm font-bold text-blue-800">{systemLoad.cpu}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemLoad.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">🧠 {t('memory')}</span>
                  <span className="text-sm font-bold text-green-800">{systemLoad.memory}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemLoad.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Разделы админ панели */}
          <div className="space-y-4">
            {adminSections.map((section, index) => (
              <Link key={index} to={section.path} className="block">
                <div className={`card-mobile ${section.color} hover:shadow-lg transition-all duration-200 active:scale-95`}>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{section.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{section.title}</h3>
                      <p className="text-sm opacity-80">{section.description}</p>
                    </div>
                    <div className="text-xl opacity-60">→</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMainMenu')}</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-red-600">🔧 {t('adminPanel')}</h2>
      <p className="text-gray-500 mb-8">{t('adminPanelDescription')}</p>

      {/* Системная нагрузка */}
      <div className="mb-8 bg-gray-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          📊 {t('systemLoad')}
          <Button variant="secondary" onClick={refreshData} disabled={loading} className="ml-auto text-sm">
            {loading ? '⏳ ...' : '🔄 ' + t('refresh')}
          </Button>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-700 mb-2">💻 {t('cpuUsage')}</h4>
            <div className="flex items-center">
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${systemLoad.cpu}%` }}
                ></div>
              </div>
              <span className="ml-3 text-lg font-bold text-blue-800">
                {systemLoad.cpu}%
              </span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-700 mb-2">🧠 {t('memoryUsage')}</h4>
            <div className="flex items-center">
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${systemLoad.memory}%` }}
                ></div>
              </div>
              <span className="ml-3 text-lg font-bold text-green-800">
                {systemLoad.memory}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Разделы админ панели */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section, index) => (
          <Link key={index} to={section.path}>
            <div className={`${section.color} p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl">{section.icon}</div>
                <h3 className="text-xl font-bold">{section.title}</h3>
              </div>
              <p className="opacity-80 mb-4">{section.description}</p>
              <div className="flex items-center justify-end">
                <span className="text-sm font-medium">Перейти →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;