import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';
import { getSystemLoad } from '../../api';

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    incoming: number;
    outgoing: number;
  };
  uptime: string;
  activeUsers: number;
  totalRequests: number;
  errorRate: number;
}

const SystemMonitorPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 45,
    network: {
      incoming: 1.2,
      outgoing: 0.8
    },
    uptime: '15 дней 8 часов',
    activeUsers: 127,
    totalRequests: 45892,
    errorRate: 0.3
  });
  
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const systemLoad = await getSystemLoad();
      setStats(prev => ({
        ...prev,
        cpu: systemLoad.cpu,
        memory: systemLoad.memory,
        // Симуляция других метрик
        disk: Math.floor(Math.random() * 20) + 40,
        network: {
          incoming: Math.random() * 2 + 0.5,
          outgoing: Math.random() * 1.5 + 0.3
        },
        activeUsers: Math.floor(Math.random() * 50) + 100,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 100),
        errorRate: Math.random() * 1
      }));
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchStats, 10000); // Обновление каждые 10 секунд
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600 bg-red-50';
    if (value >= thresholds.warning) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressBarColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500';
    if (value >= thresholds.warning) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('systemMonitoring')} showBack={true} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Link to="/admin" className="btn-secondary-mobile flex-1 text-center">
                ← {t('backToAdminPanel')}
              </Link>
              <Link to="/dashboard" className="btn-primary-mobile flex-1 text-center">
                🏠 {t('backToMainMenu')}
              </Link>
            </div>
            <h1 className="text-2xl font-bold tg-text mb-2">⚙️ {t('systemMonitoring')}</h1>
            <p className="tg-hint text-sm">{t('systemMonitoringDescription')}</p>
          </div>

          {/* Управление */}
          <div className="card-mobile mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">Управление</h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm tg-text">
                  Авто-обновление
                </label>
              </div>
            </div>
            
            <button
              onClick={fetchStats}
              disabled={loading}
              className="btn-primary-mobile w-full"
            >
              {loading ? '⏳ Обновление...' : '🔄 Обновить данные'}
            </button>
          </div>

          {/* Основные метрики */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card-mobile">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium tg-text">💻 CPU</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.cpu, { warning: 70, critical: 90 })}`}>
                  {stats.cpu}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(stats.cpu, { warning: 70, critical: 90 })}`}
                  style={{ width: `${stats.cpu}%` }}
                ></div>
              </div>
            </div>

            <div className="card-mobile">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium tg-text">🧠 RAM</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.memory, { warning: 80, critical: 95 })}`}>
                  {stats.memory}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(stats.memory, { warning: 80, critical: 95 })}`}
                  style={{ width: `${stats.memory}%` }}
                ></div>
              </div>
            </div>

            <div className="card-mobile">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium tg-text">💾 Диск</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.disk, { warning: 80, critical: 95 })}`}>
                  {stats.disk}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(stats.disk, { warning: 80, critical: 95 })}`}
                  style={{ width: `${stats.disk}%` }}
                ></div>
              </div>
            </div>

            <div className="card-mobile">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium tg-text">📊 Ошибки</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.errorRate, { warning: 1, critical: 5 })}`}>
                  {stats.errorRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(stats.errorRate, { warning: 1, critical: 5 })}`}
                  style={{ width: `${Math.min(stats.errorRate * 20, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Сетевая активность */}
          <div className="card-mobile mb-6">
            <h3 className="text-lg font-semibold tg-text mb-4">🌐 Сеть</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm tg-text">⬇️ Входящий трафик</span>
                <span className="text-sm font-medium text-blue-600">
                  {stats.network.incoming.toFixed(1)} MB/s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm tg-text">⬆️ Исходящий трафик</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.network.outgoing.toFixed(1)} MB/s
                </span>
              </div>
            </div>
          </div>

          {/* Общая статистика */}
          <div className="card-mobile">
            <h3 className="text-lg font-semibold tg-text mb-4">📈 Статистика</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
                <div className="text-xs tg-hint">Активных пользователей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalRequests.toLocaleString()}</div>
                <div className="text-xs tg-hint">Всего запросов</div>
              </div>
              <div className="text-center col-span-2">
                <div className="text-lg font-bold text-purple-600">{stats.uptime}</div>
                <div className="text-xs tg-hint">Время работы</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/admin">
          <Button variant="secondary">← {t('backToAdminPanel')}</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary">{t('backToMainMenu')}</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-orange-600">⚙️ {t('systemMonitoring')}</h2>
      <p className="text-gray-500 mb-8">{t('systemMonitoringDescription')}</p>

      {/* Управление */}
      <div className="mb-6 bg-gray-50 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={fetchStats} disabled={loading}>
              {loading ? '⏳ Обновление...' : '🔄 Обновить данные'}
            </Button>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm font-medium">
                Авто-обновление (10 сек)
              </label>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
          </div>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">💻 CPU Usage</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(stats.cpu, { warning: 70, critical: 90 })}`}>
              {stats.cpu}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(stats.cpu, { warning: 70, critical: 90 })}`}
              style={{ width: `${stats.cpu}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">🧠 Memory Usage</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(stats.memory, { warning: 80, critical: 95 })}`}>
              {stats.memory}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(stats.memory, { warning: 80, critical: 95 })}`}
              style={{ width: `${stats.memory}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">💾 Disk Usage</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(stats.disk, { warning: 80, critical: 95 })}`}>
              {stats.disk}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(stats.disk, { warning: 80, critical: 95 })}`}
              style={{ width: `${stats.disk}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">📊 Error Rate</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(stats.errorRate, { warning: 1, critical: 5 })}`}>
              {stats.errorRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(stats.errorRate, { warning: 1, critical: 5 })}`}
              style={{ width: `${Math.min(stats.errorRate * 20, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Сетевая активность */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">🌐 Сетевая активность</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">⬇️ Входящий трафик</span>
              <span className="text-lg font-bold text-blue-800">
                {stats.network.incoming.toFixed(1)} MB/s
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">⬆️ Исходящий трафик</span>
              <span className="text-lg font-bold text-green-800">
                {stats.network.outgoing.toFixed(1)} MB/s
              </span>
            </div>
          </div>
        </div>

        {/* Общая статистика */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">📈 Общая статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.activeUsers}</div>
              <div className="text-sm text-purple-700">Активных пользователей</div>
            </div>
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalRequests.toLocaleString()}</div>
              <div className="text-sm text-indigo-700">Всего запросов</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded-lg col-span-2">
              <div className="text-xl font-bold text-teal-600">{stats.uptime}</div>
              <div className="text-sm text-teal-700">Время работы системы</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitorPage;