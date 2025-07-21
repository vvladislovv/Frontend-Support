import { useState } from 'react';
import { useAppApi } from './useApi';

interface TestResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export const useApiTester = () => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const api = useAppApi();

  const runAllTests = async () => {
    setIsRunning(true);
    const results: Record<string, TestResult> = {};

    // Тестируем основные API endpoints
    const tests = [
      // Auth
      { name: 'getProfile', fn: () => api.auth.getProfile.execute() },
      
      // Bots
      { name: 'getBots', fn: () => api.bots.getBots.execute() },
      { name: 'getBotStats', fn: () => api.bots.getBotStats.execute('1') },
      
      // Tickets
      { name: 'getTickets', fn: () => api.tickets.getTickets.execute() },
      { name: 'getTicketMessages', fn: () => api.tickets.getTicketMessages.execute('1') },
      
      // Clients (Admin)
      { name: 'getClients', fn: () => api.clients.getClients.execute() },
      { name: 'getClientActivity', fn: () => api.clients.getClientActivity.execute('1') },
      
      // Referrals
      { name: 'getReferrals', fn: () => api.referrals.getReferrals.execute() },
      { name: 'getReferralLinks', fn: () => api.referrals.getReferralLinks.execute() },
      { name: 'getReferralStats', fn: () => api.referrals.getReferralStats.execute() },
      
      // Promo Codes
      { name: 'getPromoCodes', fn: () => api.admin.getPromoCodes.execute() },
      { name: 'validatePromoCode', fn: () => api.admin.validatePromoCode.execute('SUMMER2025', 1000) },
      
      // Billing
      { name: 'getBillingPlans', fn: () => api.billing.getBillingPlans.execute() },
      { name: 'getBillingStatus', fn: () => api.billing.getBillingStatus.execute() },
      { name: 'getSubscriptions', fn: () => api.billing.getSubscriptions.execute() },
      
      // CRM
      { name: 'getCRMConnections', fn: () => api.crm.getCRMConnections.execute() },
      { name: 'getCRMUserInfo', fn: () => api.crm.getCRMUserInfo.execute() },
      
      // TelegaPay
      { name: 'getPaymentMethods', fn: () => api.telegaPay.getPaymentMethods.execute(1000, 'RUB') },
      
      // Admin Stats
      { name: 'getAdminStats', fn: () => api.admin.getAdminStats.execute() },
    ];

    for (const test of tests) {
      try {
        console.log(`🧪 Testing ${test.name}...`);
        const result = await test.fn();
        results[test.name] = { success: true, data: result };
        console.log(`✅ ${test.name} - Success:`, result);
      } catch (error) {
        results[test.name] = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        console.log(`❌ ${test.name} - Error:`, error);
      }
    }

    setTestResults(results);
    setIsRunning(false);
    
    // Выводим сводку
    const successful = Object.values(results).filter(r => r.success).length;
    const total = Object.keys(results).length;
    console.log(`\n📊 Test Summary: ${successful}/${total} tests passed`);
    
    return results;
  };

  const testSpecificEndpoint = async (endpointName: string, testFn: () => Promise<unknown>) => {
    setIsRunning(true);
    try {
      console.log(`🧪 Testing ${endpointName}...`);
      const result = await testFn();
      const newResults = {
        ...testResults,
        [endpointName]: { success: true, data: result }
      };
      setTestResults(newResults);
      console.log(`✅ ${endpointName} - Success:`, result);
      return result;
    } catch (error) {
      const newResults = {
        ...testResults,
        [endpointName]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      };
      setTestResults(newResults);
      console.log(`❌ ${endpointName} - Error:`, error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  // Тестирование создания данных
  const testCreateOperations = async () => {
    setIsRunning(true);
    const results: Record<string, TestResult> = {};

    const createTests = [
      {
        name: 'createReferralLink',
        fn: () => api.referrals.createReferralLink.execute()
      },
      {
        name: 'createPromoCode',
        fn: () => api.admin.createPromoCode.execute({
          code: 'TEST2025',
          discount: 15,
          type: 'PERCENTAGE',
          maxUses: 10,
          expiresAt: '2025-12-31T23:59:59Z',
          isActive: true
        })
      },
      {
        name: 'createBot',
        fn: () => api.bots.createBot.execute({
          name: 'Test API Bot',
          token: 'test_token_123',
          username: 'test_api_bot',
          link: 'https://t.me/test_api_bot'
        })
      },
      {
        name: 'createTicket',
        fn: () => api.tickets.createTicket.execute({
          subject: 'API Test Ticket',
          message: 'This is a test ticket created via API',
          botId: '1',
          telegramId: '123456789',
          status: 'OPEN'
        })
      }
    ];

    for (const test of createTests) {
      try {
        console.log(`🧪 Testing ${test.name}...`);
        const result = await test.fn();
        results[test.name] = { success: true, data: result };
        console.log(`✅ ${test.name} - Success:`, result);
      } catch (error) {
        results[test.name] = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        console.log(`❌ ${test.name} - Error:`, error);
      }
    }

    setTestResults(prev => ({ ...prev, ...results }));
    setIsRunning(false);
    return results;
  };

  // Тестирование TelegaPay workflow
  const testTelegaPayWorkflow = async () => {
    setIsRunning(true);
    const results: Record<string, TestResult> = {};

    try {
      // 1. Получаем методы оплаты
      console.log('🧪 Testing TelegaPay workflow...');
      
      const methods = await api.telegaPay.getPaymentMethods.execute(1000, 'RUB');
      results.getPaymentMethods = { success: true, data: methods };
      console.log('✅ Payment methods:', methods);

      // 2. Создаем ссылку на оплату
      const paylink = await api.telegaPay.createPaylink.execute({
        amount: 1000,
        currency: 'RUB',
        payment_method: 'BANK_SBER',
        description: 'Test payment',
        return_url: 'https://example.com/success',
        user_id: '1'
      });
      results.createPaylink = { success: true, data: paylink };
      console.log('✅ Paylink created:', paylink);

      // 3. Проверяем статус платежа
      if (paylink.telegapay_transaction_id) {
        const status = await api.telegaPay.checkPaymentStatus.execute(paylink.telegapay_transaction_id);
        results.checkPaymentStatus = { success: true, data: status };
        console.log('✅ Payment status:', status);
      }

    } catch (error) {
      results.telegaPayWorkflow = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      console.log('❌ TelegaPay workflow error:', error);
    }

    setTestResults(prev => ({ ...prev, ...results }));
    setIsRunning(false);
    return results;
  };

  return {
    testResults,
    isRunning,
    runAllTests,
    testSpecificEndpoint,
    testCreateOperations,
    testTelegaPayWorkflow,
    clearResults: () => setTestResults({})
  };
};