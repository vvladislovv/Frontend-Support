import { useState } from 'react';
import { isTelegramWebApp } from '../telegram';

const DevModeIndicator: React.FC = () => {
  const [isTestAdmin, setIsTestAdmin] = useState(localStorage.getItem('test-admin') === 'true');
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  const isTg = isTelegramWebApp();

  if (!isDev) return null;

  const toggleTestAdmin = () => {
    const newValue = !isTestAdmin;
    setIsTestAdmin(newValue);
    if (newValue) {
      localStorage.setItem('test-admin', 'true');
    } else {
      localStorage.removeItem('test-admin');
    }
    // Перезагружаем страницу для применения изменений
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {/* Основной индикатор */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-xs font-mono shadow-mobile">
        <div className="text-yellow-800 font-semibold mb-1">DEV MODE</div>
        <div className="text-yellow-700 text-[10px] space-y-0.5">
          <div>ENV: {process.env.NODE_ENV}</div>
          <div>HOST: {window.location.hostname}</div>
          {isTg && <div>TG: WebApp</div>}
        </div>
      </div>

      {/* Кнопка переключения админа */}
      <button
        onClick={toggleTestAdmin}
        className={`px-3 py-2 rounded-lg text-xs font-mono shadow-mobile transition-colors ${
          isTestAdmin 
            ? 'bg-red-100 border border-red-300 text-red-800' 
            : 'bg-gray-100 border border-gray-300 text-gray-800'
        }`}
      >
        {isTestAdmin ? '👑 ADMIN ON' : '👤 ADMIN OFF'}
      </button>
    </div>
  );
};

export default DevModeIndicator;