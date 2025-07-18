import { useState, useEffect, useCallback } from 'react';
import { getReferrals, createReferralLink } from '../../api';
import throttle from 'lodash.throttle';

export interface Referral {
  id: string;
  userId: string;
  code: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export function useReferrals(t: (key: string) => string) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
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
      const { code } = await createReferralLink();
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