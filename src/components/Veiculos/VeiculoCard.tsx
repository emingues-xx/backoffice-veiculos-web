import { Veiculo } from '@/types/veiculo';
import { formatCurrency, formatDate, getCambioLabel, getCombustivelLabel, getStatusColor, getStatusLabel } from '@/utils/formatters';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

interface VeiculoCardProps {
  veiculo: Veiculo;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VeiculoCard: React.FC<VeiculoCardProps> = ({
  veiculo,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {veiculo.imagens && veiculo.imagens.length > 0 ? (
          <Image
            src={veiculo.imagens[0]}
            alt={`${veiculo.marca} ${veiculo.modelo}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400 text-sm">Sem imagem</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(veiculo.status)}`}>
            {getStatusLabel(veiculo.status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(veiculo.preco)}
          </span>
        </div>

        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Ano:</span> {veiculo.ano}</p>
          <p><span className="font-medium">KM:</span> {veiculo.quilometragem.toLocaleString('pt-BR')}</p>
          <p><span className="font-medium">Combustível:</span> {getCombustivelLabel(veiculo.combustivel)}</p>
          <p><span className="font-medium">Câmbio:</span> {getCambioLabel(veiculo.cambio)}</p>
          <p><span className="font-medium">Cor:</span> {veiculo.cor}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Criado em {formatDate(veiculo.dataCriacao)}</span>
            <span>Vendedor: {veiculo.vendedor.nome}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onView(veiculo.id)}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Ver
          </button>
          <button
            onClick={() => onEdit(veiculo.id)}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Editar
          </button>
          <button
            onClick={() => onDelete(veiculo.id)}
            className="flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
