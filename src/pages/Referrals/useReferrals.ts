import { useState, useEffect, useCallback } from 'react';
import { getReferrals, getNewReferralLink } from '../../api';
import type { ReferralLink } from '../../types';

interface UseReferralsReturn {
  referrals: ReferralLink[];
  loading: boolean;
  error: string;
  newLink: string | null;
  handleCreateLink: () => void;
}
import throttle from 'lodash.throttle';

export function useReferrals(t: (key: string) => string): UseReferralsReturn {
  const [referrals, setReferrals] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newLink, setNewLink] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReferrals();
      setReferrals(data);
    } catch {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  const throttledCreateLink = throttle(async () => {
    try {
      const { code } = await getNewReferralLink();
      setNewLink(`${window.location.origin}/register?ref=${code}`);
      fetchReferrals();
    } catch {
      setNewLink(null);
    }
  }, 2000, { trailing: false });
  const handleCreateLink = () => throttledCreateLink();

  return {
    referrals, loading, error, newLink, handleCreateLink
  };
} 