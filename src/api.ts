import axios from "axios";

const API_BASE_URL = "http://localhost:5173";
const IS_DEV_MODE = true;

axios.defaults.baseURL = API_BASE_URL;

const setCookie = (name: string, value: string, days: number = 30) => {
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

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Bot {
  id: string;
  name: string;
  token: string;
  username: string;
  link: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  botId: string;
  telegramId: string;
  status: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface SystemLoad {
  cpu: number;
  memory: number;
}

// Mock Data
const MOCK_DATA = {
  profile: {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    role: "user",
  },
  bots: [
    {
      id: "1",
      name: "My First Bot",
      token: "123456789:AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRss",
      username: "my_first_bot",
      link: "https://t.me/my_first_bot",
      createdAt: "2024-01-15T10:30:00Z",
    },
  ],
  tickets: [] as Ticket[],
  clients: [] as Client[],
};

// Mock API
const mockApi = {
  async login(email: string, password: string) {
    await delay(500);
    if (email === "test@example.com" && password === "password") {
      const token = "mock-token";
      localStorage.setItem("token", token);
      setCookie("auth_token", token);
      return { token, user: MOCK_DATA.profile };
    }
    throw new Error("Invalid credentials");
  },

  async register(email: string, password: string, name: string) {
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

  async updateTicket(id: string, ticketData: { status: string }) {
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

  async getSystemLoad() {
    await delay(300);
    return {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
    };
  },

  async getBillingPlans() {
    await delay(400);
    return [];
  },

  async getSubscriptions() {
    await delay(400);
    return [];
  },

  async getCRMConnections() {
    await delay(400);
    return [];
  },

  async getReferrals() {
    await delay(400);
    return [];
  },

  async createReferralLink(data: any) {
    await delay(500);
    return { id: Date.now().toString(), ...data };
  },
};

// AUTH EXPORTS
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

// BOT EXPORTS
export const getBots = async (): Promise<Bot[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getBots();
  }
  const response = await axios.get("/bots");
  return response.data;
};

export const createBot = async (
  botData: Omit<Bot, "id" | "createdAt">
): Promise<Bot> => {
  if (IS_DEV_MODE) {
    return await mockApi.createBot(botData);
  }
  const response = await axios.post("/bots", botData);
  return response.data;
};

export const updateBot = async (
  id: string,
  botData: Partial<Omit<Bot, "id" | "createdAt">>
): Promise<Bot> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateBot(id, botData);
  }
  const response = await axios.patch(`/bots/${id}`, botData);
  return response.data;
};

export const deleteBot = async (id: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteBot(id);
  }
  const response = await axios.delete(`/bots/${id}`);
  return response.data;
};

// TICKET EXPORTS
export const getTickets = async (): Promise<Ticket[]> => {
  if (IS_DEV_MODE) {
    return await mockApi.getTickets();
  }
  const response = await axios.get("/tickets");
  return response.data;
};

export const createTicket = async (
  ticketData: Omit<Ticket, "id" | "createdAt">
): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    return await mockApi.createTicket(ticketData);
  }
  const response = await axios.post("/tickets", ticketData);
  return response.data;
};

export const updateTicket = async (
  id: string,
  ticketData: { status: string }
): Promise<Ticket> => {
  if (IS_DEV_MODE) {
    return await mockApi.updateTicket(id, ticketData);
  }
  const response = await axios.patch(`/tickets/${id}`, ticketData);
  return response.data;
};

export const deleteTicket = async (id: string) => {
  if (IS_DEV_MODE) {
    return await mockApi.deleteTicket(id);
  }
  const response = await axios.delete(`/tickets/${id}`);
  return response.data;
};

// CLIENT EXPORTS
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

// SYSTEM EXPORTS
export const getSystemLoad = async (): Promise<SystemLoad> => {
  if (IS_DEV_MODE) {
    return await mockApi.getSystemLoad();
  }
  const response = await axios.get("/admin/system/load");
  return response.data;
};

// BILLING EXPORTS
export const getBillingPlans = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getBillingPlans();
  }
  const response = await axios.get("/billing/plans");
  return response.data;
};

export const getSubscriptions = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getSubscriptions();
  }
  const response = await axios.get("/billing/subscriptions");
  return response.data;
};

// CRM EXPORTS
export const getCRMConnections = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getCRMConnections();
  }
  const response = await axios.get("/crm/connections");
  return response.data;
};

// REFERRAL EXPORTS
export const getReferrals = async () => {
  if (IS_DEV_MODE) {
    return await mockApi.getReferrals();
  }
  const response = await axios.get("/referrals");
  return response.data;
};

export const createReferralLink = async (data: any) => {
  if (IS_DEV_MODE) {
    return await mockApi.createReferralLink(data);
  }
  const response = await axios.post("/referrals/links", data);
  return response.data;
};
