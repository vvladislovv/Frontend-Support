import { useState, useCallback } from 'react';

export function useModal<T = undefined>(initialValue: T | null = null) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialValue);
  const [error, setError] = useState('');

  const openModal = useCallback((payload?: T) => {
    setData(payload ?? null);
    setError('');
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setOpen(false);
    setData(initialValue);
    setError('');
  }, [initialValue]);

  return { open, openModal, closeModal, data, setData, error, setError };
} 