import { useTranslation } from 'react-i18next';
import { useAdmin } from './useAdmin';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { Link } from 'react-router-dom';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  const {
    clients, systemLoad, loading, error,
    showModal, openModal, closeModal,
    editClient, form, formLoading, formError,
    handleChange, handleSubmit, handleDelete,
    refreshData
  } = useAdmin(t);

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('adminPanel')} showBack={true} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Link to="/admin" className="btn-secondary-mobile flex-1 text-center">
                ← {t('backToAdminPanel')}
              </Link>
              <Link to="/dashboard" className="btn-primary-mobile flex-1 text-center">
                🏠 {t('backToMainMenu')}
              </Link>
            </div>
            <h1 className="text-2xl font-bold tg-text mb-2">🔧 {t('adminPanel')}</h1>
            <p className="tg-hint text-sm">{t('adminPanelDescription')}</p>
          </div>

          {/* Системная нагрузка */}
          <div className="card-mobile mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">📊 {t('systemLoad')}</h2>
              <button
                onClick={refreshData}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600 transition-colors"
              >
                🔄 {t('refresh')}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">💻 {t('cpu')}</span>
                  <span className="text-sm font-bold text-blue-800">{systemLoad.cpu}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemLoad.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">🧠 {t('memory')}</span>
                  <span className="text-sm font-bold text-green-800">{systemLoad.memory}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${systemLoad.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Управление клиентами */}
          <div className="card-mobile mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tg-text">👥 {t('clients')}</h2>
              <button
                onClick={() => openModal()}
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium active:bg-green-600 transition-colors"
              >
                ➕ {t('create')}
              </button>
            </div>

            <div className="space-y-3">
              {clients.length > 0 ? clients.map(client => (
                <div key={client.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium tg-text">{client.name}</h3>
                      <p className="text-sm tg-hint">{client.email}</p>
                      <p className="text-xs tg-hint">{new Date(client.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.active ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(client)}
                      className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium active:bg-orange-600 transition-colors"
                    >
                      ✏️ {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium active:bg-red-600 transition-colors"
                    >
                      🗑️ {t('delete')}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">👥</div>
                  <p className="tg-hint">{t('noClients')}</p>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="text-lg text-blue-600">{t('loading')}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="card-mobile bg-red-50 border-red-200">
              <p className="text-red-600 text-sm">❌ {error}</p>
            </div>
          )}

          <Modal open={showModal} onClose={closeModal} title={editClient ? `✏️ ${t('editClient')}` : `➕ ${t('createClient')}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                name="name" 
                placeholder={t('clientName')} 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="input-mobile"
              />
              <Input 
                name="email" 
                type="email"
                placeholder={t('clientEmail')} 
                value={form.email} 
                onChange={handleChange} 
                required 
                className="input-mobile"
              />
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={form.active}
                  onChange={(e) => handleChange({
                    target: { name: 'active', value: e.target.checked }
                  } as { target: { name: string; value: boolean } })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium tg-text">
                  ✅ {t('activeUser')}
                </label>
              </div>
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">❌ {formError}</p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal} className="flex-1 btn-secondary-mobile">
                  ❌ {t('cancel')}
                </Button>
                <Button type="submit" disabled={formLoading} className="flex-1 btn-primary-mobile">
                  {formLoading ? `⏳ ${t('saving')}` : (editClient ? `💾 ${t('save')}` : `➕ ${t('create')}`)}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 relative text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/admin">
          <Button variant="secondary" className="animate-slide-in">← {t('backToAdminPanel')}</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" className="animate-slide-in" style={{animationDelay: '0.1s'}}>{t('backToMainMenu')}</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-red-600 animate-fade-in">🔧 {t('adminPanel')}</h2>
      <p className="text-gray-500 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>{t('adminPanelDescription')}</p>

      {/* Системная нагрузка */}
      <div className="mb-8 bg-gray-50 p-6 rounded-xl animate-fade-in" style={{animationDelay: '0.2s'}}>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          📊 {t('systemLoad')}
          <Button variant="secondary" onClick={refreshData} className="ml-auto text-sm">
            🔄 {t('refresh')}
          </Button>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-700 mb-2">💻 {t('cpuUsage')}</h4>
            <div className="flex items-center">
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${systemLoad.cpu}%` }}
                ></div>
              </div>
              <span className="ml-3 text-lg font-bold text-blue-800">
                {systemLoad.cpu}%
              </span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-700 mb-2">🧠 {t('memoryUsage')}</h4>
            <div className="flex items-center">
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${systemLoad.memory}%` }}
                ></div>
              </div>
              <span className="ml-3 text-lg font-bold text-green-800">
                {systemLoad.memory}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Управление клиентами */}
      <div className="mb-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">👥 {t('clientManagement')}</h3>
          <Button onClick={() => openModal()} className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg">➕ {t('createClient')}</Button>
        </div>
        
        <div className="relative">
          <Table
            columns={[
              { key: 'name', label: t('clientName') },
              { key: 'email', label: t('clientEmail') },
              { key: 'status', label: t('status') },
              { key: 'createdAt', label: t('createdAt') },
            ]}
            data={clients.length > 0 ? clients.map(client => ({
              ...client,
              status: (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  client.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {client.active ? `✅ ${t('activeStatus')}` : `❌ ${t('inactiveStatus')}`}
                </span>
              ),
              createdAt: new Date(client.createdAt).toLocaleDateString('ru-RU'),
              actions: (
                <div className="flex gap-2">
                  <Button 
                    variant="warning" 
                    onClick={() => openModal(client)}
                    className="text-xs px-2 py-1"
                  >
                    ✏️ {t('change')}
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDelete(client.id)}
                    className="text-xs px-2 py-1"
                  >
                    🗑️ {t('delete')}
                  </Button>
                </div>
              )
            })) : [{ name: t('noData'), email: '', status: '', createdAt: '', actions: '' }]}
            actions={clients.length > 0 ? (
              <div className="flex gap-2">
                <Button 
                  variant="warning" 
                  onClick={() => openModal()}
                  className="text-xs px-2 py-1"
                >
                  ✏️
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {}}
                  className="text-xs px-2 py-1"
                >
                  🗑️
                </Button>
              </div>
            ) : null}
          />
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
              <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              {t('loading')}
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 mt-2">❌ {error}</div>}

      {/* Модальное окно для создания/редактирования клиента */}
      <Modal open={showModal} onClose={closeModal} title={editClient ? '✏️ ' + t('editClient') : '➕ ' + t('createClient')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            name="name" 
            placeholder={t('clientName')} 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
          <Input 
            name="email" 
            type="email"
            placeholder={t('clientEmail')} 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={form.active}
              onChange={(e) => handleChange({
                target: { name: 'active', value: e.target.checked }
              } as { target: { name: string; value: boolean } })}
              className="rounded"
            />
            <label htmlFor="active" className="text-sm font-medium">
              ✅ {t('activeUser')}
            </label>
          </div>
          {formError && <div className="text-red-500 text-sm">❌ {formError}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>
              ❌ {t('cancel')}
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? '⏳ ...' : (editClient ? '💾 ' + t('save') : '➕ ' + t('create'))}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPage;