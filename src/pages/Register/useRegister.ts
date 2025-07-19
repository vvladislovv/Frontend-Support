import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import throttle from 'lodash.throttle';
import { register as apiRegister, getProfile } from '../../api';
import { AxiosError } from 'axios';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function useRegister(onAuth: (profile: Profile) => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const throttledSubmit = throttle(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiRegister(email, password, name);
      const profile: Profile = await getProfile();
      
      // Очищаем флаг выхода при успешной регистрации
      sessionStorage.removeItem('user_logged_out');
      
      onAuth(profile);
      navigate('/dashboard');
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'isAxiosError' in e) {
        setError((e as AxiosError<{ message?: string }>).response?.data?.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }, 2000, { trailing: false });

  const handleSubmit = (e: React.FormEvent) => throttledSubmit(e);

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  };
} 