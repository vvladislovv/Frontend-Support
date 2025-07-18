import { useState, useEffect, useCallback } from 'react';
import { getClients, getSystemLoad, createClient, updateClient, deleteClient } from '../../api';
import throttle from 'lodash.throttle';

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface SystemLoad {
  cpu: number;
  memory: number;
}

export function useAdmin(t: (key: string) => string) {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [systemLoad, setSystemLoad] = useState<SystemLoad>({ cpu: 0, memory: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState<AdminClient | null>(null);
  const [form, setForm] = useState({ name: '', email: '', active: true });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchSystemLoad = useCallback(async () => {
    try {
      const loadData = await getSystemLoad();
      setSystemLoad(loadData);
    } catch {
      // Игнорируем ошибки загрузки системной нагрузки
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchClients(), fetchSystemLoad()]);
  }, [fetchClients, fetchSystemLoad]);

  useEffect(() => {
    refreshData();
    // Обновляем системную нагрузку каждые 30 секунд
    const interval = setInterval(fetchSystemLoad, 30000);
    return () => clearInterval(interval);
  }, [refreshData, fetchSystemLoad]);

  const openModal = (client?: AdminClient) => {
    setEditClient(client || null);
    setForm(client ? { 
      name: client.name, 
      email: client.email, 
      active: client.active 
    } : { 
      name: '', 
      email: '', 
      active: true 
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditClient(null);
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const throttledSubmit = throttle(async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editClient) {
        await updateClient(editClient.id, form);
      } else {
        await createClient(form);
      }
      closeModal();
      fetchClients();
    } catch {
      setFormError(t('errorSavingData'));
    } finally {
      setFormLoading(false);
    }
  }, 2000, { trailing: false });

  const handleSubmit = (event: React.FormEvent) => throttledSubmit(event);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить клиента? Это действие нельзя отменить.')) return;
    try {
      await deleteClient(id);
      fetchClients();
    } catch {
      setError(t('errorDeletingData'));
    }
  };

  return {
    clients,
    systemLoad,
    loading,
    error,
    showModal,
    openModal,
    closeModal,
    editClient,
    form,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
    handleDelete,
    refreshData
  };
}