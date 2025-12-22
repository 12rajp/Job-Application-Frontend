'use client';

import { useState } from 'react';
import { authAPI, LoginCredentials, SignupData } from '@/lib/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      return { success: true, message: 'Login successful!' };
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
      await authAPI.signup(data);
      return { 
        success: true, 
        message: 'Registration successful! Please check your email to verify your account.' 
      };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loading, error };
}
