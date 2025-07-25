import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services';
import { handleRegisterError } from '../../utils/errorHandler';
import axios from 'axios';

export const useRegister = (onAuth: (profile: { id: string; email: string; name: string; role: string }) => void) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация данных
    if (!name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    // Простая проверка email формата
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    console.log('Registration attempt:', {
      name: name.trim(),
      email: email.trim(),
      password: '***',
      referralCode: referralCode || 'none'
    });

    try {
      // Сначала проверим, работает ли сервер с простым запросом
      console.log('Testing server with simple request...');
      
      // Попробуем сначала логин с тестовыми данными (должен вернуть 401, но не 500)
      try {
        await authService.login('test@test.com', 'test123');
      } catch (loginError) {
        console.log('Login test result:', loginError);
        // Ожидаем 401 или 404, но не 500
      }
      
      // Теперь попробуем регистрацию
      console.log('Attempting registration without referral code...');
      await authService.register(email.trim(), password, name.trim(), undefined);

      // Get user profile after successful registration
      const profile = await authService.getProfile();

      onAuth(profile);
      navigate('/dashboard');
    } catch (err) {
      setError(handleRegisterError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    referralCode,
    handleSubmit
  };
};
