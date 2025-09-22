import { apiClient } from '@/lib/api';
import { CreateVehicleRequest, UpdateVehicleRequest, Vehicle, VehicleFilters, VehicleListResponse } from '@/types/vehicle';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const useVehicles = (filters?: VehicleFilters & { page?: number; limit?: number }) => {
  return useQuery<VehicleListResponse, Error>(
    ['vehicles', filters],
    () => apiClient.getVehicles(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useVehicle = (id: string) => {
  return useQuery<Vehicle, Error>(
    ['vehicle', id],
    () => apiClient.getVehicle(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<Vehicle, Error, CreateVehicleRequest>(
    (data) => apiClient.createVehicle(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vehicles']);
      },
    }
  );
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<Vehicle, Error, { id: string; data: UpdateVehicleRequest }>(
    ({ id, data }) => apiClient.updateVehicle(id, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['vehicles']);
        queryClient.invalidateQueries(['vehicle', data.id]);
      },
    }
  );
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    (id) => apiClient.deleteVehicle(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['vehicles']);
      },
    }
  );
};