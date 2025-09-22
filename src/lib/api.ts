import { ApiError, ApiResponse, HealthCheck } from '@/types/api';
import { DashboardMetrics, VendasResponse } from '@/types/dashboard';
import { CreateVeiculoRequest, UpdateVeiculoRequest, Veiculo, VeiculoFilters, VeiculoListResponse } from '@/types/veiculo';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use relative URLs to leverage Next.js rewrites and avoid CORS issues
    this.client = axios.create({
      baseURL: typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BFF_BASE_URL || 'http://localhost:3002'),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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

  // Veículos
  async getVeiculos(filters?: VeiculoFilters & { page?: number; limit?: number }): Promise<VeiculoListResponse> {
    const response = await this.client.get<ApiResponse<VeiculoListResponse>>('/api/veiculos', {
      params: filters,
    });
    return response.data.data;
  }

  async getVeiculo(id: string): Promise<Veiculo> {
    const response = await this.client.get<ApiResponse<Veiculo>>(`/api/veiculos/${id}`);
    return response.data.data;
  }

  async createVeiculo(data: CreateVeiculoRequest): Promise<Veiculo> {
    const response = await this.client.post<ApiResponse<Veiculo>>('/api/veiculos', data);
    return response.data.data;
  }

  async updateVeiculo(id: string, data: UpdateVeiculoRequest): Promise<Veiculo> {
    const response = await this.client.put<ApiResponse<Veiculo>>(`/api/veiculos/${id}`, data);
    return response.data.data;
  }

  async deleteVeiculo(id: string): Promise<void> {
    await this.client.delete(`/api/veiculos/${id}`);
  }

  // Dashboard
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await this.client.get<ApiResponse<DashboardMetrics>>('/api/dashboard/metrics');
    return response.data.data;
  }

  async getVendas(filters?: { page?: number; limit?: number; dataInicio?: string; dataFim?: string }): Promise<VendasResponse> {
    const response = await this.client.get<ApiResponse<VendasResponse>>('/api/vendas', {
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
