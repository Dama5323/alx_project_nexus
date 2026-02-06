import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  message?: string; // Add this line to fix the interface
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        });
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
    setError(null); // Clear previous errors
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
          }
        }
      });

      if (error) throw error;
      
      return { 
        success: true, 
        user: {
          id: data.user?.id || '',
          email: data.user?.email || '',
          name
        }
      };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setError(null); // Clear previous errors
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { 
        success: true, 
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0]
        }
      };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setError(null);
    await supabase.auth.signOut();
  };

  const loginWithGoogle = async (): Promise<AuthResult> => {
    setError(null);
    try {
      console.log('Starting Google OAuth flow...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      console.log('Google OAuth response:', { data, error });
      
      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
      
      // The OAuth flow will redirect the user, so we don't set user here
      return { 
        success: true, 
        message: 'Redirecting to Google...' 
      };
    } catch (error: any) {
      console.error('Google login failed:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const loginWithLinkedIn = async (): Promise<AuthResult> => {
    setError(null);
    try {
      console.log('Starting LinkedIn OAuth flow...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'openid profile email'
        }
      });

      console.log('LinkedIn OAuth response:', { data, error });
      
      if (error) {
        console.error('LinkedIn OAuth error:', error);
        throw error;
      }
      
      return { 
        success: true, 
        message: 'Redirecting to LinkedIn...' 
      };
    } catch (error: any) {
      console.error('LinkedIn login failed:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = (updatedUserData: Partial<User>) => {
  setUser(prev => prev ? { ...prev, ...updatedUserData } : null);
};

  return {
    user,
    loading,
    error, 
    signup,
    login,
    logout,
    loginWithGoogle,
    loginWithLinkedIn,
    isAuthenticated,
    updateUserProfile
  };
};