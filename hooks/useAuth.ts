'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, SignupData } from '@/types/type';
import { API_URL } from '@/lib/constants';

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
        throw new Error(errorData.message || errorData.error || 'Login failed');
      }

      const data = await res.json();
      const token = data.token || data.authToken || data.accessToken || data.access_token;

      if (token) {
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        router.refresh();
        router.push('/dashboard');
        
        return { success: true };
      } else {
        throw new Error('Login successful but no token received');
      }
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
      return { 
        success: true, 
        message: responseData.message,
        requiresVerification: true 
      };
      
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout API error:', err);
    }
    
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
    
    setLoading(false);
    window.location.href = '/login';
  };

  return { login, signup, logout, loading, error };
}
