import { useState, useCallback } from 'react';
import throttle from 'lodash.throttle';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => string | null;
  throttleMs?: number;
}

export function useForm<T extends Record<string, unknown>>({ initialValues, onSubmit, validate, throttleMs = 2000 }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const throttledSubmit = useCallback(
    (e: React.FormEvent) => {
      throttle(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (validate) {
          const err = validate(values);
          if (err) {
            setError(err);
            setLoading(false);
            return;
          }
        }
        try {
          await onSubmit(values);
          setValues(initialValues);
        } catch (err: unknown) {
          setError((err as Error)?.message || 'Error');
        } finally {
          setLoading(false);
        }
      }, throttleMs, { trailing: false })(e);
    },
    [values, onSubmit, validate, throttleMs, initialValues]
  );

  const handleSubmit = (e: React.FormEvent) => throttledSubmit(e);

  return { values, setValues, loading, error, handleChange, handleSubmit, setError };
} 