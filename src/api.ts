import axios from "axios";
import type {
  User,
  Bot,
  BotStats,
  Ticket,
  TicketMessage,
  Client,
  ClientActivity,
  SystemLoad,
  Tariff,
  ReferralLink,
  Referral,
  ReferralStats,
  PromoCode,
  BillingPlan,
  Subscription,
  SubscriptionResult,
  CRMConnection,
  TelegaPayTransaction,
  TelegaPayPayout,
} from "./types";

const API_BASE_URL = "http://localhost:3000";
const IS_DEV_MODE = true;

axios.defaults.baseURL = API_BASE_URL;

const setCookie = (name: string, value: string, days: number = 30): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data
const MOCK_DATA = {
  profile: {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    photoUrl: undefined as string | undefined,
  },
  bots: [
    {
      id: "1",
      name: "My First Bot",
      token: "123456789:AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRss",
      username: "my_first_bot",
      link: "https://t.me/my_first_bot",
      createdAt: "2024-01-15T10:30:00Z",
      stats: {
        totalUsers: 150,
        activeUsers: 45,
        messagesCount: 1250,
      },
    },
  ] as Bot[],
  tickets: [
    {
      id: "1",
      subject: "Проблема с ботом",
      message: "Бот не отвечает на команды",
      botId: "1",
      telegramId: "123456789",
      status: "OPEN" as const,
      createdAt: "2024-01-16T10:30:00Z",
    },
    {
      id: "2",
      subject: "Ошибка в настройках",
      message: "Не могу настроить автоответы",
      botId: "1",
      telegramId: "987654321",
      status: "IN_PROGRESS" as const,
      createdAt: "2024-01-15T14:20:00Z",
    },
  ] as Ticket[],
  ticketMessages: [
    {
      id: "1",
      ticketId: "1",
      message: "Бот не отвечает на команды",
      isAdmin: false,
      createdAt: "2024-01-16T10:30:00Z",
    },
    {
      id: "2",
      ticketId: "1",
      message: "Проверим настройки вашего бота",
      isAdmin: true,
      createdAt: "2024-01-16T11:00:00Z",
    },
  ] as TicketMessage[],
  clients: [
    {
      id: "1",
      name: "Иван Петров",
      email: "ivan.petrov@example.com",
      active: true,
      createdAt: "2024-01-10T08:30:00Z",
    },
    {
      id: "2",
      name: "Мария Сидорова",
      email: "maria.sidorova@example.com",
      active: true,
      createdAt: "2024-01-12T14:15:00Z",
    },
  ] as Client[],
  tariffs: [
    {
      id: "1",
      name: "Базовый",
      price: 990,
      description: "Для начинающих пользователей",
      active: true,
      features: ["До 3 ботов", "Базовая поддержка", "100 сообщений/день"],
      createdAt: "2024-01-01T00:00:00Z",
    },
  ] as Tariff[],
  referralLinks: [
    {
      id: "1",
      code: "REF123ABC",
      clicks: 25,
      registrations: 5,
      createdAt: "2024-01-10T10:00:00Z",
    },
  ] as ReferralLink[],
  referrals: [
    {
      id: "1",
      referrerId: "1",
      referredId: "2",
      bonus: 100,
      status: "PAID" as const,
      createdAt: "2024-01-12T14:15:00Z",
    },
  ] as Referral[],
  promoCodes: [
    {
      id: "1",
      code: "SUMMER2025",
      discount: 25,
      type: "PERCENTAGE" as const,
      maxUses: 50,
      currentUses: 12,
      expiresAt: "2025-12-31T23:59:59Z",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
  ] as PromoCode[],
  billingPlans: [
    {
      id: "BASIC",
      name: "Базовый",
      price: 990,
      currency: "RUB",
      features: ["До 3 ботов", "Базовая поддержка"],
      isActive: true,
    },
    {
      id: "PREMIUM",
      name: "Премиум",
      price: 2990,
      currency: "RUB",
      features: ["До 10 ботов", "Приоритетная поддержка", "Аналитика"],
      isActive: true,
    },
  ] as BillingPlan[],
  subscriptions: [
    {
      id: "1",
      userId: "1",
      planId: "BASIC",
      status: "ACTIVE" as const,
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-02-01T00:00:00Z",
      autoRenew: true,
    },
  ] as Subscription[],
  crmConnections: [
    {
      id: "1",
      userId: "1",
      provider: "AMOCRM" as const,
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
      expiresAt: "2025-12-31T23:59:59Z",
      domain: "https://test.amocrm.ru",
      isActive: true,
      otherData: { clientId: "test_client_id" },
      createdAt: "2024-01-01T00:00:00Z",
    },
  ] as CRMConnection[],
  telegaPayTransactions: [] as TelegaPayTransaction[],
  telegaPayPayouts: [] as TelegaPayPayout[],
}; // Mock

const mockApi = {
  async login(email: string, password: string) {
    await delay(500);
    if (
      (email === "admin@example.com" && password === "admin123") ||
      (email === "test@example.com" && password === "password")
    ) {
      const token = "mock-token";
      localStorage.setItem("token", token);
      setCookie("auth_token", token);
      return { token, user: MOCK_DATA.profile };
    }
    throw new Error("Invalid credentials");
  },

  async register(email: string, _password: string, name: string) {
    await delay(500);
    const user = { ...MOCK_DATA.profile, email, name };
    const token = "mock-token";
    localStorage.setItem("token", token);
    setCookie("auth_token", token);
    return { token, user };
  },

  async logout() {
    await delay(200);
    localStorage.removeItem("token");
    deleteCookie("auth_token");
    return { success: true };
  },

  async getProfile() {
    await delay(300);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    return MOCK_DATA.profile;
  },

  async uploadProfilePhoto(file: File) {
    await delay(800);
    const photoUrl = URL.createObjectURL(file);
    MOCK_DATA.profile = { ...MOCK_DATA.profile, photoUrl };
    return { photoUrl };
  },

  // BOTS
  async getBots() {
    await delay(400);
    return [...MOCK_DATA.bots];
  },

  async createBot(botData: Omit<Bot, "id" | "createdAt">) {
    await delay(600);
    const newBot: Bot = {
      id: Date.now().toString(),
      ...botData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.bots.push(newBot);
    return newBot;
  },

  async updateBot(id: string, botData: Partial<Omit<Bot, "id" | "createdAt">>) {
    await delay(500);
    const index = MOCK_DATA.bots.findIndex((bot) => bot.id === id);
    if (index === -1) throw new Error("Bot not found");
    MOCK_DATA.bots[index] = { ...MOCK_DATA.bots[index], ...botData };
    return MOCK_DATA.bots[index];
  },

  async deleteBot(id: string) {
    await delay(400);
    const index = MOCK_DATA.bots.findIndex((bot) => bot.id === id);
    if (index === -1) throw new Error("Bot not found");
    MOCK_DATA.bots.splice(index, 1);
    return { success: true };
  },

  async getBotStats(botId: string) {
    await delay(400);
    const bot = MOCK_DATA.bots.find((b) => b.id === botId);
    if (!bot) throw new Error("Bot not found");
    return (
      bot.stats || {
        totalUsers: 0,
        activeUsers: 0,
        messagesCount: 0,
      }
    );
  },

  // TICKETS
  async getTickets() {
    await delay(400);
    return [...MOCK_DATA.tickets];
  },

  async createTicket(ticketData: Omit<Ticket, "id" | "createdAt">) {
    await delay(600);
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...ticketData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.tickets.push(newTicket);
    return newTicket;
  },

  async updateTicket(id: string, ticketData: Partial<Ticket>) {
    await delay(500);
    const index = MOCK_DATA.tickets.findIndex((ticket) => ticket.id === id);
    if (index === -1) throw new Error("Ticket not found");
    MOCK_DATA.tickets[index] = { ...MOCK_DATA.tickets[index], ...ticketData };
    return MOCK_DATA.tickets[index];
  },

  async deleteTicket(id: string) {
    await delay(400);
    const index = MOCK_DATA.tickets.findIndex((ticket) => ticket.id === id);
    if (index === -1) throw new Error("Ticket not found");
    MOCK_DATA.tickets.splice(index, 1);
    return { success: true };
  },

  async getTicketMessages(ticketId: string) {
    await delay(300);
    return MOCK_DATA.ticketMessages.filter((m) => m.ticketId === ticketId);
  },

  async addTicketMessage(
    ticketId: string,
    message: string,
    isAdmin: boolean = false
  ) {
    await delay(500);
    const newMessage: TicketMessage = {
      id: Date.now().toString(),
      ticketId,
      message,
      isAdmin,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.ticketMessages.push(newMessage);
    return newMessage;
  },

  // CLIENTS
  async getClients() {
    await delay(400);
    return [...MOCK_DATA.clients];
  },

  async createClient(clientData: Omit<Client, "id" | "createdAt">) {
    await delay(600);
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.clients.push(newClient);
    return newClient;
  },

  async updateClient(
    id: string,
    clientData: Partial<Omit<Client, "id" | "createdAt">>
  ) {
    await delay(500);
    const index = MOCK_DATA.clients.findIndex((client) => client.id === id);
    if (index === -1) throw new Error("Client not found");
    MOCK_DATA.clients[index] = { ...MOCK_DATA.clients[index], ...clientData };
    return MOCK_DATA.clients[index];
  },

  async deleteClient(id: string) {
    await delay(400);
    const index = MOCK_DATA.clients.findIndex((client) => client.id === id);
    if (index === -1) throw new Error("Client not found");
    MOCK_DATA.clients.splice(index, 1);
    return { success: true };
  },

  async getClientActivity(clientId: string) {
    await delay(400);
    return [
      {
        id: "1",
        action: "Создал бота",
        timestamp: "2024-01-15T10:30:00Z",
        details: { botName: "Test Bot" },
      },
      {
        id: "2",
        action: "Обновил профиль",
        timestamp: "2024-01-14T15:20:00Z",
        details: {},
      },
    ] as ClientActivity[];
  },

  // REFERRALS
  async getReferrals() {
    await delay(400);
    return [...MOCK_DATA.referrals];
  },

  async getReferralLinks() {
    await delay(400);
    return [...MOCK_DATA.referralLinks];
  },

  async createReferralLink() {
    await delay(500);
    const newLink: ReferralLink = {
      id: Date.now().toString(),
      code: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      clicks: 0,
      registrations: 0,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.referralLinks.push(newLink);
    return newLink;
  },

  async getReferralStats() {
    await delay(300);
    const stats: ReferralStats = {
      totalReferrals: MOCK_DATA.referrals.length,
      totalBonus: MOCK_DATA.referrals.reduce((sum, ref) => sum + ref.bonus, 0),
      pendingBonus: MOCK_DATA.referrals
        .filter((r) => r.status === "PENDING")
        .reduce((sum, ref) => sum + ref.bonus, 0),
      paidBonus: MOCK_DATA.referrals
        .filter((r) => r.status === "PAID")
        .reduce((sum, ref) => sum + ref.bonus, 0),
    };
    return stats;
  },

  // BILLING
  async getBillingPlans() {
    await delay(400);
    return [...MOCK_DATA.billingPlans];
  },

  async getSubscriptions() {
    await delay(400);
    return [...MOCK_DATA.subscriptions];
  },

  async getBillingStatus() {
    await delay(300);
    const subscription = MOCK_DATA.subscriptions.find((s) => s.userId === "1");
    return {
      hasActiveSubscription: !!subscription && subscription.status === "ACTIVE",
      currentPlan: subscription
        ? MOCK_DATA.billingPlans.find((p) => p.id === subscription.planId)
        : null,
      subscription,
    };
  },

  // CRM
  async getCRMConnections() {
    await delay(400);
    return [...MOCK_DATA.crmConnections];
  },

  async getCRMUserInfo() {
    await delay(400);
    return {
      totalContacts: 150,
      totalDeals: 45,
      totalTasks: 12,
      lastSync: new Date().toISOString(),
    };
  },

  // SYSTEM
  async getSystemLoad() {
    await delay(300);
    return {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
    };
  },

  async getAdminStats() {
    await delay(400);
    return {
      totalClients: MOCK_DATA.clients.length,
      activeClients: MOCK_DATA.clients.filter((c) => c.active).length,
      totalBots: MOCK_DATA.bots.length,
      totalTickets: MOCK_DATA.tickets.length,
      openTickets: MOCK_DATA.tickets.filter((t) => t.status === "OPEN").length,
      totalRevenue: 15000,
      monthlyRevenue: 5000,
    };
  },

  // TARIFFS
  async getTariffs() {
    await delay(400);
    return [...MOCK_DATA.tariffs];
  },

  async createTariff(tariffData: Omit<Tariff, "id" | "createdAt">) {
    await delay(600);
    const newTariff: Tariff = {
      id: Date.now().toString(),
      ...tariffData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.tariffs.push(newTariff);
    return newTariff;
  },

  async updateTariff(
    id: string,
    tariffData: Partial<Omit<Tariff, "id" | "createdAt">>
  ) {
    await delay(500);
    const index = MOCK_DATA.tariffs.findIndex((tariff) => tariff.id === id);
    if (index === -1) throw new Error("Tariff not found");
    MOCK_DATA.tariffs[index] = { ...MOCK_DATA.tariffs[index], ...tariffData };
    return MOCK_DATA.tariffs[index];
  },

  async deleteTariff(id: string) {
    await delay(400);
    const index = MOCK_DATA.tariffs.findIndex((tariff) => tariff.id === id);
    if (index === -1) throw new Error("Tariff not found");
    MOCK_DATA.tariffs.splice(index, 1);
    return { success: true };
  },
};

// ==================== AUTH API ====================
export const login = async (email: string, password: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.login(email, password);
  }
  const response = await axios.post("/auth/login", { email, password });
  const { token } = response.data;
  localStorage.setItem("token", token);
  setCookie("auth_token", token);
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name: string,
  ref?: string
) => {
  if (IS_DEV_MODE) {
    return await mockApi.register(email, password, name);
  }
  const params = ref ? `?ref=${ref}` : "";
  const response = await axios.post(`/auth/register${params}`, {
    email,
    password,
    name,
  });
  const { token } = response.data;
  localStorage.setItem("token", token);
  setCookie("auth_token", token);
  return response.data;
};

export const logout = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.logout();
  }
  const response = await axios.post("/auth/logout");
  localStorage.removeItem("token");
  deleteCookie("auth_token");
  return response.data;
};

export const getProfile = async (): Promise<User> => {
  if (IS_DEV_MODE) {
    return await mockApi.getProfile();
  }
  const response = await axios.get("/auth/me");
  return response.data;
};

export const uploadProfilePhoto = async (file: File) => {
  if (IS_DEV_MODE) {
    return await mockApi.uploadProfilePhoto(file);
  }
  const formData = new FormData();
  formData.append("photo", file);
  const response = await axios.post("/auth/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ==================== BOTS API ====================
export const getBots = async (): Promise<Bot[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getBots();
  }
  const response = await axios.get("/me/bots");
  return response.data;
};

export const createBot = async (
  botData: Omit<Bot, "id" | "createdAt">
): Promise<Bot> => {
  if (IS_DEV_MODE) {
    return await mockApi.createBot(botData);
  }
  const response = await axios.post("/me/bots", botData);
  return response.data;
};

export const updateBot = async (
  id: string,
  botData: Partial<Omit<Bot, "id" | "createdAt">>
): Promise<Bot> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateBot(id, botData);
  }
  const response = await axios.patch(`/me/bots/${id}`, botData);
  return response.data;
};

export const deleteBot = async (id: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteBot(id);
  }
  const response = await axios.delete(`/me/bots/${id}`);
  return response.data;
};

