import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getProfile, logout as apiLogout, login as apiLogin } from '../api';
import { isTelegramWebApp, telegramAutoLogin } from '../telegram';
import { setCookie, getCookie, clearAllAuthCookies, getAuthToken, shouldAutoLogin, getSavedUserInfo, saveUserSession } from '../utils/cookies';
// Локальное определение типа для useAuth
interface UseAuthReturn {
  isAuth: boolean;
  isAdmin: boolean;
  loading: boolean;
  tgLoading: boolean;
  handleLogout: () => void;
  handleAuth: (profile: Profile) => void;
  forceUpdate: number;
}

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tgLoading, setTgLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    async function checkAuth(): Promise<void> {
      // Если пользователь в процессе выхода, не проверяем авторизацию
      if (isLoggingOut) {
        return;
      }
      
      const token = getAuthToken();
      
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
          // Проверяем админа с учетом тестового режима - включаем админку для всех
          const isTestAdmin = true; // Временно включаем админку для всех пользователей
          setIsAdmin(isTestAdmin);
        } catch {
          setIsAuth(false);
          setIsAdmin(false);
        } finally {
          setTgLoading(false);
          setLoading(false);
        }
      } else if (token) {
        try {
          // Проверяем, должен ли пользователь автоматически войти
          if (shouldAutoLogin()) {
            console.log('Auto-login enabled, attempting automatic authentication...');
            
            // Пытаемся получить сохраненную информацию о пользователе
            const savedUserInfo = getSavedUserInfo();
            if (savedUserInfo) {
              console.log('Found saved user info, using it for quick login:', savedUserInfo);
              setIsAuth(true);
              setIsAdmin(true); // Включаем админку для всех
              setLoading(false);
              
              // В фоне проверяем актуальность токена
              getProfile().catch(() => {
                console.log('Token expired, clearing auth data');
                setIsAuth(false);
                setIsAdmin(false);
                clearAllAuthCookies();
                localStorage.removeItem('token');
              });
              
              return;
            }
          }
          
          // Обычная проверка через API
          const profile: Profile = await getProfile();
          setIsAuth(true);
          
          // Синхронизируем токены между localStorage и cookies
          if (!localStorage.getItem('token') && token) {
            localStorage.setItem('token', token);
          }
          if (!getCookie('auth_token') && token) {
            setCookie('auth_token', token);
          }
          
          // Сохраняем информацию о пользователе для будущих автоматических входов
          saveUserSession(token, profile);
          
          // Проверяем админа с учетом тестового режима - включаем админку для всех
          const isTestAdmin = true; // Временно включаем админку для всех пользователей
          setIsAdmin(isTestAdmin);
        } catch (error) {
          console.log('Authentication failed:', error);
          setIsAuth(false);
          setIsAdmin(false);
          
          // Очищаем токены только если это ошибка 401 (неавторизован) или 403 (запрещено)
          if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            console.log('Token is invalid, clearing auth data');
            localStorage.removeItem('token');
            clearAllAuthCookies();
          }
          // Для других ошибок (сеть, сервер) не очищаем токены
        } finally {
          setLoading(false);
        }
      } else {
        // No token found - user is not authenticated
        setIsAuth(false);
        setIsAdmin(false);
        setLoading(false);
      }
    }
    checkAuth();
  }, [isLoggingOut]);

  const handleLogout = () => {
    // СНАЧАЛА обновляем состояние - это самое важное для UI
    setIsAuth(false);
    setIsAdmin(false);
    setLoading(false);
    setForceUpdate(prev => prev + 1); // Принудительное обновление
    
    // Устанавливаем флаг выхода
    setIsLoggingOut(true);
    
    // Отмечаем, что пользователь намеренно вышел
    sessionStorage.setItem('user_logged_out', 'true');
    
    // Вызываем API выхода
    apiLogout();
    
    // Очищаем все данные авторизации из localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('test-admin');
    localStorage.clear(); // Полностью очищаем localStorage
    
    // Полностью очищаем все cookies связанные с авторизацией
    clearAllAuthCookies();
    
    // Принудительно обновляем компонент еще раз
    setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 50);
    
    // Перенаправляем на страницу логина с задержкой для обновления UI
    setTimeout(() => {
      navigate('/login');
    }, 200);
    
    // Сбрасываем флаг выхода через небольшую задержку
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 500);
  };

  const handleAuth = (profile: Profile) => {
    // Очищаем флаг выхода при успешной авторизации
    sessionStorage.removeItem('user_logged_out');
    setIsLoggingOut(false);
    
    setIsAuth(true);
    setIsAdmin(true); // Включаем админку для всех
    
    // Сохраняем токен и информацию о пользователе для автоматического входа
    const token = localStorage.getItem('token');
    if (token) {
      saveUserSession(token, profile);
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