import { apiClient } from '@/lib/api';
import { DashboardMetrics, VendasResponse } from '@/types/dashboard';
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

export const useVendas = (filters?: { page?: number; limit?: number; dataInicio?: string; dataFim?: string }) => {
  return useQuery<VendasResponse, Error>(
    ['vendas', filters],
    () => apiClient.getVendas(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
