import React, { useState, useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartType, ChartConfig, getResponsiveConfig, formatXAxisLabel, formatYAxisLabel, createCustomTooltip, generateGradientDefs } from '@/utils/chartConfig';
import { useChartData } from '@/hooks/useChartData';
import { EmptyState } from './EmptyState';

interface SalesChartProps {
  data: any[];
  type?: ChartType;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showDataLabels?: boolean;
  color?: string;
  className?: string;
  onTypeChange?: (type: ChartType) => void;
  onDataClick?: (data: any) => void;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  xKey?: string;
  yKey?: string;
  dateFormat?: string;
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  type = 'line',
  title,
  height = 400,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  showDataLabels = false,
  color = '#3B82F6',
  className = '',
  onTypeChange,
  onDataClick,
  loading = false,
  error,
  emptyMessage = 'Nenhum dado disponível para exibir',
  xKey = 'date',
  yKey = 'value',
  dateFormat = 'dd/MM'
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Detectar se é mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Processar dados do gráfico
  const chartData = useChartData({
    data,
    xKey,
    yKey,
    dateFormat,
    valueFormatter: (value) => typeof value === 'number' ? value : 0,
    labelFormatter: (date) => {
      try {
        return formatXAxisLabel(date);
      } catch {
        return date;
      }
    }
  });

  // Configuração responsiva
  const config = useMemo(() => getResponsiveConfig(isMobile), [isMobile]);

  // Tooltip customizado
  const customTooltip = useMemo(() => createCustomTooltip(), []);

  // Renderizar gráfico baseado no tipo
  const renderChart = useCallback(() => {
    if (!chartData.data || chartData.data.length === 0) {
      return (
        <EmptyState
          title={emptyMessage}
          description="Não há dados suficientes para exibir o gráfico."
          type="no-data"
        />
      );
    }

    const commonProps = {
      data: chartData.data,
      margin: config.dimensions.margin,
      onClick: onDataClick
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={config.colors.grid} />}
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke={config.colors.text}
              fontSize={isMobile ? 10 : 12}
            />
            <YAxis 
              tickFormatter={formatYAxisLabel}
              stroke={config.colors.text}
              fontSize={isMobile ? 10 : 12}
            />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              {...getAnimationProps(isVisible)}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={config.colors.grid} />}
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke={config.colors.text}
              fontSize={isMobile ? 10 : 12}
            />
            <YAxis 
              tickFormatter={formatYAxisLabel}
              stroke={config.colors.text}
              fontSize={isMobile ? 10 : 12}
            />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
              {...getAnimationProps(isVisible)}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {/* Gradient definitions would go here */}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={config.colors.grid} />}
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke={config.colors.text}
              fontSize={isMobile ? 10 : 12}
            />
            <YAxis 
              tickFormatter={formatYAxisLabel}
              stroke={config.colors.text}
              fontSize={isMobile ? 10 : 12}
            />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill="url(#gradient)"
              strokeWidth={2}
              {...getAnimationProps(isVisible)}
            />
          </AreaChart>
        );

      default:
        return null;
    }
  }, [type, chartData.data, config, color, showGrid, showTooltip, showLegend, customTooltip, isMobile, isVisible, onDataClick, emptyMessage]);

  // Toggle de tipo de gráfico
  const handleTypeChange = useCallback((newType: ChartType) => {
    if (onTypeChange) {
      onTypeChange(newType);
    }
  }, [onTypeChange]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <EmptyState
          title="Erro ao carregar gráfico"
          description={error}
          type="error"
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        
        {/* Type Toggle */}
        {onTypeChange && (
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['line', 'bar', 'area'] as ChartType[]).map((chartType) => (
              <button
                key={chartType}
                onClick={() => handleTypeChange(chartType)}
                className={`
                  px-3 py-1 text-sm font-medium rounded-md transition-colors
                  ${type === chartType
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {chartType === 'line' && '📈'}
                {chartType === 'bar' && '📊'}
                {chartType === 'area' && '📉'}
                <span className="ml-1 capitalize">{chartType}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>No chart data</div>}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      {chartData.data && chartData.data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-500">Total</div>
            <div className="font-semibold text-gray-900">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0
              }).format(chartData.totalValue)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Média</div>
            <div className="font-semibold text-gray-900">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0
              }).format(chartData.averageValue)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Máximo</div>
            <div className="font-semibold text-gray-900">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0
              }).format(chartData.maxValue)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Pontos</div>
            <div className="font-semibold text-gray-900">{chartData.dataPoints}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para props de animação
const getAnimationProps = (isVisible: boolean) => ({
  isAnimationActive: isVisible,
  animationDuration: 750,
  animationEasing: 'ease-out' as any
});

export default SalesChart;
