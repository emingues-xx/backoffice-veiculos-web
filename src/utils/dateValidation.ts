import { format, isValid, parseISO, differenceInDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DatePreset {
  label: string;
  value: string;
  getDateRange: () => DateRange;
}

export const DATE_PRESETS: DatePreset[] = [
  {
    label: 'Hoje',
    value: 'today',
    getDateRange: () => {
      const today = new Date();
      return {
        startDate: startOfDay(today),
        endDate: endOfDay(today)
      };
    }
  },
  {
    label: 'Última semana',
    value: 'lastWeek',
    getDateRange: () => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      return {
        startDate: startOfDay(lastWeek),
        endDate: endOfDay(today)
      };
    }
  },
  {
    label: 'Últimos 30 dias',
    value: 'last30Days',
    getDateRange: () => {
      const today = new Date();
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      return {
        startDate: startOfDay(last30Days),
        endDate: endOfDay(today)
      };
    }
  },
  {
    label: 'Último mês',
    value: 'lastMonth',
    getDateRange: () => {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      return {
        startDate: startOfDay(lastMonth),
        endDate: endOfDay(today)
      };
    }
  },
  {
    label: 'Último trimestre',
    value: 'lastQuarter',
    getDateRange: () => {
      const today = new Date();
      const lastQuarter = new Date(today);
      lastQuarter.setMonth(today.getMonth() - 3);
      return {
        startDate: startOfDay(lastQuarter),
        endDate: endOfDay(today)
      };
    }
  }
];

export const validateDateRange = (startDate: Date | null, endDate: Date | null): string | null => {
  if (!startDate && !endDate) {
    return null; // Ambos vazios é válido
  }

  if (startDate && !isValid(startDate)) {
    return 'Data de início inválida';
  }

  if (endDate && !isValid(endDate)) {
    return 'Data de fim inválida';
  }

  if (startDate && endDate) {
    if (startDate > endDate) {
      return 'Data de início deve ser anterior à data de fim';
    }

    const daysDifference = differenceInDays(endDate, startDate);
    if (daysDifference > 365) {
      return 'Período não pode ser maior que 1 ano';
    }
  }

  return null;
};

export const formatDateForAPI = (date: Date | null): string | null => {
  if (!date || !isValid(date)) {
    return null;
  }
  return format(date, 'yyyy-MM-dd');
};

export const formatDateForDisplay = (date: Date | null): string => {
  if (!date || !isValid(date)) {
    return '';
  }
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const parseDateFromString = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Tenta parsear como ISO string primeiro
  const isoDate = parseISO(dateString);
  if (isValid(isoDate)) {
    return isoDate;
  }

  // Tenta parsear como DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    if (isValid(date)) {
      return date;
    }
  }

  return null;
};

export const getDateRangeFromPreset = (presetValue: string): DateRange | null => {
  const preset = DATE_PRESETS.find(p => p.value === presetValue);
  return preset ? preset.getDateRange() : null;
};

export const isDateInRange = (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate && !endDate) return true;
  if (!startDate) return date <= endDate!;
  if (!endDate) return date >= startDate;
  return date >= startDate && date <= endDate;
};
