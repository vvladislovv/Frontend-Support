import { useState, useEffect, useCallback } from 'react';
import { getClients, getSystemLoad } from '../../api';
import type { Client, SystemLoad } from '../../types';

interface UseAdminPanelReturn {
  clients: Client[];
  systemLoad: SystemLoad;
  loading: boolean;
  refreshData: () => Promise<void>;
}

export function useAdminPanel(): UseAdminPanelReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [systemLoad, setSystemLoad] = useState<SystemLoad>({ cpu: 0, memory: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  // error не используется в компоненте, убираем

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [clientsData, loadData] = await Promise.all([
        getClients(),
        getSystemLoad()
      ]);
      setClients(clientsData);
      setSystemLoad(loadData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return {
    clients, systemLoad, loading, refreshData: fetchData
  };
} 