export const getBotStats = async (botId: string): Promise<BotStats> => {
  if (IS_DEV_MODE) {
    return await mockApi.getBotStats(botId);
  }
  const response = await axios.get(`/me/bots/${botId}/stats`);
  return response.data;
};

// ==================== TICKETS API ====================
export const getTickets = async (): Promise<Ticket[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getTickets();
  }
  const response = await axios.get("/me/tickets");
  return response.data;
};

export const createTicket = async (
  ticketData: Omit<Ticket, "id" | "createdAt">
): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    return await mockApi.createTicket(ticketData);
  }
  const response = await axios.post("/me/tickets", ticketData);
  return response.data;
};

export const updateTicket = async (
  id: string,
  ticketData: Partial<Ticket>
): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateTicket(id, ticketData);
  }
  const response = await axios.patch(`/me/tickets/${id}`, ticketData);
  return response.data;
};

export const deleteTicket = async (id: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteTicket(id);
  }
  const response = await axios.delete(`/me/tickets/${id}`);
  return response.data;
};

export const getTicketMessages = async (
  ticketId: string
): Promise<TicketMessage[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getTicketMessages(ticketId);
  }
  const response = await axios.get(`/me/tickets/${ticketId}/messages`);
  return response.data;
};

export const addTicketMessage = async (
  ticketId: string,
  message: string
): Promise<TicketMessage> => {
  if (IS_DEV_MODE) {
    return await mockApi.addTicketMessage(ticketId, message, false);
  }
  const response = await axios.post(`/me/tickets/${ticketId}/messages`, {
    message,
  });
  return response.data;
};

