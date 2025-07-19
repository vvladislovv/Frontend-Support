import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import MobileHeader from '../../components/MobileHeader';
import { isTelegramWebApp } from '../../telegram';
import { useTariffs } from './useTariffs';

const TariffsPage: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  const {
    tariffs,
    loading,
    error,
    showModal,
    openModal,
    closeModal,
    editTariff,
    form,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
    handleDelete
  } = useTariffs(t);

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('plans')} fullWidth={true} />
        
        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">💎 {t('plans')}</h1>
            <p className="tg-hint text-sm">{t('tariffManagementDescription')}</p>
          </div>

          <div className="mb-4">
            <button
              onClick={() => openModal()}
              className="btn-primary-mobile w-full"
            >
              ➕ {t('createTariff')}
            </button>
          </div>

          <div className="space-y-4">
            {tariffs.map(tariff => (
              <div key={tariff.id} className="card-mobile">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg tg-text">{tariff.name}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">{tariff.price} ₽</p>
                    <p className="text-sm tg-hint mb-3">{tariff.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tariff.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tariff.active ? '✅' : '❌'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm tg-text mb-2">Возможности:</h4>
                  <ul className="space-y-1">
                    {tariff.features.map((feature, index) => (
                      <li key={index} className="text-sm tg-hint flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(tariff)}
                    className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium active:bg-orange-600 transition-colors"
                  >
                    ✏️ {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(tariff.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium active:bg-red-600 transition-colors"
                  >
                    🗑️ {t('delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Modal open={showModal} onClose={closeModal} title={editTariff ? `✏️ ${t('editTariff')}` : `➕ ${t('createTariff')}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                name="name" 
                placeholder={t('tariffName')} 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="input-mobile"
              />
              <Input 
                name="price" 
                type="number"
                placeholder={t('tariffPrice')} 
                value={form.price} 
                onChange={handleChange} 
                required 
                className="input-mobile"
              />
              <textarea
                name="description"
                placeholder={t('tariffDescription')}
                value={form.description}
                onChange={handleChange}
                required
                className="input-mobile min-h-[80px] resize-none"
              />
              <Input 
                name="features" 
                placeholder="Возможности (через запятую)" 
                value={form.features} 
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
                  } as any)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium tg-text">
                  ✅ {t('active')}
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
                  {formLoading ? `⏳ ${t('saving')}` : (editTariff ? `💾 ${t('save')}` : `➕ ${t('create')}`)}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/admin">
          <Button variant="secondary">{t('backToAdminPanel')}</Button>
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-purple-600">💎 {t('tariffManagement')}</h2>
      <p className="text-gray-500 mb-8">{t('tariffManagementDescription')}</p>

      <div className="mb-6">
        <Button onClick={() => openModal()}>➕ {t('createTariff')}</Button>
      </div>

      <Table
        columns={[
          { key: 'name', label: t('tariffName') },
          { key: 'price', label: t('tariffPrice') },
          { key: 'description', label: t('tariffDescription') },
          { key: 'status', label: t('status') },
        ]}
        data={tariffs.map(tariff => ({
          ...tariff,
          price: `${tariff.price} ₽`,
          status: (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              tariff.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {tariff.active ? `✅ ${t('active')}` : `❌ ${t('inactive')}`}
            </span>
          ),
          actions: (
            <div className="flex gap-2">
              <Button 
                variant="warning" 
                onClick={() => openModal(tariff)}
                className="text-xs px-2 py-1"
              >
                ✏️ {t('edit')}
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDelete(tariff.id)}
                className="text-xs px-2 py-1"
              >
                🗑️ {t('delete')}
              </Button>
            </div>
          )
        }))}
        actions={null}
      />

      <Modal open={showModal} onClose={closeModal} title={editTariff ? '✏️ ' + t('editTariff') : '➕ ' + t('createTariff')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            name="name" 
            placeholder={t('tariffName')} 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
          <Input 
            name="price" 
            type="number"
            placeholder={t('tariffPrice')} 
            value={form.price} 
            onChange={handleChange} 
            required 
          />
          <textarea
            name="description"
            placeholder={t('tariffDescription')}
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          />
          <Input 
            name="features" 
            placeholder="Возможности (через запятую)" 
            value={form.features} 
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
              ✅ {t('active')}
            </label>
          </div>
          {formError && <div className="text-red-500 text-sm">❌ {formError}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>
              ❌ {t('cancel')}
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? '⏳ ...' : (editTariff ? '💾 ' + t('save') : '➕ ' + t('create'))}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TariffsPage;