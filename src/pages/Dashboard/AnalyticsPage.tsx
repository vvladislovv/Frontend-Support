import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showBotsModal, setShowBotsModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  // {t('testData')}
  const [analytics] = useState({
    overview: {
      totalBots: 3,
      activeTickets: 5,
      totalMessages: 1247,
      totalUsers: 89,
      uptime: 99.8
    },
    monthlyStats: {
      messages: [120, 150, 180, 220, 190, 240, 280, 320, 290, 350, 380, 420],
      users: [10, 15, 22, 28, 35, 42, 48, 55, 63, 71, 78, 89],
      tickets: [2, 3, 1, 4, 2, 5, 3, 6, 4, 2, 3, 5]
    },
    topBots: [
      { name: t('myFirstBot'), messages: 456, users: 34 },
      { name: t('customerSupport'), messages: 321, users: 28 },
      { name: t('testBot'), messages: 189, users: 15 }
    ],
    recentActivity: [
      { time: `2 ${t('minutesAgo')}`, action: `${t('newTicketFrom')} @user123` },
      { time: `15 ${t('minutesAgo')}`, action: `${t('customerSupport')} ${t('botSentMessages')} 5` },
      { time: `1 ${t('hourAgo')}`, action: `${t('createdNewBot')} "Продажи"` },
      { time: `3 ${t('hoursAgo')}`, action: `${t('closedTicket')} #1247` }
    ]
  });

  useEffect(() => {
    // {t('simulateDataLoading')}
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen tg-bg text-xl tg-text">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>{t('loadingAnalytics')}</span>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('analytics')} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">📊 {t('analytics')}</h1>
            <p className="tg-hint text-sm">{t('detailedStatistics')}</p>
          </div>

          {/* Основные метрики */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card-mobile bg-blue-50 border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.overview.totalBots}</div>
              <div className="text-xs tg-hint">🤖 {t('bots')}</div>
            </div>
            <div className="card-mobile bg-green-50 border-green-200 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{analytics.overview.activeTickets}</div>
              <div className="text-xs tg-hint">🎫 {t('tickets')}</div>
            </div>
            <div className="card-mobile bg-purple-50 border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{analytics.overview.totalMessages}</div>
              <div className="text-xs tg-hint">💬 {t('messages')}</div>
            </div>
            <div className="card-mobile bg-orange-50 border-orange-200 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{analytics.overview.totalUsers}</div>
              <div className="text-xs tg-hint">👥 {t('users')}</div>
            </div>
          </div>

          {/* Аптайм */}
          <div className="card-mobile mb-6 bg-cyan-50 border-cyan-200 text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-1">{analytics.overview.uptime}%</div>
            <div className="text-sm tg-hint">⚡ {t('systemUptime')}</div>
          </div>

          {/* Топ ботов */}
          <div className="card-mobile mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">🏆 {t('topBots')}</h2>
              <button
                onClick={() => setShowBotsModal(true)}
                className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm font-medium active:bg-purple-600 transition-colors"
              >
                📊 Детали
              </button>
            </div>
            <div className="space-y-3">
              {analytics.topBots.map((bot, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm tg-text">{bot.name}</div>
                      <div className="text-xs tg-hint">{bot.users} {t('usersCount')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{bot.messages}</div>
                    <div className="text-xs tg-hint">{t('messagesCount')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Последняя активность */}
          <div className="card-mobile mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">🕒 {t('activity')}</h2>
              <button
                onClick={() => setShowActivityModal(true)}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600 transition-colors"
              >
                👁️ Подробнее
              </button>
            </div>
            <div className="space-y-3">
              {analytics.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm tg-text">{activity.action}</div>
                    <div className="text-xs tg-hint">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* График активности */}
          <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">📈 {t('activityYear')}</h2>
              <button
                onClick={() => setShowYearModal(true)}
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium active:bg-green-600 transition-colors"
              >
                📅 Год
              </button>
            </div>
            <div className="grid grid-cols-12 gap-1 h-24 mb-3">
              {analytics.monthlyStats.messages.map((value, index) => (
                <div key={index} className="flex flex-col justify-end">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(value / 420) * 100}%` }}
                  ></div>
                  <div className="text-xs text-center mt-1 tg-hint">{index + 1}</div>
                </div>
              ))}
            </div>
            <div className="text-sm tg-hint text-center">💬 {t('messagesByMonth')}</div>
          </div>

          {/* Модальные окна */}
          <Modal open={showActivityModal} onClose={() => setShowActivityModal(false)} title="🕒 Подробная активность">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Детали: Пользователь выполнил действие в системе
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Modal>

          <Modal open={showBotsModal} onClose={() => setShowBotsModal(false)} title="🏆 Детальная статистика ботов">
            <div className="space-y-4">
              {analytics.topBots.map((bot, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{bot.name}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">#{index + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Сообщений:</div>
                      <div className="font-bold text-blue-600">{bot.messages}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Пользователей:</div>
                      <div className="font-bold text-green-600">{bot.users}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Активность:</div>
                      <div className="font-bold text-purple-600">{Math.round(bot.messages / bot.users)} сообщ/польз</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Статус:</div>
                      <div className="font-bold text-green-600">🟢 Активен</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Modal>

          <Modal open={showYearModal} onClose={() => setShowYearModal(false)} title="📅 Активность за год">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 h-40">
                {analytics.monthlyStats.messages.map((value, index) => (
                  <div key={index} className="flex flex-col justify-end items-center">
                    <div className="text-xs font-bold text-blue-600 mb-1">{value}</div>
                    <div 
                      className="bg-blue-500 rounded-t w-full"
                      style={{ height: `${(value / 420) * 100}%` }}
                    ></div>
                    <div className="text-xs mt-1 font-medium">{index + 1}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {analytics.monthlyStats.messages.reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-xs text-blue-700">Всего сообщений</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {analytics.monthlyStats.users.reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-xs text-green-700">Всего пользователей</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round(analytics.monthlyStats.messages.reduce((a, b) => a + b, 0) / 12)}
                  </div>
                  <div className="text-xs text-purple-700">Среднее в месяц</div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMenu')}</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">{t('profile')}</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-purple-600">📊 {t('analytics')}</h2>
      <p className="text-gray-500 mb-8">{t('detailedAnalytics')}</p>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalBots}</div>
              <div className="text-sm text-blue-700">🤖 {t('bots')}</div>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{analytics.overview.activeTickets}</div>
              <div className="text-sm text-green-700">🎫 {t('tickets')}</div>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{analytics.overview.totalMessages}</div>
              <div className="text-sm text-purple-700">💬 {t('messages')}</div>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{analytics.overview.totalUsers}</div>
              <div className="text-sm text-orange-700">👥 {t('users')}</div>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
        
        <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyan-600">{analytics.overview.uptime}%</div>
              <div className="text-sm text-cyan-700">⚡ {t('uptime')}</div>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Топ ботов */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🏆 {t('topBotsByActivity')}
          </h3>
          <div className="space-y-4">
            {analytics.topBots.map((bot, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg">
                <div>
                  <div className="font-semibold">{bot.name}</div>
                  <div className="text-sm text-gray-500">{bot.users} {t('usersCount')}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{bot.messages}</div>
                  <div className="text-sm text-gray-500">{t('messagesCount')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последняя активность */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🕒 {t('recentActivity')}
          </h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-sm">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* График активности (простая визуализация) */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">📈 {t('activityLast12Months')}</h3>
        <div className="grid grid-cols-12 gap-2 h-32">
          {analytics.monthlyStats.messages.map((value, index) => (
            <div key={index} className="flex flex-col justify-end">
              <div 
                className="bg-blue-500 rounded-t"
                style={{ height: `${(value / 420) * 100}%` }}
                title={`${t('month')} ${index + 1}: ${value} ${t('messagesCount')}`}
              ></div>
              <div className="text-xs text-center mt-1">{index + 1}</div>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-2">💬 {t('messagesByMonth')}</div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 