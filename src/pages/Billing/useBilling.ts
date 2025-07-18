import { useState, useEffect, useCallback } from 'react';
import { getBillingPlans, getSubscriptions } from '../../api';
import throttle from 'lodash.throttle';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
}

export function useBilling(t: (key: string) => string) {
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
        getSubscriptions(),
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