// ==================== CLIENTS API (ADMIN) ====================
export const getClients = async (): Promise<Client[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getClients();
  }
  const response = await axios.get("/admin/clients");
  return response.data;
};

export const createClient = async (
  clientData: Omit<Client, "id" | "createdAt">
): Promise<Client> => {
  if (IS_DEV_MODE) {
    return await mockApi.createClient(clientData);
  }
  const response = await axios.post("/admin/clients", clientData);
  return response.data;
};

export const updateClient = async (
  id: string,
  clientData: Partial<Omit<Client, "id" | "createdAt">>
): Promise<Client> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateClient(id, clientData);
  }
  const response = await axios.patch(`/admin/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteClient(id);
  }
  const response = await axios.delete(`/admin/clients/${id}`);
  return response.data;
};

export const getClientById = async (clientId: string): Promise<Client> => {
  if (IS_DEV_MODE) {
    const client = MOCK_DATA.clients.find((c) => c.id === clientId);
    if (!client) throw new Error("Client not found");
    return client;
  }
  const response = await axios.get(`/admin/clients/${clientId}`);
  return response.data;
};

export const getClientActivity = async (
  clientId: string
): Promise<ClientActivity[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getClientActivity(clientId);
  }
  const response = await axios.get(`/admin/clients/${clientId}/activity`);
  return response.data;
};

// ==================== SYSTEM API ====================
export const getSystemLoad = async (): Promise<SystemLoad> => {
  if (IS_DEV_MODE) {
    return await mockApi.getSystemLoad();
  }
  const response = await axios.get("/admin/system/load");
  return response.data;
};

export const getAdminStats = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getAdminStats();
  }
  const response = await axios.get("/admin/clients/stats");
  return response.data;
};

// ==================== TARIFFS API ====================
export const getTariffs = async (): Promise<Tariff[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getTariffs();
  }
  const response = await axios.get("/admin/tariffs");
  return response.data;
};

export const createTariff = async (
  tariffData: Omit<Tariff, "id" | "createdAt">
): Promise<Tariff> => {
  if (IS_DEV_MODE) {
    return await mockApi.createTariff(tariffData);
  }
  const response = await axios.post("/admin/tariffs", tariffData);
  return response.data;
};

export const updateTariff = async (
  id: string,
  tariffData: Partial<Omit<Tariff, "id" | "createdAt">>
): Promise<Tariff> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateTariff(id, tariffData);
  }
  const response = await axios.patch(`/admin/tariffs/${id}`, tariffData);
  return response.data;
};

export const deleteTariff = async (id: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteTariff(id);
  }
  const response = await axios.delete(`/admin/tariffs/${id}`);
  return response.data;
};

// ==================== REFERRALS API ====================
export const getReferrals = async (): Promise<Referral[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferrals();
  }
  const response = await axios.get("/me/referrals");
  return response.data;
};

export const getReferralLinks = async (): Promise<ReferralLink[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferralLinks();
  }
  const response = await axios.get("/me/referrals/links");
  return response.data;
};

export const createReferralLink = async (): Promise<ReferralLink> => {
  if (IS_DEV_MODE) {
    return await mockApi.createReferralLink();
  }
  const response = await axios.get("/me/referrals/new");
  return response.data;
};

export const getReferralStats = async (): Promise<ReferralStats> => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferralStats();
  }
  const response = await axios.get("/me/referrals/stats");
  return response.data;
};

export const trackReferralClick = async (code: string) => {
  if (IS_DEV_MODE) {
    await delay(200);
    const link = MOCK_DATA.referralLinks.find(l => l.code === code);
    if (link) {
      link.clicks += 1;
    }
    return { success: true };
  }
  const response = await axios.post(`/referrals/track/${code}`);
  return response.data;
};

// ==================== BILLING API ====================
export const getBillingPlans = async (): Promise<BillingPlan[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getBillingPlans();
  }
  const response = await axios.get("/billing/plans");
  return response.data;
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getSubscriptions();
  }
  const response = await axios.get("/billing/subscriptions");
  return response.data;
};

export const getBillingStatus = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getBillingStatus();
  }
  const response = await axios.get("/me/billing/status");
  return response.data;
};

export const getBillingInfo = async () => {
  if (IS_DEV_MODE) {
    await delay(300);
    return {
      currentBalance: 1500,
      totalSpent: 5000,
      nextPaymentDate: "2025-02-01T00:00:00Z",
      paymentMethod: "Карта **** 1234"
    };
  }
  const response = await axios.get("/me/billing/info");
  return response.data;
};

export const subscribeToPlan = async (planId: string, userId?: string, promoCode?: string): Promise<SubscriptionResult> => {
  if (IS_DEV_MODE) {
    await delay(800);
    const plan = MOCK_DATA.billingPlans.find(p => p.id === planId);
    if (!plan) throw new Error("Plan not found");
    
    // Проверяем промокод если он предоставлен
    let discount = 0;
    if (promoCode) {
      const promo = MOCK_DATA.promoCodes.find(p => p.code === promoCode && p.isActive);
      if (promo && promo.currentUses < promo.maxUses) {
        discount = promo.type === 'PERCENTAGE' ? (plan.price * promo.discount / 100) : promo.discount;
        promo.currentUses++;
      }
    }
    
    const finalPrice = Math.max(0, plan.price - discount);
    
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      userId: userId || "1",
      planId,
      status: "ACTIVE",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true
    };
    
    MOCK_DATA.subscriptions.push(newSubscription);
    
    // Возвращаем результат с информацией о платеже
    return {
      subscription: newSubscription,
      paymentUrl: `https://payment.example.com/pay?amount=${finalPrice}&plan=${planId}`,
      originalPrice: plan.price,
      discount,
      finalPrice
    };
  }
  const response = await axios.post("/billing/subscribe", { planId, userId, promoCode });
  return response.data;
};

