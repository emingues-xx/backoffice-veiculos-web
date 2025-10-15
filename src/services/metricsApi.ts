import { apiClient } from '@/lib/api';
import { formatDateForAPI } from '@/utils/dateValidation';

export interface MetricsFilters {
  startDate?: Date | null;
  endDate?: Date | null;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  sellerId?: string;
}

export interface RevenueData {
  totalRevenue: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface SalesByDayData {
  salesByDay: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface TopSellerData {
  sellerId: string;
  sellerName: string;
  salesCount: number;
  revenue: number;
  commission: number;
}

export interface TopSellersData {
  topSellers: TopSellerData[];
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface TotalSalesData {
  totalSales: number;
  totalRevenue: number;
  period: {
    startDate: string;
    endDate: string;
  };
  growth: number;
}

export interface MetricsData {
  revenue: RevenueData;
  salesByDay: SalesByDayData;
  topSellers: TopSellersData;
  totalSales: TotalSalesData;
}

class MetricsApiService {
  private apiClient = apiClient;

  private buildQueryParams(filters: MetricsFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.startDate) {
      params.startDate = formatDateForAPI(filters.startDate) || '';
    }

    if (filters.endDate) {
      params.endDate = formatDateForAPI(filters.endDate) || '';
    }

    if (filters.period) {
      params.period = filters.period;
    }

    if (filters.sellerId) {
      params.sellerId = filters.sellerId;
    }

    return params;
  }

  async getRevenue(filters: MetricsFilters = {}): Promise<RevenueData> {
    const params = this.buildQueryParams(filters);
    const response = await this.apiClient.request('GET', '/api/metrics/revenue', { params });
    return response.data;
  }

  async getSalesByDay(filters: MetricsFilters = {}): Promise<SalesByDayData> {
    const params = this.buildQueryParams(filters);
    const response = await this.apiClient.request('GET', '/api/metrics/sales-by-day', { params });
    return response.data;
  }

  async getTopSellers(filters: MetricsFilters = {}): Promise<TopSellersData> {
    const params = this.buildQueryParams(filters);
    const response = await this.apiClient.request('GET', '/api/metrics/top-sellers', { params });
    return response.data;
  }

  async getTotalSales(filters: MetricsFilters = {}): Promise<TotalSalesData> {
    const params = this.buildQueryParams(filters);
    const response = await this.apiClient.request('GET', '/api/metrics/total-sales', { params });
    return response.data;
  }

  async getAllMetrics(filters: MetricsFilters = {}): Promise<MetricsData> {
    const [revenue, salesByDay, topSellers, totalSales] = await Promise.all([
      this.getRevenue(filters),
      this.getSalesByDay(filters),
      this.getTopSellers(filters),
      this.getTotalSales(filters)
    ]);

    return {
      revenue,
      salesByDay,
      topSellers,
      totalSales
    };
  }

  // Métodos para exportação de dados
  async exportMetrics(filters: MetricsFilters = {}, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const params = this.buildQueryParams(filters);
    params.format = format;
    
    const response = await this.apiClient.request('GET', '/api/metrics/export', { 
      params,
      responseType: 'blob'
    });
    
    return response.data;
  }

  // Método para obter estatísticas resumidas
  async getMetricsSummary(filters: MetricsFilters = {}): Promise<{
    totalRevenue: number;
    totalSales: number;
    averageTicket: number;
    topSeller: TopSellerData | null;
    growthRate: number;
  }> {
    const [revenue, totalSales, topSellers] = await Promise.all([
      this.getRevenue(filters),
      this.getTotalSales(filters),
      this.getTopSellers(filters)
    ]);

    const averageTicket = totalSales.totalSales > 0 
      ? totalSales.totalRevenue / totalSales.totalSales 
      : 0;

    const topSeller = topSellers.topSellers.length > 0 
      ? topSellers.topSellers[0] 
      : null;

    return {
      totalRevenue: revenue.totalRevenue,
      totalSales: totalSales.totalSales,
      averageTicket,
      topSeller,
      growthRate: totalSales.growth
    };
  }
}

// Instância singleton
export const metricsApiService = new MetricsApiService();

// Funções utilitárias para uso direto
export const getRevenue = (filters?: MetricsFilters) => 
  metricsApiService.getRevenue(filters);

export const getSalesByDay = (filters?: MetricsFilters) => 
  metricsApiService.getSalesByDay(filters);

export const getTopSellers = (filters?: MetricsFilters) => 
  metricsApiService.getTopSellers(filters);

export const getTotalSales = (filters?: MetricsFilters) => 
  metricsApiService.getTotalSales(filters);

export const getAllMetrics = (filters?: MetricsFilters) => 
  metricsApiService.getAllMetrics(filters);

export const exportMetrics = (filters?: MetricsFilters, format?: 'csv' | 'xlsx') => 
  metricsApiService.exportMetrics(filters, format);

export const getMetricsSummary = (filters?: MetricsFilters) => 
  metricsApiService.getMetricsSummary(filters);

export default metricsApiService;
