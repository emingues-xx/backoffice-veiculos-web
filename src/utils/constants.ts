export const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'ethanol', label: 'Etanol' },
  { value: 'flex', label: 'Flex' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Elétrico' },
  { value: 'hybrid', label: 'Híbrido' },
] as const;

export const TRANSMISSION_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automático' },
  { value: 'cvt', label: 'CVT' },
] as const;

export const VEHICLE_CATEGORIES = [
  { value: 'hatch', label: 'Hatch' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'truck', label: 'Caminhão' },
  { value: 'motorcycle', label: 'Moto' },
] as const;

export const VEHICLE_STATUS = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'sold', label: 'Vendido' },
  { value: 'reserved', label: 'Reservado' },
] as const;

export const POPULAR_BRANDS = [
  'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Fiat', 'Hyundai', 'Nissan', 'Renault', 'Peugeot'
];

export const POPULAR_COLORS = [
  'Branco', 'Preto', 'Prata', 'Cinza', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Marrom', 'Dourado'
];

export const PAGINATION_LIMITS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;