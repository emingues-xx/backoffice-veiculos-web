import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type ChartType = 'line' | 'bar' | 'area';

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  [key: string]: any;
}

export interface ChartConfig {
  type: ChartType;
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
    background: string;
    text: string;
    grid: string;
  };
  dimensions: {
    width: number;
    height: number;
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  animations: {
    duration: number;
    easing: string;
  };
}

export const CHART_TYPES: { label: string; value: ChartType; icon: string }[] = [
  { label: 'Linha', value: 'line', icon: '📈' },
  { label: 'Barras', value: 'bar', icon: '📊' },
  { label: 'Área', value: 'area', icon: '📉' }
];

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  type: 'line',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    gradient: 'url(#gradient)',
    background: '#FFFFFF',
    text: '#374151',
    grid: '#E5E7EB'
  },
  dimensions: {
    width: 800,
    height: 400,
    margin: {
      top: 20,
      right: 30,
      bottom: 60,
      left: 60
    }
  },
  animations: {
    duration: 750,
    easing: 'ease-out'
  }
};

export const MOBILE_CHART_CONFIG: ChartConfig = {
  ...DEFAULT_CHART_CONFIG,
  dimensions: {
    width: 350,
    height: 250,
    margin: {
      top: 15,
      right: 20,
      bottom: 50,
      left: 40
    }
  }
};

export const formatXAxisLabel = (value: string | number): string => {
  if (typeof value === 'string') {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      // Formatação baseada no período dos dados
      const now = new Date();
      const diffInDays = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffInDays <= 7) {
        return format(date, 'dd/MM', { locale: ptBR });
      } else if (diffInDays <= 365) {
        return format(date, 'MMM/yy', { locale: ptBR });
      } else {
        return format(date, 'yyyy', { locale: ptBR });
      }
    } catch {
      return value;
    }
  }
  return value.toString();
};

export const formatYAxisLabel = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatTooltipValue = (value: number, name: string): [string, string] => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);

  return [formattedValue, name];
};

export const formatTooltipLabel = (label: string): string => {
  try {
    const date = new Date(label);
    if (isNaN(date.getTime())) return label;
    
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return label;
  }
};

export const getResponsiveConfig = (isMobile: boolean): ChartConfig => {
  return isMobile ? MOBILE_CHART_CONFIG : DEFAULT_CHART_CONFIG;
};

export const generateGradientDefs = (id: string, color: string): JSX.Element => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
      <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
    </linearGradient>
  </defs>
);

export const getChartColors = (index: number): string[] => {
  const colorPalettes = [
    ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    ['#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'],
    ['#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
  ];
  
  return colorPalettes[index % colorPalettes.length];
};

export const calculateOptimalTickCount = (dataLength: number, isMobile: boolean): number => {
  if (isMobile) {
    return Math.min(5, Math.max(3, Math.floor(dataLength / 3)));
  }
  return Math.min(10, Math.max(5, Math.floor(dataLength / 2)));
};

export const shouldShowDataLabels = (dataLength: number, isMobile: boolean): boolean => {
  if (isMobile) return dataLength <= 5;
  return dataLength <= 10;
};

export const getAnimationProps = (isVisible: boolean) => ({
  isAnimationActive: isVisible,
  animationDuration: DEFAULT_CHART_CONFIG.animations.duration,
  animationEasing: DEFAULT_CHART_CONFIG.animations.easing
});

export const createCustomTooltip = (labelFormatter?: (label: string) => string) => {
  return ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {labelFormatter ? labelFormatter(label) : formatTooltipLabel(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatTooltipValue(entry.value, entry.name)[0]}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
};

export const createCustomLabel = (formatter?: (value: number) => string) => {
  return ({ x, y, value }: any) => {
    if (value === 0) return null;
    
    return (
      <text
        x={x}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize="12"
        fontWeight="500"
      >
        {formatter ? formatter(value) : formatYAxisLabel(value)}
      </text>
    );
  };
};
