'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Usuario } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthContextType {
  user: Usuario | null;
  session: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, nombre: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialAuth() {
  if (typeof window === 'undefined') {
    return { session: null, user: null };
  }
  const storedSession = localStorage.getItem('session');
  const storedUser = localStorage.getItem('user');
  return {
    session: storedSession,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialAuth = useMemo(() => getInitialAuth(), []);
  const [user, setUser] = useState<Usuario | null>(initialAuth.user);
  const [session, setSession] = useState<string | null>(initialAuth.session);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Error al iniciar sesión' };
      }

      const token = data.session.access_token;
      const userData = data.user;

      localStorage.setItem('session', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setSession(token);
      setUser(userData);

      return { error: null };
    } catch {
      return { error: 'Error de conexión' };
    }
  };

  const signUp = async (email: string, password: string, nombre: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nombre }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Error al registrar' };
      }

      return { error: null };
    } catch {
      return { error: 'Error de conexión' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
