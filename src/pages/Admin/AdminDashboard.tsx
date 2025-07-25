import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { adminService } from '../../services';
import { isTelegramWebApp } from '../../telegram';
import MobileHeader from '../../components/MobileHeader';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalBots: 0,
    totalTickets: 0,
    openTickets: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await adminService.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('adminPanel')} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">👑 {t('adminPanel')}</h1>
            <p className="tg-hint text-sm">{t('adminPanelDescription')}</p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="card-mobile text-center">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-xl font-bold tg-text">{stats.totalClients}</div>
              <div className="text-sm tg-hint">{t('clients')}</div>
            </div>
            <div className="card-mobile text-center">
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-xl font-bold tg-text">{stats.totalBots}</div>
              <div className="text-sm tg-hint">{t('bots')}</div>
            </div>
            <div className="card-mobile text-center">
              <div className="text-2xl mb-1">🎫</div>
              <div className="text-xl font-bold tg-text">{stats.totalTickets}</div>
              <div className="text-sm tg-hint">{t('tickets')}</div>
            </div>
            <div className="card-mobile text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-xl font-bold tg-text">{stats.totalRevenue}₽</div>
              <div className="text-sm tg-hint">Доход</div>
            </div>
          </div>

          {/* Меню админки */}
          <div className="space-y-3">
            <Link to="/admin/users" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold tg-text">{t('userManagement')}</h3>
                <p className="text-sm tg-hint">{t('userManagementDescription')}</p>
              </div>
              <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/admin/tariffs" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold tg-text">{t('tariffManagement')}</h3>
                <p className="text-sm tg-hint">{t('tariffManagementDescription')}</p>
              </div>
              <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/admin/promo-codes" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎟️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold tg-text">Промокоды</h3>
                <p className="text-sm tg-hint">Управление промокодами</p>
              </div>
              <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/admin/monitor" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold tg-text">{t('systemMonitoring')}</h3>
                <p className="text-sm tg-hint">{t('systemMonitoringDescription')}</p>
              </div>
              <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link to="/admin/logs" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold tg-text">{t('systemLogs')}</h3>
                <p className="text-sm tg-hint">{t('systemLogsDescription')}</p>
              </div>
              <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">👑 {t('adminPanel')}</h1>
          <p className="text-gray-600">{t('adminPanelDescription')}</p>
        </div>
        <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {t('backToMenu')}
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('clients')}</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalClients}</p>
          <p className="text-sm text-gray-500">Активных: {stats.activeClients}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('bots')}</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalBots}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('tickets')}</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalTickets}</p>
          <p className="text-sm text-gray-500">Открытых: {stats.openTickets}</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Доход</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.totalRevenue}₽</p>
          <p className="text-sm text-gray-500">За месяц: {stats.monthlyRevenue}₽</p>
        </div>
      </div>

      {/* Меню админки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('userManagement')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('userManagementDescription')}</p>
        </Link>

        <Link
          to="/admin/tariffs"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('tariffManagement')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('tariffManagementDescription')}</p>
        </Link>

        <Link
          to="/admin/promo-codes"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🎟️</span>
            </div>
            <h3 className="text-lg font-semibold text-black">Промокоды</h3>
          </div>
          <p className="text-gray-600 text-sm">Управление промокодами и скидками</p>
        </Link>

        <Link
          to="/admin/monitor"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('systemMonitoring')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('systemMonitoringDescription')}</p>
        </Link>

        <Link
          to="/admin/logs"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('systemLogs')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('systemLogsDescription')}</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;