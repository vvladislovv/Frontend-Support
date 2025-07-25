import { useState, useEffect, useCallback } from 'react';
import { getBillingPlans, getUserSubscriptions } from '../../api';
import type { BillingPlan, Subscription } from '../../types';

interface UseBillingReturn {
  plans: BillingPlan[];
  subscriptions: Subscription[];
  loading: boolean;
  error: string;
  throttledSubscribe: (planId: string) => void;
}
import throttle from 'lodash.throttle';

export function useBilling(t: (key: string) => string): UseBillingReturn {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, subsRes] = await Promise.all([
        getBillingPlans(),
        getUserSubscriptions(),
      ]);
      setPlans(plansRes);
      setSubscriptions(subsRes);
    } catch {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const throttledSubscribe = throttle((planId: string) => {
    // Здесь должен быть реальный запрос на оформление подписки
    alert('Оформление подписки на тариф: ' + planId);
  }, 2000, { trailing: false });

  return {
    plans, subscriptions, loading, error, throttledSubscribe
  };
} 