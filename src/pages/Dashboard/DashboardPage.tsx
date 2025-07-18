import { Link } from 'react-router-dom';
import { useDashboard } from './useDashboard';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';
import { 
  ChatBubbleLeftRightIcon,
  TicketIcon,
  ChartBarIcon,
  UserGroupIcon,
  HandRaisedIcon,
  CreditCardIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { isAdmin } = useDashboard();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  const dashboardItems = [
    {
      href: '/bots',
      icon: ChatBubbleLeftRightIcon,
      title: 'Боты',
      description: 'Настройка и управление Telegram ботами',
      color: 'blue',
      emoji: '🤖'
    },
    {
      href: '/tickets',
      icon: TicketIcon,
      title: 'Тикеты',
      description: 'Мониторинг и ответы на обращения клиентов',
      color: 'green',
      emoji: '🎫'
    },
    {
      href: '/analytics',
      icon: ChartBarIcon,
      title: 'Аналитика',
      description: 'Обзор активности и статистики',
      color: 'purple',
      emoji: '📊'
    },
    {
      href: '/crm',
      icon: UserGroupIcon,
      title: 'CRM',
      description: 'Управление подключениями и данными CRM',
      color: 'yellow',
      emoji: '📇'
    },
    {
      href: '/greetings',
      icon: HandRaisedIcon,
      title: 'Приветствия',
      description: 'Настройка автоматических приветственных сообщений',
      color: 'pink',
      emoji: '👋'
    },
    {
      href: '/billing',
      icon: CreditCardIcon,
      title: 'Биллинг',
      description: 'Управление подпиской и тарифными планами',
      color: 'cyan',
      emoji: '💳'
    },
    {
      href: '/referrals',
      icon: UsersIcon,
      title: 'Рефералы',
      description: 'Управление реферальными ссылками и отслеживание конверсий',
      color: 'gray',
      emoji: '👥'
    }
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title="Главная" />
        
        <div className="px-4 py-6">
          {/* Приветствие */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">
              Добро пожаловать! 👋
            </h1>
            <p className="tg-hint text-sm">
              Управляйте своими ботами и сервисами
            </p>
          </div>

          {/* Админ уведомление */}
          {isAdmin && (
            <div className="card-mobile mb-6 bg-red-50 border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <CogIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-red-700 font-medium text-sm">Режим администратора</p>
                    <p className="text-red-600 text-xs">У вас есть права администратора</p>
                  </div>
                </div>
                <Link
                  to="/admin"
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium active:bg-red-700 transition-colors"
                >
                  Админ
                </Link>
              </div>
            </div>
          )}

          {/* Сетка сервисов */}
          <div className="grid grid-cols-2 gap-4">
            {dashboardItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="card-mobile group active:scale-95 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-3 group-active:scale-95 transition-transform`}>
                      <span className="text-2xl">{item.emoji}</span>
                    </div>
                    <h3 className={`font-semibold text-${item.color}-700 mb-1 text-sm`}>
                      {item.title}
                    </h3>
                    <p className="text-xs tg-hint leading-tight">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Статистика */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold tg-text mb-4">Быстрая статистика</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-mobile text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                <div className="text-xs tg-hint">Активных ботов</div>
              </div>
              <div className="card-mobile text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">48</div>
                <div className="text-xs tg-hint">Новых тикетов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl mt-20 flex flex-col gap-8 border border-blue-100">
      <h2 className="text-3xl font-extrabold mb-2 text-blue-800 text-center drop-shadow-sm tracking-tight">
        Панель управления
      </h2>
      
      {isAdmin && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-red-700 font-semibold">🔧 Режим администратора активен</span>
            <Link to="/admin" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Панель администратора
            </Link>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`group flex flex-col items-center justify-center bg-${item.color}-50 hover:bg-${item.color}-100 transition rounded-xl p-6 shadow border border-${item.color}-100`}
            >
              <span className="text-4xl mb-2">{item.emoji}</span>
              <span className={`text-lg font-semibold text-${item.color}-700 group-hover:underline`}>
                {item.title}
              </span>
              <span className="text-gray-400 text-sm mt-1 text-center">
                {item.description}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;