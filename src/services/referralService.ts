import axios from 'axios';
import type { Referral, ReferralLink, ReferralStats } from '../types';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class ReferralService {
  private static instance: ReferralService;
  
  static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  // User Referral Operations
  async getReferrals(): Promise<Referral[]> {
    const response = await axios.get(`${API_BASE_URL}/me/referrals`);
    return response.data;
  }

  async getNewReferralLink(): Promise<ReferralLink> {
    const response = await axios.get(`${API_BASE_URL}/me/referrals/new`);
    return response.data;
  }

  async trackReferralClick(code: string) {
    const response = await axios.get(`${API_BASE_URL}/me/referrals/track/${code}`);
    return response.data;
  }

  // Admin Referral Operations for Clients
  async getClientReferrals(clientId: string): Promise<Referral[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/me/referrals`);
    return response.data;
  }

  async getClientReferralStats(clientId: string): Promise<ReferralStats> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/me/referrals/stats`);
    return response.data;
  }

  async getClientReferralLinks(clientId: string): Promise<ReferralLink[]> {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/me/referrals/links`);
    return response.data;
  }

  async getClientReferralBonuses(clientId: string) {
    const response = await axios.get(`${API_BASE_URL}/admin/clients/${clientId}/me/referrals/bonuses`);
    return response.data;
  }

  async updateClientReferralBonuses(clientId: string, bonusData: {
    totalBonus: number;
    pendingBonus: number;
  }) {
    const response = await axios.patch(`${API_BASE_URL}/admin/clients/${clientId}/me/referrals/bonuses`, bonusData);
    return response.data;
  }

  async deleteClientReferralLink(clientId: string, linkId: string) {
    const response = await axios.delete(`${API_BASE_URL}/admin/clients/${clientId}/me/referrals/links/${linkId}`);
    return response.data;
  }
}

export const referralService = ReferralService.getInstance();