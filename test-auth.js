// Тестовый файл для проверки логики авторизации

// Функции для работы с cookies (копия из useAuth.ts)
const setCookie = (name, value, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const clearAllAuthCookies = () => {
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

console.log('Тестовые функции для работы с cookies загружены');
console.log('Для тестирования:');
console.log('1. setCookie("auth_token", "test123") - установить cookie');
console.log('2. getCookie("auth_token") - получить cookie');
console.log('3. clearAllAuthCookies() - очистить все cookies');