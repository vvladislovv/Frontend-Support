import { useState, useCallback } from 'react';
import * as api from '../api';
// Локальные определения типов для хуков
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, TArgs extends unknown[] = unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<T>;
  reset: () => void;
}



export function useApi<T, TArgs extends unknown[] = unknown[]>(
  apiFunction: (...args: TArgs) => Promise<T>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<T> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Специализированные хуки для часто используемых API
export const useAuth = () => {
  const login = useApi(api.login);
  const register = useApi(api.register);
  const logout = useApi(api.logout);
  const getProfile = useApi(api.getProfile);

  return {
    login,
    register,
    logout,
    getProfile,
  };
};

export const useBots = () => {
  const getBots = useApi(api.getBots);
  const createBot = useApi(api.createBot);
  const updateBot = useApi(api.updateBot);
  const deleteBot = useApi(api.deleteBot);
  const getBotStats = useApi(api.getBotStats);

  return {
    getBots,
    createBot,
    updateBot,
    deleteBot,
    getBotStats,
  };
};

export const useTickets = () => {
  const getTickets = useApi(api.getTickets);
  const createTicket = useApi(api.createTicket);
  const updateTicket = useApi(api.updateTicket);
  const deleteTicket = useApi(api.deleteTicket);
  const getTicketMessages = useApi(api.getTicketMessages);
  const addTicketMessage = useApi(api.addTicketMessage);

  return {
    getTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketMessages,
    addTicketMessage,
  };
};

export const useClients = () => {
  const getClients = useApi(api.getClients);
  const createClient = useApi(api.createClient);
  const updateClient = useApi(api.updateClient);
  const deleteClient = useApi(api.deleteClient);
  const getClientById = useApi(api.getClientById);
  const getClientActivity = useApi(api.getClientActivity);

  return {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientActivity,
  };
};

export const useReferrals = () => {
  const getReferrals = useApi(api.getReferrals);
  const getReferralLinks = useApi(api.getReferralLinks);
  const createReferralLink = useApi(api.createReferralLink);
  const getReferralStats = useApi(api.getReferralStats);
  const trackReferralClick = useApi(api.trackReferralClick);

  return {
    getReferrals,
    getReferralLinks,
    createReferralLink,
    getReferralStats,
    trackReferralClick,
  };
};

export const usePromoCodes = () => {
  const getPromoCodes = useApi(api.getPromoCodes);
  const createPromoCode = useApi(api.createPromoCode);
  const updatePromoCode = useApi(api.updatePromoCode);
  const deletePromoCode = useApi(api.deletePromoCode);
  const togglePromoCode = useApi(api.togglePromoCode);
  const validatePromoCode = useApi(api.validatePromoCode);

  return {
    getPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    togglePromoCode,
    validatePromoCode,
  };
};

export const useBilling = () => {
  const getBillingPlans = useApi(api.getBillingPlans);
  const getSubscriptions = useApi(api.getSubscriptions);
  const getBillingStatus = useApi(api.getBillingStatus);
  const getBillingInfo = useApi(api.getBillingInfo);
  const subscribeToPlan = useApi(api.subscribeToPlan);

  return {
    getBillingPlans,
    getSubscriptions,
    getBillingStatus,
    getBillingInfo,
    subscribeToPlan,
  };
};

export const useCRM = () => {
  const getCRMConnections = useApi(api.getCRMConnections);
  const createCRMConnection = useApi(api.createCRMConnection);
  const updateCRMConnection = useApi(api.updateCRMConnection);
  const deleteCRMConnection = useApi(api.deleteCRMConnection);
  const toggleCRMConnection = useApi(api.toggleCRMConnection);
  const getCRMUserInfo = useApi(api.getCRMUserInfo);

  return {
    getCRMConnections,
    createCRMConnection,
    updateCRMConnection,
    deleteCRMConnection,
    toggleCRMConnection,
    getCRMUserInfo,
  };
};

export const useTelegaPay = () => {
  const getPaymentMethods = useApi(api.getPaymentMethods);
  const getRequisites = useApi(api.getRequisites);
  const createPaylink = useApi(api.createPaylink);
  const checkPaymentStatus = useApi(api.checkPaymentStatus);
  const confirmPayment = useApi(api.confirmPayment);
  const cancelPayment = useApi(api.cancelPayment);
  const sendReceipt = useApi(api.sendReceipt);
  const createPayout = useApi(api.createPayout);
  const cancelPayout = useApi(api.cancelPayout);

  return {
    getPaymentMethods,
    getRequisites,
    createPaylink,
    checkPaymentStatus,
    confirmPayment,
    cancelPayment,
    sendReceipt,
    createPayout,
    cancelPayout,
  };
};

export const useAdmin = () => {
  const getAdminStats = useApi(api.getAdminStats);
  
  // Client Management
  const getClients = useApi(api.getClients);
  const createClient = useApi(api.createClient);
  const updateClient = useApi(api.updateClient);
  const deleteClient = useApi(api.deleteClient);
  const getClientById = useApi(api.getClientById);
  const getClientActivity = useApi(api.getClientActivity);

  // Bot Management for Clients
  const createBotForClient = useApi(api.createBotForClient);
  const getBotForClient = useApi(api.getBotForClient);
  const updateBotForClient = useApi(api.updateBotForClient);
  const deleteBotForClient = useApi(api.deleteBotForClient);

  // Ticket Management for Clients
  const getTicketsForClient = useApi(api.getTicketsForClient);
  const createTicketForClient = useApi(api.createTicketForClient);
  const getTicketForClient = useApi(api.getTicketForClient);
  const updateTicketForClient = useApi(api.updateTicketForClient);
  const deleteTicketForClient = useApi(api.deleteTicketForClient);
  const addMessageToTicketForClient = useApi(api.addMessageToTicketForClient);
  const getTicketMessagesForClient = useApi(api.getTicketMessagesForClient);

  // Referral Management for Clients
  const getClientReferrals = useApi(api.getClientReferrals);
  const getClientReferralStats = useApi(api.getClientReferralStats);
  const getClientReferralLinks = useApi(api.getClientReferralLinks);
  const getClientReferralBonuses = useApi(api.getClientReferralBonuses);
  const updateClientReferralBonuses = useApi(api.updateClientReferralBonuses);
  const deleteClientReferralLink = useApi(api.deleteClientReferralLink);

  // CRM Management for Clients
  const getClientCRMConnections = useApi(api.getClientCRMConnections);
  const createCRMConnectionForClient = useApi(api.createCRMConnectionForClient);
  const updateCRMConnectionForClient = useApi(api.updateCRMConnectionForClient);
  const deleteCRMConnectionForClient = useApi(api.deleteCRMConnectionForClient);
  const getAllClientCRMData = useApi(api.getAllClientCRMData);

  // Promo Codes
  const getPromoCodes = useApi(api.getPromoCodes);
  const createPromoCode = useApi(api.createPromoCode);
  const updatePromoCode = useApi(api.updatePromoCode);
  const deletePromoCode = useApi(api.deletePromoCode);
  const togglePromoCode = useApi(api.togglePromoCode);
  const validatePromoCode = useApi(api.validatePromoCode);

  // CRM Global Management
  const getCRMConnections = useApi(api.getCRMConnections);
  const deleteCRMConnection = useApi(api.deleteCRMConnection);
  const toggleCRMConnection = useApi(api.toggleCRMConnection);

  return {
    getAdminStats,
    
    // Client Management
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientActivity,

    // Bot Management for Clients
    createBotForClient,
    getBotForClient,
    updateBotForClient,
    deleteBotForClient,

    // Ticket Management for Clients
    getTicketsForClient,
    createTicketForClient,
    getTicketForClient,
    updateTicketForClient,
    deleteTicketForClient,
    addMessageToTicketForClient,
    getTicketMessagesForClient,

    // Referral Management for Clients
    getClientReferrals,
    getClientReferralStats,
    getClientReferralLinks,
    getClientReferralBonuses,
    updateClientReferralBonuses,
    deleteClientReferralLink,

    // CRM Management for Clients
    getClientCRMConnections,
    createCRMConnectionForClient,
    updateCRMConnectionForClient,
    deleteCRMConnectionForClient,
    getAllClientCRMData,

    // Promo Codes
    getPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    togglePromoCode,
    validatePromoCode,

    // CRM Global Management
    getCRMConnections,
    deleteCRMConnection,
    toggleCRMConnection,
  };
};

// Главный хук для доступа ко всем API
export const useAppApi = () => {
  return {
    auth: useAuth(),
    bots: useBots(),
    tickets: useTickets(),
    clients: useClients(),
    referrals: useReferrals(),
    promoCodes: usePromoCodes(),
    billing: useBilling(),
    crm: useCRM(),
    telegaPay: useTelegaPay(),
    admin: useAdmin(),
    
    // Прямой доступ к API для особых случаев
    api,
  };
};