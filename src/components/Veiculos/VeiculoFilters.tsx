import { VeiculoFilters as VeiculoFiltersType } from '@/types/veiculo';
import { CAMBIOS, CATEGORIAS, COMBUSTIVEIS, MARCAS_POPULARES, STATUS } from '@/utils/constants';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface VeiculoFiltersProps {
  filters: VeiculoFiltersType;
  onFiltersChange: (filters: VeiculoFiltersType) => void;
  onClearFilters: () => void;
}

export const VeiculoFilters: React.FC<VeiculoFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof VeiculoFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        <div className="flex space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpar filtros
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isExpanded ? 'Menos filtros' : 'Mais filtros'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Marca, modelo, descrição..."
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            value={filters.marca || ''}
            onChange={(e) => handleFilterChange('marca', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas as marcas</option>
            {MARCAS_POPULARES.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {STATUS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {isExpanded && (
          <>
            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filters.categoria || ''}
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Combustível */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Combustível
              </label>
              <select
                value={filters.combustivel || ''}
                onChange={(e) => handleFilterChange('combustivel', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todos os combustíveis</option>
                {COMBUSTIVEIS.map((combustivel) => (
                  <option key={combustivel.value} value={combustivel.value}>
                    {combustivel.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Câmbio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câmbio
              </label>
              <select
                value={filters.cambio || ''}
                onChange={(e) => handleFilterChange('cambio', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todos os câmbios</option>
                {CAMBIOS.map((cambio) => (
                  <option key={cambio.value} value={cambio.value}>
                    {cambio.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preço Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Mínimo
              </label>
              <input
                type="number"
                value={filters.precoMin || ''}
                onChange={(e) => handleFilterChange('precoMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="R$ 0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Máximo
              </label>
              <input
                type="number"
                value={filters.precoMax || ''}
                onChange={(e) => handleFilterChange('precoMax', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="R$ 1.000.000"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Ano Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano Mínimo
              </label>
              <input
                type="number"
                value={filters.anoMin || ''}
                onChange={(e) => handleFilterChange('anoMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1990"
                min="1990"
                max={new Date().getFullYear()}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Ano Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano Máximo
              </label>
              <input
                type="number"
                value={filters.anoMax || ''}
                onChange={(e) => handleFilterChange('anoMax', e.target.value ? Number(e.target.value) : undefined)}
                placeholder={new Date().getFullYear().toString()}
                min="1990"
                max={new Date().getFullYear()}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
