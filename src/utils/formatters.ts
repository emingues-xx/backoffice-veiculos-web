import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata valores monetários em reais (R$)
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return 'R$ 0,00';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
};

/**
 * Formata valores percentuais
 */
export const formatPercentage = (value: number | string | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0%';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numericValue / 100);
};

/**
 * Formata números inteiros com separadores de milhares
 */
export const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0';
  }

  return new Intl.NumberFormat('pt-BR').format(Math.round(numericValue));
};

/**
 * Formata números decimais com separadores de milhares
 */
export const formatDecimal = (value: number | string | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined || value === '') {
    return '0,00';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numericValue);
};

/**
 * Formata datas para exibição
 */
export const formatDate = (date: string | Date | null | undefined, pattern: string = 'dd/MM/yyyy'): string => {
  if (!date) return '';

  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = parseISO(date);
    if (!isValid(dateObj)) {
      return '';
    }
  } else {
    dateObj = date;
  }

  return format(dateObj, pattern, { locale: ptBR });
};

/**
 * Formata datas e horas para exibição
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Formata tempo em segundos para formato legível (HH:mm:ss)
 */
export const formatDuration = (seconds: number | string | null | undefined): string => {
  if (seconds === null || seconds === undefined || seconds === '') {
    return '00:00:00';
  }

  const numericSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
  
  if (isNaN(numericSeconds) || numericSeconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(numericSeconds / 3600);
  const minutes = Math.floor((numericSeconds % 3600) / 60);
  const remainingSeconds = Math.floor(numericSeconds % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formata tempo em minutos para formato legível
 */
export const formatMinutes = (minutes: number | string | null | undefined): string => {
  if (minutes === null || minutes === undefined || minutes === '') {
    return '0 min';
  }

  const numericMinutes = typeof minutes === 'string' ? parseFloat(minutes) : minutes;
  
  if (isNaN(numericMinutes) || numericMinutes < 0) {
    return '0 min';
  }

  if (numericMinutes < 60) {
    return `${Math.round(numericMinutes)} min`;
  }

  const hours = Math.floor(numericMinutes / 60);
  const remainingMinutes = Math.round(numericMinutes % 60);

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formata valores grandes com sufixos (K, M, B)
 */
export const formatCompactNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0';
  }

  if (numericValue < 1000) {
    return numericValue.toString();
  }

  if (numericValue < 1000000) {
    return `${(numericValue / 1000).toFixed(1)}K`;
  }

  if (numericValue < 1000000000) {
    return `${(numericValue / 1000000).toFixed(1)}M`;
  }

  return `${(numericValue / 1000000000).toFixed(1)}B`;
};

/**
 * Formata valores monetários compactos
 */
export const formatCompactCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return 'R$ 0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return 'R$ 0';
  }

  if (numericValue < 1000) {
    return `R$ ${numericValue.toFixed(0)}`;
  }

  if (numericValue < 1000000) {
    return `R$ ${(numericValue / 1000).toFixed(1)}K`;
  }

  if (numericValue < 1000000000) {
    return `R$ ${(numericValue / 1000000).toFixed(1)}M`;
  }

  return `R$ ${(numericValue / 1000000000).toFixed(1)}B`;
};

/**
 * Calcula a variação percentual entre dois valores
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

/**
 * Formata a variação percentual com sinal e cor
 */
export const formatPercentageChange = (current: number, previous: number): {
  value: string;
  isPositive: boolean;
  isNeutral: boolean;
} => {
  const change = calculatePercentageChange(current, previous);
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return {
    value: `${isPositive ? '+' : ''}${formatPercentage(Math.abs(change))}`,
    isPositive,
    isNeutral
  };
};