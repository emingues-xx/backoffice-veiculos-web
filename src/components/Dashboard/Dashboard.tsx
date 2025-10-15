import React from 'react';
import { useMetrics } from '@/hooks/useMetrics';
import { useFilters } from '@/hooks/useFilters';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';
import { MetricCard } from './MetricCard';
import { MetricCardSkeleton } from '@/components/MetricCardSkeleton';
import { SalesChart } from '@/components/SalesChart';
import { FilterBar } from '@/components/FilterBar';
import { EmptyState } from '@/components/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage';
import {
  TrendingUp,
  DollarSign,
  Users,
  Car,
  BarChart3,
  PieChart
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { filters, getApiFilters } = useFilters();
  const { data: metrics, isLoading, error, refetch } = useMetrics(getApiFilters());



  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar dashboard"
        message="Não foi possível carregar os dados do dashboard."
        details={error instanceof Error ? error.message : String(error)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <FilterBar
        onFiltersChange={() => {
          // Filters are automatically applied via useMetrics hook
        }}
        showDateRange={true}
        showSearch={false}
        showSellerFilter={true}
        showPeriodFilter={true}
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Receita Total"
          value={formatCurrency(metrics.revenue?.totalRevenue || 0)}
          icon={DollarSign}
          color="green"
          change={metrics.totalSales?.growth ? {
            value: Math.abs(metrics.totalSales.growth),
            type: metrics.totalSales.growth > 0 ? 'increase' : 'decrease'
          } : undefined}
        />
        <MetricCard
          title="Total de Vendas"
          value={formatNumber(metrics.totalSales?.totalSales || 0)}
          icon={TrendingUp}
          color="blue"
          change={metrics.totalSales?.growth ? {
            value: Math.abs(metrics.totalSales.growth),
            type: metrics.totalSales.growth > 0 ? 'increase' : 'decrease'
          } : undefined}
        />
        <MetricCard
          title="Melhor Vendedor"
          value={metrics.topSellers?.topSellers?.[0]?.sellerName || 'N/A'}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(
            metrics.totalSales?.totalSales && metrics.totalSales.totalSales > 0 
              ? (metrics.totalSales.totalRevenue / metrics.totalSales.totalSales)
              : 0
          )}
          icon={BarChart3}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Day */}
        <SalesChart
          title="Vendas por Dia"
          data={metrics.salesByDay?.salesByDay || []}
          xKey="date"
          yKey="revenue"
          type="line"
          height={300}
        />

        {/* Top Sellers */}
        <SalesChart
          title="Melhores Vendedores"
          data={metrics.topSellers?.topSellers || []}
          xKey="sellerName"
          yKey="revenue"
          type="bar"
          height={300}
        />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Count by Day */}
        <SalesChart
          title="Quantidade de Vendas por Dia"
          data={metrics.salesByDay?.salesByDay || []}
          xKey="date"
          yKey="count"
          type="area"
          height={300}
        />

        {/* Revenue vs Sales */}
        <SalesChart
          title="Receita vs Vendas"
          data={metrics.salesByDay?.salesByDay || []}
          xKey="date"
          yKey="revenue"
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
};