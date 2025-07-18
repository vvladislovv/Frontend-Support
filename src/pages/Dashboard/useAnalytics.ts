import { useState, useEffect, useCallback } from 'react';
import { getBots, getTickets, getCRMConnections } from '../../api';

export interface AnalyticsStats {
  bots: number;
  tickets: number;
  users: number;
}

export function useAnalytics(t: (key: string) => string) {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [botsRes, ticketsRes, usersRes] = await Promise.all([
        getBots(),
        getTickets(),
        getCRMConnections(),
      ]);
      setStats({
        bots: botsRes.length,
        tickets: ticketsRes.length,
        users: usersRes.length,
      });
    } catch {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return {
    stats, loading, error
  };
} 