// Общие типы для приложения

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface Bot {
  id: string;
  name: string;
  token: string;
  username: string;
  link: string;
  createdAt: string;
  stats?: BotStats;
}

export interface BotStats {
  totalUsers: number;
  activeUsers: number;
  messagesCount: number;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  botId: string;
  telegramId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  activity?: ClientActivity[];
}

export interface ClientActivity {
  id: string;
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface SystemLoad {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    incoming: number;
    outgoing: number;
  };
  uptime: string;
  activeUsers: number;
  totalRequests: number;
  errorRate: number;
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  features: string[];
  createdAt: string;
}

export interface ReferralLink {
  id: string;
  code: string;
  clicks: number;
  registrations: number;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  bonus: number;
  status: 'PENDING' | 'PAID';
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  totalBonus: number;
  pendingBonus: number;
  paidBonus: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface BillingStatus {
  hasActiveSubscription: boolean;
  currentPlan: BillingPlan | null;
  subscription: Subscription | null;
}

export interface SubscriptionResult {
  subscription: Subscription;
  paymentUrl?: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
}

export interface CRMUserInfo {
  id: string;
  name: string;
  email?: string;
  provider: 'AMOCRM' | 'BITRIX24' | 'HUBSPOT';
  domain?: string;
  isConnected: boolean;
  totalContacts?: number;
  totalDeals?: number;
  totalTasks?: number;
  lastSync?: string;
}

export interface CRMFormData {
  provider: 'AMOCRM' | 'BITRIX24' | 'HUBSPOT';
  accessToken: string;
  refreshToken: string;
  domain: string;
  clientId: string;
  clientSecret: string;
}

export interface CRMConnection {
  id: string;
  userId: string;
  provider: 'AMOCRM' | 'BITRIX24' | 'HUBSPOT';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  domain?: string;
  isActive: boolean;
  otherData?: Record<string, unknown>;
  createdAt: string;
}

export interface TelegaPayTransaction {
  id: string;
  externalId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: string;
  paymentUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TelegaPayPayout {
  id: string;
  amount: number;
  currency: string;
  requisiteType: 'CARD' | 'WALLET';
  requisiteValue: string;
  holderName: string;
  bankName?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

// Экспортируем дополнительные типы
// Временно отключены все экспорты для диагностики
// export * from './api';
// export * from './components';
// export * from './hooks';
// export * from './pages';
// export * from './global';