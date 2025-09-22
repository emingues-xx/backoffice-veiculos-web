import { Vehicle } from '@/types/vehicle';
import { formatCurrency, formatDate, getFuelLabel, getStatusColor, getStatusLabel, getTransmissionLabel, getCategoryLabel } from '@/utils/formatters';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicle,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Detalhes do Veículo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Images */}
          {vehicle.images && vehicle.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.images.map((image, index) => (
                <div key={index} className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${vehicle.brand} ${vehicle.vehicleModel} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {vehicle.brand} {vehicle.vehicleModel}
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(vehicle.price)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Ano:</span>
                  <p className="text-sm text-gray-900">{vehicle.year}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Quilometragem:</span>
                  <p className="text-sm text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Combustível:</span>
                  <p className="text-sm text-gray-900">{getFuelLabel(vehicle.fuelType)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Transmissão:</span>
                  <p className="text-sm text-gray-900">{getTransmissionLabel(vehicle.transmission)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Cor:</span>
                  <p className="text-sm text-gray-900 capitalize">{vehicle.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Portas:</span>
                  <p className="text-sm text-gray-900">{vehicle.doors}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Categoria:</span>
                  <p className="text-sm text-gray-900">{getCategoryLabel(vehicle.category)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Condição:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.condition)}`}>
                    {getStatusLabel(vehicle.condition)}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Seller */}
            <div className="space-y-4">
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-2">Localização</h5>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900">
                    {vehicle.location.city}, {vehicle.location.state}
                  </p>
                  <p className="text-sm text-gray-500">
                    CEP: {vehicle.location.zipCode}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-md font-medium text-gray-900 mb-2">Vendedor</h5>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{vehicle.seller.name}</p>
                  <p className="text-sm text-gray-500">{vehicle.seller.email}</p>
                  <p className="text-sm text-gray-500">{vehicle.seller.phone}</p>
                </div>
              </div>

              <div>
                <h5 className="text-md font-medium text-gray-900 mb-2">Informações do Anúncio</h5>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-gray-500">
                    Criado em: {formatDate(vehicle.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Atualizado em: {formatDate(vehicle.updatedAt)}
                  </p>
                  {vehicle.isFeatured && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Destaque
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div>
              <h5 className="text-md font-medium text-gray-900 mb-2">Descrição</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
