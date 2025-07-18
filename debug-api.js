// Диагностический скрипт для проверки API экспортов
import fs from 'fs';
import path from 'path';

console.log('🔍 Диагностика API файла...\n');

// Читаем содержимое API файла
const apiPath = './src/api.ts';
let apiContent = '';

try {
  apiContent = fs.readFileSync(apiPath, 'utf8');
  console.log('✅ API файл найден и прочитан');
  console.log(`📏 Размер файла: ${apiContent.length} символов`);
} catch (error) {
  console.error('❌ Ошибка чтения API файла:', error.message);
  process.exit(1);
}

// Проверяем наличие экспортов
console.log('\n🔎 Поиск экспортов...');

const exports = [];
const exportRegex = /export\s+const\s+(\w+)/g;
let match;

while ((match = exportRegex.exec(apiContent)) !== null) {
  exports.push(match[1]);
}

console.log('📋 Найденные экспорты:', exports);

// Специально ищем getProfile
const getProfileExport = apiContent.includes('export const getProfile');
const getProfileFunction = apiContent.includes('getProfile');

console.log('\n🎯 Проверка getProfile:');
console.log('- export const getProfile найден:', getProfileExport);
console.log('- функция getProfile найден:', getProfileFunction);

// Ищем все строки с getProfile
const lines = apiContent.split('\n');
const getProfileLines = [];

lines.forEach((line, index) => {
  if (line.includes('getProfile')) {
    getProfileLines.push(`Строка ${index + 1}: ${line.trim()}`);
  }
});

console.log('\n📝 Все упоминания getProfile:');
getProfileLines.forEach(line => console.log(line));

// Проверяем синтаксические ошибки
console.log('\n🔧 Проверка синтаксиса...');

// Ищем потенциальные проблемы
const problems = [];

if (apiContent.includes('};// ')) {
  problems.push('Найдены комментарии без пробела после //');
}

if (apiContent.includes('export const getProfile') === false) {
  problems.push('export const getProfile не найден');
}

if (apiContent.includes('async getProfile()') === false) {
  problems.push('async getProfile() в mockApi не найден');
}

console.log('⚠️ Найденные проблемы:', problems.length > 0 ? problems : 'Нет проблем');

// Создаем исправленную версию если нужно
if (problems.length > 0) {
  console.log('\n🛠️ Создаю исправленную версию...');
  
  // Простая проверка и исправление
  let fixedContent = apiContent;
  
  // Исправляем комментарии
  fixedContent = fixedContent.replace(/};\/\/ /g, '};\n\n// ');
  
  // Записываем исправленную версию
  fs.writeFileSync('./src/api-fixed.ts', fixedContent);
  console.log('✅ Исправленная версия сохранена как api-fixed.ts');
}

console.log('\n🎯 ДИАГНОЗ:');
if (getProfileExport) {
  console.log('✅ getProfile экспортируется корректно');
  console.log('🤔 Проблема может быть в:');
  console.log('   1. Кэше браузера - нужно очистить (Ctrl+Shift+R)');
  console.log('   2. Кэше Vite - перезапустить сервер');
  console.log('   3. TypeScript компиляции - проверить tsconfig.json');
} else {
  console.log('❌ getProfile НЕ экспортируется!');
  console.log('🔧 РЕШЕНИЕ: Нужно добавить export const getProfile');
}

console.log('\n📋 ПЛАН ДЕЙСТВИЙ:');
console.log('1. Остановить сервер разработки (Ctrl+C)');
console.log('2. Очистить кэш: rm -rf node_modules/.vite');
console.log('3. Перезапустить: npm start');
console.log('4. Очистить кэш браузера (Ctrl+Shift+R)');