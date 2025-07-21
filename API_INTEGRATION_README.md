# API Integration - AdminBotTelegaVPN

## 📋 Обзор

Полная интеграция всех API endpoints из Postman collection `AdminBotTelegaVPN.postman_collection.json` в React фронтенд.

## 🚀 Быстрый старт

1. **Запуск приложения:**
   ```bash
   npm run dev
   # или
   yarn dev
   ```

2. **Доступ к тестированию API:**
   - Перейдите на `/api-test` после авторизации
   - Нажмите "Запустить все тесты" для проверки всех endpoints

3. **Настройка API URL:**
   - В файле `src/api.ts` измените `API_BASE_URL` на ваш сервер
   - По умолчанию: `http://localhost:3000`

## 📁 Структура проекта

```
src/
├── api.ts                 # Основной API файл со всеми endpoints
├── hooks/
│   ├── useApi.ts         # Универсальный хук для API
│   └── useApiTester.ts   # Хук для тестирования API
├── pages/
│   ├── ApiTestPage.tsx   # Страница тестирования API
│   ├── Referrals/        # Реферальная система
│   ├── Billing/          # Биллинг и подписки
│   ├── CRM/              # CRM интеграции
│   └── Admin/
│       └── PromoCodesPage.tsx  # Управление промокодами
└── types/index.ts        # TypeScript типы
```

## 🔌 Интегрированные API Endpoints

### 🔐 Авторизация
- `POST /auth/login` - Вход в систему
- `POST /auth/register` - Регистрация
- `POST /auth/logout` - Выход
- `GET /auth/me` - Получение профиля

### 🤖 Боты
- `GET /me/bots` - Список ботов
- `POST /me/bots` - Создание бота
- `PATCH /me/bots/:id` - Обновление бота
- `DELETE /me/bots/:id` - Удаление бота
- `GET /me/bots/:id/stats` - Статистика бота

### 🎫 Тикеты
- `GET /me/tickets` - Список тикетов
- `POST /me/tickets` - Создание тикета
- `PATCH /me/tickets/:id` - Обновление тикета
- `DELETE /me/tickets/:id` - Удаление тикета
- `GET /me/tickets/:id/messages` - Сообщения тикета
- `POST /me/tickets/:id/messages` - Добавление сообщения

### 👥 Реферальная система
- `GET /me/referrals` - Список рефералов
- `GET /me/referrals/new` - Создание реферальной ссылки
- `GET /me/referrals/stats` - Статистика рефералов
- `GET /me/referrals/track/:code` - Отслеживание клика

### 🎟️ Промокоды (Админ)
- `GET /admin/promo-codes` - Список промокодов
- `POST /admin/promo-codes` - Создание промокода
- `PATCH /admin/promo-codes/:id` - Обновление промокода
- `DELETE /admin/promo-codes/:id` - Удаление промокода
- `PATCH /admin/promo-codes/:id/toggle` - Переключение статуса
- `POST /admin/promo-codes/validate` - Валидация промокода

### 💳 Биллинг
- `GET /billing/plans` - Тарифные планы
- `GET /billing/subscriptions` - Подписки пользователя
- `GET /me/billing/status` - Статус биллинга
- `POST /me/billing/subscribe` - Подписка на план

### 📇 CRM
- `GET /me/crm/connections` - CRM подключения
- `POST /crm/connections` - Создание подключения
- `PUT /crm/connections/:id` - Обновление подключения
- `DELETE /crm/connections/:id` - Удаление подключения
- `GET /me/crm/usersinfo` - Информация пользователей CRM

### 💰 TelegaPay
- `POST /telegapay/get-methods` - Методы оплаты
- `POST /telegapay/create-paylink` - Создание ссылки на оплату
- `POST /telegapay/check-status` - Проверка статуса платежа
- `POST /telegapay/confirm-payment` - Подтверждение платежа
- `POST /telegapay/cancel-payment` - Отмена платежа
- `POST /telegapay/create-payout` - Создание выплаты

