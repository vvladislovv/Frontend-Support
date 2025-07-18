import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

const AdminPanelPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded shadow mt-8 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">← Назад в меню</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">Профиль</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('admin')}</h2>
      <ul className="space-y-2">
        <li><Link to="/admin/clients" className="text-blue-600 hover:underline">{t('adminClients')}</Link></li>
        <li><Link to="/admin/plans" className="text-blue-600 hover:underline">{t('adminTariffs')}</Link></li>
        <li><Link to="/admin/load" className="text-blue-600 hover:underline">{t('adminLoad')}</Link></li>
      </ul>
    </div>
  );
};

export default AdminPanelPage; 