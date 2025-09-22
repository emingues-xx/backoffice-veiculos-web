import { apiClient } from '@/lib/api';
import { DashboardMetrics, SalesResponse } from '@/types/dashboard';
import { useQuery } from 'react-query';

export const useDashboardMetrics = () => {
  return useQuery<DashboardMetrics, Error>(
    ['dashboard', 'metrics'],
    async () => {
      try {
        return await apiClient.getDashboardMetrics();
      } catch (error) {
        // Return mock data if API is not available
        console.warn('Dashboard API not available, using mock data:', error);
        return {
          totalVehicles: 0,
          totalSales: 0,
          totalRevenue: 0,
          activeVehicles: 0,
          salesByMonth: [],
          vehiclesByCategory: [],
          recentSales: []
        };
      }
    },
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