import type { Meta, StoryObj } from '@storybook/react';
import { SalesChart } from './SalesChart';

const meta: Meta<typeof SalesChart> = {
  title: 'Charts/SalesChart',
  component: SalesChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de gráfico para exibir dados de vendas com suporte a diferentes tipos (linha, barra, área).',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'bar', 'area'],
      description: 'Tipo do gráfico',
    },
    title: {
      control: 'text',
      description: 'Título do gráfico',
    },
    height: {
      control: 'number',
      description: 'Altura do gráfico em pixels',
    },
    color: {
      control: 'color',
      description: 'Cor do gráfico',
    },
    showLegend: {
      control: 'boolean',
      description: 'Mostrar legenda',
    },
    showGrid: {
      control: 'boolean',
      description: 'Mostrar grade',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Mostrar tooltip',
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento',
    },
    error: {
      control: 'text',
      description: 'Mensagem de erro',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SalesChart>;

const sampleData = [
  { date: '2024-01-01', value: 1000, count: 5 },
  { date: '2024-01-02', value: 1500, count: 8 },
  { date: '2024-01-03', value: 2000, count: 12 },
  { date: '2024-01-04', value: 1800, count: 10 },
  { date: '2024-01-05', value: 2200, count: 15 },
  { date: '2024-01-06', value: 1900, count: 11 },
  { date: '2024-01-07', value: 2500, count: 18 },
];

export const LineChart: Story = {
  args: {
    title: 'Vendas por Dia',
    data: sampleData,
    type: 'line',
    height: 300,
    color: '#3B82F6',
  },
};

export const BarChart: Story = {
  args: {
    title: 'Receita por Dia',
    data: sampleData,
    type: 'bar',
    height: 300,
    color: '#10B981',
  },
};

export const AreaChart: Story = {
  args: {
    title: 'Crescimento de Vendas',
    data: sampleData,
    type: 'area',
    height: 300,
    color: '#F59E0B',
  },
};

export const WithTypeToggle: Story = {
  args: {
    title: 'Gráfico Interativo',
    data: sampleData,
    type: 'line',
    height: 300,
    onTypeChange: (type) => console.log('Chart type changed to:', type),
  },
};

export const Loading: Story = {
  args: {
    title: 'Carregando Gráfico',
    data: [],
    type: 'line',
    height: 300,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    title: 'Erro no Gráfico',
    data: [],
    type: 'line',
    height: 300,
    error: 'Erro ao carregar dados do gráfico',
  },
};

export const EmptyData: Story = {
  args: {
    title: 'Sem Dados',
    data: [],
    type: 'line',
    height: 300,
    emptyMessage: 'Nenhum dado disponível para o período selecionado',
  },
};

export const CustomColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <SalesChart
        title="Vendas (Azul)"
        data={sampleData}
        type="line"
        height={200}
        color="#3B82F6"
      />
      <SalesChart
        title="Receita (Verde)"
        data={sampleData}
        type="bar"
        height={200}
        color="#10B981"
      />
      <SalesChart
        title="Crescimento (Amarelo)"
        data={sampleData}
        type="area"
        height={200}
        color="#F59E0B"
      />
      <SalesChart
        title="Performance (Roxo)"
        data={sampleData}
        type="line"
        height={200}
        color="#8B5CF6"
      />
    </div>
  ),
};

export const Responsive: Story = {
  args: {
    title: 'Gráfico Responsivo',
    data: sampleData,
    type: 'line',
    height: 400,
    showLegend: true,
    showGrid: true,
    showTooltip: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
};
