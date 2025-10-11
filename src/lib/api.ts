import { ApiError, ApiResponse, HealthCheck } from '@/types/api';
import { DashboardMetrics, SalesResponse } from '@/types/dashboard';
import { CreateVehicleRequest, UpdateVehicleRequest, Vehicle, VehicleFilters, VehicleListResponse } from '@/types/vehicle';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use relative URLs on client side (leverages Next.js rewrites)
    // Use direct BFF URL on server side
    const baseURL = typeof window !== 'undefined' 
      ? '' // Use relative URLs to leverage rewrites
      : (process.env.BFF_BASE_URL || 'https://backoffice-veiculos-bff-production.up.railway.app');
    
    // Debug log for environment variables
    if (process.env.NODE_ENV === 'production') {
      console.log('API Client Configuration:');
      console.log('- BFF_BASE_URL:', process.env.BFF_BASE_URL);
      console.log('- NEXT_PUBLIC_BFF_BASE_URL:', process.env.NEXT_PUBLIC_BFF_BASE_URL);
      console.log('- API_TIMEOUT:', process.env.NEXT_PUBLIC_API_TIMEOUT);
      console.log('- Base URL:', baseURL);
    }
    
    this.client = axios.create({
      baseURL,
      timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
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

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      console.log('Login URL:', this.client.defaults.baseURL + '/api/users/login');
      
      // In development, use direct API to avoid SSL/CORS issues
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: using direct API');
        const directApiClient = axios.create({
          baseURL: 'https://backoffice-veiculos-api-production.up.railway.app',
          timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const response = await directApiClient.post<any>('/api/users/login', {
          email,
          password,
        });
        
        console.log('Login response:', response.data);
        return response.data;
      }
      
      // In production, try BFF first, then fallback to direct API
      let response;
      try {
        response = await this.client.post<any>('/api/users/login', {
          email,
          password,
        });
      } catch (bffError: any) {
        console.log('BFF login failed, trying direct API...');
        // If BFF fails, try direct API
        const directApiClient = axios.create({
          baseURL: 'https://backoffice-veiculos-api-production.up.railway.app',
          timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        response = await directApiClient.post<any>('/api/users/login', {
          email,
          password,
        });
      }
      
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Vehicles (BFF uses English endpoints)
  async getVehicles(filters?: VehicleFilters & { page?: number; limit?: number }): Promise<VehicleListResponse> {
    // Map filter names to API parameter names
    const apiFilters: any = {};
    
    if (filters) {
      if (filters.brand) apiFilters.brand = filters.brand;
      if (filters.vehicleModel) apiFilters.model = filters.vehicleModel;
      if (filters.yearMin) apiFilters.minYear = filters.yearMin;
      if (filters.yearMax) apiFilters.maxYear = filters.yearMax;
      if (filters.priceMin) apiFilters.minPrice = filters.priceMin;
      if (filters.priceMax) apiFilters.maxPrice = filters.priceMax;
      if (filters.fuelType) apiFilters.fuelType = filters.fuelType;
      if (filters.transmission) apiFilters.transmission = filters.transmission;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.condition) apiFilters.condition = filters.condition;
      if (filters.search) apiFilters.search = filters.search;
      if (filters.page) apiFilters.page = filters.page;
      if (filters.limit) apiFilters.limit = filters.limit;
    }

    const response = await this.client.get<any>('/api/vehicles', {
      params: apiFilters,
    });
    
    // Map the API response to our expected structure
    const apiData = response.data;
    
    // Debug log to understand the response structure
    if (process.env.NODE_ENV === 'production') {
      console.log('API Response Structure:', {
        hasData: !!apiData.data,
        dataType: typeof apiData.data,
        isArray: Array.isArray(apiData.data),
        hasNestedData: !!apiData.data?.data,
        nestedDataType: typeof apiData.data?.data,
        isNestedArray: Array.isArray(apiData.data?.data)
      });
    }
    
    return {
      vehicles: apiData.data?.data || apiData.data || apiData.vehicles || [],
      total: apiData.data?.pagination?.total || apiData.pagination?.total || apiData.total || 0,
      page: apiData.data?.pagination?.page || apiData.pagination?.page || apiData.page || 1,
      limit: apiData.data?.pagination?.limit || apiData.pagination?.limit || apiData.limit || 25,
      totalPages: apiData.data?.pagination?.totalPages || apiData.pagination?.totalPages || apiData.totalPages || 0
    };
  }

  async getVehicle(id: string): Promise<Vehicle> {
    const response = await this.client.get<any>(`/api/vehicles/${id}`);
    return response.data.data || response.data;
  }

  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    const response = await this.client.post<any>('/api/vehicles', data);
    return response.data.data || response.data;
  }

  async updateVehicle(id: string, data: UpdateVehicleRequest): Promise<Vehicle> {
    const response = await this.client.put<any>(`/api/vehicles/${id}`, data);
    return response.data.data || response.data;
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

  // Validar e substituir URLs de imagens inválidas
  async validateAndReplaceImages(images: string[]): Promise<string[]> {
    const validImages: string[] = [];
    
    for (const imageUrl of images) {
      try {
        // Verificar se é uma URL do Unsplash que pode causar problemas
        if (imageUrl.includes('images.unsplash.com')) {
          // Substituir por uma imagem placeholder válida
          validImages.push('https://via.placeholder.com/400x300/cccccc/666666?text=Imagem+do+Veículo');
        } else {
          // Testar se a imagem é acessível
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (response.ok) {
            validImages.push(imageUrl);
          } else {
            // Substituir por placeholder se não for acessível
            validImages.push('https://via.placeholder.com/400x300/cccccc/666666?text=Imagem+do+Veículo');
          }
        }
      } catch (error) {
        // Em caso de erro, usar placeholder
        validImages.push('https://via.placeholder.com/400x300/cccccc/666666?text=Imagem+do+Veículo');
      }
    }
    
    return validImages;
  }
}

export const apiClient = new ApiClient();
