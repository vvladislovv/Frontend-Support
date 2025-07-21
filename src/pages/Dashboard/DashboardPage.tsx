import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDashboard } from './useDashboard';
import { useAppApi } from '../../hooks/useApi';
import { isTelegramWebApp } from '../../telegram';
import MobileHeader from '../../components/MobileHeader';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAdmin } = useDashboard();
  const { bots, tickets } = useAppApi();
  const [stats, setStats] = useState({
    botsCount: 0,
    ticketsCount: 0,
    activeUsers: 0,
    messages: 0
  });

  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [botsData, ticketsData] = await Promise.all([
        bots.getBots.execute(),
        tickets.getTickets.execute()
      ]);
      
      setStats({
        botsCount: botsData.length,
        ticketsCount: ticketsData.length,
        activeUsers: botsData.reduce((sum, bot) => sum + (bot.stats?.activeUsers || 0), 0),
        messages: botsData.reduce((sum, bot) => sum + (bot.stats?.messagesCount || 0), 0)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('dashboard')} />
        
        <div className="px-4 py-6 pb-32">
          {/* Приветствие */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">
              {t('welcomeMessage')}
            </h1>
            <p className="tg-hint text-sm">{t('manageServices')}</p>
          </div>

          {/* Админ режим */}
          {isAdmin && (
            <div className="card-mobile bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">👑</span>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">{t('adminModeActive')}</h3>
                  <p className="text-sm text-purple-700">{t('youHaveAdminRights')}</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="mt-3 block w-full text-center py-2 bg-purple-500 text-white rounded-lg font-medium active:bg-purple-600 transition-colors"
              >
                {t('adminPanel')}
              </Link>
            </div>
          )}

          {/* Статистика */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold tg-text mb-3">{t('quickStats')}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-mobile text-center">
                <div className="text-2xl mb-1">🤖</div>
                <div className="text-xl font-bold tg-text">{stats.botsCount}</div>
                <div className="text-sm tg-hint">{t('activeBotsCount')}</div>
              </div>
              <div className="card-mobile text-center">
                <div className="text-2xl mb-1">🎫</div>
                <div className="text-xl font-bold tg-text">{stats.ticketsCount}</div>
                <div className="text-sm tg-hint">{t('newTickets')}</div>
              </div>
              <div className="card-mobile text-center">
                <div className="text-2xl mb-1">👥</div>
                <div className="text-xl font-bold tg-text">{stats.activeUsers}</div>
                <div className="text-sm tg-hint">{t('users')}</div>
              </div>
              <div className="card-mobile text-center">
                <div className="text-2xl mb-1">💬</div>
                <div className="text-xl font-bold tg-text">{stats.messages}</div>
                <div className="text-sm tg-hint">{t('messages')}</div>
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold tg-text mb-3">{t('quickActions')}</h2>
            <div className="space-y-3">
              <Link to="/bots" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold tg-text">{t('manageBots')}</h3>
                  <p className="text-sm tg-hint">{t('configureBotsDescription')}</p>
                </div>
                <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link to="/tickets" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎫</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold tg-text">{t('manageTickets')}</h3>
                  <p className="text-sm tg-hint">{t('monitorTicketsDescription')}</p>
                </div>
                <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link to="/analytics" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold tg-text">{t('analytics')}</h3>
                  <p className="text-sm tg-hint">{t('analyticsDescription')}</p>
                </div>
                <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link to="/crm" className="card-mobile flex items-center gap-4 active:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔗</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold tg-text">{t('manageCRM')}</h3>
                  <p className="text-sm tg-hint">{t('manageCRMDescription')}</p>
                </div>
                <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">{t('controlPanel')}</h1>
          <p className="text-gray-600">{t('dashboardDescription')}</p>
        </div>
        <Link to="/profile" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {t('profile')}
        </Link>
      </div>

      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-900">{t('adminMode')}</h3>
              <p className="text-sm text-purple-700">{t('youHaveAdminRights')}</p>
            </div>
            <Link
              to="/admin"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              {t('adminPanel')}
            </Link>
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('activeBots')}</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.botsCount}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('openTickets')}</h3>
          <p className="text-2xl font-bold text-green-600">{stats.ticketsCount}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('users')}</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.activeUsers}</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">{t('messages')}</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.messages}</p>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/bots"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('manageBots')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('configureBotsDescription')}</p>
        </Link>

        <Link
          to="/tickets"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🎫</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('viewTickets')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('monitorTicketsDescription')}</p>
        </Link>

        <Link
          to="/analytics"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('analytics')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('analyticsDescription')}</p>
        </Link>

        <Link
          to="/crm"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('crmIntegration')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('manageCRMDescription')}</p>
        </Link>

        <Link
          to="/billing"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('billing')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('billingDescription')}</p>
        </Link>

        <Link
          to="/referrals"
          className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-lg font-semibold text-black">{t('referrals')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('referralsDescription')}</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;