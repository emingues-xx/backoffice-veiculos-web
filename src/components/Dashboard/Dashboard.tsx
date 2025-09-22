import { useDashboardMetrics } from '@/hooks/useDashboard';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  ChartBarIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { ChartCard, SimpleBarChart, SimpleLineChart, SimplePieChart } from './ChartCard';
import { MetricCard } from './MetricCard';

export const Dashboard: React.FC = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center">
                <div className="p-3 rounded-md bg-gray-200 h-12 w-12"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro ao carregar dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do sistema de veículos
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Veículos"
          value={formatNumber(metrics.totalVehicles)}
          icon={TruckIcon}
          color="blue"
        />
        <MetricCard
          title="Veículos Ativos"
          value={formatNumber(metrics.activeVehicles)}
          icon={CheckCircleIcon}
          color="green"
        />
        <MetricCard
          title="Vendas do Mês"
          value={formatNumber(metrics.monthlySales)}
          icon={ChartBarIcon}
          color="yellow"
        />
        <MetricCard
          title="Receita do Mês"
          value={formatCurrency(metrics.monthlyRevenue)}
          icon={CurrencyDollarIcon}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Month */}
        <ChartCard title="Vendas por Mês">
          <SimpleLineChart
            data={metrics.salesByMonth.map(item => ({
              name: item.month,
              value: item.sales,
            }))}
          />
        </ChartCard>

        {/* Vehicles by Category */}
        <ChartCard title="Veículos por Categoria">
          <SimplePieChart
            data={metrics.vehiclesByCategory.map(item => ({
              name: item.category,
              value: item.quantity,
            }))}
          />
        </ChartCard>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <ChartCard title="Receita por Mês">
          <SimpleBarChart
            data={metrics.salesByMonth.map(item => ({
              name: item.month,
              value: item.revenue,
            }))}
          />
        </ChartCard>

        {/* Top Brands */}
        <ChartCard title="Top Marcas">
          <SimpleBarChart
            data={metrics.topBrands.map(item => ({
              name: item.brand,
              value: item.sales,
            }))}
          />
        </ChartCard>
      </div>
    </div>
  );
};