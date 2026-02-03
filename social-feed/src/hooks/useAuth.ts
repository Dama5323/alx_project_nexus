// src/hooks/useAuth.ts
import { useState, useCallback, useEffect } from 'react';
import { User } from '../types'; 


interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Login attempt:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email,
        username: email.split('@')[0],
        avatar: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date().toISOString(),
        verified: true,
        bio: 'Just a demo user'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Signup attempt:', { name, email });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        username: email.split('@')[0],
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString(),
        verified: false,
        bio: 'New user'
      };
      
      console.log('Signup successful:', mockUser);
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;