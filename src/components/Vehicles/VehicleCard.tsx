import { Vehicle } from '@/types/vehicle';
import { formatCurrency, formatDate, getFuelLabel, getStatusColor, getStatusLabel, getTransmissionLabel } from '@/utils/formatters';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
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
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.condition)}`}>
            {getStatusLabel(vehicle.condition)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.brand} {vehicle.vehicleModel}
          </h3>
          <span className="text-sm text-gray-500">{vehicle.year}</span>
        </div>

        <div className="text-2xl font-bold text-blue-600 mb-3">
          {formatCurrency(vehicle.price)}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Quilometragem:</span>
            <span>{vehicle.mileage.toLocaleString('pt-BR')} km</span>
          </div>
          <div className="flex justify-between">
            <span>Combustível:</span>
            <span>{getFuelLabel(vehicle.fuelType)}</span>
          </div>
          <div className="flex justify-between">
            <span>Câmbio:</span>
            <span>{getTransmissionLabel(vehicle.transmission)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cor:</span>
            <span>{vehicle.color}</span>
          </div>
          <div className="flex justify-between">
            <span>Portas:</span>
            <span>{vehicle.doors}</span>
          </div>
        </div>

        {vehicle.description && (
          <div className="mt-3 text-sm text-gray-600 line-clamp-2">
            {vehicle.description}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Criado em: {formatDate(vehicle.createdAt)}
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onView(vehicle._id)}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
          >
            <EyeIcon className="h-4 w-4" />
            <span>Ver</span>
          </button>
          <button
            onClick={() => onEdit(vehicle._id)}
            className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-1"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDelete(vehicle._id)}
            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};