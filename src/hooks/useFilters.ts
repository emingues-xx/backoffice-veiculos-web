import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DateRange, DATE_PRESETS, getDateRangeFromPreset } from '@/utils/dateValidation';

export interface FilterState {
  dateRange: DateRange;
  preset: string;
  sellerId?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  search?: string;
}

export interface UseFiltersReturn {
  filters: FilterState;
  setDateRange: (dateRange: DateRange) => void;
  setPreset: (preset: string) => void;
  setSellerId: (sellerId: string | undefined) => void;
  setPeriod: (period: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined) => void;
  setSearch: (search: string | undefined) => void;
  resetFilters: () => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  hasActiveFilters: boolean;
  getApiFilters: () => Record<string, any>;
  syncWithUrl: () => void;
  loadFromUrl: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  dateRange: {
    startDate: null,
    endDate: null
  },
  preset: 'lastMonth',
  sellerId: undefined,
  period: undefined,
  search: undefined
};

export const useFilters = (): UseFiltersReturn => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(() => {
    // Inicializar com o preset padrão aplicado
    const presetRange = getDateRangeFromPreset('lastMonth');
    return {
      ...DEFAULT_FILTERS,
      dateRange: presetRange || DEFAULT_FILTERS.dateRange
    };
  });

  // Inicializar com preset padrão
  const initializeWithPreset = useCallback(() => {
    const presetRange = getDateRangeFromPreset('lastMonth');
    if (presetRange) {
      setFilters(prev => ({
        ...prev,
        dateRange: presetRange,
        preset: 'lastMonth'
      }));
    }
  }, []);

  // Carregar filtros da URL
  const loadFromUrl = useCallback(() => {
    const { query } = router;
    
    const newFilters: FilterState = {
      dateRange: {
        startDate: query.startDate ? new Date(query.startDate as string) : null,
        endDate: query.endDate ? new Date(query.endDate as string) : null
      },
      preset: (query.preset as string) || 'lastMonth',
      sellerId: query.sellerId as string || undefined,
      period: query.period as any || undefined,
      search: query.search as string || undefined
    };

    setFilters(newFilters);
  }, [router]);

  // Sincronizar filtros com URL
  const syncWithUrl = useCallback(() => {
    const query: Record<string, string> = {};

    if (filters.dateRange.startDate) {
      query.startDate = filters.dateRange.startDate.toISOString().split('T')[0];
    }
    
    if (filters.dateRange.endDate) {
      query.endDate = filters.dateRange.endDate.toISOString().split('T')[0];
    }
    
    if (filters.preset && filters.preset !== 'lastMonth') {
      query.preset = filters.preset;
    }
    
    if (filters.sellerId) {
      query.sellerId = filters.sellerId;
    }
    
    if (filters.period) {
      query.period = filters.period;
    }
    
    if (filters.search) {
      query.search = filters.search;
    }

    router.push({
      pathname: router.pathname,
      query: { ...router.query, ...query }
    }, undefined, { shallow: true });
  }, [filters, router]);

  // Setters individuais
  const setDateRange = useCallback((dateRange: DateRange) => {
    setFilters(prev => ({
      ...prev,
      dateRange,
      preset: 'custom' // Marcar como custom quando datas são definidas manualmente
    }));
  }, []);

  const setPreset = useCallback((preset: string) => {
    const presetRange = getDateRangeFromPreset(preset);
    if (presetRange) {
      setFilters(prev => ({
        ...prev,
        dateRange: presetRange,
        preset
      }));
    }
  }, []);

  const setSellerId = useCallback((sellerId: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      sellerId
    }));
  }, []);

  const setPeriod = useCallback((period: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined) => {
    setFilters(prev => ({
      ...prev,
      period
    }));
  }, []);

  const setSearch = useCallback((search: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      search
    }));
  }, []);

  // Resetar filtros
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    initializeWithPreset();
  }, [initializeWithPreset]);

  // Atualizar múltiplos filtros
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.sellerId ||
      filters.period ||
      filters.search ||
      (filters.preset && filters.preset !== 'lastMonth') ||
      (filters.dateRange.startDate && filters.dateRange.endDate)
    );
  }, [filters]);

  // Converter para formato da API
  const getApiFilters = useCallback(() => {
    const apiFilters: Record<string, any> = {};

    if (filters.dateRange.startDate) {
      apiFilters.startDate = filters.dateRange.startDate.toISOString().split('T')[0];
    }
    
    if (filters.dateRange.endDate) {
      apiFilters.endDate = filters.dateRange.endDate.toISOString().split('T')[0];
    }
    
    if (filters.period) {
      apiFilters.period = filters.period;
    }
    
    if (filters.sellerId) {
      apiFilters.sellerId = filters.sellerId;
    }

    return apiFilters;
  }, [filters]);

  return {
    filters,
    setDateRange,
    setPreset,
    setSellerId,
    setPeriod,
    setSearch,
    resetFilters,
    updateFilters,
    hasActiveFilters,
    getApiFilters,
    syncWithUrl,
    loadFromUrl
  };
};

// Hook para filtros específicos de métricas
export const useMetricsFilters = () => {
  const baseFilters = useFilters();
  
  const metricsFilters = useMemo(() => {
    return baseFilters.getApiFilters();
  }, [baseFilters]);

  return {
    ...baseFilters,
    metricsFilters
  };
};

// Hook para filtros de veículos
export const useVehicleFilters = () => {
  const baseFilters = useFilters();
  
  const vehicleFilters = useMemo(() => {
    const apiFilters = baseFilters.getApiFilters();
    
    return {
      ...apiFilters,
      search: baseFilters.filters.search
    };
  }, [baseFilters]);

  return {
    ...baseFilters,
    vehicleFilters
  };
};

// Hook para filtros de vendas
export const useSalesFilters = () => {
  const baseFilters = useFilters();
  
  const salesFilters = useMemo(() => {
    const apiFilters = baseFilters.getApiFilters();
    
    return {
      ...apiFilters,
      search: baseFilters.filters.search
    };
  }, [baseFilters]);

  return {
    ...baseFilters,
    salesFilters
  };
};
