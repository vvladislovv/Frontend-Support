import axios from 'axios';
import type { BillingPlan, Subscription } from '../types';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class BillingService {
  private static instance: BillingService;
  
  static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  async getPlans(): Promise<BillingPlan[]> {
    const response = await axios.get(`${API_BASE_URL}/billing/plans`);
    return response.data;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    const response = await axios.get(`${API_BASE_URL}/billing/subscriptions`);
    return response.data;
  }

  async createPayment(planData: {
    planId: string;
    promoCode?: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/billing/pay`, planData);
    return response.data;
  }

  async subscribeToPlan(planData: {
    plan: string;
    botId: number;
  }) {
    const response = await axios.post(`${API_BASE_URL}/me/billing/subscribe`, planData);
    return response.data;
  }

  async getBillingStatus() {
    const response = await axios.get(`${API_BASE_URL}/me/billing/status`);
    return response.data;
  }

  async getBillingInfo() {
    const response = await axios.get(`${API_BASE_URL}/me/billing`);
    return response.data;
  }

  async handleWebhook(webhookData: {
    event: string;
    payment_id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, any>;
  }) {
    const response = await axios.post(`${API_BASE_URL}/billing/webhook/telegram-pay`, webhookData);
    return response.data;
  }
}

export const billingService = BillingService.getInstance();