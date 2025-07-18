// Простой тест импорта API функций
console.log('Тестируем импорт API функций...');

try {
  // Пытаемся импортировать функции
  import('./src/api.ts').then(api => {
    console.log('API модуль загружен:', api);
    console.log('getProfile:', typeof api.getProfile);
    console.log('login:', typeof api.login);
    console.log('logout:', typeof api.logout);
    
    if (typeof api.getProfile === 'function') {
      console.log('✅ getProfile импортируется корректно');
    } else {
      console.log('❌ getProfile не найден в экспортах');
      console.log('Доступные экспорты:', Object.keys(api));
    }
  }).catch(error => {
    console.error('Ошибка импорта:', error);
  });
} catch (error) {
  console.error('Ошибка:', error);
}