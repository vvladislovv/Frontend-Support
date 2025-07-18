import { useState, useEffect } from 'react';
import { getCRMConnections } from '../../api';

export interface CRMUser {
  telegramId: string;
  name: string;
  email?: string;
}
export interface CRMConnection {
  id: string;
  provider: string;
  accessToken: string;
  expiresAt?: string;
}

export function useCRM() {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<CRMConnection[]>([]);

  useEffect(() => {
    // Здесь должен быть реальный запрос к API для пользователей
    setUsers([]);
    setLoading(false);
  }, []);

  const fetchConnections = async () => {
    try {
      const conns = await getCRMConnections();
      setConnections(conns);
    } catch {
      setConnections([]);
    }
  };

  return {
    users, loading, connections, fetchConnections
  };
} 