import { register as registerApi } from '../services/api';
import type { RegisterPayload } from '../types/auth';

export const useRegister = () => {

  const handleRegister = async (payload: RegisterPayload) => {
    try {
      await registerApi(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Register failed');
      }
    }
  };

  return handleRegister;
};
