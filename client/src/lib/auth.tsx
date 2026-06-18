import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API = '/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('logicost-token');
  });

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || 'Credenciales inválidas');
    }

    const data = await res.json();
    const serverUser = data.data.user || data.data;
    const tokenStr = data.data.token;

    const mappedUser: User = {
      id: serverUser.id,
      name: serverUser.name,
      email: serverUser.email,
      role: serverUser.role === 'admin' ? 'admin' : 'user',
      createdAt: serverUser.createdAt || new Date().toISOString()
    };

    setUser(mappedUser);
    setToken(tokenStr);
    localStorage.setItem('logicost-user', JSON.stringify(mappedUser));
    localStorage.setItem('logicost-token', tokenStr);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('logicost-user');
    localStorage.removeItem('logicost-token');
  };

  const updateProfile = async (data: { name?: string; email?: string; password?: string }) => {
    const currentToken = token || localStorage.getItem('logicost-token');
    if (!currentToken || !user) throw new Error('No autorizado');

    const res = await fetch(`${API}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      throw new Error(result.error?.message || 'Error al actualizar perfil');
    }

    const result = await res.json();
    const serverUser = result.data;

    const mappedUser: User = {
      id: serverUser.id,
      name: serverUser.name,
      email: serverUser.email,
      role: serverUser.role === 'admin' ? 'admin' : 'user',
      createdAt: serverUser.createdAt || user.createdAt
    };

    setUser(mappedUser);
    localStorage.setItem('logicost-user', JSON.stringify(mappedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
