import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;
  return `${Math.floor(diffInDays / 365)} anos atrás`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'sold':
      return 'bg-blue-100 text-blue-800';
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'inactive':
      return 'Inativo';
    case 'sold':
      return 'Vendido';
    case 'reserved':
      return 'Reservado';
    default:
      return status;
  }
};

export const getFuelLabel = (fuel: string): string => {
  switch (fuel) {
    case 'gasoline':
      return 'Gasolina';
    case 'ethanol':
      return 'Etanol';
    case 'flex':
      return 'Flex';
    case 'diesel':
      return 'Diesel';
    case 'electric':
      return 'Elétrico';
    case 'hybrid':
      return 'Híbrido';
    default:
      return fuel;
  }
};

export const getTransmissionLabel = (transmission: string): string => {
  switch (transmission) {
    case 'manual':
      return 'Manual';
    case 'automatic':
      return 'Automático';
    case 'cvt':
      return 'CVT';
    default:
      return transmission;
  }
};

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'hatch':
      return 'Hatch';
    case 'sedan':
      return 'Sedan';
    case 'suv':
      return 'SUV';
    case 'pickup':
      return 'Pickup';
    case 'truck':
      return 'Caminhão';
    case 'motorcycle':
      return 'Moto';
    default:
      return category;
  }
};