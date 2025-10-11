import { CreateVehicleRequest, UpdateVehicleRequest } from '@/types/vehicle';
import { FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_CATEGORIES, VEHICLE_CONDITIONS, VEHICLE_STATUS } from '@/utils/constants';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/components/Auth/AuthProvider';
import { XMarkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface VehicleFormProps {
  initialData?: Partial<CreateVehicleRequest & { status?: string }>;
  onSubmit: (data: CreateVehicleRequest | UpdateVehicleRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateVehicleRequest & { status?: string }>({
    defaultValues: initialData ? {
      ...initialData,
      // Map API field names to form field names
      brand: initialData.brand,
      vehicleModel: initialData.vehicleModel,
      year: initialData.year,
      price: initialData.price,
      mileage: initialData.mileage,
      fuelType: initialData.fuelType,
      transmission: initialData.transmission,
      color: initialData.color,
      doors: initialData.doors,
      category: initialData.category,
      condition: initialData.condition,
      description: initialData.description,
      // Set default values for missing fields
      location: initialData.location || { city: '', state: '', zipCode: '' },
      seller: initialData.seller || { id: '', name: '', phone: '', email: '' },
      isFeatured: initialData.isFeatured || false,
    } : {
      location: { city: '', state: '', zipCode: '' },
      seller: user ? { 
        id: user.id, 
        name: user.name, 
        phone: user.phone || '', 
        email: user.email 
      } : { id: '', name: '', phone: '', email: '' },
      isFeatured: false,
    },
  });

  // Update seller info when user changes
  useEffect(() => {
    if (user && !isEdit) {
      setValue('seller', {
        id: user.id,
        name: user.name,
        phone: user.phone || '',
        email: user.email
      });
    }
  }, [user, setValue, isEdit]);

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(file => apiClient.uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      setValue('images', newImages);
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      alert('Erro ao fazer upload das imagens. Tente novamente.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
  };

  const handleFormSubmit = (data: CreateVehicleRequest & { status?: string }) => {
    const { status, ...vehicleData } = data;
    
    // API now uses English field names directly
    const apiData = {
      brand: vehicleData.brand,
      vehicleModel: vehicleData.vehicleModel,
      year: vehicleData.year,
      price: vehicleData.price,
      mileage: vehicleData.mileage,
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission,
      color: vehicleData.color,
      doors: vehicleData.doors,
      category: vehicleData.category,
      condition: vehicleData.condition,
      description: vehicleData.description,
      images: images,
      location: vehicleData.location,
      seller: vehicleData.seller,
      isFeatured: vehicleData.isFeatured,
      // Add status for edit mode
      ...(isEdit && status && { status })
    };
    
    onSubmit(apiData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Editar Veículo' : 'Novo Veículo'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                {...register('brand', { required: 'Marca é obrigatória' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Toyota"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                {...register('vehicleModel', { required: 'Modelo é obrigatório' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Corolla"
              />
              {errors.vehicleModel && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleModel.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano *
              </label>
              <input
                type="number"
                {...register('year', {
                  required: 'Ano é obrigatório',
                  min: { value: 1900, message: 'Ano deve ser maior que 1900' },
                  max: { value: new Date().getFullYear() + 1, message: 'Ano inválido' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2020"
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço deve ser maior que 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 50000.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quilometragem *
              </label>
              <input
                type="number"
                {...register('mileage', {
                  required: 'Quilometragem é obrigatória',
                  min: { value: 0, message: 'Quilometragem deve ser maior que 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 50000"
              />
              {errors.mileage && (
                <p className="text-red-500 text-sm mt-1">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Combustível *
              </label>
              <select
                {...register('fuelType', { required: 'Combustível é obrigatório' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o combustível</option>
                {FUEL_TYPES.map((fuel) => (
                  <option key={fuel.value} value={fuel.value}>
                    {fuel.label}
                  </option>
                ))}
              </select>
              {errors.fuelType && (
                <p className="text-red-500 text-sm mt-1">{errors.fuelType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câmbio *
              </label>
              <select
                {...register('transmission', { required: 'Câmbio é obrigatório' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o câmbio</option>
                {TRANSMISSION_TYPES.map((transmission) => (
                  <option key={transmission.value} value={transmission.value}>
                    {transmission.label}
                  </option>
                ))}
              </select>
              {errors.transmission && (
                <p className="text-red-500 text-sm mt-1">{errors.transmission.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor *
              </label>
              <input
                type="text"
                {...register('color', { required: 'Cor é obrigatória' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Branco"
              />
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portas *
              </label>
              <input
                type="number"
                min="2"
                max="5"
                {...register('doors', {
                  required: 'Número de portas é obrigatório',
                  min: { value: 2, message: 'Mínimo 2 portas' },
                  max: { value: 5, message: 'Máximo 5 portas' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 4"
              />
              {errors.doors && (
                <p className="text-red-500 text-sm mt-1">{errors.doors.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                {...register('category', { required: 'Categoria é obrigatória' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione a categoria</option>
                {VEHICLE_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condição
            </label>
            <select
              {...register('condition')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {VEHICLE_CONDITIONS.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status (only for edit) */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {VEHICLE_STATUS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagens
            </label>
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImages}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {uploadingImages ? 'Fazendo upload...' : 'Clique para adicionar imagens'}
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF até 10MB cada
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Localização</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  {...register('location.city', { required: 'Cidade é obrigatória' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: São Paulo"
                />
                {errors.location?.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  {...register('location.state', { required: 'Estado é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: SP"
                />
                {errors.location?.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.state.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  {...register('location.zipCode', { required: 'CEP é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 01234-567"
                />
                {errors.location?.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seller */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Vendedor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  {...register('seller.name', { required: 'Nome do vendedor é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: João Silva"
                />
                {errors.seller?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.seller.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('seller.email', { required: 'Email é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: joao@email.com"
                />
                {errors.seller?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.seller.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  {...register('seller.phone', { required: 'Telefone é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: (11) 99999-9999"
                />
                {errors.seller?.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.seller.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Destacar este veículo
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição do veículo..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};