// ==================== PROMO CODES API ====================
export const getPromoCodes = async (): Promise<PromoCode[]> => {
  if (IS_DEV_MODE) {
    await delay(400);
    return [...MOCK_DATA.promoCodes];
  }
  const response = await axios.get("/admin/promo-codes");
  return response.data;
};

export const createPromoCode = async (promoData: Omit<PromoCode, "id" | "createdAt">): Promise<PromoCode> => {
  if (IS_DEV_MODE) {
    await delay(600);
    const newPromoCode: PromoCode = {
      id: Date.now().toString(),
      ...promoData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.promoCodes.push(newPromoCode);
    return newPromoCode;
  }
  const response = await axios.post("/admin/promo-codes", promoData);
  return response.data;
};

export const updatePromoCode = async (id: string, promoData: Partial<Omit<PromoCode, "id" | "createdAt">>): Promise<PromoCode> => {
  if (IS_DEV_MODE) {
    await delay(500);
    const index = MOCK_DATA.promoCodes.findIndex(promo => promo.id === id);
    if (index === -1) throw new Error("Promo code not found");
    MOCK_DATA.promoCodes[index] = { ...MOCK_DATA.promoCodes[index], ...promoData };
    return MOCK_DATA.promoCodes[index];
  }
  const response = await axios.patch(`/admin/promo-codes/${id}`, promoData);
  return response.data;
};

export const deletePromoCode = async (id: string) => {
  if (IS_DEV_MODE) {
    await delay(400);
    const index = MOCK_DATA.promoCodes.findIndex(promo => promo.id === id);
    if (index === -1) throw new Error("Promo code not found");
    MOCK_DATA.promoCodes.splice(index, 1);
    return { success: true };
  }
  const response = await axios.delete(`/admin/promo-codes/${id}`);
  return response.data;
};

export const togglePromoCode = async (id: string): Promise<PromoCode> => {
  if (IS_DEV_MODE) {
    await delay(400);
    const index = MOCK_DATA.promoCodes.findIndex(promo => promo.id === id);
    if (index === -1) throw new Error("Promo code not found");
    MOCK_DATA.promoCodes[index].isActive = !MOCK_DATA.promoCodes[index].isActive;
    return MOCK_DATA.promoCodes[index];
  }
  const response = await axios.patch(`/admin/promo-codes/${id}/toggle`);
  return response.data;
};

export const validatePromoCode = async (code: string, amount: number) => {
  if (IS_DEV_MODE) {
    await delay(300);
    const promo = MOCK_DATA.promoCodes.find(p => p.code === code && p.isActive);
    if (!promo) throw new Error("Promo code not found or inactive");
    if (promo.currentUses >= promo.maxUses) throw new Error("Promo code usage limit exceeded");
    if (new Date(promo.expiresAt) < new Date()) throw new Error("Promo code expired");
    
    const discount = promo.type === 'PERCENTAGE' 
      ? Math.floor(amount * promo.discount / 100)
      : promo.discount;
    
    return {
      valid: true,
      discount,
      finalAmount: amount - discount,
      promoCode: promo
    };
  }
  const response = await axios.post("/promo-codes/validate", { code, amount });
  return response.data;
};

// ==================== TELEGAPAY API ====================
export const getPaymentMethods = async (amount: number, currency: string = 'RUB') => {
  if (IS_DEV_MODE) {
    await delay(400);
    return [
      { id: 'card', name: 'Банковская карта', fee: 2.9, available: true },
      { id: 'sbp', name: 'СБП', fee: 0.7, available: true },
      { id: 'wallet', name: 'Электронный кошелек', fee: 1.5, available: true }
    ];
  }
  const response = await axios.get(`/telegapay/methods?amount=${amount}&currency=${currency}`);
  return response.data;
};

export const getRequisites = async () => {
  if (IS_DEV_MODE) {
    await delay(300);
    return {
      cardNumber: '2200 1234 5678 9012',
      cardHolder: 'IVAN PETROV',
      bankName: 'Сбербанк',
      bik: '044525225'
    };
  }
  const response = await axios.get("/telegapay/requisites");
  return response.data;
};

export const createPaylink = async (amount: number, currency: string = 'RUB', description?: string) => {
  if (IS_DEV_MODE) {
    await delay(600);
    const transaction: TelegaPayTransaction = {
      id: Date.now().toString(),
      externalId: `PAY_${Date.now()}`,
      amount,
      currency,
      status: 'PENDING',
      paymentMethod: 'card',
      paymentUrl: `https://pay.telegapay.com/pay/${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    MOCK_DATA.telegaPayTransactions.push(transaction);
    return transaction;
  }
  const response = await axios.post("/telegapay/paylink", { amount, currency, description });
  return response.data;
};

export const checkPaymentStatus = async (transactionId: string) => {
  if (IS_DEV_MODE) {
    await delay(300);
    const transaction = MOCK_DATA.telegaPayTransactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error("Transaction not found");
    return transaction;
  }
  const response = await axios.get(`/telegapay/status/${transactionId}`);
  return response.data;
};

export const confirmPayment = async (transactionId: string) => {
  if (IS_DEV_MODE) {
    await delay(500);
    const index = MOCK_DATA.telegaPayTransactions.findIndex(t => t.id === transactionId);
    if (index === -1) throw new Error("Transaction not found");
    MOCK_DATA.telegaPayTransactions[index].status = 'COMPLETED';
    MOCK_DATA.telegaPayTransactions[index].completedAt = new Date().toISOString();
    return MOCK_DATA.telegaPayTransactions[index];
  }
  const response = await axios.post(`/telegapay/confirm/${transactionId}`);
  return response.data;
};

export const cancelPayment = async (transactionId: string) => {
  if (IS_DEV_MODE) {
    await delay(400);
    const index = MOCK_DATA.telegaPayTransactions.findIndex(t => t.id === transactionId);
    if (index === -1) throw new Error("Transaction not found");
    MOCK_DATA.telegaPayTransactions[index].status = 'CANCELLED';
    return MOCK_DATA.telegaPayTransactions[index];
  }
  const response = await axios.post(`/telegapay/cancel/${transactionId}`);
  return response.data;
};

export const sendReceipt = async (transactionId: string, email: string) => {
  if (IS_DEV_MODE) {
    await delay(400);
    return { success: true, message: 'Receipt sent successfully' };
  }
  const response = await axios.post(`/telegapay/receipt/${transactionId}`, { email });
  return response.data;
};

export const createPayout = async (payoutData: Omit<TelegaPayPayout, "id" | "createdAt" | "status">): Promise<TelegaPayPayout> => {
  if (IS_DEV_MODE) {
    await delay(600);
    const newPayout: TelegaPayPayout = {
      id: Date.now().toString(),
      ...payoutData,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    MOCK_DATA.telegaPayPayouts.push(newPayout);
    return newPayout;
  }
  const response = await axios.post("/telegapay/payout", payoutData);
  return response.data;
};

export const cancelPayout = async (payoutId: string) => {
  if (IS_DEV_MODE) {
    await delay(400);
    const index = MOCK_DATA.telegaPayPayouts.findIndex(p => p.id === payoutId);
    if (index === -1) throw new Error("Payout not found");
    MOCK_DATA.telegaPayPayouts[index].status = 'CANCELLED';
    return MOCK_DATA.telegaPayPayouts[index];
  }
  const response = await axios.post(`/telegapay/payout/${payoutId}/cancel`);
  return response.data;
};

// ==================== ADMIN API (EXTENDED) ====================
// Bot Management for Clients
export const createBotForClient = async (clientId: string, botData: Omit<Bot, "id" | "createdAt">): Promise<Bot> => {
  if (IS_DEV_MODE) {
    return await mockApi.createBot(botData);
  }
  const response = await axios.post(`/admin/clients/${clientId}/bots`, botData);
  return response.data;
};

export const getBotForClient = async (clientId: string, botId: string): Promise<Bot> => {
  if (IS_DEV_MODE) {
    const bot = MOCK_DATA.bots.find(b => b.id === botId);
    if (!bot) throw new Error("Bot not found");
    return bot;
  }
  const response = await axios.get(`/admin/clients/${clientId}/bots/${botId}`);
  return response.data;
};

export const updateBotForClient = async (clientId: string, botId: string, botData: Partial<Bot>): Promise<Bot> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateBot(botId, botData);
  }
  const response = await axios.patch(`/admin/clients/${clientId}/bots/${botId}`, botData);
  return response.data;
};

export const deleteBotForClient = async (clientId: string, botId: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteBot(botId);
  }
  const response = await axios.delete(`/admin/clients/${clientId}/bots/${botId}`);
  return response.data;
};

// Ticket Management for Clients
export const getTicketsForClient = async (clientId: string): Promise<Ticket[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getTickets();
  }
  const response = await axios.get(`/admin/clients/${clientId}/tickets`);
  return response.data;
};

export const createTicketForClient = async (clientId: string, ticketData: Omit<Ticket, "id" | "createdAt">): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    return await mockApi.createTicket(ticketData);
  }
  const response = await axios.post(`/admin/clients/${clientId}/tickets`, ticketData);
  return response.data;
};

export const getTicketForClient = async (clientId: string, ticketId: string): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    const ticket = MOCK_DATA.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  }
  const response = await axios.get(`/admin/clients/${clientId}/tickets/${ticketId}`);
  return response.data;
};

export const updateTicketForClient = async (clientId: string, ticketId: string, ticketData: Partial<Ticket>): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateTicket(ticketId, ticketData);
  }
  const response = await axios.patch(`/admin/clients/${clientId}/tickets/${ticketId}`, ticketData);
  return response.data;
};

export const deleteTicketForClient = async (clientId: string, ticketId: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteTicket(ticketId);
  }
  const response = await axios.delete(`/admin/clients/${clientId}/tickets/${ticketId}`);
  return response.data;
};

export const addMessageToTicketForClient = async (clientId: string, ticketId: string, message: string): Promise<TicketMessage> => {
  if (IS_DEV_MODE) {
    return await mockApi.addTicketMessage(ticketId, message, true);
  }
  const response = await axios.post(`/admin/clients/${clientId}/tickets/${ticketId}/messages`, { message });
  return response.data;
};

export const getTicketMessagesForClient = async (clientId: string, ticketId: string): Promise<TicketMessage[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getTicketMessages(ticketId);
  }
  const response = await axios.get(`/admin/clients/${clientId}/tickets/${ticketId}/messages`);
  return response.data;
};

// Referral Management for Clients
export const getClientReferrals = async (clientId: string): Promise<Referral[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferrals();
  }
  const response = await axios.get(`/admin/clients/${clientId}/referrals`);
  return response.data;
};

export const getClientReferralStats = async (clientId: string): Promise<ReferralStats> => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferralStats();
  }
  const response = await axios.get(`/admin/clients/${clientId}/referrals/stats`);
  return response.data;
};

export const getClientReferralLinks = async (clientId: string): Promise<ReferralLink[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferralLinks();
  }
  const response = await axios.get(`/admin/clients/${clientId}/referrals/links`);
  return response.data;
};

export const getClientReferralBonuses = async (clientId: string) => {
  if (IS_DEV_MODE) {
    await delay(300);
    return { totalBonus: 500, availableBonus: 200 };
  }
  const response = await axios.get(`/admin/clients/${clientId}/referrals/bonuses`);
  return response.data;
};

export const updateClientReferralBonuses = async (clientId: string, bonusData: { bonus: number; status: string }) => {
  if (IS_DEV_MODE) {
    await delay(400);
    return { success: true };
  }
  const response = await axios.patch(`/admin/clients/${clientId}/referrals/bonuses`, bonusData);
  return response.data;
};

export const deleteClientReferralLink = async (clientId: string, linkId: string) => {
  if (IS_DEV_MODE) {
    await delay(400);
    return { success: true };
  }
  const response = await axios.delete(`/admin/clients/${clientId}/referrals/links/${linkId}`);
  return response.data;
};

// CRM Management for Clients
export const getClientCRMConnections = async (clientId: string): Promise<CRMConnection[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getCRMConnections();
  }
  const response = await axios.get(`/admin/clients/${clientId}/crm/connections`);
  return response.data;
};

export const createCRMConnectionForClient = async (clientId: string, connectionData: Omit<CRMConnection, "id" | "createdAt">): Promise<CRMConnection> => {
  if (IS_DEV_MODE) {
    await delay(600);
    const newConnection: CRMConnection = {
      id: Date.now().toString(),
      ...connectionData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.crmConnections.push(newConnection);
    return newConnection;
  }
  const response = await axios.post(`/admin/clients/${clientId}/crm/connections`, connectionData);
  return response.data;
};

export const updateCRMConnectionForClient = async (clientId: string, connectionId: string, connectionData: Partial<CRMConnection>): Promise<CRMConnection> => {
  if (IS_DEV_MODE) {
    return await updateCRMConnection(connectionId, connectionData);
  }
  const response = await axios.patch(`/admin/clients/${clientId}/crm/connections/${connectionId}`, connectionData);
  return response.data;
};

export const deleteCRMConnectionForClient = async (clientId: string, connectionId: string) => {
  if (IS_DEV_MODE) {
    return await deleteCRMConnection(connectionId);
  }
  const response = await axios.delete(`/admin/clients/${clientId}/crm/connections/${connectionId}`);
  return response.data;
};

export const getAllClientCRMData = async (clientId: string) => {
  if (IS_DEV_MODE) {
    await delay(500);
    return {
      connections: await mockApi.getCRMConnections(),
      totalContacts: 150,
      totalDeals: 45,
      lastSync: new Date().toISOString()
    };
  }
  const response = await axios.get(`/admin/clients/${clientId}/crm/data`);
  return response.data;
};

// ==================== CRM API ====================
export const getCRMConnections = async (): Promise<CRMConnection[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getCRMConnections();
  }
  const response = await axios.get("/me/crm/connections");
  return response.data;
};

export const getCRMUserInfo = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getCRMUserInfo();
  }
  const response = await axios.get("/me/crm/usersinfo");
  return response.data;
};

export const createCRMConnection = async (connectionData: Omit<CRMConnection, "id" | "createdAt">): Promise<CRMConnection> => {
  if (IS_DEV_MODE) {
    await delay(600);
    const newConnection: CRMConnection = {
      id: Date.now().toString(),
      ...connectionData,
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.crmConnections.push(newConnection);
    return newConnection;
  }
  const response = await axios.post("/me/crm/connections", connectionData);
  return response.data;
};

export const updateCRMConnection = async (id: string, connectionData: Partial<Omit<CRMConnection, "id" | "createdAt">>): Promise<CRMConnection> => {
  if (IS_DEV_MODE) {
    await delay(500);
    const index = MOCK_DATA.crmConnections.findIndex(conn => conn.id === id);
    if (index === -1) throw new Error("CRM connection not found");
    MOCK_DATA.crmConnections[index] = { ...MOCK_DATA.crmConnections[index], ...connectionData };
    return MOCK_DATA.crmConnections[index];
  }
  const response = await axios.patch(`/me/crm/connections/${id}`, connectionData);
  return response.data;
};

export const deleteCRMConnection = async (id: string) => {
  if (IS_DEV_MODE) {
    await delay(400);
    const index = MOCK_DATA.crmConnections.findIndex(conn => conn.id === id);
    if (index === -1) throw new Error("CRM connection not found");
    MOCK_DATA.crmConnections.splice(index, 1);
    return { success: true };
  }
  const response = await axios.delete(`/me/crm/connections/${id}`);
  return response.data;
};

export const toggleCRMConnection = async (id: string): Promise<CRMConnection> => {
  if (IS_DEV_MODE) {
    await delay(400);
    const index = MOCK_DATA.crmConnections.findIndex(conn => conn.id === id);
    if (index === -1) throw new Error("CRM connection not found");
    MOCK_DATA.crmConnections[index].isActive = !MOCK_DATA.crmConnections[index].isActive;
    return MOCK_DATA.crmConnections[index];
  }
  const response = await axios.patch(`/me/crm/connections/${id}/toggle`);
  return response.data;
};

// ==================== UNIFIED API OBJECT ====================
export const api = {
  // Auth
  login,
  register,
  logout,
  getProfile,
  uploadProfilePhoto,

  // Bots
  getBots,
  createBot,
  updateBot,
  deleteBot,
  getBotStats,

  // Tickets
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketMessages,
  addTicketMessage,

  // Clients (Admin)
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientById,
  getClientActivity,

  // System
  getSystemLoad,
  getAdminStats,

  // Tariffs
  getTariffs,
  createTariff,
  updateTariff,
  deleteTariff,

  // Referrals
  getReferrals,
  getReferralLinks,
  createReferralLink,
  getReferralStats,
  trackReferralClick,

  // Promo Codes
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  togglePromoCode,
  validatePromoCode,

  // Billing
  getBillingPlans,
  getSubscriptions,
  getBillingStatus,
  getBillingInfo,
  subscribeToPlan,

  // TelegaPay
  getPaymentMethods,
  getRequisites,
  createPaylink,
  checkPaymentStatus,
  confirmPayment,
  cancelPayment,
  sendReceipt,
  createPayout,
  cancelPayout,

  // CRM
  getCRMConnections,
  createCRMConnection,
  updateCRMConnection,
  deleteCRMConnection,
  toggleCRMConnection,
  getCRMUserInfo,

  // Admin - Bot Management for Clients
  createBotForClient,
  getBotForClient,
  updateBotForClient,
  deleteBotForClient,

  // Admin - Ticket Management for Clients
  getTicketsForClient,
  createTicketForClient,
  getTicketForClient,
  updateTicketForClient,
  deleteTicketForClient,
  addMessageToTicketForClient,
  getTicketMessagesForClient,

  // Admin - Referral Management for Clients
  getClientReferrals,
  getClientReferralStats,
  getClientReferralLinks,
  getClientReferralBonuses,
  updateClientReferralBonuses,
  deleteClientReferralLink,

  // Admin - CRM Management for Clients
  getClientCRMConnections,
  createCRMConnectionForClient,
  updateCRMConnectionForClient,
  deleteCRMConnectionForClient,
  getAllClientCRMData,
};

// Re-export types for backward compatibility
export type {
  User,
  Bot,
  BotStats,
  Ticket,
  TicketMessage,
  Client,
  ClientActivity,
  SystemLoad,
  Tariff,
  ReferralLink,
  Referral,
  ReferralStats,
  PromoCode,
  BillingPlan,
  Subscription,
  SubscriptionResult,
  CRMConnection,
  TelegaPayTransaction,
  TelegaPayPayout,
};
