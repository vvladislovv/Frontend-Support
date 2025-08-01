import { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';
interface Greeting {
  id: string;
  text: string;
}

interface UseGreetingsReturn {
  greetings: Greeting[];
  loading: boolean;
  error: string;
  form: { id?: string; text: string };
  setForm: React.Dispatch<React.SetStateAction<{ id?: string; text: string }>>;
  formLoading: boolean;
  formError: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleEdit: (greeting: Greeting) => void;
  handleDelete: () => Promise<void>;
}

export function useGreetings(t: (key: string) => string): UseGreetingsReturn {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{id?: string, text: string}>({ text: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // TODO: заменить на реальный API, если появится
  const fetchGreetings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Здесь должен быть реальный запрос к API, если он появится
      setGreetings([]);
    } catch {
      setError(t('errorLoadingData') || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchGreetings(); }, [fetchGreetings]);

  const throttledSubmit = throttle(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      // Здесь должен быть реальный запрос к API, если он появится
      setForm({ text: '' });
      fetchGreetings();
    } catch {
      setFormError(t('errorLoadingData') || 'Ошибка сохранения');
    } finally {
      setFormLoading(false);
    }
  }, 2000, { trailing: false });
  const handleSubmit = (e: React.FormEvent) => throttledSubmit(e);

  function handleEdit(greeting: Greeting): void {
    setForm({ id: greeting.id, text: greeting.text });
  }

  async function handleDelete(): Promise<void> {
    if (!window.confirm(t('delete') || 'Удалить?')) return;
    // Здесь должен быть реальный запрос к API, если он появится
    fetchGreetings();
  }

  return {
    greetings, loading, error, form, setForm, formLoading, formError,
    handleSubmit, handleEdit, handleDelete
  };
} 