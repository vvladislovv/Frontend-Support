import { useTranslation } from 'react-i18next';
import { useTickets } from './useTickets';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { Link } from 'react-router-dom';

const TicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    tickets, loading, error,
    showModal, openModal, closeModal,
    form, formLoading, formError,
    handleChange, handleSubmit
  } = useTickets(t);

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black relative">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">← Назад в меню</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">Профиль</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-2">{t('tickets')}</h2>
      <p className="text-gray-500 mb-6">{t('monitorTicketsDescription')}</p>
      <div className="flex justify-end mb-4">
        <Button onClick={openModal}>{t('newTicket')}</Button>
      </div>
      <div className="relative">
        <Table
          columns={[
            { key: 'subject', label: t('ticketSubject') },
            { key: 'status', label: t('status') },
            { key: 'botId', label: t('botId') },
            { key: 'telegramId', label: t('telegramId') },
          ]}
          data={tickets.length > 0 ? tickets.map(ticket => ({ ...ticket })) : [{ subject: t('noData'), status: '', botId: '', telegramId: '' }]}
          actions={null}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
            <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            {t('loading')}
          </div>
        )}
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Modal open={showModal} onClose={closeModal} title={t('newTicket')}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="subject" placeholder={t('ticketSubject')} value={form.subject} onChange={handleChange} required />
          <Input name="message" placeholder={t('ticketMessage')} value={form.message} onChange={handleChange} required />
          <Input name="botId" placeholder={t('botId')} value={form.botId} onChange={handleChange} required />
          <Input name="telegramId" placeholder={t('telegramId')} value={form.telegramId} onChange={handleChange} required />
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>{t('cancel')}</Button>
            <Button type="submit" disabled={formLoading}>{formLoading ? '...' : t('save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TicketsPage; 