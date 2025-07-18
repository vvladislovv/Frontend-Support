import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminPanel } from './useAdminPanel';
import type { Client } from '../../api';
import { Button } from '../../components/common/Button';

interface AdminPanelProps {
  onClientSelect?: (client: Client) => void;
  onCreateClient?: () => void;
  onEditClient?: (client: Client) => void;
  onDeleteClient?: (clientId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  onClientSelect,
  onCreateClient,
  onEditClient,
  onDeleteClient
}) => {
  const { t } = useTranslation();
  const { clients, systemLoad, loading, refreshData } = useAdminPanel();

  const handleRowClick = (client: Client) => {
    onClientSelect?.(client);
  };

  if (loading) {
    return <div className="p-4">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('adminPanel')}</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="secondary" onClick={refreshData}>{t('refresh')}</Button>
          <h2 className="text-xl font-semibold">{t('clientManagement')}</h2>
          <Button onClick={onCreateClient}>{t('createClient')}</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('clientName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('clientEmail')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr
  key={client.id}
  onClick={() => handleRowClick(client)}
  className="hover:bg-blue-50 cursor-pointer"
>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.active ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
<Button
  onClick={() => onEditClient?.(client)}
  className="text-indigo-600 hover:text-indigo-900 mr-2"
>
  {t('editClient')}
</Button>
<Button
  onClick={() => onDeleteClient?.(client.id)}
  className="text-red-600 hover:text-red-900"
>
  {t('delete')}
</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t('systemLoad')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">{t('cpuUsage')}</h3>
            <div className="mt-1">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${systemLoad.cpu}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {systemLoad.cpu}%
                </span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">{t('memoryUsage')}</h3>
            <div className="mt-1">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${systemLoad.memory}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {systemLoad.memory}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
