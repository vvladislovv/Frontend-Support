import { useState, useEffect } from 'react';
import { getProfile } from '../../api';

export function useDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Проверяем админа (в тестовом режиме любой ID может быть админом)
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const profile = await getProfile();
        // В тестовом режиме делаем админом пользователя с ID '1' или если в localStorage есть admin флаг
        const isTestAdmin = profile.id === '1' || localStorage.getItem('test-admin') === 'true';
        setIsAdmin(isTestAdmin);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  return {
    isAdmin
  };
}