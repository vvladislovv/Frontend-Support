import { useTranslation } from 'react-i18next';
import { useCRM } from './useCRM';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Link } from 'react-router-dom';

const CRMPage: React.FC = () => {
  const { t } = useTranslation();
  const { users, loading, connections, fetchConnections } = useCRM();

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-8 relative text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">← Назад в меню</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">Профиль</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('crm')}</h2>
      <div className="relative">
        <Table
          columns={[
            { key: 'telegramId', label: 'Telegram ID' },
            { key: 'name', label: t('name') },
          ]}
          data={users.map(u => ({ ...u }))}
          actions={<Button onClick={fetchConnections}>{t('crmConnections')}</Button>}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
            <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            {t('loading')}
          </div>
        )}
      </div>
      {connections.length > 0 && (
        <div className="mb-6 border rounded p-4 bg-white">
          <div className="font-bold mb-2">{t('crmConnections')}</div>
          <ul className="list-disc pl-5">
            {connections.map(conn => (
              <li key={conn.id}>{conn.provider} — {conn.accessToken} {conn.expiresAt && <span>{t('expiresAt')}: {conn.expiresAt}</span>}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CRMPage; 