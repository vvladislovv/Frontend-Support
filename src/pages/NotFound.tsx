import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-center text-black">
      <div className="mb-8">
        <div className="text-8xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Страница не найдена</h2>
        <p className="text-gray-500 mb-8">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/dashboard">
          <Button variant="primary">← Вернуться на главную</Button>
        </Link>
        <Link to="/bots">
          <Button variant="secondary">Управление ботами</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;