import { useTranslation } from 'react-i18next';
import { useBilling } from './useBilling';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

const BillingPage: React.FC = () => {
  const { t } = useTranslation();
  const { plans, subscriptions, loading, error, throttledSubscribe } = useBilling(t);

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded shadow mt-8 text-black relative">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMenu')}</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">{t('profile')}</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('billing')}</h2>
      <div className="relative">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <h3 className="text-xl font-semibold mb-2">{t('plans')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded p-4 bg-white">
              <div className="font-bold text-lg mb-1">{plan.name}</div>
              <div className="mb-2">{plan.description}</div>
              <div className="mb-2 font-semibold">{plan.price} ₽</div>
              <Button onClick={() => throttledSubscribe(plan.id)}>{t('subscribe')}</Button>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-semibold mb-2">{t('subscription')}</h3>
        {subscriptions.length === 0 ? (
          <div className="text-gray-500">{t('noActiveSubscription')}</div>
        ) : (
          <ul className="space-y-2">
            {subscriptions.map(sub => (
              <li key={sub.id} className="bg-green-100 p-3 rounded">
                <div>{t('plan')}: {sub.planId}</div>
                <div>{t('status')}: {sub.status}</div>
                <div>{t('startDate')}: {sub.startDate}</div>
                <div>{t('endDate')}: {sub.endDate}</div>
              </li>
            ))}
          </ul>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
            <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            {t('loading')}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage; 