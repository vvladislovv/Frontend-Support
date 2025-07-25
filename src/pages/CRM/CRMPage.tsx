import React, { useEffect, useState } from "react";
import { useAppApi } from "../../hooks/useApi";
import type { CRMConnection, CRMUserInfo, CRMFormData } from "../../types";

const CRMPage: React.FC = () => {
  const { crm } = useAppApi();
  const [connections, setConnections] = useState<CRMConnection[]>([]);
  const [userInfo, setUserInfo] = useState<CRMUserInfo | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CRMFormData>({
    provider: "AMOCRM",
    accessToken: "",
    refreshToken: "",
    domain: "",
    clientId: "",
    clientSecret: "",
  });
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [connectionsData, userInfoData] = await Promise.all([
        crm.getCRMConnections.execute(),
        crm.getCRMUserInfo.execute(),
      ]);
      
      // Убеждаемся, что connectionsData это массив
      const safeConnections = Array.isArray(connectionsData) ? connectionsData : [];
      setConnections(safeConnections);
      setUserInfo(userInfoData);
      setLoadError(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setLoadError(true);
      setConnections([]);
      setUserInfo(null);
    }
  };

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newConnection = await crm.createCRMConnection.execute({
        userId: 1,
        provider: formData.provider,
        accessToken: formData.accessToken,
        refreshToken: formData.refreshToken,
        domain: formData.domain,
        expiresAt: new Date().toISOString(),
        otherData: {
          clientId: formData.clientId,
          clientSecret: formData.clientSecret,
        },
      });
      setConnections([...connections, newConnection]);
      setShowCreateForm(false);
      setFormData({
        provider: "AMOCRM",
        accessToken: "",
        refreshToken: "",
        domain: "",
        clientId: "",
        clientSecret: "",
      });
    } catch (err) {
      console.error("Error creating CRM connection:", err);
    }
  };

  const handleToggleConnection = async (id: string) => {
    try {
      const updatedConnection = await crm.toggleCRMConnection.execute(id);
      setConnections(
        Array.isArray(connections) 
          ? connections.map(conn => conn.id === id ? updatedConnection : conn)
          : []
      );
    } catch (err) {
      console.error("Error toggling CRM connection:", err);
    }
  };

  const handleDeleteConnection = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить это подключение?")) return;

    try {
      await crm.deleteCRMConnection.execute(id);
      setConnections(
        Array.isArray(connections) 
          ? connections.filter(conn => conn.id !== id)
          : []
      );
    } catch (err) {
      console.error("Error deleting CRM connection:", err);
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "AMOCRM":
        return "amoCRM";
      case "BITRIX24":
        return "Bitrix24";
      case "HUBSPOT":
        return "HubSpot";
      default:
        return provider;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          CRM интеграции
        </h1>
        <p className="text-gray-600">
          Подключите свою CRM систему для синхронизации данных
        </p>
      </div>

      {userInfo && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Контакты</h3>
            <p className="text-2xl font-bold text-gray-900">
              {userInfo.totalContacts}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Сделки</h3>
            <p className="text-2xl font-bold text-blue-600">
              {userInfo.totalDeals}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Задачи</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {userInfo.totalTasks}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Последняя синхронизация
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(userInfo.lastSync).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">CRM подключения</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Добавить подключение
          </button>
        </div>

        <div className="p-6">
          {loadError ? (
            <div className="text-gray-400 text-center py-8">Нет данных (backend недоступен)</div>
          ) : !Array.isArray(connections) || connections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              У вас пока нет CRM подключений. Добавьте первое!
            </p>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {getProviderName(connection.provider)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {connection.domain}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(connection.isActive)}`}>
                        {connection.isActive ? "Активно" : "Неактивно"}
                      </span>
                      <button
                        onClick={() => handleToggleConnection(connection.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {connection.isActive ? "Отключить" : "Включить"}
                      </button>
                      <button
                        onClick={() => handleDeleteConnection(connection.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Создано: {new Date(connection.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Новое CRM подключение
            </h3>
            <form onSubmit={handleCreateConnection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CRM система
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      provider: e.target.value as "AMOCRM" | "BITRIX24" | "HUBSPOT",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                >
                  <option value="AMOCRM">amoCRM</option>
                  <option value="BITRIX24">Bitrix24</option>
                  <option value="HUBSPOT">HubSpot</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Домен
                </label>
                <input
                  type="url"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, domain: e.target.value }))
                  }
                  placeholder="https://your-domain.amocrm.ru"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <input
                  type="text"
                  value={formData.accessToken}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      accessToken: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refresh Token
                </label>
                <input
                  type="text"
                  value={formData.refreshToken}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      refreshToken: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      clientId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      clientSecret: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={crm.createCRMConnection.loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {crm.createCRMConnection.loading ? "Создание..." : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage;
