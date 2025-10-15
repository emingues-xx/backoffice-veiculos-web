import { useMemo } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { ChartDataPoint, ChartConfig } from '@/utils/chartConfig';

export interface ChartDataHookOptions {
  data: any[];
  xKey: string;
  yKey: string;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFormat?: string;
  valueFormatter?: (value: any) => any;
  labelFormatter?: (label: any) => string;
}

export interface ProcessedChartData {
  data: ChartDataPoint[];
  maxValue: number;
  minValue: number;
  totalValue: number;
  averageValue: number;
  dataPoints: number;
}

export const useChartData = (options: ChartDataHookOptions): ProcessedChartData => {
  const {
    data,
    xKey,
    yKey,
    groupBy,
    sortBy = xKey,
    sortOrder = 'asc',
    dateFormat = 'yyyy-MM-dd',
    valueFormatter,
    labelFormatter
  } = options;

  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        data: [],
        maxValue: 0,
        minValue: 0,
        totalValue: 0,
        averageValue: 0,
        dataPoints: 0
      };
    }

    // Processar dados
    let processedData = data.map(item => {
      let xValue = item[xKey];
      let yValue = item[yKey];

      // Formatar valor Y se necessário
      if (valueFormatter) {
        yValue = valueFormatter(yValue);
      }

      // Formatar label X se necessário
      if (labelFormatter) {
        xValue = labelFormatter(xValue);
      }

      // Processar datas
      if (typeof xValue === 'string' && dateFormat) {
        try {
          const date = parseISO(xValue);
          if (isValid(date)) {
            xValue = format(date, dateFormat);
          }
        } catch {
          // Manter valor original se não conseguir parsear
        }
      }

      return {
        date: xValue,
        value: yValue,
        label: xValue,
        ...item
      };
    });

    // Agrupar dados se necessário
    if (groupBy) {
      const grouped = processedData.reduce((acc, item) => {
        const key = item[groupBy];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      // Processar grupos (somar valores, etc.)
      processedData = Object.entries(grouped).map(([key, items]) => {
        const totalValue = (items as any[]).reduce((sum: number, item: any) => sum + (item.value || 0), 0);
        return {
          date: key,
          value: totalValue,
          label: key,
          count: (items as any[]).length,
          items
        };
      });
    }

    // Ordenar dados
    processedData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Calcular estatísticas
    const values = processedData.map(item => item.value || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const totalValue = values.reduce((sum, value) => sum + value, 0);
    const averageValue = values.length > 0 ? totalValue / values.length : 0;

    return {
      data: processedData,
      maxValue,
      minValue,
      totalValue,
      averageValue,
      dataPoints: processedData.length
    };
  }, [data, xKey, yKey, groupBy, sortBy, sortOrder, dateFormat, valueFormatter, labelFormatter]);
};

// Hook específico para dados de vendas
export const useSalesChartData = (salesData: any[]) => {
  return useChartData({
    data: salesData,
    xKey: 'date',
    yKey: 'revenue',
    dateFormat: 'dd/MM',
    valueFormatter: (value) => typeof value === 'number' ? value : 0,
    labelFormatter: (date) => {
      try {
        return format(parseISO(date), 'dd/MM');
      } catch {
        return date;
      }
    }
  });
};

// Hook específico para dados de contagem
export const useCountChartData = (countData: any[]) => {
  return useChartData({
    data: countData,
    xKey: 'date',
    yKey: 'count',
    dateFormat: 'dd/MM',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de vendedores
export const useSellersChartData = (sellersData: any[]) => {
  return useChartData({
    data: sellersData,
    xKey: 'sellerName',
    yKey: 'revenue',
    sortBy: 'revenue',
    sortOrder: 'desc',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de produtos/categorias
export const useCategoryChartData = (categoryData: any[]) => {
  return useChartData({
    data: categoryData,
    xKey: 'category',
    yKey: 'count',
    sortBy: 'count',
    sortOrder: 'desc',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de performance temporal
export const usePerformanceChartData = (performanceData: any[]) => {
  return useChartData({
    data: performanceData,
    xKey: 'date',
    yKey: 'performance',
    dateFormat: 'dd/MM',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de comparação (antes/depois)
export const useComparisonChartData = (comparisonData: any[]) => {
  return useChartData({
    data: comparisonData,
    xKey: 'period',
    yKey: 'value',
    groupBy: 'type',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de tendência
export const useTrendChartData = (trendData: any[]) => {
  return useChartData({
    data: trendData,
    xKey: 'date',
    yKey: 'value',
    dateFormat: 'dd/MM',
    sortBy: 'date',
    sortOrder: 'asc',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de distribuição
export const useDistributionChartData = (distributionData: any[]) => {
  return useChartData({
    data: distributionData,
    xKey: 'range',
    yKey: 'count',
    sortBy: 'range',
    sortOrder: 'asc',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de correlação
export const useCorrelationChartData = (correlationData: any[]) => {
  return useChartData({
    data: correlationData,
    xKey: 'x',
    yKey: 'y',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de funil
export const useFunnelChartData = (funnelData: any[]) => {
  return useChartData({
    data: funnelData,
    xKey: 'stage',
    yKey: 'value',
    sortBy: 'order',
    sortOrder: 'asc',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};

// Hook para dados de mapa de calor
export const useHeatmapChartData = (heatmapData: any[]) => {
  return useChartData({
    data: heatmapData,
    xKey: 'x',
    yKey: 'y',
    groupBy: 'category',
    valueFormatter: (value) => typeof value === 'number' ? value : 0
  });
};
