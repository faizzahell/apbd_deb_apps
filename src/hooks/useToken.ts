import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { login as loginApi } from '../services/api';
import type { LoginPayload } from '../types/auth';

export const useToken = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (payload: LoginPayload) => {
    const response = await loginApi(payload);
    login(response.token, {
      id: response.id,
      username: response.username,
      name: response.name,
      email: response.email,
      role: response.role
    });
    navigate('/dashboard');
  };

  return handleLogin;
};
