import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { Layout } from '@/components/Layout/Layout';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a token in localStorage
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      // Set default user data
      setUser({
        id: '68d1d34f2dd6f78e64b71fff',
        name: 'Admin User',
        email: 'admin@test.com',
        phone: '(11) 99999-9999'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.login(credentials.email, credentials.password);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
      }
      
      setToken(response.token);
      setIsAuthenticated(true);
      setUser(response.user || {
        id: '68d1d34f2dd6f78e64b71fff',
        name: 'Admin User',
        email: 'admin@test.com',
        phone: '(11) 99999-9999'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      user,
      login,
      logout,
    }}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : !isAuthenticated ? (
        <LoginForm />
      ) : (
        <Layout>
          {children}
        </Layout>
      )}
    </AuthContext.Provider>
  );
};
