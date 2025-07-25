import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import { handleLoginError } from '../../utils/errorHandler';

export const useLogin = (onAuth: (profile: { id: string; email: string; name: string; role: string }) => void) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      
      // Get user profile after successful login
      const profile = await authService.getProfile();
      
      onAuth(profile);
      navigate('/dashboard');
    } catch (err) {
      setError(handleLoginError(err));
    } finally {
      setLoading(false);
    }
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
};