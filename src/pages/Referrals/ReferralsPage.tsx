import { useTranslation } from 'react-i18next';
import { useReferrals } from './useReferrals';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

const ReferralsPage: React.FC = () => {
  const { t } = useTranslation();
  const { referrals, loading, error, newLink, handleCreateLink } = useReferrals(t);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow mt-8 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMenu')}</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">{t('profile')}</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('referrals')}</h2>
      <Button className="mb-4" onClick={handleCreateLink}>{t('createReferralLink')}</Button>
      {newLink && (
        <div className="mb-4 p-2 bg-blue-100 rounded break-all">
          {t('yourReferralLink')}: <a href={newLink} className="text-blue-700 underline">{newLink}</a>
        </div>
      )}
      {loading ? (
        <div>{t('loading')}</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul className="space-y-2">
          {referrals.map(ref => (
            <li key={ref.id} className="bg-white p-3 rounded flex justify-between items-center">
              <span>{t('code')}: {ref.code} | {t('clicks')}: {ref.clicks} | {t('conversions')}: {ref.conversions}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReferralsPage; 