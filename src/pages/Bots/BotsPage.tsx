import { useBots } from './useBots';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { Link } from 'react-router-dom';

const BotsPage: React.FC = () => {
  const {
    bots, loading, error,
    showModal, openModal, closeModal,
    editBot, form, formLoading, formError,
    handleChange, handleSubmit
  } = useBots();

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 relative text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">← Back to Menu</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">Profile</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-black">Bots</h2>
      <p className="text-gray-500 mb-6">Configure and manage your Telegram bots</p>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create Bot</Button>
      </div>
      <div className="relative">
        <Table
          columns={[
            { key: 'name', label: 'Bot Name' },
            { key: 'username', label: 'Bot Username' },
            { key: 'link', label: 'Bot Link' },
          ]}
          data={bots.length > 0 ? bots.map(bot => ({
            ...bot,
            link: <a href={bot.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{bot.link}</a>,
          })) : [{ name: 'No data', username: '', link: '' }]}
          actions={null}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
            <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Loading...
          </div>
        )}
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Modal open={showModal} onClose={closeModal} title={editBot ? 'Edit Bot' : 'Create Bot'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="name" placeholder="Bot Name" value={form.name} onChange={handleChange} required />
          <Input name="token" placeholder="Bot Token" value={form.token} onChange={handleChange} required />
          <Input name="username" placeholder="Bot Username" value={form.username} onChange={handleChange} required />
          <Input name="link" placeholder="Bot Link" value={form.link} onChange={handleChange} required />
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={formLoading}>{formLoading ? '...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BotsPage; 