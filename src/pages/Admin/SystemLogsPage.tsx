import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: string;
}

const SystemLogsPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2024-01-16T10:30:15Z",
      level: "info",
      message: "Пользователь успешно авторизован",
      source: "auth.service",
      details: "User ID: 123, Email: test@example.com"
    },
    {
      id: "2",
      timestamp: "2024-01-16T10:28:42Z",
      level: "warning",
      message: "Превышен лимит запросов API",
      source: "api.middleware",
      details: "Rate limit: 100 req/min, Current: 105 req/min"
    },
    {
      id: "3",
      timestamp: "2024-01-16T10:25:33Z",
      level: "error",
      message: "Ошибка подключения к базе данных",
      source: "database.connection",
      details: "Connection timeout after 30s"
    },
    {
      id: "4",
      timestamp: "2024-01-16T10:22:18Z",
      level: "info",
      message: "Создан новый бот",
      source: "bot.service",
      details: "Bot ID: bot_456, Name: Test Bot"
    },
    {
      id: "5",
      timestamp: "2024-01-16T10:20:05Z",
      level: "debug",
      message: "Обработка webhook от Telegram",
      source: "telegram.webhook",
      details: "Update ID: 789, Chat ID: 987654321"
    },
    {
      id: "6",
      timestamp: "2024-01-16T10:18:27Z",
      level: "warning",
      message: "Низкий уровень свободной памяти",
      source: "system.monitor",
      details: "Available memory: 15%, Threshold: 20%"
    },
    {
      id: "7",
      timestamp: "2024-01-16T10:15:44Z",
      level: "info",
      message: "Запущена задача очистки логов",
      source: "cleanup.service",
      details: "Removed 1000 old log entries"
    },
    {
      id: "8",
      timestamp: "2024-01-16T10:12:11Z",
      level: "error",
      message: "Не удалось отправить уведомление",
      source: "notification.service",
      details: "SMTP server connection failed"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const refreshLogs = async () => {
    setLoading(true);
    // Симуляция загрузки новых логов
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const clearLogs = async () => {
    if (!window.confirm('Очистить все логи? Это действие нельзя отменить.')) return;
    setLogs([]);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'debug': return '🔍';
      default: return '📝';
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('systemLogs')} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">📋 {t('systemLogs')}</h1>
            <p className="tg-hint text-sm">{t('systemLogsDescription')}</p>
          </div>

          {/* Фильтры и поиск */}
          <div className="card-mobile mb-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Поиск в логах..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-mobile"
              />
            </div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {['all', 'error', 'warning', 'info', 'debug'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                  }`}
                >
                  {level === 'all' ? 'Все' : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={refreshLogs}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Обновление...' : '🔄 Обновить'}
              </button>
              <button
                onClick={clearLogs}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium active:bg-red-600 transition-colors"
              >
                🗑️ Очистить
              </button>
            </div>
          </div>

          {/* Логи */}
          <div className="space-y-3">
            {filteredLogs.length > 0 ? filteredLogs.map(log => (
              <div key={log.id} className="card-mobile">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-lg">{getLevelIcon(log.level)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-xs tg-hint">
                        {new Date(log.timestamp).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm tg-text font-medium mb-1">{log.message}</p>
                    <p className="text-xs tg-hint mb-2">Источник: {log.source}</p>
                    {log.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer tg-hint hover:text-blue-600">
                          Подробности
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-gray-700">
                          {log.details}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="card-mobile text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p className="tg-hint">Логи не найдены</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/admin">
          <Button variant="secondary">{t('backToAdminPanel')}</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-gray-600">📋 {t('systemLogs')}</h2>
      <p className="text-gray-500 mb-8">{t('systemLogsDescription')}</p>

      {/* Фильтры и управление */}
      <div className="mb-6 bg-gray-50 p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Поиск в логах..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <Button onClick={refreshLogs} disabled={loading} className="flex-1">
              {loading ? '⏳ Обновление...' : '🔄 Обновить'}
            </Button>
            <Button variant="danger" onClick={clearLogs} className="flex-1">
              🗑️ Очистить
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {['all', 'error', 'warning', 'info', 'debug'].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {level === 'all' ? 'Все' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица логов */}
      <div className="space-y-2">
        {filteredLogs.length > 0 ? filteredLogs.map(log => (
          <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-xl">{getLevelIcon(log.level)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString('ru-RU')}
                  </span>
                  <span className="text-sm text-gray-400">
                    {log.source}
                  </span>
                </div>
                <p className="text-gray-900 font-medium mb-2">{log.message}</p>
                {log.details && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-blue-600">
                      Подробности
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-gray-700 font-mono text-xs">
                      {log.details}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">Логи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogsPage;