import { apiClient } from '@/lib/api';
import { DashboardMetrics, SalesResponse } from '@/types/dashboard';
import { useQuery } from 'react-query';

export const useDashboardMetrics = () => {
  return useQuery<DashboardMetrics, Error>(
    ['dashboard', 'metrics'],
    () => apiClient.getDashboardMetrics(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );
};

export const useSales = (filters?: { page?: number; limit?: number; startDate?: string; endDate?: string }) => {
  return useQuery<SalesResponse, Error>(
    ['sales', filters],
    () => apiClient.getSales(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};