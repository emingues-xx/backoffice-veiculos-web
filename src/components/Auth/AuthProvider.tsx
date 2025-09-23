import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any;
  login: (credentials: { email: string; password: string }) => void;
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
  const authHook = useAuthHook();

  useEffect(() => {
    // Check if there's a token in localStorage
    const savedToken = localStorage.getItem('auth_token');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authHook.isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated: authHook.isAuthenticated,
      token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
      user: authHook.user,
      login: authHook.login,
      logout: authHook.logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
