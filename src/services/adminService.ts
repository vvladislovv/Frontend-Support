import axios from 'axios';
import type { Client, ClientActivity, PromoCode } from '../types';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class AdminService {
  private static instance: AdminService;
  
  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Client Management
  async getClients(): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/clients`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.warn('Backend unavailable, returning mock data');
      // Возвращаем тестовые данные если backend недоступен
      return [
        {
          id: '1',
          name: 'Test User 1',
          email: 'test1@example.com',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Test User 2',
          email: 'test2@example.com',
          active: false,
          createdAt: new Date().toISOString()
        }
      ];
    }
  }

  async createClient(clientData: {
    email: string;
    password: string;
    name: string;
  }): Promise<Client> {
    const response = await axios.post(`${API_BASE_URL}/admin/clients`, clientData);
    return response.data;
  }

  async getClientById(clientId: string): Promise<Client> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}`);
    return response.data;
  }

  async updateClient(clientId: string, clientData: { name?: string }): Promise<Client> {
    const response = await axios.patch(`${API_BASE_URL}/admin/clients/${clientId}`, clientData);
    return response.data;
  }

  async deleteClient(clientId: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/clients/${clientId}`);
    return response.data;
  }

  async getClientActivity(clientId: string): Promise<ClientActivity[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/activity`);
    return response.data;
  }

  async getClientsStats() {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/stats`);
    return response.data;
  }

  async getAdminStats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/clients/stats`);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, returning mock stats');
      // Возвращаем тестовые статистики если backend недоступен
      return {
        totalClients: 42,
        activeClients: 38,
        totalBots: 15,
        totalTickets: 127,
        openTickets: 8,
        totalRevenue: 15420,
        monthlyRevenue: 3240
      };
    }
  }

  // Promo Code Management
  async getPromoCodes(): Promise<PromoCode[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/promo-codes`);
    return response.data;
  }

  async createPromoCode(promoData: {
    code: string;
    discount: number;
    type: 'PERCENTAGE' | 'FIXED';
    maxUses: number;
    expiresAt: string;
    isActive: boolean;
  }): Promise<PromoCode> {
    const response = await axios.post(`${API_BASE_URL}/admin/promo-codes`, promoData);
    return response.data;
  }

  async getPromoCodeById(id: string): Promise<PromoCode> {
    const response = await axios.get(`${API_BASE_URL}/admin/promo-codes/${id}`);
    return response.data;
  }

  async updatePromoCode(id: string, promoData: {
    discount?: number;
    maxUses?: number;
  }): Promise<PromoCode> {
    const response = await axios.patch(`${API_BASE_URL}/admin/promo-codes/${id}`, promoData);
    return response.data;
  }

  async deletePromoCode(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/promo-codes/${id}`);
    return response.data;
  }

  async togglePromoCode(id: string): Promise<PromoCode> {
    const response = await axios.patch(`${API_BASE_URL}/admin/promo-codes/${id}/toggle`);
    return response.data;
  }

  async validatePromoCode(code: string, amount: number) {
    const response = await axios.post(`${API_BASE_URL}/admin/promo-codes/validate`, {
      code,
      amount
    });
    return response.data;
  }
}

export const adminService = AdminService.getInstance();