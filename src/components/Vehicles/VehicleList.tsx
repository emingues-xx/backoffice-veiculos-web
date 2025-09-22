import { useCreateVehicle, useDeleteVehicle, useUpdateVehicle, useVehicles } from '@/hooks/useVehicles';
import { CreateVehicleRequest, UpdateVehicleRequest, VehicleFilters as VehicleFiltersType } from '@/types/vehicle';
import { DEFAULT_PAGE_SIZE, PAGINATION_LIMITS } from '@/utils/constants';
import { PlusIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { VehicleCard } from './VehicleCard';
import { VehicleFilters } from './VehicleFilters';
import { VehicleForm } from './VehicleForm';

export const VehicleList: React.FC = () => {
  const [filters, setFilters] = useState<VehicleFiltersType & { page?: number; limit?: number }>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<string | null>(null);

  const { data: vehiclesData, isLoading, error } = useVehicles(filters);
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
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

  const handleCreateVehicle = (data: CreateVehicleRequest | UpdateVehicleRequest) => {
    createVehicleMutation.mutate(data as CreateVehicleRequest, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleUpdateVehicle = (data: UpdateVehicleRequest) => {
    if (editingVehicle) {
      updateVehicleMutation.mutate(
        { id: editingVehicle, data },
        {
          onSuccess: () => {
            setEditingVehicle(null);
          },
        }
      );
    }
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicleMutation.mutate(id, {
      onSuccess: () => {
        setDeletingVehicle(null);
      },
    });
  };

  const handleViewVehicle = (id: string) => {
    // TODO: Implement view vehicle details
    console.log('View vehicle:', id);
  };

  const handleEditVehicle = (id: string) => {
    setEditingVehicle(id);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingVehicle(id);
  };

  const confirmDelete = () => {
    if (deletingVehicle) {
      handleDeleteVehicle(deletingVehicle);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Erro ao carregar veículos</p>
          <p className="text-gray-600 mt-2">{error.message}</p>
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
          <p className="text-gray-600 mt-1">
            Gerencie o catálogo de veículos da sua loja
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Novo Veículo</span>
        </button>
      </div>

      {/* Filters */}
      <VehicleFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      {vehiclesData && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Mostrando {vehiclesData.vehicles.length} de {vehiclesData.total} veículos
            </p>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Itens por página:</label>
              <select
                value={filters.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {PAGINATION_LIMITS.map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando veículos...</p>
          </div>
        </div>
      )}

      {/* Vehicles Grid */}
      {vehiclesData && !isLoading && (
        <>
          {vehiclesData.vehicles && vehiclesData.vehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
              <p className="text-gray-400 mt-2">
                Tente ajustar os filtros ou adicione um novo veículo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehiclesData.vehicles && vehiclesData.vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onView={handleViewVehicle}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {vehiclesData.totalPages && vehiclesData.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={filters.page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {Array.from({ length: vehiclesData.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${page === filters.page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={filters.page === vehiclesData.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <VehicleForm
          onSubmit={handleCreateVehicle}
          onCancel={() => setShowForm(false)}
          isLoading={createVehicleMutation.isLoading}
        />
      )}

      {/* Edit Form Modal */}
      {editingVehicle && (
        <VehicleForm
          initialData={vehiclesData?.vehicles.find(v => v._id === editingVehicle)}
          onSubmit={handleUpdateVehicle}
          onCancel={() => setEditingVehicle(null)}
          isLoading={updateVehicleMutation.isLoading}
          isEdit={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmar Exclusão
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setDeletingVehicle(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteVehicleMutation.isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteVehicleMutation.isLoading ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};