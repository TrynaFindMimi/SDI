import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: User[] = [
  { id: '0', name: 'Admin Genérico', email: 'admin@admin.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: '1', name: 'Admin Demo', email: 'admin@logicost.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: '2', name: 'Usuario Demo', email: 'user@logicost.com', role: 'user', createdAt: new Date().toISOString() },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('logicost-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string) => {
    const found = DEMO_USERS.find(u => u.email === email) || DEMO_USERS[0];
    setUser(found);
    localStorage.setItem('logicost-user', JSON.stringify(found));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('logicost-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
