import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@infrastructure/api/client';
import { authService, LoginResponse } from '@infrastructure/api/authService';
import { User } from '@domain/models';

interface AuthState {
  token: string | null;
  user: Omit<User, 'passwordHash'> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          const { token, user } = response.data;
          apiClient.setToken(token);
          set({ token, user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({ token: null, user: null });
      },

      fetchUser: async () => {
        try {
          const response = await authService.me();
          set({ user: response.data });
        } catch {
          set({ token: null, user: null });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);
