import { useCreateVeiculo, useDeleteVeiculo, useUpdateVeiculo, useVeiculos } from '@/hooks/useVeiculos';
import { CreateVeiculoRequest, UpdateVeiculoRequest, VeiculoFilters as VeiculoFiltersType } from '@/types/veiculo';
import { DEFAULT_PAGE_SIZE, PAGINATION_LIMITS } from '@/utils/constants';
import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { VeiculoCard } from './VeiculoCard';
import { VeiculoFilters } from './VeiculoFilters';
import { VeiculoForm } from './VeiculoForm';

export const VeiculoList: React.FC = () => {
  const [filters, setFilters] = useState<VeiculoFiltersType & { page?: number; limit?: number }>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<string | null>(null);
  const [deletingVeiculo, setDeletingVeiculo] = useState<string | null>(null);

  const { data: veiculosData, isLoading, error } = useVeiculos(filters);
  const createVeiculoMutation = useCreateVeiculo();
  const updateVeiculoMutation = useUpdateVeiculo();
  const deleteVeiculoMutation = useDeleteVeiculo();

  const handleFiltersChange = (newFilters: VeiculoFiltersType) => {
    setFilters({ ...newFilters, page: 1, limit: filters.limit });
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: filters.limit });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ ...filters, limit, page: 1 });
  };

  const handleCreateVeiculo = (data: CreateVeiculoRequest) => {
    createVeiculoMutation.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleUpdateVeiculo = (data: UpdateVeiculoRequest) => {
    if (editingVeiculo) {
      updateVeiculoMutation.mutate(
        { id: editingVeiculo, data },
        {
          onSuccess: () => {
            setEditingVeiculo(null);
          },
        }
      );
    }
  };

  const handleDeleteVeiculo = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      deleteVeiculoMutation.mutate(id);
    }
  };

  const handleViewVeiculo = (id: string) => {
    // Implementar visualização detalhada
    console.log('View veiculo:', id);
  };

  const handleEditVeiculo = (id: string) => {
    setEditingVeiculo(id);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar veículos</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie o catálogo de veículos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Veículo
        </button>
      </div>

      {/* Filters */}
      <VeiculoFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : veiculosData ? (
        <>
          {/* Results Info */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Mostrando {veiculosData.veiculos.length} de {veiculosData.total} veículos
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Itens por página:</span>
              <select
                value={filters.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PAGINATION_LIMITS.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicles Grid */}
          {veiculosData.veiculos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {veiculosData.veiculos.map((veiculo) => (
                <VeiculoCard
                  key={veiculo.id}
                  veiculo={veiculo}
                  onView={handleViewVeiculo}
                  onEdit={handleEditVeiculo}
                  onDelete={handleDeleteVeiculo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
              <p className="text-gray-500 mb-4">
                Tente ajustar os filtros ou adicionar um novo veículo.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Veículo
              </button>
            </div>
          )}

          {/* Pagination */}
          {veiculosData.totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {[...Array(veiculosData.totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === filters.page;

                  if (
                    page === 1 ||
                    page === veiculosData.totalPages ||
                    (page >= filters.page! - 2 && page <= filters.page! + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${isCurrentPage
                            ? 'border-primary-500 bg-primary-50 text-primary-600'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === filters.page! - 3 ||
                    page === filters.page! + 3
                  ) {
                    return <span key={page} className="px-2 text-gray-500">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={filters.page === veiculosData.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              </nav>
            </div>
          )}
        </>
      ) : null}

      {/* Forms */}
      {showForm && (
        <VeiculoForm
          onSubmit={handleCreateVeiculo}
          onCancel={() => setShowForm(false)}
          isLoading={createVeiculoMutation.isLoading}
        />
      )}

      {editingVeiculo && (
        <VeiculoForm
          isEdit
          onSubmit={handleUpdateVeiculo}
          onCancel={() => setEditingVeiculo(null)}
          isLoading={updateVeiculoMutation.isLoading}
        />
      )}
    </div>
  );
};
