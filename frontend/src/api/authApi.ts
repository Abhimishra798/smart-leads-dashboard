import axiosInstance from './axiosInstance';
import { ApiResponse, User } from '@/types';

export interface AuthPayload {
  token: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterInput) =>
    axiosInstance.post<ApiResponse<AuthPayload>>('/auth/register', data),

  login: (data: LoginInput) =>
    axiosInstance.post<ApiResponse<AuthPayload>>('/auth/login', data),

  getMe: () =>
    axiosInstance.get<ApiResponse<User>>('/auth/me'),
};
