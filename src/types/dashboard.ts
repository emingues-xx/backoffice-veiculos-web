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
  id: string;
  vehicleId: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
  price: number;
  saleDate: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  seller: {
    id: string;
    name: string;
  };
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
