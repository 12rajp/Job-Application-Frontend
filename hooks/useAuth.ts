'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginCredentials, SignupData } from '@/types/type';
import { API_URL } from '@/lib/constants';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);

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

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error || 'Login failed');
        return { success: false, message: data.message || data.error };
      }

      const token = data.token || data.authToken || data.accessToken || data.access_token;

      if (token) {
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        
        toast.success('Login successful! Redirecting...');
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        router.refresh();
        router.push('/dashboard');
        
        return { success: true };
      } else {
        toast.error('Login successful but no token received');
        return { success: false, message: 'No token received' };
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        toast.error(responseData.message || 'Registration failed');
        return { success: false, message: responseData.message };
      }

      toast.success(responseData.message || 'Registration successful! Please verify your email.');
      
      return { 
        success: true, 
        message: responseData.message,
        requiresVerification: true 
      };
      
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
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

  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';

  toast.success('Logged out successfully');

  setLoading(false);
  router.replace('/login'); 
};

  return { login, signup, logout, loading };
}
 