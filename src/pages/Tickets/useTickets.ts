import { useState, useEffect, useCallback } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../../api';
import throttle from 'lodash.throttle';

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  botId: string;
  telegramId: string;
}

export function useTickets(t: (key: string) => string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [form, setForm] = useState({ subject: '', message: '', botId: '', telegramId: '', status: 'open' });
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

  const openModal = (ticket?: Ticket) => {
    setEditTicket(ticket || null);
    setForm(ticket ? {
      subject: ticket.subject,
      message: ticket.message,
      botId: ticket.botId,
      telegramId: ticket.telegramId,
      status: ticket.status
    } : { subject: '', message: '', botId: '', telegramId: '', status: 'open' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTicket(null);
    setForm({ subject: '', message: '', botId: '', telegramId: '', status: 'open' });
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const throttledSubmit = throttle(async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editTicket) {
        await updateTicket(editTicket.id, form);
      } else {
        await createTicket(form);
      }
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
    editTicket, form, setForm, formLoading, formError,
    handleChange, handleSubmit, handleDelete
  };
} 