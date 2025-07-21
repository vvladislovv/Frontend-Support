// Дополнительные типы для API

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateBotRequest {
  name: string;
  token: string;
  username: string;
  link: string;
}

export interface UpdateBotRequest extends Partial<CreateBotRequest> {}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  botId: string;
  telegramId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export interface UpdateTicketRequest extends Partial<CreateTicketRequest> {}

export interface CreateClientRequest {
  name: string;
  email: string;
  active: boolean;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export interface CreateTariffRequest {
  name: string;
  price: number;
  description: string;
  active: boolean;
  features: string[];
}

export interface UpdateTariffRequest extends Partial<CreateTariffRequest> {}

export interface CreatePromoCodeRequest {
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface UpdatePromoCodeRequest extends Partial<CreatePromoCodeRequest> {}

export interface CreateCRMConnectionRequest {
  provider: 'AMOCRM' | 'BITRIX24' | 'HUBSPOT';
  accessToken: string;
  refreshToken?: string;
  domain?: string;
}

export interface UpdateCRMConnectionRequest extends Partial<CreateCRMConnectionRequest> {}

export interface CreatePaylinkRequest {
  amount: number;
  currency: string;
  payment_method: string;
  description?: string;
  return_url?: string;
  user_id?: string;
}

export interface CreatePayoutRequest {
  amount: number;
  currency: string;
  requisiteType: 'CARD' | 'WALLET';
  requisiteValue: string;
  holderName: string;
  bankName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}