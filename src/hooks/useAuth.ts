import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout as apiLogout, login as apiLogin } from '../api';
import { isTelegramWebApp, telegramAutoLogin } from '../telegram';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

// Функции для работы с cookies
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const clearAllAuthCookies = () => {
  // Удаляем все возможные cookies связанные с авторизацией
  const cookiesToDelete = [
    'auth_token',
    'token',
    'session',
    'user_id',
    'user_role',
    'remember_me',
    'access_token',
    'refresh_token'
  ];
  
  cookiesToDelete.forEach(cookieName => {
    // Удаляем с разными вариантами пути и домена
    deleteCookie(cookieName);
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  
  // Дополнительная очистка - удаляем ВСЕ cookies для текущего домена
  document.cookie.split(";").forEach(function(c) { 
    const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
    if (cookieName) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    }
  });
};

export function useAuth() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tgLoading, setTgLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token') || getCookie('auth_token');
      
      // В режиме разработки автоматически авторизуем пользователя
      const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      
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
          // Если токен есть только в cookies, сохраняем его в localStorage
          if (!localStorage.getItem('token') && token) {
            localStorage.setItem('token', token);
          }
          // Если токен есть только в localStorage, сохраняем его в cookies
          if (!getCookie('auth_token') && token) {
            setCookie('auth_token', token);
          }
          // Проверяем админа с учетом тестового режима
          const isTestAdmin = profile.role === 'admin' || profile.id === '1' || localStorage.getItem('test-admin') === 'true';
          setIsAdmin(isTestAdmin);
        } catch {
          if (isDev) {
            // В режиме разработки создаем токен автоматически
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
            deleteCookie('auth_token');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = () => {
    // Вызываем API выхода
    apiLogout();
    // Очищаем все данные авторизации из localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('test-admin');
    localStorage.clear(); // Полностью очищаем localStorage
    
    // Полностью очищаем все cookies связанные с авторизацией
    clearAllAuthCookies();
    
    // Обновляем состояние
    setIsAuth(false);
    setIsAdmin(false);
    
    // Перенаправляем на страницу логина
    navigate('/login');
  };

  const handleAuth = (profile: Profile) => {
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
    handleAuth
  };
}