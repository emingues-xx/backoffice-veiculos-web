export interface Vehicle {
  _id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  color: string;
  doors: number;
  category: 'car' | 'motorcycle' | 'truck' | 'van';
  condition: 'new' | 'used';
  description: string;
  images: string[];
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  seller: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  brand: string;
  vehicleModel: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: Vehicle['fuelType'];
  transmission: Vehicle['transmission'];
  color: string;
  doors: number;
  category: Vehicle['category'];
  condition: Vehicle['condition'];
  description: string;
  images: string[];
  location: Vehicle['location'];
  seller: Vehicle['seller'];
  isFeatured: boolean;
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {}

export interface VehicleFilters {
  brand?: string;
  vehicleModel?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: Vehicle['fuelType'];
  transmission?: Vehicle['transmission'];
  category?: Vehicle['category'];
  condition?: Vehicle['condition'];
  search?: string;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
