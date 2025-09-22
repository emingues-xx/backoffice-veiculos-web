import { useVendas } from '@/hooks/useDashboard';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function VendasPage() {
  const { data: vendasData, isLoading, error } = useVendas({ limit: 50 });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Histórico de vendas realizadas
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Histórico de vendas realizadas
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar vendas</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
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
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Histórico de vendas realizadas
        </p>
      </div>

      {/* Vendas List */}
      {vendasData && vendasData.vendas.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {vendasData.vendas.map((venda) => (
              <li key={venda.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {venda.veiculo.marca.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {venda.veiculo.marca} {venda.veiculo.modelo} ({venda.veiculo.ano})
                      </div>
                      <div className="text-sm text-gray-500">
                        Comprador: {venda.comprador.nome} • {venda.comprador.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        Vendedor: {venda.vendedor.nome}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(venda.preco)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(venda.dataVenda)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda encontrada</h3>
          <p className="text-gray-500">
            As vendas aparecerão aqui quando forem realizadas.
          </p>
        </div>
      )}
    </div>
  );
}
