import { useState, useEffect } from 'react';
import { ticketService } from '../../services';
import { handleTicketError, handleApiError } from '../../utils/errorHandler';
import type { Ticket } from '../../types';

export const useTickets = (t: (key: string) => string) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    subject: '',
    message: '',
    telegramId: '',
    botId: '1',
    status: 'OPEN' as const
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (err) {
      setError(handleApiError(err, { context: 'load_tickets' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openModal = (ticket?: Ticket) => {
    if (ticket) {
      setEditTicket(ticket);
      setForm({
        subject: ticket.subject,
        message: ticket.message,
        telegramId: ticket.telegramId,
        botId: ticket.botId,
        status: ticket.status
      });
    } else {
      setEditTicket(null);
      setForm({
        subject: '',
        message: '',
        telegramId: '',
        botId: '1',
        status: 'OPEN'
      });
    }
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTicket(null);
    setFormError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (editTicket) {
        await ticketService.updateTicket(editTicket.id, {
          subject: form.subject,
          message: form.message,
          telegramId: form.telegramId,
          status: form.status
        });
      } else {
        await ticketService.createTicket({
          subject: form.subject,
          message: form.message,
          telegramId: form.telegramId,
          botId: parseInt(form.botId),
          status: form.status
        });
      }
      
      await loadTickets();
      closeModal();
    } catch (err) {
      setFormError(handleTicketError(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      setLoading(true);
      await ticketService.deleteTicket(id);
      await loadTickets();
    } catch (err) {
      setError(handleApiError(err, { context: 'delete_ticket' }));
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    showModal,
    openModal,
    closeModal,
    editTicket,
    form,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
    handleDelete
  };
};