// Утилиты для работы с cookies

export const setCookie = (name: string, value: string, days: number = 365): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// Функция для установки долгосрочных куки (1 год)
export const setLongTermCookie = (name: string, value: string): void => {
  setCookie(name, value, 365);
};

// Функция для установки сессионных куки (до закрытия браузера)
export const setSessionCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${value};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const clearAllAuthCookies = (): void => {
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

// Проверка авторизации по токенам
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const cookieToken = getCookie('auth_token');
  return !!(token || cookieToken);
};

// Получение токена из любого источника
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token') || getCookie('auth_token');
};

// Сохранение данных пользователя для автоматического входа
export const saveUserSession = (token: string, userInfo?: { id: string; email: string; name: string; role: string }): void => {
  // Сохраняем токен в localStorage и куки
  localStorage.setItem('token', token);
  setLongTermCookie('auth_token', token);
  
  // Сохраняем информацию о пользователе в куки для быстрого доступа
  if (userInfo) {
    setLongTermCookie('user_id', userInfo.id);
    setLongTermCookie('user_email', userInfo.email);
    setLongTermCookie('user_name', userInfo.name);
    setLongTermCookie('user_role', userInfo.role);
    setLongTermCookie('last_login', new Date().toISOString());
  }
  
  // Устанавливаем флаг автоматического входа
  setLongTermCookie('auto_login', 'true');
};

// Получение сохраненной информации о пользователе
export const getSavedUserInfo = (): { id: string; email: string; name: string; role: string } | null => {
  const id = getCookie('user_id');
  const email = getCookie('user_email');
  const name = getCookie('user_name');
  const role = getCookie('user_role');
  
  if (id && email && name && role) {
    return { id, email, name, role };
  }
  
  return null;
};

// Проверка, должен ли пользователь автоматически войти
export const shouldAutoLogin = (): boolean => {
  const autoLogin = getCookie('auto_login');
  const token = getAuthToken();
  const userLoggedOut = sessionStorage.getItem('user_logged_out');
  
  return autoLogin === 'true' && !!token && !userLoggedOut;
};