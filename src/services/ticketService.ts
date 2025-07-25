import axios from 'axios';
import type { Ticket, TicketMessage } from '../types';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class TicketService {
  private static instance: TicketService;
  
  static getInstance(): TicketService {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
    }
    return TicketService.instance;
  }

  // User Ticket Operations
  async getTickets(): Promise<Ticket[]> {
    const response = await axios.get(`${API_BASE_URL}/me/tickets`);
    return response.data;
  }

  async createTicket(ticketData: {
    subject: string;
    message: string;
    botId: number;
    telegramId: number;
  }): Promise<Ticket> {
    const response = await axios.post(`${API_BASE_URL}/me/tickets`, ticketData);
    return response.data;
  }

  async getTicketById(id: string): Promise<Ticket> {
    const response = await axios.get(`${API_BASE_URL}/me/tickets/${id}`);
    return response.data;
  }

  async updateTicket(id: string, ticketData: { status?: string }): Promise<Ticket> {
    const response = await axios.patch(`${API_BASE_URL}/me/tickets/${id}`, ticketData);
    return response.data;
  }

  async deleteTicket(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/me/tickets/${id}`);
    return response.data;
  }

  async addTicketMessage(ticketId: string, message: string): Promise<TicketMessage> {
    const response = await axios.post(`${API_BASE_URL}/me/tickets/${ticketId}/messages`, {
      message
    });
    return response.data;
  }

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const response = await axios.get(`${API_BASE_URL}/me/tickets/${ticketId}/messages`);
    return response.data;
  }

  // Admin Ticket Operations for Clients
  async getClientTickets(clientId: string): Promise<Ticket[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/tickets`);
    return response.data;
  }

  async createClientTicket(clientId: string, ticketData: {
    subject: string;
    message: string;
    botId: number;
    telegramId: number;
  }): Promise<Ticket> {
    const response = await axios.post(`${API_BASE_URL}/admin/clients/${clientId}/tickets`, ticketData);
    return response.data;
  }

  async getClientTicket(clientId: string, ticketId: string): Promise<Ticket> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/tickets/${ticketId}`);
    return response.data;
  }

  async updateClientTicket(clientId: string, ticketId: string, ticketData: { status?: string }): Promise<Ticket> {
    const response = await axios.patch(`${API_BASE_URL}/admin/clients/${clientId}/tickets/${ticketId}`, ticketData);
    return response.data;
  }

  async deleteClientTicket(clientId: string, ticketId: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/clients/${clientId}/tickets/${ticketId}`);
    return response.data;
  }

  async addClientTicketMessage(clientId: string, ticketId: string, message: string): Promise<TicketMessage> {
    const response = await axios.post(`${API_BASE_URL}/admin/clients/${clientId}/tickets/${ticketId}/messages`, {
      message
    });
    return response.data;
  }

  async getClientTicketMessages(clientId: string, ticketId: string): Promise<TicketMessage[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/tickets/${ticketId}/messages`);
    return response.data;
  }
}

export const ticketService = TicketService.getInstance();