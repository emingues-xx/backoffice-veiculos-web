export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: 'gasoline' | 'ethanol' | 'flex' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic' | 'cvt';
  color: string;
  doors: number;
  category: 'hatch' | 'sedan' | 'suv' | 'pickup' | 'truck' | 'motorcycle';
  status: 'active' | 'inactive' | 'sold' | 'reserved';
  description?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateVehicleRequest {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: Vehicle['fuel'];
  transmission: Vehicle['transmission'];
  color: string;
  doors: number;
  category: Vehicle['category'];
  description?: string;
  images?: string[];
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  status?: Vehicle['status'];
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuel?: Vehicle['fuel'];
  transmission?: Vehicle['transmission'];
  category?: Vehicle['category'];
  status?: Vehicle['status'];
  search?: string;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
