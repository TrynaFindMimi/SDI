import { apiClient } from '../api/client';
import { User } from '@domain/models';

export interface LoginResponse {
  token: string;
  user: Omit<User, 'passwordHash'>;
}

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<{ success: boolean; data: LoginResponse }>('/auth/login', { email, password }),
  me: () =>
    apiClient.get<{ success: boolean; data: User }>('/auth/me'),
  getAll: () =>
    apiClient.get<{ success: boolean; data: User[] }>('/users'),
  create: (data: { email: string; password: string; name: string; role: string }) =>
    apiClient.post<{ success: boolean; data: User }>('/users', data),
  update: (id: string, data: Partial<User> & { password?: string }) =>
    apiClient.put<{ success: boolean; data: User }>(`/users/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/users/${id}`)
};
