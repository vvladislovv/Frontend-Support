import { useState, useEffect } from 'react';
import { getProfile } from '../../api';

interface UseDashboardReturn {
  isAdmin: boolean;
  loading: boolean;
  error: string;
}

export function useDashboard(): UseDashboardReturn {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Проверяем админа (в тестовом режиме любой ID может быть админом)
  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await getProfile();
        // В тестовом режиме делаем админом пользователя с ID '1' или если в localStorage есть admin флаг
        const isTestAdmin = profile.id === '1' || localStorage.getItem('test-admin') === 'true';
        setIsAdmin(isTestAdmin);
      } catch (err) {
        setIsAdmin(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  return {
    isAdmin,
    loading,
    error
  };
}