export interface DashboardMetrics {
  totalVehicles: number;
  activeVehicles: number;
  soldVehicles: number;
  monthlySales: number;
  monthlyRevenue: number;
  totalRevenue: number;
  vehiclesByCategory: {
    category: string;
    quantity: number;
  }[];
  salesByMonth: {
    month: string;
    sales: number;
    revenue: number;
  }[];
  topBrands: {
    brand: string;
    quantity: number;
    sales: number;
  }[];
}

export interface Sale {
  _id: string;
  vehicleId: string;
  vehicle: {
    brand: string;
    vehicleModel: string;
    year: number;
  };
  buyer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  seller: {
    id: string;
    name: string;
  };
  salePrice: number;
  commission: number;
  paymentMethod: 'cash' | 'financing' | 'trade-in';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleRequest {
  vehicleId: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  salePrice: number;
  commission?: number;
  paymentMethod: 'cash' | 'financing' | 'trade-in';
  notes?: string;
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface SaleFilters {
  status?: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'financing' | 'trade-in';
  dateFrom?: string;
  dateTo?: string;
  sellerId?: string;
  page?: number;
  limit?: number;
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  completedSales: number;
  pendingSales: number;
  cancelledSales: number;
  averageSalePrice: number;
  salesByMonth: {
    month: string;
    sales: number;
    revenue: number;
  }[];
}
