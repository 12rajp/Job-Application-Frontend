'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SignupData {
  user_name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.identifier.includes('@') ? credentials.identifier : undefined,
          user_name: !credentials.identifier.includes('@') ? credentials.identifier : undefined,
          password: credentials.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await res.json();

      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }

      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await res.json();

      if (responseData.token) {
        document.cookie = `token=${responseData.token}; path=/; max-age=86400; SameSite=Strict; Secure`;
      }

      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
    
      document.cookie = 'token=; path=/; max-age=0';
      router.push('/login');
    }
  };

  return { login, signup, logout, loading, error };
}
