const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SignupData {
  user_name: string;
  email: string;
  password: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.identifier.includes('@') ? credentials.identifier : undefined,
        user_name: !credentials.identifier.includes('@') ? credentials.identifier : undefined,
        password: credentials.password
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Login failed');
    }
    
    return response.json();
  },

  signup: async (data: SignupData) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  }
};
