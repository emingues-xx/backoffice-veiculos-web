import { apiClient } from '@/lib/api';
import { CreateVeiculoRequest, UpdateVeiculoRequest, Veiculo, VeiculoFilters, VeiculoListResponse } from '@/types/veiculo';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const useVeiculos = (filters?: VeiculoFilters & { page?: number; limit?: number }) => {
  return useQuery<VeiculoListResponse, Error>(
    ['veiculos', filters],
    () => apiClient.getVeiculos(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useVeiculo = (id: string) => {
  return useQuery<Veiculo, Error>(
    ['veiculo', id],
    () => apiClient.getVeiculo(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateVeiculo = () => {
  const queryClient = useQueryClient();

  return useMutation<Veiculo, Error, CreateVeiculoRequest>(
    (data) => apiClient.createVeiculo(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['veiculos']);
      },
    }
  );
};

export const useUpdateVeiculo = () => {
  const queryClient = useQueryClient();

  return useMutation<Veiculo, Error, { id: string; data: UpdateVeiculoRequest }>(
    ({ id, data }) => apiClient.updateVeiculo(id, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['veiculos']);
        queryClient.invalidateQueries(['veiculo', data.id]);
      },
    }
  );
};

export const useDeleteVeiculo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    (id) => apiClient.deleteVeiculo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['veiculos']);
      },
    }
  );
};
