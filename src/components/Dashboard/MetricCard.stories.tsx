import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';
import { DollarSign, TrendingUp, Users, Car } from 'lucide-react';

const meta: Meta<typeof MetricCard> = {
  title: 'Dashboard/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente para exibir métricas do dashboard com ícone, valor e indicador de mudança.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Título da métrica',
    },
    value: {
      control: 'text',
      description: 'Valor da métrica (string ou número)',
    },
    color: {
      control: 'select',
      options: ['blue', 'green', 'yellow', 'red', 'purple'],
      description: 'Cor do ícone',
    },
    change: {
      control: 'object',
      description: 'Indicador de mudança percentual',
    },
    icon: {
      control: false,
      description: 'Ícone do Lucide React',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    title: 'Receita Total',
    value: 'R$ 125.000',
    icon: DollarSign,
    color: 'green',
  },
};

export const WithIncrease: Story = {
  args: {
    title: 'Vendas do Mês',
    value: '1.250',
    icon: TrendingUp,
    color: 'blue',
    change: {
      value: 12.5,
      type: 'increase',
    },
  },
};

export const WithDecrease: Story = {
  args: {
    title: 'Novos Usuários',
    value: '89',
    icon: Users,
    color: 'purple',
    change: {
      value: 3.2,
      type: 'decrease',
    },
  },
};

export const NumericValue: Story = {
  args: {
    title: 'Total de Veículos',
    value: 1250,
    icon: Car,
    color: 'yellow',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        title="Receita"
        value="R$ 125.000"
        icon={DollarSign}
        color="blue"
        change={{ value: 5.2, type: 'increase' }}
      />
      <MetricCard
        title="Vendas"
        value="1.250"
        icon={TrendingUp}
        color="green"
        change={{ value: 8.1, type: 'increase' }}
      />
      <MetricCard
        title="Usuários"
        value="89"
        icon={Users}
        color="yellow"
        change={{ value: 2.3, type: 'decrease' }}
      />
      <MetricCard
        title="Veículos"
        value="45"
        icon={Car}
        color="red"
        change={{ value: 1.5, type: 'decrease' }}
      />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    title: 'Carregando...',
    value: '...',
    icon: DollarSign,
    color: 'blue',
  },
  decorators: [
    (Story) => (
      <div className="animate-pulse">
        <Story />
      </div>
    ),
  ],
};
