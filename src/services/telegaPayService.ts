import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV ? "" : "http://localhost:3000";

export class TelegaPayService {
  private static instance: TelegaPayService;
  
  static getInstance(): TelegaPayService {
    if (!TelegaPayService.instance) {
      TelegaPayService.instance = new TelegaPayService();
    }
    return TelegaPayService.instance;
  }

  async getPaymentMethods(amount: number, currency: string = 'RUB') {
    const response = await axios.post(`${API_BASE_URL}/telegapay/get-methods`, {
      amount,
      currency
    });
    return response.data;
  }

  async getRequisites(paymentData: {
    amount: number;
    currency: string;
    method: string;
    order_id: string;
    user_id: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/get-requisites`, paymentData);
    return response.data;
  }

  async createPaylink(paylinkData: {
    amount: number;
    currency: string;
    payment_method: string;
    description: string;
    return_url: string;
    user_id: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/create-paylink`, paylinkData);
    return response.data;
  }

  async checkPaymentStatus(transactionId: string) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/check-status`, {
      transaction_id: transactionId
    });
    return response.data;
  }

  async confirmPayment(transactionId: string) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/confirm-payment`, {
      transaction_id: transactionId
    });
    return response.data;
  }

  async cancelPayment(transactionId: string) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/cancel-payment`, {
      transaction_id: transactionId
    });
    return response.data;
  }

  async sendReceipt(receiptData: {
    transaction_id: string;
    receipt_url: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/send-receipt`, receiptData);
    return response.data;
  }

  async createPayout(payoutData: {
    amount: number;
    currency: string;
    requisite_type: string;
    requisite_value: string;
    holder_name: string;
    bank_name?: string;
    external_id: string;
    userId: number;
  }) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/create-payout`, payoutData);
    return response.data;
  }

  async cancelPayout(payoutId: string) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/cancel-payout`, {
      payout_id: payoutId
    });
    return response.data;
  }

  async handleWebhook(webhookData: {
    transaction_id: string;
    status: string;
    type: string;
    amount: number;
    amount_usdt: number;
    currency: string;
    created_at: string;
    completed_at?: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/telegapay/webhook`, webhookData);
    return response.data;
  }
}

export const telegaPayService = TelegaPayService.getInstance();