import { useTranslation } from 'react-i18next';
import { useAdmin } from './useAdmin';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    clients, systemLoad, loading, error,
    showModal, openModal, closeModal,
    editClient, form, formLoading, formError,
    handleChange, handleSubmit, handleDelete,
    refreshData
  } = useAdmin(t);

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 relative text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/admin">
          <Button variant="secondary" className="animate-slide-in">← Вернуться в админ панель</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" className="animate-slide-in" style={{animationDelay: '0.1s'}}>Главное меню</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-red-600 animate-fade-in">🔧 {t('adminPanel')}</h2>
      <p className="text-gray-500 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>Управление пользователями и системой</p>

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
                  {client.active ? '✅ Активен' : '❌ Неактивен'}
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
                    ✏️ Изменить
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDelete(client.id)}
                    className="text-xs px-2 py-1"
                  >
                    🗑️ Удалить
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
              } as any)}
              className="rounded"
            />
            <label htmlFor="active" className="text-sm font-medium">
              ✅ Активный пользователь
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