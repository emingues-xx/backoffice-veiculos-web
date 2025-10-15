import { useQuery, useMutation, useQueryClient } from 'react-query';
import { metricsApiService, MetricsFilters, MetricsData } from '@/services/metricsApi';
import { useAuth } from '@/components/Auth/AuthProvider';

// Chaves de query para cache
export const METRICS_QUERY_KEYS = {
  revenue: (filters: MetricsFilters) => ['metrics', 'revenue', filters],
  salesByDay: (filters: MetricsFilters) => ['metrics', 'salesByDay', filters],
  topSellers: (filters: MetricsFilters) => ['metrics', 'topSellers', filters],
  totalSales: (filters: MetricsFilters) => ['metrics', 'totalSales', filters],
  all: (filters: MetricsFilters) => ['metrics', 'all', filters],
  summary: (filters: MetricsFilters) => ['metrics', 'summary', filters]
};

// Configurações padrão para queries
const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000)
};

// Hook para receita total
export const useRevenue = (filters: MetricsFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.revenue(filters),
    queryFn: () => metricsApiService.getRevenue(filters),
    enabled: !!user,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para vendas por dia
export const useSalesByDay = (filters: MetricsFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.salesByDay(filters),
    queryFn: () => metricsApiService.getSalesByDay(filters),
    enabled: !!user,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para melhores vendedores
export const useTopSellers = (filters: MetricsFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.topSellers(filters),
    queryFn: () => metricsApiService.getTopSellers(filters),
    enabled: !!user,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para total de vendas
export const useTotalSales = (filters: MetricsFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.totalSales(filters),
    queryFn: () => metricsApiService.getTotalSales(filters),
    enabled: !!user,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para todas as métricas
export const useAllMetrics = (filters: MetricsFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.all(filters),
    queryFn: () => metricsApiService.getAllMetrics(filters),
    enabled: !!user,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para resumo das métricas
export const useMetricsSummary = (filters: MetricsFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.summary(filters),
    queryFn: () => metricsApiService.getMetricsSummary(filters),
    enabled: !!user,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para exportação de métricas
export const useExportMetrics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ filters, format }: { filters: MetricsFilters; format: 'csv' | 'xlsx' }) =>
      metricsApiService.exportMetrics(filters, format),
    onSuccess: (blob, variables) => {
      // Criar download do arquivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `metrics-${new Date().toISOString().split('T')[0]}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  });
};

// Hook principal para dashboard
export const useMetrics = (filters: MetricsFilters = {}) => {
  const revenue = useRevenue(filters);
  const salesByDay = useSalesByDay(filters);
  const topSellers = useTopSellers(filters);
  const totalSales = useTotalSales(filters);
  const summary = useMetricsSummary(filters);
  const exportMetrics = useExportMetrics();

  const isLoading = revenue.isLoading || salesByDay.isLoading || 
                   topSellers.isLoading || totalSales.isLoading || summary.isLoading;
  
  const isError = revenue.isError || salesByDay.isError || 
                 topSellers.isError || totalSales.isError || summary.isError;
  
  const error = revenue.error || salesByDay.error || 
               topSellers.error || totalSales.error || summary.error;

  const data = {
    revenue: revenue.data,
    salesByDay: salesByDay.data,
    topSellers: topSellers.data,
    totalSales: totalSales.data,
    summary: summary.data
  };


  const refetch = () => {
    revenue.refetch();
    salesByDay.refetch();
    topSellers.refetch();
    totalSales.refetch();
    summary.refetch();
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    exportMetrics
  };
};

// Hook para métricas em tempo real (com polling)
export const useRealtimeMetrics = (filters: MetricsFilters = {}, interval: number = 30000) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: METRICS_QUERY_KEYS.all(filters),
    queryFn: () => metricsApiService.getAllMetrics(filters),
    enabled: !!user,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    ...DEFAULT_QUERY_OPTIONS
  });
};

// Hook para invalidar cache de métricas
export const useInvalidateMetrics = () => {
  const queryClient = useQueryClient();
  
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
  };
  
  const invalidateByFilters = (filters: MetricsFilters) => {
    Object.values(METRICS_QUERY_KEYS).forEach(keyFn => {
      queryClient.invalidateQueries({ queryKey: keyFn(filters) });
    });
  };
  
  return {
    invalidateAll,
    invalidateByFilters
  };
};

// Hook para pré-carregar métricas
export const usePrefetchMetrics = () => {
  const queryClient = useQueryClient();
  
  const prefetchMetrics = (filters: MetricsFilters) => {
    queryClient.prefetchQuery({
      queryKey: METRICS_QUERY_KEYS.all(filters),
      queryFn: () => metricsApiService.getAllMetrics(filters),
      ...DEFAULT_QUERY_OPTIONS
    });
  };
  
  return { prefetchMetrics };
};
