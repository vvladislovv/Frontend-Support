import { useState, useEffect, useCallback } from 'react';
import { getBots, createBot, updateBot, deleteBot } from '../../api';
import { handleApiError } from '../../utils/errorHandler';
import type { Bot } from '../../types';

interface UseBotsReturn {
  bots: Bot[];
  loading: boolean;
  error: string;
  showModal: boolean;
  openModal: (bot?: Bot) => void;
  closeModal: () => void;
  editBot: Bot | null;
  form: {
    name: string;
    token: string;
    username: string;
    link: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    name: string;
    token: string;
    username: string;
    link: string;
  }>>;
  formLoading: boolean;
  formError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
}
import throttle from 'lodash.throttle';

export function useBots(): UseBotsReturn {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBot, setEditBot] = useState<Bot | null>(null);
  const [form, setForm] = useState({ name: '', token: '', username: '', link: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchBots = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const bots = await getBots();
      setBots(bots);
    } catch (err) {
      setError(handleApiError(err, { context: 'load_bots' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBots(); }, [fetchBots]);

  const openModal = (bot?: Bot) => {
    setEditBot(bot || null);
    setForm(bot ? { name: bot.name, token: bot.token, username: bot.username, link: bot.link } : { name: '', token: '', username: '', link: '' });
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditBot(null); setFormError(''); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const throttledSubmit = throttle(async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editBot) {
        await updateBot(editBot.id, form);
      } else {
        await createBot(form);
      }
      closeModal();
      fetchBots();
    } catch (err) {
      setFormError(handleApiError(err, { context: 'save_bot' }));
    } finally {
      setFormLoading(false);
    }
  }, 2000, { trailing: false });
  const handleSubmit = (event: React.FormEvent) => throttledSubmit(event);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete?')) return;
    try {
      await deleteBot(id);
      fetchBots();
    } catch (err) {
      setError(handleApiError(err, { context: 'delete_bot' }));
    }
  };

  return {
    bots, loading, error,
    showModal, openModal, closeModal,
    editBot, form, setForm, formLoading, formError,
    handleChange, handleSubmit, handleDelete
  };
} 