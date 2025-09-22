export const COMBUSTIVEIS = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol', label: 'Etanol' },
  { value: 'flex', label: 'Flex' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' },
] as const;

export const CAMBIOS = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automático' },
  { value: 'cvt', label: 'CVT' },
] as const;

export const CATEGORIAS = [
  { value: 'hatch', label: 'Hatch' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'caminhao', label: 'Caminhão' },
  { value: 'moto', label: 'Moto' },
] as const;

export const STATUS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'reservado', label: 'Reservado' },
] as const;

export const MARCAS_POPULARES = [
  'Volkswagen',
  'Fiat',
  'Chevrolet',
  'Ford',
  'Toyota',
  'Honda',
  'Hyundai',
  'Nissan',
  'Renault',
  'Peugeot',
  'Citroën',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volvo',
];

export const CORES_POPULARES = [
  'Branco',
  'Preto',
  'Prata',
  'Cinza',
  'Azul',
  'Vermelho',
  'Verde',
  'Amarelo',
  'Marrom',
  'Bege',
];

export const PAGINATION_LIMITS = [10, 25, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 25;
