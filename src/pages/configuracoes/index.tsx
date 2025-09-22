
export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configurações do sistema
        </p>
      </div>

      {/* Coming Soon */}
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">⚙️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações em Desenvolvimento</h3>
        <p className="text-gray-500">
          Esta funcionalidade estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
