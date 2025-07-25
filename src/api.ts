import axios from "axios";
import { saveUserSession, setCookie, getCookie, deleteCookie } from "./utils/cookies";
import type {
  User,
  Bot,
  BotStats,
  Ticket,
  TicketMessage,
  Client,
  ClientActivity,
  ReferralLink,
  Referral,
  PromoCode,
  SubscriptionResult,
  CRMConnection,
  Tariff,
  SystemLoad,
} from "./types";

// Удаляем все mock-режимы и fallback

const TELEGAPAY_API_KEY =
  import.meta.env.VITE_TELEGAPAY_API_KEY || "YOUR_TELEGA_PAY_API_KEY_HERE";

// Set base URL for axios requests
axios.defaults.baseURL = "http://localhost:3000";



axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || getCookie("auth_token");
  if (token && token !== "dev-token" && !token.startsWith("mock-")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.url?.includes("/telegapay/")) {
    config.headers["X-API-Key"] = TELEGAPAY_API_KEY;
  }
  if (["post", "put", "patch"].includes(config.method?.toLowerCase() || "")) {
    config.headers["Content-Type"] =
      config.headers["Content-Type"] || "application/json";
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.code === "ERR_NETWORK" || err.message.includes("CORS")) {
      throw new Error(
        "Unable to connect to server. Please check if the backend is running on http://localhost:3000"
      );
    }
    
    // Очищаем токены и редиректим только для защищенных эндпоинтов, 
    // но НЕ для логина/регистрации
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        // Это защищенный эндпоинт с невалидным токеном
        console.log('Invalid token detected, clearing auth data');
        localStorage.removeItem("token");
        deleteCookie("auth_token");
        
        // Редиректим только если мы не на странице логина
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          window.location.href = "/login";
        }
      }
      // Для логина/регистрации просто пробрасываем ошибку дальше
    }
    
    throw err;
  }
);

// ==================== AUTH API ====================

/**
 * Вход в систему
 * @param email - Email пользователя
 * @param password - Пароль пользователя
 * @returns Объект с access_token
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "user@example.com",
 *     "password": "password123"
 *   }'
 * ```
 */
