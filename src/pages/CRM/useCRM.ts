import { useState, useEffect } from 'react';
import { getCRMConnections } from '../../api';
import type { CRMConnection } from '../../types';

interface UseCRMReturn {
  users: CRMUser[];
  loading: boolean;
  connections: CRMConnection[];
  fetchConnections: () => Promise<void>;
}

export interface CRMUser {
  telegramId: string;
  name: string;
  email?: string;
}

export function useCRM(): UseCRMReturn {
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