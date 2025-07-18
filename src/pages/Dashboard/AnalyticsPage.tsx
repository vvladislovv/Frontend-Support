import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  
  // Тестовые данные для аналитики
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
      { name: 'Мой первый бот', messages: 456, users: 34 },
      { name: 'Поддержка клиентов', messages: 321, users: 28 },
      { name: 'Тестовый бот', messages: 189, users: 15 }
    ],
    recentActivity: [
      { time: '2 минуты назад', action: 'Новый тикет от пользователя @user123' },
      { time: '15 минут назад', action: 'Бот "Поддержка" отправил 5 сообщений' },
      { time: '1 час назад', action: 'Создан новый бот "Продажи"' },
      { time: '3 часа назад', action: 'Закрыт тикет #1247' }
    ]
  });

  useEffect(() => {
    // Симулируем загрузку данных
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-xl text-gray-600">
        <svg className="animate-spin h-8 w-8 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Загрузка аналитики...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">← Назад в меню</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">Профиль</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-purple-600">📊 {t('analytics')}</h2>
      <p className="text-gray-500 mb-8">Подробная статистика и аналитика вашего проекта</p>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalBots}</div>
              <div className="text-sm text-blue-700">🤖 Ботов</div>
            </div>
            <div className="text-3xl">🤖</div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{analytics.overview.activeTickets}</div>
              <div className="text-sm text-green-700">🎫 Активных тикетов</div>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{analytics.overview.totalMessages}</div>
              <div className="text-sm text-purple-700">💬 Сообщений</div>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{analytics.overview.totalUsers}</div>
              <div className="text-sm text-orange-700">👥 Пользователей</div>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
        
        <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyan-600">{analytics.overview.uptime}%</div>
              <div className="text-sm text-cyan-700">⚡ Аптайм</div>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Топ ботов */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🏆 Топ ботов по активности
          </h3>
          <div className="space-y-4">
            {analytics.topBots.map((bot, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg">
                <div>
                  <div className="font-semibold">{bot.name}</div>
                  <div className="text-sm text-gray-500">{bot.users} пользователей</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{bot.messages}</div>
                  <div className="text-sm text-gray-500">сообщений</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последняя активность */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🕒 Последняя активность
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
        <h3 className="text-xl font-semibold mb-4">📈 Активность за последние 12 месяцев</h3>
        <div className="grid grid-cols-12 gap-2 h-32">
          {analytics.monthlyStats.messages.map((value, index) => (
            <div key={index} className="flex flex-col justify-end">
              <div 
                className="bg-blue-500 rounded-t"
                style={{ height: `${(value / 420) * 100}%` }}
                title={`Месяц ${index + 1}: ${value} сообщений`}
              ></div>
              <div className="text-xs text-center mt-1">{index + 1}</div>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-2">💬 Сообщения по месяцам</div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 