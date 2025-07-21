import { useState, useCallback } from 'react';
// Локальное определение типа для useModal
interface UseModalReturn<T> {
  open: boolean;
  openModal: (payload?: T) => void;
  closeModal: () => void;
  data: T | null;
  setData: (data: T | null) => void;
  error: string;
  setError: (error: string) => void;
}

export function useModal<T = undefined>(initialValue: T | null = null): UseModalReturn<T> {
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