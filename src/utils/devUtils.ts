// Утилиты для разработки

import { clearAllAuthCookies } from './cookies';

// Функция для очистки данных при перезапуске сервера разработки
export const clearDevData = (): boolean => {
  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  if (isDev) {
    // Проверяем, был ли намеренный выход пользователя
    const wasLoggedOut = sessionStorage.getItem('user_logged_out') === 'true';
    
    // Если пользователь намеренно вышел, не очищаем данные автоматически
    if (wasLoggedOut) {
      return false;
    }
    
    // Проверяем, был ли уже запуск в этой сессии
    const sessionKey = 'dev_session_' + Date.now().toString().slice(0, -7); // Уникальный ключ на ~10 минут
    const lastSession = localStorage.getItem('dev_last_session');
    
    // Если это новая сессия разработки
    if (!lastSession || (Date.now() - parseInt(lastSession)) > 10 * 60 * 1000) { // 10 минут
      // Очищаем все auth данные
      localStorage.clear();
      clearAllAuthCookies();
      
      // Сохраняем метку текущей сессии
      localStorage.setItem('dev_last_session', Date.now().toString());
      
      // Также очищаем данные языка, чтобы сбросить на дефолтный
      document.cookie.split(";").forEach(function(c) { 
        const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
        if (cookieName && cookieName.includes('language')) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      return true; // Данные были очищены
    }
  }
  
  return false; // Данные не очищались
};

// Функция для принудительной очистки всех данных (для кнопки в UI)
export const forceCleanAll = (): void => {
  // Отмечаем, что это намеренная очистка
  sessionStorage.setItem('user_logged_out', 'true');
  
  // Очищаем localStorage
  localStorage.clear();
  
  // Очищаем все cookies
  clearAllAuthCookies();
  
  // Перезагружаем страницу на login
  window.location.href = '/login';
};

// Функция для отладки - показывает все сохраненные данные
export const debugStorageData = (): void => {
  // Функция отключена в продакшене
};