### 👨‍💼 Админ панель
- `GET /admin/clients` - Список клиентов
- `POST /admin/clients` - Создание клиента
- `GET /admin/clients/:id` - Клиент по ID
- `PATCH /admin/clients/:id` - Обновление клиента
- `DELETE /admin/clients/:id` - Удаление клиента
- `GET /admin/clients/stats` - Статистика админа

## 🎯 Использование API

### Базовое использование
```typescript
import { useAppApi } from '../hooks/useApi';

const MyComponent = () => {
  const { bots, tickets, referrals } = useAppApi();
  
  const loadData = async () => {
    try {
      const botsData = await bots.getBots.execute();
      const ticketsData = await tickets.getTickets.execute();
      const referralsData = await referrals.getReferrals.execute();
    } catch (error) {
      console.error('Error:', error);
    }
  };
};
```

### Специализированные хуки
```typescript
import { useBots, useTickets, useReferrals } from '../hooks/useApi';

const BotsPage = () => {
  const { getBots, createBot, updateBot, deleteBot } = useBots();
  
  // Автоматическое управление состоянием loading/error
  const handleCreateBot = async (botData) => {
    try {
      const newBot = await createBot.execute(botData);
      // newBot содержит созданного бота
    } catch (error) {
      // Обработка ошибки
    }
  };
};
```

### Прямой доступ к API
```typescript
import { api } from '../api';

// Прямой вызов без хуков
const data = await api.getBots();
const newBot = await api.createBot(botData);
```

## 🧪 Тестирование

### Автоматическое тестирование
1. Перейдите на `/api-test`
2. Нажмите "Запустить все тесты"
3. Просмотрите результаты тестирования

### Ручное тестирование
```typescript
import { useApiTester } from '../hooks/useApiTester';

const TestComponent = () => {
  const { testSpecificEndpoint } = useApiTester();
  
  const testCustomEndpoint = async () => {
    await testSpecificEndpoint('customTest', async () => {
      return await api.someCustomEndpoint();
    });
  };
};
```

## 🔧 Конфигурация

### Переключение между dev и production
```typescript
// src/api.ts
const API_BASE_URL = "http://localhost:3000"; // Для разработки
const IS_DEV_MODE = true; // false для production
```

### Добавление нового endpoint
1. Добавьте интерфейс в `src/types/index.ts`
2. Добавьте mock данные в `MOCK_DATA`
3. Добавьте функцию в `mockApi`
4. Добавьте экспорт функции в конце файла
5. Добавьте в объект `api` для удобного доступа

## 📱 Страницы

### Новые страницы
- `/referrals` - Реферальная программа
- `/billing` - Биллинг и подписки  
- `/crm` - CRM интеграции
- `/admin/promo-codes` - Управление промокодами
- `/api-test` - Тестирование API

### Обновленные страницы
- `/dashboard` - Добавлены ссылки на новые разделы
- `/admin` - Добавлена ссылка на промокоды

## 🔐 Безопасность

- Все запросы автоматически включают JWT токен
- Токен сохраняется в localStorage и cookies
- Автоматическое перенаправление на login при истечении токена
- Проверка прав доступа для админ функций

## 📊 Мониторинг

- Все API вызовы логируются в консоль
- Автоматическое отслеживание ошибок
- Статистика успешных/неуспешных запросов в тестере

## 🚀 Развертывание

1. Обновите `API_BASE_URL` на production URL
2. Установите `IS_DEV_MODE = false`
3. Соберите проект: `npm run build`
4. Разверните на вашем сервере

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Используйте `/api-test` для диагностики
3. Убедитесь что backend сервер запущен на правильном порту
4. Проверьте CORS настройки на сервере

---

**Все endpoints из Postman collection полностью интегрированы и готовы к использованию!** 🎉