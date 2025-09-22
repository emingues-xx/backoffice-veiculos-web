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
    case 'ativo':
      return 'bg-green-100 text-green-800';
    case 'inativo':
      return 'bg-gray-100 text-gray-800';
    case 'vendido':
      return 'bg-blue-100 text-blue-800';
    case 'reservado':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'ativo':
      return 'Ativo';
    case 'inativo':
      return 'Inativo';
    case 'vendido':
      return 'Vendido';
    case 'reservado':
      return 'Reservado';
    default:
      return status;
  }
};

export const getCombustivelLabel = (combustivel: string): string => {
  switch (combustivel) {
    case 'gasolina':
      return 'Gasolina';
    case 'etanol':
      return 'Etanol';
    case 'flex':
      return 'Flex';
    case 'diesel':
      return 'Diesel';
    case 'eletrico':
      return 'Elétrico';
    case 'hibrido':
      return 'Híbrido';
    default:
      return combustivel;
  }
};

export const getCambioLabel = (cambio: string): string => {
  switch (cambio) {
    case 'manual':
      return 'Manual';
    case 'automatico':
      return 'Automático';
    case 'cvt':
      return 'CVT';
    default:
      return cambio;
  }
};

export const getCategoriaLabel = (categoria: string): string => {
  switch (categoria) {
    case 'hatch':
      return 'Hatch';
    case 'sedan':
      return 'Sedan';
    case 'suv':
      return 'SUV';
    case 'pickup':
      return 'Pickup';
    case 'caminhao':
      return 'Caminhão';
    case 'moto':
      return 'Moto';
    default:
      return categoria;
  }
};
