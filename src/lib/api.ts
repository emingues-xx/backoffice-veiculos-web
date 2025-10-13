import { ApiError, ApiResponse, HealthCheck } from '@/types/api';
import { DashboardMetrics, SalesResponse } from '@/types/dashboard';
import { CreateVehicleRequest, UpdateVehicleRequest, Vehicle, VehicleFilters, VehicleListResponse } from '@/types/vehicle';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use relative URLs on client side (leverages Next.js rewrites)
    // Use direct BFF URL on server side
    // In development (localhost), always use direct API to avoid SSL issues
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseURL = typeof window !== 'undefined' 
      ? (isLocalhost ? 'https://backoffice-veiculos-api-production.up.railway.app' : '') // Use direct API on localhost
      : (process.env.BFF_BASE_URL || 'https://backoffice-veiculos-bff-production.up.railway.app');
    
    // Debug log for environment variables
    console.log('API Client Configuration:');
    console.log('- BFF_BASE_URL:', process.env.BFF_BASE_URL);
    console.log('- NEXT_PUBLIC_BFF_BASE_URL:', process.env.NEXT_PUBLIC_BFF_BASE_URL);
    console.log('- API_TIMEOUT:', process.env.NEXT_PUBLIC_API_TIMEOUT);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Is Localhost:', isLocalhost);
    console.log('- Base URL:', baseURL);
    
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
      (response: AxiosResponse) => {
        // Fix UTF-8 encoding issues
        if (response.data) {
          response.data = this.fixUtf8Encoding(response.data);
        }
        return response;
      },
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

  // Fix UTF-8 encoding issues
  private fixUtf8Encoding(data: any): any {
    if (typeof data === 'string') {
      // Try to fix common encoding issues
      return data
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/â€"/g, '–')
        .replace(/â€"/g, '—')
        .replace(/â€¦/g, '…')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã¢/g, 'â')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã /g, 'à')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã£/g, 'ã')
        .replace(/Ãµ/g, 'õ')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã‡/g, 'Ç')
        .replace(/Ãƒ/g, 'Ã')
        .replace(/Ã"/g, 'Ó')
        .replace(/Ãš/g, 'Ú');
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.fixUtf8Encoding(item));
    }
    
    if (data && typeof data === 'object') {
      const fixed: any = {};
      for (const [key, value] of Object.entries(data)) {
        fixed[key] = this.fixUtf8Encoding(value);
      }
      return fixed;
    }
    
    return data;
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
      
      // In development or localhost, use direct API to avoid SSL/CORS issues
      const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      if (process.env.NODE_ENV === 'development' || isLocalhost) {
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
        // API direta retorna { token, user } diretamente
        return response.data;
      }
      
      // In production, try BFF first, then fallback to direct API
      let response;
      try {
        response = await this.client.post<any>('/api/auth/login', {
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
      
      // BFF retorna { success: true, data: { token, user } }
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
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
    if (!images || images.length === 0) return [];
    
    // URLs de imagens que funcionam em dev e prod (sem CORS)
    const corsFreeImageServices = [
      'https://picsum.photos/400/300?random=',
      'https://via.placeholder.com/400x300/cccccc/666666?text=Vehicle+',
      'https://images.unsplash.com/photo-',
      'https://source.unsplash.com/400x300/?car,',
      'https://picsum.photos/400/300?grayscale&random='
    ];
    
    // Se não há imagens válidas ou são URLs problemáticas, usar imagens CORS-free
    const hasValidImages = images.some(img => 
      img && 
      !img.includes('webmotors.com.br') && 
      !img.includes('images.unsplash.com') &&
      (img.startsWith('https://') || img.startsWith('http://'))
    );
    
    if (!hasValidImages || images.length === 0) {
      console.log('Using CORS-free images for better compatibility');
      return images.map((_, index) => {
        const serviceIndex = index % corsFreeImageServices.length;
        const baseUrl = corsFreeImageServices[serviceIndex];
        
        if (baseUrl.includes('picsum.photos')) {
          return `${baseUrl}${index + 1}`;
        } else if (baseUrl.includes('placeholder.com')) {
          return `${baseUrl}${index + 1}`;
        } else if (baseUrl.includes('unsplash.com')) {
          return `${baseUrl}${index + 1}`;
        } else {
          return `${baseUrl}${index + 1}`;
        }
      });
    }
    
    // Se há imagens válidas, tentar validar (apenas em produção)
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    if (isLocalhost || process.env.NODE_ENV === 'development') {
      console.log('Development mode: using CORS-free images');
      return images.map((_, index) => {
        const serviceIndex = index % corsFreeImageServices.length;
        const baseUrl = corsFreeImageServices[serviceIndex];
        return `${baseUrl}${index + 1}`;
      });
    }
    
    // Em produção, tentar validar as imagens originais
    const validImages: string[] = [];
    for (const imageUrl of images) {
      try {
        // Verificar se é uma URL problemática
        if (imageUrl.includes('webmotors.com.br') || imageUrl.includes('images.unsplash.com')) {
          // Substituir por uma imagem CORS-free
          const serviceIndex = validImages.length % corsFreeImageServices.length;
          const baseUrl = corsFreeImageServices[serviceIndex];
          validImages.push(`${baseUrl}${validImages.length + 1}`);
        } else {
          // Testar se a imagem é acessível
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (response.ok) {
            validImages.push(imageUrl);
          } else {
            // Substituir por imagem CORS-free
            const serviceIndex = validImages.length % corsFreeImageServices.length;
            const baseUrl = corsFreeImageServices[serviceIndex];
            validImages.push(`${baseUrl}${validImages.length + 1}`);
          }
        }
      } catch (error) {
        // Em caso de erro, usar imagem CORS-free
        const serviceIndex = validImages.length % corsFreeImageServices.length;
        const baseUrl = corsFreeImageServices[serviceIndex];
        validImages.push(`${baseUrl}${validImages.length + 1}`);
      }
    }
    
    return validImages;
  }
}

export const apiClient = new ApiClient();
