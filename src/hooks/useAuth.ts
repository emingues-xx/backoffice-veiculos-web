import { apiClient } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>(
    async ({ email, password }) => {
      const response = await apiClient.login(email, password);
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch user data
        queryClient.invalidateQueries(['auth', 'user']);
      },
    }
  );

  const logoutMutation = useMutation<void, Error>(
    async () => {
      await apiClient.logout();
    },
    {
      onSuccess: () => {
        // Clear all cached data
        queryClient.clear();
      },
    }
  );

  const getUser = useQuery<AuthUser | null, Error>(
    ['auth', 'user'],
    async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) return null;
      
      // You might want to add a /me endpoint to get user info
      // For now, we'll return a default user
      return {
        id: '68d1d34f2dd6f78e64b71fff',
        name: 'Admin User',
        email: 'admin@test.com',
        phone: '(11) 99999-9999'
      };
    },
    {
      enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const isAuthenticated = !!getUser.data && !!localStorage.getItem('auth_token');

  return {
    user: getUser.data,
    isAuthenticated,
    isLoading: getUser.isLoading || loginMutation.isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
};
