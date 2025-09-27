import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import type { 
  RegisterPayload, 
  RegisterResponse,
  VerifyPayload, 
  VerifyResponse,
  LoginPayload, 
  LoginResponse,
} from '../types/auth';

const API_URL = import.meta.env.VITE_BACKEND_API as string;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return error.response?.status === 500 || !error.response;
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(new Error(error.response.data.message || 'Server error'));
    } else if (error.request) {
      return Promise.reject(new Error('Network error, please check your connection'));
    } else {
      return Promise.reject(new Error('Error occurred while setting up the request'));
    }
  }
);

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const response: AxiosResponse<{ data: RegisterResponse }> = await axiosInstance.post('/register', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Register failed');
    } else {
      throw new Error('Register failed');
    }
  }
};

export const verify = async (payload: VerifyPayload): Promise<VerifyResponse> => {
  try {
    const response: AxiosResponse<{ data: VerifyResponse }> = await axiosInstance.post('/verify', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Verification failed');
    } else {
      throw new Error('Verification failed');
    }
  }
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<{ data: LoginResponse }> = await axiosInstance.post('/login', payload);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Login failed');
    } else {
      throw new Error('Login failed');
    }
  }
};

