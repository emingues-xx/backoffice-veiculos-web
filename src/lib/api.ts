import { ApiError, ApiResponse, HealthCheck } from '@/types/api';
import { DashboardMetrics, SalesResponse } from '@/types/dashboard';
import { CreateVehicleRequest, UpdateVehicleRequest, Vehicle, VehicleFilters, VehicleListResponse } from '@/types/vehicle';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use relative URLs to leverage Next.js rewrites and avoid CORS issues
    this.client = axios.create({
      baseURL: typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BFF_BASE_URL || 'https://backoffice-veiculos-bff-production.up.railway.app'),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available (only on client side)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          code: error.response?.data?.code,
          details: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Health check
  async healthCheck(): Promise<HealthCheck> {
    const response = await this.client.get<HealthCheck>('/health');
    return response.data;
  }

  // Vehicles (BFF uses English endpoints)
  async getVehicles(filters?: VehicleFilters & { page?: number; limit?: number }): Promise<VehicleListResponse> {
    const response = await this.client.get<any>('/api/vehicles', {
      params: filters,
    });
    
    // Map the API response to our expected structure
    const apiData = response.data;
    return {
      vehicles: apiData.data || [],
      total: apiData.pagination?.total || 0,
      page: apiData.pagination?.page || 1,
      limit: apiData.pagination?.limit || 25,
      totalPages: apiData.pagination?.totalPages || 0
    };
  }

  async getVehicle(id: string): Promise<Vehicle> {
    const response = await this.client.get<ApiResponse<Vehicle>>(`/api/vehicles/${id}`);
    return response.data.data;
  }

  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    const response = await this.client.post<ApiResponse<Vehicle>>('/api/vehicles', data);
    return response.data.data;
  }

  async updateVehicle(id: string, data: UpdateVehicleRequest): Promise<Vehicle> {
    const response = await this.client.put<ApiResponse<Vehicle>>(`/api/vehicles/${id}`, data);
    return response.data.data;
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.client.delete(`/api/vehicles/${id}`);
  }

  // Dashboard
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await this.client.get<ApiResponse<DashboardMetrics>>('/api/dashboard/metrics');
    return response.data.data;
  }

  async getSales(filters?: { page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<SalesResponse> {
    const response = await this.client.get<ApiResponse<SalesResponse>>('/api/sales', {
      params: filters,
    });
    return response.data.data;
  }

  // Upload de imagens
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.client.post<ApiResponse<{ url: string }>>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.url;
  }
}

export const apiClient = new ApiClient();
