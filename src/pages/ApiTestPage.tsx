import React from 'react';
import { useApiTester } from '../hooks/useApiTester';

const ApiTestPage: React.FC = () => {
  const { 
    testResults, 
    isRunning, 
    runAllTests, 
    testCreateOperations, 
    testTelegaPayWorkflow,
    clearResults 
  } = useApiTester();

  const getResultColor = (result: { success: boolean } | null) => {
    if (!result) return 'text-gray-500';
    return result.success ? 'text-green-600' : 'text-red-600';
  };

  const getResultIcon = (result: { success: boolean } | null) => {
    if (!result) return '⏳';
    return result.success ? '✅' : '❌';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">API Tester</h1>
        <p className="text-gray-600">Тестирование всех API endpoints из Postman collection</p>
      </div>

      {/* Кнопки управления */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Тестирование...' : 'Запустить все тесты'}
        </button>
        
        <button
          onClick={testCreateOperations}
          disabled={isRunning}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Тест создания данных
        </button>
        
        <button
          onClick={testTelegaPayWorkflow}
          disabled={isRunning}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          Тест TelegaPay
        </button>
        
        <button
          onClick={clearResults}
          disabled={isRunning}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Очистить результаты
        </button>
      </div>

      {/* Результаты тестов */}
      {Object.keys(testResults).length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Результаты тестирования</h2>
            <p className="text-sm text-gray-500">
              Успешно: {Object.values(testResults).filter(r => r.success).length} / {Object.keys(testResults).length}
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(testResults).map(([name, result]) => (
                <div key={name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{name}</h3>
                    <span className="text-xl">{getResultIcon(result)}</span>
                  </div>
                  
                  <div className={`text-sm ${getResultColor(result)}`}>
                    {result.success ? 'Успешно' : `Ошибка: ${result.error}`}
                  </div>
                  
                  {result.success && result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Показать данные</summary>
                      <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Информация о доступных endpoints */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Доступные API Endpoints</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🔐 Auth</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• login</li>
                <li>• register</li>
                <li>• logout</li>
                <li>• getProfile</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🤖 Bots</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getBots</li>
                <li>• createBot</li>
                <li>• updateBot</li>
                <li>• deleteBot</li>
                <li>• getBotStats</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎫 Tickets</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getTickets</li>
                <li>• createTicket</li>
                <li>• updateTicket</li>
                <li>• deleteTicket</li>
                <li>• getTicketMessages</li>
                <li>• addTicketMessage</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">👥 Referrals</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getReferrals</li>
                <li>• getReferralLinks</li>
                <li>• createReferralLink</li>
                <li>• getReferralStats</li>
                <li>• trackReferralClick</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎟️ Promo Codes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getPromoCodes</li>
                <li>• createPromoCode</li>
                <li>• updatePromoCode</li>
                <li>• deletePromoCode</li>
                <li>• togglePromoCode</li>
                <li>• validatePromoCode</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">💳 Billing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getBillingPlans</li>
                <li>• getSubscriptions</li>
                <li>• getBillingStatus</li>
                <li>• subscribeToPlan</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📇 CRM</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getCRMConnections</li>
                <li>• createCRMConnection</li>
                <li>• updateCRMConnection</li>
                <li>• deleteCRMConnection</li>
                <li>• getCRMUserInfo</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">💰 TelegaPay</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getPaymentMethods</li>
                <li>• createPaylink</li>
                <li>• checkPaymentStatus</li>
                <li>• confirmPayment</li>
                <li>• cancelPayment</li>
                <li>• createPayout</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">👨‍💼 Admin</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• getClients</li>
                <li>• createClient</li>
                <li>• updateClient</li>
                <li>• deleteClient</li>
                <li>• getAdminStats</li>
                <li>• getClientActivity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;