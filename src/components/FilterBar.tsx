import React from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { useFilters, FilterState } from '@/hooks/useFilters';

interface FilterBarProps {
  onFiltersChange?: (filters: FilterState) => void;
  showDateRange?: boolean;
  showSearch?: boolean;
  showSellerFilter?: boolean;
  showPeriodFilter?: boolean;
  className?: string;
  sellers?: Array<{ id: string; name: string }>;
  onSearch?: (search: string) => void;
  searchPlaceholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFiltersChange,
  showDateRange = true,
  showSearch = true,
  showSellerFilter = false,
  showPeriodFilter = false,
  className = '',
  sellers = [],
  onSearch,
  searchPlaceholder = 'Buscar...'
}) => {
  const {
    filters,
    setDateRange,
    setPreset,
    setSellerId,
    setPeriod,
    setSearch,
    resetFilters,
    hasActiveFilters
  } = useFilters();

  // Notificar mudanças nos filtros
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  // Notificar mudanças na busca
  React.useEffect(() => {
    if (onSearch && filters.search !== undefined) {
      onSearch(filters.search);
    }
  }, [filters.search, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value || undefined);
  };

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSellerId(e.target.value || undefined);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value as any || undefined);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Picker */}
        {showDateRange && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Período
            </label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={setDateRange}
              onPresetChange={setPreset}
              placeholder="Selecionar período"
            />
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Busca
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {filters.search && (
                <button
                  onClick={() => setSearch(undefined)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Seller Filter */}
        {showSellerFilter && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Vendedor
            </label>
            <select
              value={filters.sellerId || ''}
              onChange={handleSellerChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os vendedores</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Period Filter */}
        {showPeriodFilter && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Agrupamento
            </label>
            <select
              value={filters.period || ''}
              onChange={handlePeriodChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Automático</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            
            {filters.preset && filters.preset !== 'lastMonth' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {filters.preset}
                <button
                  onClick={() => setPreset('lastMonth')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.sellerId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Vendedor: {sellers.find(s => s.id === filters.sellerId)?.name || filters.sellerId}
                <button
                  onClick={() => setSellerId(undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.period && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {filters.period}
                <button
                  onClick={() => setPeriod(undefined)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Busca: {filters.search}
                <button
                  onClick={() => setSearch(undefined)}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