export const login = async (email: string, password: string) => {
  const requestData = { email, password };
  
  console.log('Login request:', {
    url: '/auth/login',
    data: { ...requestData, password: '***' },
    baseURL: axios.defaults.baseURL
  });
  
  try {
    const response = await axios.post("/auth/login", requestData);
    
    console.log('Login response:', {
      status: response.status,
      data: response.data
    });
    
    const { access_token, user } = response.data;
    
    // Сохраняем токен в localStorage и куки
    localStorage.setItem("token", access_token);
    setCookie("auth_token", access_token);
    
    // Если есть информация о пользователе, сохраняем её для автоматического входа
    if (user) {
      saveUserSession(access_token, user);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        requestData: { ...requestData, password: '***' },
        url: '/auth/login',
        baseURL: axios.defaults.baseURL
      });
      
      if (error.response?.data) {
        console.error('Server response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    throw error;
  }
};

/**
 * Регистрация пользователя
 * @param email - Email пользователя
 * @param password - Пароль пользователя
 * @param name - Имя пользователя
 * @param ref - Реферальный код (опционально)
 * @returns Объект с access_token
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/auth/register \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "new_user@example.com",
 *     "password": "password123",
 *     "name": "New User"
 *   }'
 * ```
 */
export const register = async (
  email: string,
  password: string,
  name: string,
  ref?: string
) => {
  // Убедимся, что ref не пустая строка
  const cleanRef = ref && ref.trim() ? ref.trim() : undefined;
  const params = cleanRef ? `?ref=${cleanRef}` : "";
  // Валидация данных
  if (!email || !email.trim()) {
    throw new Error('Email is required');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  if (!name || !name.trim()) {
    throw new Error('Name is required');
  }

  const requestData = {
    email: email.trim(),
    password: password,
    name: name.trim(),
  };
  
  console.log('Register request:', {
    url: `/auth/register${params}`,
    data: { ...requestData, password: '***' },
    baseURL: axios.defaults.baseURL,
    fullURL: `${axios.defaults.baseURL}/auth/register${params}`
  });
  
  try {
    const response = await axios.post(`/auth/register${params}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000, // 10 секунд таймаут
      withCredentials: false, // Явно отключаем credentials для избежания CORS проблем
    });
    
    console.log('Register response:', {
      status: response.status,
      data: response.data
    });
    
    const { access_token, user } = response.data;
    
    // Сохраняем токен в localStorage и куки
    localStorage.setItem("token", access_token);
    setCookie("auth_token", access_token);
    
    // Если есть информация о пользователе, сохраняем её для автоматического входа
    if (user) {
      saveUserSession(access_token, user);
    }
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Register error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        requestData: requestData,
        url: `/auth/register${params}`,
        baseURL: axios.defaults.baseURL,
        fullURL: `${axios.defaults.baseURL}/auth/register${params}`
      });
      
      // Логируем полный ответ сервера для отладки
      if (error.response?.data) {
        console.error('Server response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      // Проверяем, доступен ли сервер вообще
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:3000');
      }
    }
    throw error;
  }
};

/**
 * Получить профиль пользователя
 * @returns Объект с данными пользователя
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/auth/me \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getProfile = async (): Promise<User> => {
  const response = await axios.get("/auth/me");
  return response.data;
};

/**
 * Выход из системы
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/auth/logout \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const logout = async () => {
  try {
    await axios.post("/auth/logout");
  } catch (error) {
    // Ignore logout errors
  }
  localStorage.removeItem("token");
  deleteCookie("auth_token");
};

// ==================== Me (Личный кабинет) API ====================

/**
 * Получить список рефералов
 * @returns Список рефералов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/referrals \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getReferrals = async (): Promise<Referral[]> => {
  const response = await axios.get("/me/referrals");
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Получить новую реферальную ссылку
 * @returns Объект с новой реферальной ссылкой
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/referrals/new \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getNewReferralLink = async (): Promise<ReferralLink> => {
  const response = await axios.get("/me/referrals/new");
  return response.data;
};

/**
 * Трекнуть клик по реферальной ссылке
 * @param code - Реферальный код
 * @returns Объект с информацией о трекинге
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/referrals/track/REFERRAL_CODE
 * ```
 */
export const trackReferralClick = async (code: string) => {
  const response = await axios.get(`/me/referrals/track/${code}`);
  return response.data;
};

/**
 * Подписаться через TelegaPay
 * @param plan - Название тарифного плана
 * @param botId - ID бота
 * @returns Объект с информацией о подписке
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/me/billing/subscribe \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "plan": "PREMIUM",
 *     "botId": 1
 *   }'
 * ```
 */
export const subscribeToPlan = async (planData: {
  plan: string;
  botId: number;
}): Promise<SubscriptionResult> => {
  const response = await axios.post("/me/billing/subscribe", planData);
  return response.data;
};

/**
 * Получить статус подписки
 * @returns Объект с информацией о статусе подписки
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/billing/status \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getBillingStatus = async () => {
  const response = await axios.get("/me/billing/status");
  return response.data;
};

/**
 * Получить информацию о биллинге
 * @returns Объект с информацией о биллинге
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/billing \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getBillingInfo = async () => {
  const response = await axios.get("/me/billing");
  return response.data;
};

/**
 * Получить CRM информацию пользователя
 * @returns Объект с информацией о пользователе в CRM
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/crm/usersinfo \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getCRMUserInfo = async () => {
  const response = await axios.get("/me/crm/usersinfo");
  return response.data;
};

/**
 * Получить CRM подключения пользователя
 * @returns Список CRM подключений
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/crm/connections \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getCRMConnections = async (): Promise<CRMConnection[]> => {
  const response = await axios.get("/me/crm/connections");
  // Убеждаемся, что возвращаем массив
  return Array.isArray(response.data) ? response.data : [];
};

// ==================== BOTS API ====================

/**
 * Создать нового бота
 * @param botData - Данные бота
 * @returns Объект с информацией о боте
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/me/bots \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "My VPN Bot",
 *     "token": "BOT_TOKEN_FROM_BOTFATHER",
 *     "username": "my_vpn_bot",
 *     "description": "VPN bot for users"
 *   }'
 * ```
 */
export const createBot = async (
  botData: Omit<Bot, "id" | "createdAt">
): Promise<Bot> => {
  const response = await axios.post("/me/bots", botData);
  return response.data;
};

/**
 * Получить список всех ботов
 * @returns Список ботов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/bots \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getBots = async (): Promise<Bot[]> => {
  const response = await axios.get("/me/bots");
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Получить информацию о боте
 * @param botId - ID бота
 * @returns Объект с информацией о боте
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/bots/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getBotById = async (botId: string): Promise<Bot> => {
  const response = await axios.get(`/me/bots/${botId}`);
  return response.data;
};

/**
 * Обновить информацию о боте
 * @param id - ID бота
 * @param botData - Данные для обновления
 * @returns Объект с обновленной информацией о боте
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/me/bots/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "Updated Bot Name",
 *     "description": "Updated description"
 *   }'
 * ```
 */
export const updateBot = async (
  id: string,
  botData: Partial<Omit<Bot, "id" | "createdAt">>
): Promise<Bot> => {
  const response = await axios.patch(`/me/bots/${id}`, botData);
  return response.data;
};

/**
 * Удалить бота
 * @param id - ID бота
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/me/bots/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const deleteBot = async (id: string) => {
  const response = await axios.delete(`/me/bots/${id}`);
  return response.data;
};

/**
 * Получить статистику бота
 * @param botId - ID бота
 * @returns Объект со статистикой бота
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/bots/1/stats \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getBotStats = async (botId: string): Promise<BotStats> => {
  const response = await axios.get(`/me/bots/${botId}/stats`);
  return response.data;
};

// ==================== TICKETS API ====================

/**
 * Создать новый тикет
 * @param ticketData - Данные тикета
 * @returns Объект с информацией о тикете
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/me/tickets \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "title": "Bot not working",
 *     "description": "My bot stopped responding",
 *     "botId": 1,
 *     "priority": "HIGH"
 *   }'
 * ```
 */
export const createTicket = async (
  ticketData: Omit<Ticket, "id" | "createdAt">
): Promise<Ticket> => {
  const response = await axios.post("/me/tickets", ticketData);
  return response.data;
};

/**
 * Получить список всех тикетов
 * @returns Список тикетов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/tickets \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getTickets = async (): Promise<Ticket[]> => {
  const response = await axios.get("/me/tickets");
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Получить информацию о тикете
 * @param ticketId - ID тикета
 * @returns Объект с информацией о тикете
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/tickets/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  const response = await axios.get(`/me/tickets/${ticketId}`);
  return response.data;
};

/**
 * Обновить статус тикета
 * @param id - ID тикета
 * @param ticketData - Данные для обновления
 * @returns Объект с обновленной информацией о тикете
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/me/tickets/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "status": "IN_PROGRESS"
 *   }'
 * ```
 */
export const updateTicket = async (
  id: string,
  ticketData: Partial<Ticket>
): Promise<Ticket> => {
  const response = await axios.patch(`/me/tickets/${id}`, ticketData);
  return response.data;
};

/**
 * Удалить тикет
 * @param id - ID тикета
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/me/tickets/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const deleteTicket = async (id: string) => {
  const response = await axios.delete(`/me/tickets/${id}`);
  return response.data;
};

/**
 * Добавить сообщение в тикет
 * @param ticketId - ID тикета
 * @param message - Текст сообщения
 * @returns Объект с информацией о сообщении
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/me/tickets/1/messages \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "message": "Additional information about the issue"
 *   }'
 * ```
 */
export const addTicketMessage = async (
  ticketId: string,
  message: string
): Promise<TicketMessage> => {
  const response = await axios.post(`/me/tickets/${ticketId}/messages`, {
    message,
  });
  return response.data;
};

/**
 * Получить сообщения тикета
 * @param ticketId - ID тикета
 * @returns Список сообщений
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/me/tickets/1/messages \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getTicketMessages = async (
  ticketId: string
): Promise<TicketMessage[]> => {
  const response = await axios.get(`/me/tickets/${ticketId}/messages`);
  return response.data;
};

// ==================== ADMIN API ====================

/**
 * Получить системную нагрузку
 * @returns Объект с информацией о системной нагрузке
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/system/load \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getSystemLoad = async (): Promise<SystemLoad> => {
  try {
    const response = await axios.get("/admin/system/load");
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, returning mock system load');
    // Возвращаем тестовые данные если backend недоступен
    return {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      disk: Math.floor(Math.random() * 50) + 25,
      network: {
        incoming: Math.floor(Math.random() * 100) + 50,
        outgoing: Math.floor(Math.random() * 80) + 40
      },
      uptime: '5 days, 12 hours',
      activeUsers: Math.floor(Math.random() * 50) + 100,
      totalRequests: Math.floor(Math.random() * 1000) + 5000,
      errorRate: Math.floor(Math.random() * 5) + 1
    };
  }
};

/**
 * Создать промокод
 * @param promoData - Данные промокода
 * @returns Объект с информацией о промокоде
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/promo-codes \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "code": "DISCOUNT20",
 *     "discountPercent": 20,
 *     "maxUses": 100,
 *     "expiresAt": "2024-12-31T23:59:59Z"
 *   }'
 * ```
 */
export const createPromoCode = async (
  promoData: Omit<PromoCode, "id" | "createdAt">
): Promise<PromoCode> => {
  const response = await axios.post("/admin/promo-codes", promoData);
  return response.data;
};

/**
 * Получить все промокоды
 * @returns Список промокодов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/promo-codes \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getPromoCodes = async (): Promise<PromoCode[]> => {
  const response = await axios.get("/admin/promo-codes");
  return response.data;
};

/**
 * Получить промокод по ID
 * @param id - ID промокода
 * @returns Объект с информацией о промокоде
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/promo-codes/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getPromoCodeById = async (id: string): Promise<PromoCode> => {
  const response = await axios.get(`/admin/promo-codes/${id}`);
  return response.data;
};

/**
 * Обновить промокод
 * @param id - ID промокода
 * @param promoData - Данные для обновления
 * @returns Объект с обновленной информацией о промокоде
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/promo-codes/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "discountPercent": 25,
 *     "maxUses": 200
 *   }'
 * ```
 */
export const updatePromoCode = async (
  id: string,
  promoData: Partial<Omit<PromoCode, "id" | "createdAt">>
): Promise<PromoCode> => {
  const response = await axios.patch(`/admin/promo-codes/${id}`, promoData);
  return response.data;
};

/**
 * Удалить промокод
 * @param id - ID промокода
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/promo-codes/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deletePromoCode = async (id: string) => {
  const response = await axios.delete(`/admin/promo-codes/${id}`);
  return response.data;
};

/**
 * Переключить статус промокода
 * @param id - ID промокода
 * @returns Объект с обновленной информацией о промокоде
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/promo-codes/1/toggle \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const togglePromoCode = async (id: string): Promise<PromoCode> => {
  const response = await axios.patch(`/admin/promo-codes/${id}/toggle`);
  return response.data;
};

/**
 * Проверить промокод
 * @param code - Код промокода
 * @param amount - Сумма для проверки
 * @returns Объект с информацией о проверке промокода
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/promo-codes/validate \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "code": "DISCOUNT20",
 *     "userId": 1
 *   }'
 * ```
 */
export const validatePromoCode = async (code: string, amount: number) => {
  const response = await axios.post("/admin/promo-codes/validate", {
    code,
    amount,
  });
  return response.data;
};

// ==================== ADMIN CLIENTS API ====================

/**
 * Создать клиента
 * @param clientData - Данные клиента
 * @returns Объект с информацией о клиенте
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/clients \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "client@example.com",
 *     "password": "password123",
 *     "firstName": "Jane",
 *     "lastName": "Smith"
 *   }'
 * ```
 */
export const createClient = async (
  clientData: Omit<Client, "id" | "createdAt">
): Promise<Client> => {
  const response = await axios.post("/admin/clients", clientData);
  return response.data;
};

/**
 * Получить список всех клиентов
 * @returns Список клиентов
 * @example
 * ```bash
 * curl -X GET "http://localhost:3000/admin/clients?page=1&limit=10&search=jane" \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClients = async (): Promise<Client[]> => {
  const response = await axios.get("/admin/clients");
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Получить статистику дашборда
 * @returns Объект со статистикой
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/stats \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getAdminStats = async () => {
  const response = await axios.get("/admin/clients/stats");
  return response.data;
};

/**
 * Получить клиента по ID
 * @param clientId - ID клиента
 * @returns Объект с информацией о клиенте
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientById = async (clientId: string): Promise<Client> => {
  const response = await axios.get(`/admin/clients/${clientId}`);
  return response.data;
};

/**
 * Получить активность пользователя
 * @param clientId - ID клиента
 * @returns Список активностей
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/activity \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientActivity = async (
  clientId: string
): Promise<ClientActivity[]> => {
  const response = await axios.get(`/admin/clients/${clientId}/activity`);
  return response.data;
};

/**
 * Обновить клиента
 * @param id - ID клиента
 * @param clientData - Данные для обновления
 * @returns Объект с обновленной информацией о клиенте
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/clients/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "firstName": "Updated Name",
 *     "isActive": true
 *   }'
 * ```
 */
export const updateClient = async (
  id: string,
  clientData: Partial<Omit<Client, "id" | "createdAt">>
): Promise<Client> => {
  const response = await axios.patch(`/admin/clients/${id}`, clientData);
  return response.data;
};

/**
 * Удалить клиента
 * @param id - ID клиента
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/clients/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteClient = async (id: string) => {
  const response = await axios.delete(`/admin/clients/${id}`);
  return response.data;
};

// ==================== TELEGAPAY API ====================

/**
 * Получить методы оплаты
 * @param amount - Сумма
 * @param currency - Валюта (по умолчанию 'RUB')
 * @returns Объект с методами оплаты
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/get-methods \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "amount": 100,
 *     "currency": "RUB"
 *   }'
 * ```
 */
export const getTelegaPayMethods = async (
  amount: number,
  currency: string = "RUB"
) => {
  const response = await axios.post("/telegapay/get-methods", {
    amount,
    currency,
  });
  return response.data;
};

/**
 * Получить реквизиты для оплаты
 * @param paymentData - Данные для оплаты
 * @returns Объект с реквизитами для оплаты
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/get-requisites \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "method": "card",
 *     "amount": 100,
 *     "currency": "RUB",
 *     "order_id": "order_123",
 *     "user_id": "user_456"
 *   }'
 * ```
 */
export const getTelegaPayRequisites = async (paymentData: {
  amount: number;
  currency: string;
  method: string;
  order_id: string;
  user_id: string;
}) => {
  const response = await axios.post("/telegapay/get-requisites", paymentData);
  return response.data;
};

/**
 * Проверить доступность метода оплаты
 * @param paymentData - Данные для проверки
 * @returns Объект с информацией о проверке
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/validate-payment-method \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "payment_method": "card",
 *     "amount": 100,
 *     "currency": "RUB"
 *   }'
 * ```
 */
export const validatePaymentMethod = async (paymentData: {
  payment_method: string;
  amount: number;
  currency: string;
}) => {
  const response = await axios.post(
    "/telegapay/validate-payment-method",
    paymentData
  );
  return response.data;
};

/**
 * Создать ссылку на оплату
 * @param paylinkData - Данные для создания ссылки
 * @returns Объект с информацией о ссылке
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/create-paylink \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "amount": 100,
 *     "currency": "RUB",
 *     "order_id": "order_123",
 *     "description": "VPN subscription",
 *     "success_url": "https://example.com/success",
 *     "cancel_url": "https://example.com/cancel"
 *   }'
 * ```
 */
export const createTelegaPaylink = async (paylinkData: {
  amount: number;
  currency: string;
  order_id: string;
  description: string;
  success_url: string;
  cancel_url: string;
}) => {
  const response = await axios.post("/telegapay/create-paylink", paylinkData);
  return response.data;
};

/**
 * Проверить статус платежа
 * @param transactionId - ID транзакции
 * @returns Объект с информацией о статусе платежа
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/check-status \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "order_id": "order_123"
 *   }'
 * ```
 */
export const checkTelegaPaymentStatus = async (transactionId: string) => {
  const response = await axios.post("/telegapay/check-status", {
    transaction_id: transactionId,
  });
  return response.data;
};

/**
 * Подтвердить платеж
 * @param transactionId - ID транзакции
 * @returns Объект с информацией о подтверждении платежа
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/confirm-payment \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "external_id": "payment_external_id"
 *   }'
 * ```
 */
export const confirmTelegaPayment = async (transactionId: string) => {
  const response = await axios.post("/telegapay/confirm-payment", {
    transaction_id: transactionId,
  });
  return response.data;
};

/**
 * Создать выплату
 * @param payoutData - Данные для выплаты
 * @returns Объект с информацией о выплате
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/create-payout \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "amount": 100,
 *     "currency": "RUB",
 *     "method": "card",
 *     "order_id": "payout_123",
 *     "requisites": {
 *       "card_number": "1234567890123456"
 *     }
 *   }'
 * ```
 */
export const createTelegaPayout = async (payoutData: {
  amount: number;
  currency: string;
  method: string;
  order_id: string;
  requisites: {
    card_number: string;
  };
}) => {
  const response = await axios.post("/telegapay/create-payout", payoutData);
  return response.data;
};

/**
 * Отменить платеж
 * @param transactionId - ID транзакции
 * @returns Объект с информацией об отмене платежа
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/cancel-payment \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "order_id": "order_123"
 *   }'
 * ```
 */
export const cancelTelegaPayment = async (transactionId: string) => {
  const response = await axios.post("/telegapay/cancel-payment", {
    transaction_id: transactionId,
  });
  return response.data;
};

/**
 * Отменить выплату
 * @param transactionId - ID транзакции
 * @returns Объект с информацией об отмене выплаты
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/cancel-payout \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "order_id": "payout_123"
 *   }'
 * ```
 */
export const cancelTelegaPayout = async (transactionId: string) => {
  const response = await axios.post("/telegapay/cancel-payout", {
    transaction_id: transactionId,
  });
  return response.data;
};

/**
 * Отправить чек
 * @param receiptData - Данные для чека
 * @returns Объект с информацией о чеке
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/telegapay/send-receipt \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "transaction_id": "trans_123",
 *     "receipt_url": "https://example.com/receipt.jpg"
 *   }'
 * ```
 */
export const sendTelegaPayReceipt = async (receiptData: {
  transaction_id: string;
  receipt_url: string;
}) => {
  const response = await axios.post("/telegapay/send-receipt", receiptData);
  return response.data;
};

// ==================== ADMIN BOTS API ====================

/**
 * Создать бота для клиента (Admin)
 * @param clientId - ID клиента
 * @param botData - Данные бота
 * @returns Объект с информацией о боте
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/clients/1/bots \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "Test Bot for Client",
 *     "token": "YOUR_BOT_TOKEN_HERE",
 *     "username": "@test_bot_username"
 *   }'
 * ```
 */
export const createBotForClient = async (
  clientId: string,
  botData: Omit<Bot, "id" | "createdAt">
): Promise<Bot> => {
  const response = await axios.post(`/admin/clients/${clientId}/bots`, botData);
  return response.data;
};

/**
 * Получить бота клиента по ID (Admin)
 * @param clientId - ID клиента
 * @param botId - ID бота
 * @returns Объект с информацией о боте
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/bots/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getBotForClient = async (
  clientId: string,
  botId: string
): Promise<Bot> => {
  const response = await axios.get(`/admin/clients/${clientId}/bots/${botId}`);
  return response.data;
};

/**
 * Обновить бота клиента (Admin)
 * @param clientId - ID клиента
 * @param botId - ID бота
 * @param botData - Данные для обновления
 * @returns Объект с обновленной информацией о боте
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/clients/1/bots/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "Updated Bot Name",
 *     "token": "new_telegram_bot_token",
 *     "username": "@updated_bot_username"
 *   }'
 * ```
 */
export const updateBotForClient = async (
  clientId: string,
  botId: string,
  botData: Partial<Omit<Bot, "id" | "createdAt">>
): Promise<Bot> => {
  const response = await axios.patch(
    `/admin/clients/${clientId}/bots/${botId}`,
    botData
  );
  return response.data;
};

/**
 * Удалить бота клиента (Admin)
 * @param clientId - ID клиента
 * @param botId - ID бота
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/clients/1/bots/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteBotForClient = async (clientId: string, botId: string) => {
  const response = await axios.delete(
    `/admin/clients/${clientId}/bots/${botId}`
  );
  return response.data;
};

// ==================== ADMIN TICKETS API ====================

/**
 * Получить все тикеты клиента (Admin)
 * @param clientId - ID клиента
 * @returns Список тикетов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/tickets \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getTicketsForClient = async (
  clientId: string
): Promise<Ticket[]> => {
  const response = await axios.get(`/admin/clients/${clientId}/tickets`);
  return response.data;
};

/**
 * Создать тикет для клиента (Admin)
 * @param clientId - ID клиента
 * @param ticketData - Данные тикета
 * @returns Объект с информацией о тикете
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/clients/1/tickets \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "subject": "Test Ticket for Client",
 *     "message": "Message for client ticket",
 *     "botId": 1,
 *     "telegramId": 123456789
 *   }'
 * ```
 */
export const createTicketForClient = async (
  clientId: string,
  ticketData: Omit<Ticket, "id" | "createdAt">
): Promise<Ticket> => {
  const response = await axios.post(
    `/admin/clients/${clientId}/tickets`,
    ticketData
  );
  return response.data;
};

/**
 * Получить тикет клиента по ID (Admin)
 * @param clientId - ID клиента
 * @param ticketId - ID тикета
 * @returns Объект с информацией о тикете
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/tickets/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getTicketForClient = async (
  clientId: string,
  ticketId: string
): Promise<Ticket> => {
  const response = await axios.get(
    `/admin/clients/${clientId}/tickets/${ticketId}`
  );
  return response.data;
};

/**
 * Обновить тикет клиента (Admin)
 * @param clientId - ID клиента
 * @param ticketId - ID тикета
 * @param ticketData - Данные для обновления
 * @returns Объект с обновленной информацией о тикете
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/clients/1/tickets/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "status": "CLOSED"
 *   }'
 * ```
 */
export const updateTicketForClient = async (
  clientId: string,
  ticketId: string,
  ticketData: Partial<Ticket>
): Promise<Ticket> => {
  const response = await axios.patch(
    `/admin/clients/${clientId}/tickets/${ticketId}`,
    ticketData
  );
  return response.data;
};

/**
 * Удалить тикет клиента (Admin)
 * @param clientId - ID клиента
 * @param ticketId - ID тикета
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/clients/1/tickets/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteTicketForClient = async (
  clientId: string,
  ticketId: string
) => {
  const response = await axios.delete(
    `/admin/clients/${clientId}/tickets/${ticketId}`
  );
  return response.data;
};

/**
 * Добавить сообщение в тикет клиента (Admin)
 * @param clientId - ID клиента
 * @param ticketId - ID тикета
 * @param message - Текст сообщения
 * @returns Объект с информацией о сообщении
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/clients/1/tickets/1/messages \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "message": "New message from admin"
 *   }'
 * ```
 */
export const addTicketMessageForClient = async (
  clientId: string,
  ticketId: string,
  message: string
): Promise<TicketMessage> => {
  const response = await axios.post(
    `/admin/clients/${clientId}/tickets/${ticketId}/messages`,
    {
      message,
    }
  );
  return response.data;
};

/**
 * Получить сообщения тикета клиента (Admin)
 * @param clientId - ID клиента
 * @param ticketId - ID тикета
 * @returns Список сообщений
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/tickets/1/messages \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getTicketMessagesForClient = async (
  clientId: string,
  ticketId: string
): Promise<TicketMessage[]> => {
  const response = await axios.get(
    `/admin/clients/${clientId}/tickets/${ticketId}/messages`
  );
  return response.data;
};

// ==================== ADMIN REFERRALS API ====================

/**
 * Получить рефералы клиента (Admin)
 * @param clientId - ID клиента
 * @returns Список рефералов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/me/referrals \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientReferrals = async (
  clientId: string
): Promise<Referral[]> => {
  const response = await axios.get(`/admin/clients/${clientId}/me/referrals`);
  return response.data;
};

/**
 * Получить статистику рефералов клиента (Admin)
 * @param clientId - ID клиента
 * @returns Объект со статистикой рефералов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/me/referrals/stats \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientReferralStats = async (clientId: string) => {
  const response = await axios.get(
    `/admin/clients/${clientId}/me/referrals/stats`
  );
  return response.data;
};

/**
 * Получить реферальные ссылки клиента (Admin)
 * @param clientId - ID клиента
 * @returns Список реферальных ссылок
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/me/referrals/links \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientReferralLinks = async (
  clientId: string
): Promise<ReferralLink[]> => {
  const response = await axios.get(
    `/admin/clients/${clientId}/me/referrals/links`
  );
  return response.data;
};

/**
 * Получить бонусы рефералов клиента (Admin)
 * @param clientId - ID клиента
 * @returns Объект с информацией о бонусах
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/me/referrals/bonuses \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientReferralBonuses = async (clientId: string) => {
  const response = await axios.get(
    `/admin/clients/${clientId}/me/referrals/bonuses`
  );
  return response.data;
};

/**
 * Обновить бонусы рефералов клиента (Admin)
 * @param clientId - ID клиента
 * @param bonusData - Данные бонусов
 * @returns Объект с обновленной информацией о бонусах
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/clients/1/me/referrals/bonuses \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "totalBonus": 200,
 *     "pendingBonus": 50
 *   }'
 * ```
 */
export const updateClientReferralBonuses = async (
  clientId: string,
  bonusData: { totalBonus: number; pendingBonus: number }
) => {
  const response = await axios.patch(
    `/admin/clients/${clientId}/me/referrals/bonuses`,
    bonusData
  );
  return response.data;
};

/**
 * Удалить реферальную ссылку клиента (Admin)
 * @param clientId - ID клиента
 * @param linkId - ID реферальной ссылки
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/clients/1/me/referrals/links/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteClientReferralLink = async (
  clientId: string,
  linkId: string
) => {
  const response = await axios.delete(
    `/admin/clients/${clientId}/me/referrals/links/${linkId}`
  );
  return response.data;
};

// ==================== ADMIN CRM API ====================

/**
 * Получить все CRM подключения (Admin)
 * @returns Список CRM подключений
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/crm/connections \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getAdminCRMConnections = async (): Promise<CRMConnection[]> => {
  const response = await axios.get("/admin/crm/connections");
  return response.data;
};

/**
 * Получить CRM подключение по ID (Admin)
 * @param connectionId - ID подключения
 * @returns Объект с информацией о CRM подключении
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/crm/connections/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getAdminCRMConnectionById = async (
  connectionId: string
): Promise<CRMConnection> => {
  const response = await axios.get(`/admin/crm/connections/${connectionId}`);
  return response.data;
};

/**
 * Удалить CRM подключение (Admin)
 * @param connectionId - ID подключения
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/crm/connections/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteAdminCRMConnection = async (connectionId: string) => {
  const response = await axios.delete(`/admin/crm/connections/${connectionId}`);
  return response.data;
};

/**
 * Переключить статус CRM подключения (Admin)
 * @param connectionId - ID подключения
 * @returns Объект с обновленной информацией о подключении
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/crm/connections/1/toggle \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const toggleAdminCRMConnection = async (
  connectionId: string
): Promise<CRMConnection> => {
  const response = await axios.patch(
    `/admin/crm/connections/${connectionId}/toggle`
  );
  return response.data;
};

/**
 * Создать CRM подключение для клиента (Admin)
 * @param clientId - ID клиента
 * @param connectionData - Данные подключения
 * @returns Объект с информацией о подключении
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/clients/1/crm/connections \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "provider": "AMOCRM",
 *     "accessToken": "CLIENT_ACCESS_TOKEN",
 *     "refreshToken": "CLIENT_REFRESH_TOKEN",
 *     "expiresAt": "2025-12-31T23:59:59Z",
 *     "domain": "https://client-subdomain.amocrm.ru",
 *     "otherData": {
 *       "clientId": "client_id",
 *       "clientSecret": "client_secret"
 *     },
 *     "isActive": true
 *   }'
 * ```
 */
export const createCRMConnectionForClient = async (
  clientId: string,
  connectionData: Omit<CRMConnection, "id" | "createdAt">
): Promise<CRMConnection> => {
  const response = await axios.post(
    `/admin/clients/${clientId}/crm/connections`,
    connectionData
  );
  return response.data;
};

/**
 * Получить CRM подключения клиента (Admin)
 * @param clientId - ID клиента
 * @returns Список CRM подключений
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/crm/connections \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getClientCRMConnections = async (
  clientId: string
): Promise<CRMConnection[]> => {
  const response = await axios.get(
    `/admin/clients/${clientId}/crm/connections`
  );
  return response.data;
};

/**
 * Обновить CRM подключение клиента (Admin)
 * @param clientId - ID клиента
 * @param connectionId - ID подключения
 * @param connectionData - Данные для обновления
 * @returns Объект с обновленной информацией о подключении
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/clients/1/crm/connections/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "accessToken": "UPDATED_ACCESS_TOKEN",
 *     "refreshToken": "UPDATED_REFRESH_TOKEN",
 *     "isActive": false
 *   }'
 * ```
 */
export const updateClientCRMConnection = async (
  clientId: string,
  connectionId: string,
  connectionData: Partial<Omit<CRMConnection, "id" | "createdAt">>
): Promise<CRMConnection> => {
  const response = await axios.patch(
    `/admin/clients/${clientId}/crm/connections/${connectionId}`,
    connectionData
  );
  return response.data;
};

/**
 * Удалить CRM подключение клиента (Admin)
 * @param clientId - ID клиента
 * @param connectionId - ID подключения
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/clients/1/crm/connections/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteClientCRMConnection = async (
  clientId: string,
  connectionId: string
) => {
  const response = await axios.delete(
    `/admin/clients/${clientId}/crm/connections/${connectionId}`
  );
  return response.data;
};

/**
 * Получить все CRM данные клиента (Admin)
 * @param clientId - ID клиента
 * @returns Объект со всеми CRM данными
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/clients/1/crm/data/all \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getAllClientCRMData = async (clientId: string) => {
  const response = await axios.get(`/admin/clients/${clientId}/crm/data/all`);
  return response.data;
};

// ==================== BILLING API ====================

/**
 * Получить тарифные планы
 * @returns Список тарифных планов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/billing/plans \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getBillingPlans = async () => {
  const response = await axios.get("/billing/plans");
  return response.data;
};

/**
 * Получить подписки пользователя
 * @returns Список подписок
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/billing/subscriptions \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getUserSubscriptions = async () => {
  const response = await axios.get("/billing/subscriptions");
  return response.data;
};

/**
 * Создать инвойс Telegram Pay
 * @param paymentData - Данные для оплаты
 * @returns Объект с информацией об инвойсе
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/billing/pay \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "planId": "BASIC",
 *     "promoCode": "DISCOUNT20"
 *   }'
 * ```
 */
export const createTelegramPayInvoice = async (paymentData: {
  planId: string;
  promoCode?: string;
}) => {
  const response = await axios.post("/billing/pay", paymentData);
  return response.data;
};

// ==================== CRM API ====================

/**
 * Создать CRM подключение
 * @param connectionData - Данные подключения
 * @returns Объект с информацией о подключении
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/crm/connections \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "userId": 1,
 *     "provider": "AMOCRM",
 *     "accessToken": "YOUR_ACCESS_TOKEN",
 *     "refreshToken": "YOUR_REFRESH_TOKEN",
 *     "expiresAt": "2025-12-31T23:59:59Z",
 *     "domain": "https://your-amocrm-subdomain.amocrm.ru",
 *     "otherData": {
 *       "clientId": "YOUR_CLIENT_ID",
 *       "clientSecret": "YOUR_CLIENT_SECRET",
 *       "redirectUri": "YOUR_REDIRECT_URI"
 *     }
 *   }'
 * ```
 */
export const createCRMConnection = async (
  connectionData: Omit<CRMConnection, "id" | "createdAt">
): Promise<CRMConnection> => {
  const response = await axios.post("/crm/connections", connectionData);
  return response.data;
};

/**
 * Получить все CRM подключения
 * @returns Список CRM подключений
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/crm/connections \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getAllCRMConnections = async (): Promise<CRMConnection[]> => {
  const response = await axios.get("/crm/connections");
  return response.data;
};

/**
 * Получить CRM подключение по ID
 * @param connectionId - ID подключения
 * @returns Объект с информацией о CRM подключении
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/crm/connections/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const getCRMConnectionById = async (
  connectionId: string
): Promise<CRMConnection> => {
  const response = await axios.get(`/crm/connections/${connectionId}`);
  return response.data;
};

/**
 * Обновить CRM подключение
 * @param connectionId - ID подключения
 * @param connectionData - Данные для обновления
 * @returns Объект с обновленной информацией о подключении
 * @example
 * ```bash
 * curl -X PUT http://localhost:3000/crm/connections/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "accessToken": "NEW_ACCESS_TOKEN",
 *     "expiresAt": "2026-12-31T23:59:59Z"
 *   }'
 * ```
 */
export const updateCRMConnection = async (
  connectionId: string,
  connectionData: Partial<Omit<CRMConnection, "id" | "createdAt">>
): Promise<CRMConnection> => {
  const response = await axios.put(
    `/crm/connections/${connectionId}`,
    connectionData
  );
  return response.data;
};

/**
 * Удалить CRM подключение
 * @param connectionId - ID подключения
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/crm/connections/1 \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN"
 * ```
 */
export const deleteCRMConnection = async (connectionId: string) => {
  const response = await axios.delete(`/crm/connections/${connectionId}`);
  return response.data;
};

// ==================== TARIFFS API ====================

/**
 * Получить все тарифы
 * @returns Список тарифов
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/tariffs \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getTariffs = async (): Promise<Tariff[]> => {
  const response = await axios.get("/admin/tariffs");
  return response.data;
};

/**
 * Создать тариф
 * @param tariffData - Данные тарифа
 * @returns Объект с информацией о тарифе
 * @example
 * ```bash
 * curl -X POST http://localhost:3000/admin/tariffs \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "Premium Plan",
 *     "price": 999,
 *     "description": "Premium VPN plan with unlimited features",
 *     "active": true,
 *     "features": ["Unlimited bandwidth", "24/7 support", "Multiple devices"]
 *   }'
 * ```
 */
export const createTariff = async (
  tariffData: Omit<Tariff, "id" | "createdAt">
): Promise<Tariff> => {
  const response = await axios.post("/admin/tariffs", tariffData);
  return response.data;
};

/**
 * Получить тариф по ID
 * @param id - ID тарифа
 * @returns Объект с информацией о тарифе
 * @example
 * ```bash
 * curl -X GET http://localhost:3000/admin/tariffs/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const getTariffById = async (id: string): Promise<Tariff> => {
  const response = await axios.get(`/admin/tariffs/${id}`);
  return response.data;
};

/**
 * Обновить тариф
 * @param id - ID тарифа
 * @param tariffData - Данные для обновления
 * @returns Объект с обновленной информацией о тарифе
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/tariffs/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "Updated Premium Plan",
 *     "price": 1299,
 *     "active": false
 *   }'
 * ```
 */
export const updateTariff = async (
  id: string,
  tariffData: Partial<Omit<Tariff, "id" | "createdAt">>
): Promise<Tariff> => {
  const response = await axios.patch(`/admin/tariffs/${id}`, tariffData);
  return response.data;
};

/**
 * Удалить тариф
 * @param id - ID тарифа
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/admin/tariffs/1 \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const deleteTariff = async (id: string) => {
  const response = await axios.delete(`/admin/tariffs/${id}`);
  return response.data;
};

/**
 * Переключить статус тарифа
 * @param id - ID тарифа
 * @returns Объект с обновленной информацией о тарифе
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/admin/tariffs/1/toggle \
 *   -H "Authorization: Bearer ADMIN_JWT_TOKEN"
 * ```
 */
export const toggleTariff = async (id: string): Promise<Tariff> => {
  const response = await axios.patch(`/admin/tariffs/${id}/toggle`);
  return response.data;
};
