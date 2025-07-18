import { useState, useEffect, useCallback } from 'react';
import { getTickets, createTicket, deleteTicket } from '../../api';
import throttle from 'lodash.throttle';

export interface Ticket {
  id: string;
  subject: string;
  status: string;
  botId: string;
  telegramId: string;
}

export function useTickets(t: (key: string) => string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '', botId: '', telegramId: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const tickets = await getTickets();
      setTickets(tickets);
    } catch {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const openModal = () => { setShowModal(true); setFormError(''); };
  const closeModal = () => { setShowModal(false); setForm({ subject: '', message: '', botId: '', telegramId: '' }); setFormError(''); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const throttledSubmit = throttle(async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      await createTicket({ ...form, status: 'open' });
      closeModal();
      fetchTickets();
    } catch {
      setFormError(t('errorLoadingData'));
    } finally {
      setFormLoading(false);
    }
  }, 2000, { trailing: false });
  const handleSubmit = (event: React.FormEvent) => throttledSubmit(event);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('delete') + '?')) return;
    try {
      await deleteTicket(id);
      fetchTickets();
    } catch { /* no-op */ }
  };

  return {
    tickets, loading, error,
    showModal, openModal, closeModal,
    form, setForm, formLoading, formError,
    handleChange, handleSubmit, handleDelete
  };
} 