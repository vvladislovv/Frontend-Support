// Тестовый файл для проверки импорта getProfile
import { getProfile, login, logout } from './src/api.ts';

console.log('getProfile:', typeof getProfile);
console.log('login:', typeof login);
console.log('logout:', typeof logout);

// Проверяем, что функции определены
if (typeof getProfile === 'function') {
  console.log('✅ getProfile импортируется корректно');
} else {
  console.log('❌ getProfile не импортируется');
}