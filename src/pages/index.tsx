import { Dashboard } from '@/components/Dashboard/Dashboard';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral e métricas do sistema
        </p>
      </div>

      {/* Dashboard Content */}
      <Dashboard />
    </div>
  );
}
