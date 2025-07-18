import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import throttle from 'lodash.throttle';
import { login } from '../../api';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function useLogin(onAuth: (profile: Profile) => void) {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const throttledSubmit = throttle(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Используем API функцию входа
      const response = await login(email, password);
      const profile: Profile = response.user;
      
      // Вызываем функцию авторизации (она сохранит токены в cookies)
      onAuth(profile);
      
      // Перенаправляем на дашборд
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }, 2000, { trailing: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая валидация email
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Invalid email or password: Enter your email');
      return;
    }
    if (!password) {
      setError('Invalid email or password: Enter your password');
      return;
    }
    throttledSubmit(e);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  };
} 