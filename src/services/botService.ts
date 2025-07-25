import axios from 'axios';
import type { Bot, BotStats } from '../types';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class BotService {
  private static instance: BotService;
  
  static getInstance(): BotService {
    if (!BotService.instance) {
      BotService.instance = new BotService();
    }
    return BotService.instance;
  }

  // User Bot Operations
  async getBots(): Promise<Bot[]> {
    const response = await axios.get(`${API_BASE_URL}/me/bots`);
    return response.data;
  }

  async createBot(botData: {
    name: string;
    token: string;
    username: string;
    link: string;
  }): Promise<Bot> {
    const response = await axios.post(`${API_BASE_URL}/me/bots`, botData);
    return response.data;
  }

  async getBotById(id: string): Promise<Bot> {
    const response = await axios.get(`${API_BASE_URL}/me/bots/${id}`);
    return response.data;
  }

  async updateBot(id: string, botData: Partial<Bot>): Promise<Bot> {
    const response = await axios.patch(`${API_BASE_URL}/me/bots/${id}`, botData);
    return response.data;
  }

  async deleteBot(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/me/bots/${id}`);
    return response.data;
  }

  async getBotStats(botId: string): Promise<BotStats> {
    const response = await axios.get(`${API_BASE_URL}/me/bots/${botId}/stats`);
    return response.data;
  }

  // Admin Bot Operations for Clients
  async createClientBot(clientId: string, botData: {
    name: string;
    token: string;
    username: string;
  }): Promise<Bot> {
    const response = await axios.post(`${API_BASE_URL}/admin/clients/${clientId}/bots`, botData);
    return response.data;
  }

  async getClientBot(clientId: string, botId: string): Promise<Bot> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/bots/${botId}`);
    return response.data;
  }

  async updateClientBot(clientId: string, botId: string, botData: {
    name?: string;
    token?: string;
    username?: string;
  }): Promise<Bot> {
    const response = await axios.patch(`${API_BASE_URL}/admin/clients/${clientId}/bots/${botId}`, botData);
    return response.data;
  }

  async deleteClientBot(clientId: string, botId: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/clients/${clientId}/bots/${botId}`);
    return response.data;
  }
}

export const botService = BotService.getInstance();