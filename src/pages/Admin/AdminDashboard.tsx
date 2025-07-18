import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl mt-20 flex flex-col gap-8 border border-red-100">
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="secondary" className="animate-slide-in">← Вернуться в главное меню</Button>
        </Link>
      </div>
      <h2 className="text-3xl font-extrabold mb-2 text-red-800 text-center drop-shadow-sm tracking-tight animate-fade-in">
        🔧 Админ панель
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a href="/admin/clients" className="group flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-red-100 animate-fade-in">
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">👥</span>
          <span className="text-lg font-semibold text-red-700 group-hover:underline transition-colors duration-200">Клиенты</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">Управление пользователями</span>
        </a>
        <a href="/admin/system" className="group flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-orange-100 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">⚙️</span>
          <span className="text-lg font-semibold text-orange-700 group-hover:underline transition-colors duration-200">Система</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">Мониторинг нагрузки</span>
        </a>
        <a href="/admin/plans" className="group flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-purple-100 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">💎</span>
          <span className="text-lg font-semibold text-purple-700 group-hover:underline transition-colors duration-200">Тарифы</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">Управление планами</span>
        </a>
        <a href="/admin/logs" className="group flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl rounded-xl p-6 shadow border border-gray-100 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <span className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">📋</span>
          <span className="text-lg font-semibold text-gray-700 group-hover:underline transition-colors duration-200">Логи</span>
          <span className="text-gray-400 text-sm mt-1 text-center transition-colors duration-200 group-hover:text-gray-600">Системные логи</span>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;