import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout as apiLogout, login as apiLogin } from '../api';
import { isTelegramWebApp, telegramAutoLogin } from '../telegram';
import { setCookie, getCookie, clearAllAuthCookies, isAuthenticated, getAuthToken } from '../utils/cookies';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function useAuth() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tgLoading, setTgLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      // Если пользователь в процессе выхода, не проверяем авторизацию
      if (isLoggingOut) {
        return;
      }
      
      const token = getAuthToken();
      
      // В режиме разработки автоматически авторизуем пользователя
      const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      
      // Проверяем, был ли намеренный выход
      const wasLoggedOut = sessionStorage.getItem('user_logged_out') === 'true';
      
      if (isTelegramWebApp() && !isDev) {
        setTgLoading(true);
        try {
          // Telegram Mini App login: backend должен принимать telegramInitData
          await telegramAutoLogin((data) => apiLogin(data.telegramInitData, ''));
          const profile: Profile = await getProfile();
          setIsAuth(true);
          // Сохраняем токен в cookies при успешной авторизации
          if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'tg-token');
            setCookie('auth_token', 'tg-token');
          }
          // Проверяем админа с учетом тестового режима
          const isTestAdmin = profile.role === 'admin' || profile.id === '1' || localStorage.getItem('test-admin') === 'true';
          setIsAdmin(isTestAdmin);
        } catch {
          setIsAuth(false);
          setIsAdmin(false);
        } finally {
          setTgLoading(false);
          setLoading(false);
        }
      } else if (token || isDev) {
        try {
          const profile: Profile = await getProfile();
          setIsAuth(true);
          // Синхронизируем токены между localStorage и cookies
          if (!localStorage.getItem('token') && token) {
            localStorage.setItem('token', token);
          }
          if (!getCookie('auth_token') && token) {
            setCookie('auth_token', token);
          }
          // Проверяем админа с учетом тестового режима
          const isTestAdmin = profile.role === 'admin' || profile.id === '1' || localStorage.getItem('test-admin') === 'true';
          setIsAdmin(isTestAdmin);
        } catch {
          if (isDev && !wasLoggedOut) {
            // В режиме разработки создаем токен автоматически, но только если не было намеренного выхода
            localStorage.setItem('token', 'dev-token');
            setCookie('auth_token', 'dev-token');
            setIsAuth(true);
            // В режиме разработки проверяем тестовый админ флаг
            setIsAdmin(localStorage.getItem('test-admin') === 'true');
          } else {
            setIsAuth(false);
            setIsAdmin(false);
            // Очищаем токены если авторизация не удалась
            localStorage.removeItem('token');
            clearAllAuthCookies();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [isLoggingOut]);

  const handleLogout = () => {
    console.log('🚪 Logout started');
    
    // СНАЧАЛА обновляем состояние - это самое важное для UI
    setIsAuth(false);
    setIsAdmin(false);
    setLoading(false);
    setForceUpdate(prev => prev + 1); // Принудительное обновление
    console.log('✅ Updated auth state to false IMMEDIATELY');
    
    // Устанавливаем флаг выхода
    setIsLoggingOut(true);
    
    // Отмечаем, что пользователь намеренно вышел
    sessionStorage.setItem('user_logged_out', 'true');
    console.log('✅ Set logout flag in sessionStorage');
    
    // Вызываем API выхода
    apiLogout();
    console.log('✅ Called API logout');
    
    // Очищаем все данные авторизации из localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('test-admin');
    localStorage.clear(); // Полностью очищаем localStorage
    console.log('✅ Cleared localStorage');
    
    // Полностью очищаем все cookies связанные с авторизацией
    clearAllAuthCookies();
    console.log('✅ Cleared all auth cookies');
    
    // Принудительно обновляем компонент еще раз
    setTimeout(() => {
      setForceUpdate(prev => prev + 1);
      console.log('✅ Force updated component');
    }, 50);
    
    // Перенаправляем на страницу логина с задержкой для обновления UI
    setTimeout(() => {
      navigate('/login');
      console.log('✅ Navigated to /login');
    }, 200); // Увеличили задержку
    
    // Сбрасываем флаг выхода через небольшую задержку
    setTimeout(() => {
      setIsLoggingOut(false);
      console.log('✅ Reset logging out flag');
    }, 500);
  };

  const handleAuth = (profile: Profile) => {
    // Очищаем флаг выхода при успешной авторизации
    sessionStorage.removeItem('user_logged_out');
    setIsLoggingOut(false);
    
    setIsAuth(true);
    setIsAdmin(profile.role === 'admin' || profile.id === '1' || localStorage.getItem('test-admin') === 'true');
    // Сохраняем токен в cookies при успешной авторизации
    const token = localStorage.getItem('token');
    if (token && !getCookie('auth_token')) {
      setCookie('auth_token', token);
    }
  };

  return {
    isAuth,
    isAdmin,
    loading,
    tgLoading,
    handleLogout,
    handleAuth,
    forceUpdate // Добавляем для принудительного обновления
  };
}