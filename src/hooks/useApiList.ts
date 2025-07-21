import { useState, useCallback } from 'react';

interface UseApiListOptions<T> {
  fetchList: () => Promise<T[]>;
  removeItem?: (id: string) => Promise<void>;
  onError?: (err: unknown) => void;
}

interface UseApiListReturn<T> {
  items: T[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useApiList<T>({ fetchList, removeItem, onError }: UseApiListOptions<T>): UseApiListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchList();
      setItems(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [fetchList, onError]);

  const handleDelete = useCallback(async (id: string) => {
    if (!removeItem) return;
    try {
      await removeItem(id);
      fetch();
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error');
      onError?.(err);
    }
  }, [removeItem, fetch, onError]);

  return { items, loading, error, refresh: fetch, remove: handleDelete };
} 