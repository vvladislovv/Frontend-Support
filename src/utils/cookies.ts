// Утилиты для работы с cookies

export const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
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

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const clearAllAuthCookies = () => {
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