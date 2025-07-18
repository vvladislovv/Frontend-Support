import { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';

export interface Greeting {
  id: string;
  text: string;
}

export function useGreetings(t: (key: string) => string) {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{id?: string, text: string}>({ text: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchGreetings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Здесь должен быть реальный запрос к API
      setGreetings([]); // Заглушка
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
      // Здесь должен быть реальный запрос к API
      setForm({ text: '' });
      fetchGreetings();
    } catch {
      setFormError(t('errorLoadingData') || 'Ошибка сохранения');
    } finally {
      setFormLoading(false);
    }
  }, 2000, { trailing: false });
  const handleSubmit = (e: React.FormEvent) => throttledSubmit(e);

  function handleEdit(greeting: Greeting) {
    setForm({ id: greeting.id, text: greeting.text });
  }

  async function handleDelete() {
    if (!window.confirm(t('delete') || 'Удалить?')) return;
    // Здесь должен быть реальный запрос к API
    fetchGreetings();
  }

  return {
    greetings, loading, error, form, setForm, formLoading, formError,
    handleSubmit, handleEdit, handleDelete
  };
} 