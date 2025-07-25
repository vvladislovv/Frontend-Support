import axios from 'axios';
import type { CRMConnection } from '../types';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class CRMService {
  private static instance: CRMService;
  
  static getInstance(): CRMService {
    if (!CRMService.instance) {
      CRMService.instance = new CRMService();
    }
    return CRMService.instance;
  }

  // User CRM Operations
  async getUserInfo() {
    const response = await axios.get(`${API_BASE_URL}/me/crm/usersinfo`);
    return response.data;
  }

  async getConnections(): Promise<CRMConnection[]> {
    const response = await axios.get(`${API_BASE_URL}/me/crm/connections`);
    return response.data;
  }

  async createConnection(connectionData: {
    userId: number;
    provider: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    domain: string;
    otherData: Record<string, any>;
  }): Promise<CRMConnection> {
    const response = await axios.post(`${API_BASE_URL}/crm/connections`, connectionData);
    return response.data;
  }

  async getConnectionById(id: string): Promise<CRMConnection> {
    const response = await axios.get(`${API_BASE_URL}/crm/connections/${id}`);
    return response.data;
  }

  async updateConnection(id: string, connectionData: {
    accessToken?: string;
    expiresAt?: string;
  }): Promise<CRMConnection> {
    const response = await axios.put(`${API_BASE_URL}/crm/connections/${id}`, connectionData);
    return response.data;
  }

  async deleteConnection(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/crm/connections/${id}`);
    return response.data;
  }

  // Admin CRM Operations
  async getAllConnections(): Promise<CRMConnection[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/crm/connections`);
    return response.data;
  }

  async getAdminConnectionById(id: string): Promise<CRMConnection> {
    const response = await axios.get(`${API_BASE_URL}/admin/crm/connections/${id}`);
    return response.data;
  }

  async deleteAdminConnection(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/crm/connections/${id}`);
    return response.data;
  }

  async toggleAdminConnection(id: string): Promise<CRMConnection> {
    const response = await axios.patch(`${API_BASE_URL}/admin/crm/connections/${id}/toggle`);
    return response.data;
  }

  // Admin Client CRM Operations
  async createClientConnection(clientId: string, connectionData: {
    provider: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    domain: string;
    otherData: Record<string, any>;
    isActive: boolean;
  }): Promise<CRMConnection> {
    const response = await axios.post(`${API_BASE_URL}/admin/clients/${clientId}/crm/connections`, connectionData);
    return response.data;
  }

  async getClientConnections(clientId: string): Promise<CRMConnection[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/crm/connections`);
    return response.data;
  }

  async updateClientConnection(clientId: string, connectionId: string, connectionData: {
    accessToken?: string;
    refreshToken?: string;
    isActive?: boolean;
  }): Promise<CRMConnection> {
    const response = await axios.patch(`${API_BASE_URL}/admin/clients/${clientId}/crm/connections/${connectionId}`, connectionData);
    return response.data;
  }

  async deleteClientConnection(clientId: string, connectionId: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/clients/${clientId}/crm/connections/${connectionId}`);
    return response.data;
  }

  async getAllClientCRMData(clientId: string) {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/crm/data/all`);
    return response.data;
  }
}

export const crmService = CRMService.getInstance();