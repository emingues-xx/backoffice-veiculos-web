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

  if (!metrics) {
    return null;
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
          value={formatNumber(metrics.totalVeiculos)}
          icon={TruckIcon}
          color="blue"
        />
        <MetricCard
          title="Veículos Ativos"
          value={formatNumber(metrics.veiculosAtivos)}
          icon={CheckCircleIcon}
          color="green"
        />
        <MetricCard
          title="Vendas do Mês"
          value={formatNumber(metrics.vendasMes)}
          icon={ChartBarIcon}
          color="yellow"
        />
        <MetricCard
          title="Receita do Mês"
          value={formatCurrency(metrics.receitaMes)}
          icon={CurrencyDollarIcon}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Mês */}
        <ChartCard title="Vendas por Mês">
          <SimpleLineChart
            data={metrics.vendasPorMes.map(item => ({
              name: item.mes,
              value: item.vendas,
            }))}
            dataKey="value"
            color="#3b82f6"
          />
        </ChartCard>

        {/* Veículos por Categoria */}
        <ChartCard title="Veículos por Categoria">
          <SimplePieChart
            data={metrics.veiculosPorCategoria.map((item, index) => ({
              name: item.categoria,
              value: item.quantidade,
              color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6],
            }))}
          />
        </ChartCard>
      </div>

      {/* Top Marcas */}
      <ChartCard title="Top Marcas" className="lg:col-span-2">
        <SimpleBarChart
          data={metrics.topMarcas.map(item => ({
            name: item.marca,
            value: item.quantidade,
          }))}
          dataKey="value"
          color="#10b981"
        />
      </ChartCard>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Receita Total</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.receitaTotal)}</p>
          <p className="text-sm text-gray-500 mt-1">Receita acumulada de todas as vendas</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Veículos Vendidos</h3>
          <p className="text-3xl font-bold text-gray-900">{formatNumber(metrics.veiculosVendidos)}</p>
          <p className="text-sm text-gray-500 mt-1">Total de veículos vendidos</p>
        </div>
      </div>
    </div>
  );
};
