import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getProfile, logout as apiLogout } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import MobileHeader from '../components/MobileHeader';
import { isTelegramWebApp } from '../telegram';
import { 
  UserIcon, 
  EnvelopeIcon, 
  IdentificationIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  // Тестовые данные для профиля
  const [stats] = useState({
    totalBots: 3,
    activeTickets: 5,
    totalMessages: 1247,
    joinDate: '15 января 2024',
    lastLogin: '2 часа назад',
    subscription: 'Профессиональный',
    subscriptionExpiry: '15 февраля 2025'
  });

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError(t('errorLoadingData')))
      .finally(() => setLoading(false));
  }, [t]);

  const handleLogout = () => {
    apiLogout();
    navigate('/login');
  };

  const toggleAdmin = () => {
    const isAdmin = localStorage.getItem('test-admin') === 'true';
    localStorage.setItem('test-admin', (!isAdmin).toString());
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen tg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg tg-text">Загрузка профиля...</p>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!profile) return null;

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title="Профиль" showMenu={true} onLogout={handleLogout} isAuth={true} />
        
        <div className="px-4 py-6">
          {/* Аватар и основная информация */}
          <div className="card-mobile mb-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold tg-text mb-1">{profile.name}</h1>
            <p className="tg-hint text-sm mb-3">{profile.email}</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              profile.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {profile.role === 'admin' ? (
                <>
                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                  Администратор
                </>
              ) : (
                <>
                  <UserIcon className="w-3 h-3 mr-1" />
                  Пользователь
                </>
              )}
            </div>
          </div>

          {/* Статистика */}
          <div className="card-mobile mb-6">
            <h2 className="text-lg font-semibold tg-text mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Статистика
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{stats.totalBots}</div>
                <div className="text-xs tg-hint">Ботов</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{stats.activeTickets}</div>
                <div className="text-xs tg-hint">Тикетов</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{stats.totalMessages}</div>
                <div className="text-xs tg-hint">Сообщений</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-xs tg-hint">Аптайм</div>
              </div>
            </div>
          </div>

          {/* Информация об аккаунте */}
          <div className="card-mobile mb-6">
            <h2 className="text-lg font-semibold tg-text mb-4">Информация об аккаунте</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">Дата регистрации</span>
                </div>
                <span className="text-sm tg-hint">{stats.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">Последний вход</span>
                </div>
                <span className="text-sm tg-hint">{stats.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCardIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">Подписка</span>
                </div>
                <span className="text-sm font-medium text-green-600">{stats.subscription}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">Действует до</span>
                </div>
                <span className="text-sm tg-hint">{stats.subscriptionExpiry}</span>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-3">
            <button
              onClick={() => alert('Функция в разработке!')}
              className="btn-secondary-mobile w-full flex items-center justify-center"
            >
              <CogIcon className="w-4 h-4 mr-2" />
              Настройки
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={toggleAdmin}
                className="btn-secondary-mobile w-full flex items-center justify-center"
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Переключить админа (тест)
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="btn-primary-mobile w-full flex items-center justify-center bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">← Назад в меню</Button>
        </Link>
        <Link to="/analytics">
          <Button variant="primary">Аналитика</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основная информация */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">👤 Профиль пользователя</h2>
          
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-600">Имя:</div>
                <div className="text-lg">{profile.name}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">Email:</div>
                <div className="text-lg">{profile.email}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">ID пользователя:</div>
                <div className="text-lg font-mono">{profile.id}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">Роль:</div>
                <div className="text-lg">
                  <span className={`px-3 py-1 rounded-full text-sm ${profile.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {profile.role === 'admin' ? '👑 Администратор' : '👤 Пользователь'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-blue-50 p-6 rounded-xl mb-6">
            <h3 className="text-xl font-bold mb-4 text-blue-800">📊 Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalBots}</div>
                <div className="text-sm text-gray-600">Ботов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.activeTickets}</div>
                <div className="text-sm text-gray-600">Активных тикетов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalMessages}</div>
                <div className="text-sm text-gray-600">Сообщений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Аптайм</div>
              </div>
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div>
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-bold mb-4">ℹ️ Информация об аккаунте</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Дата регистрации:</span>
                <div>{stats.joinDate}</div>
              </div>
              <div>
                <span className="font-semibold">Последний вход:</span>
                <div>{stats.lastLogin}</div>
              </div>
              <div>
                <span className="font-semibold">Подписка:</span>
                <div className="text-green-600 font-semibold">{stats.subscription}</div>
              </div>
              <div>
                <span className="font-semibold">Действует до:</span>
                <div>{stats.subscriptionExpiry}</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-3">
            <Button className="w-full" onClick={() => alert('Функция в разработке!')}>
              ⚙️ Настройки
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button className="w-full" variant="secondary" onClick={toggleAdmin}>
                🔧 Переключить админа (тест)
              </Button>
            )}
            <Button className="w-full" variant="danger" onClick={handleLogout}>
              🚪 Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 