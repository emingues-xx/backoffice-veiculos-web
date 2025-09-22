import { CreateVeiculoRequest, UpdateVeiculoRequest } from '@/types/veiculo';
import { CAMBIOS, CATEGORIAS, COMBUSTIVEIS, STATUS } from '@/utils/constants';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useForm } from 'react-hook-form';

interface VeiculoFormProps {
  initialData?: Partial<CreateVeiculoRequest & { status?: string }>;
  onSubmit: (data: CreateVeiculoRequest | UpdateVeiculoRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const VeiculoForm: React.FC<VeiculoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateVeiculoRequest & { status?: string }>({
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CreateVeiculoRequest & { status?: string }) => {
    const { status, ...veiculoData } = data;
    const submitData = isEdit ? { ...veiculoData, status } : veiculoData;
    onSubmit(submitData);
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                {...register('marca', { required: 'Marca é obrigatória' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Toyota"
              />
              {errors.marca && (
                <p className="text-red-500 text-sm mt-1">{errors.marca.message}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo *
              </label>
              <input
                type="text"
                {...register('modelo', { required: 'Modelo é obrigatório' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Corolla"
              />
              {errors.modelo && (
                <p className="text-red-500 text-sm mt-1">{errors.modelo.message}</p>
              )}
            </div>

            {/* Ano */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano *
              </label>
              <input
                type="number"
                {...register('ano', {
                  required: 'Ano é obrigatório',
                  min: { value: 1990, message: 'Ano deve ser maior que 1990' },
                  max: { value: new Date().getFullYear() + 1, message: 'Ano inválido' }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="2023"
                min="1990"
                max={new Date().getFullYear() + 1}
              />
              {errors.ano && (
                <p className="text-red-500 text-sm mt-1">{errors.ano.message}</p>
              )}
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('preco', {
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço deve ser maior que zero' }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50000.00"
                min="0"
              />
              {errors.preco && (
                <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>
              )}
            </div>

            {/* Quilometragem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quilometragem *
              </label>
              <input
                type="number"
                {...register('quilometragem', {
                  required: 'Quilometragem é obrigatória',
                  min: { value: 0, message: 'Quilometragem deve ser maior ou igual a zero' }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50000"
                min="0"
              />
              {errors.quilometragem && (
                <p className="text-red-500 text-sm mt-1">{errors.quilometragem.message}</p>
              )}
            </div>

            {/* Combustível */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Combustível *
              </label>
              <select
                {...register('combustivel', { required: 'Combustível é obrigatório' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione o combustível</option>
                {COMBUSTIVEIS.map((combustivel) => (
                  <option key={combustivel.value} value={combustivel.value}>
                    {combustivel.label}
                  </option>
                ))}
              </select>
              {errors.combustivel && (
                <p className="text-red-500 text-sm mt-1">{errors.combustivel.message}</p>
              )}
            </div>

            {/* Câmbio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câmbio *
              </label>
              <select
                {...register('cambio', { required: 'Câmbio é obrigatório' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione o câmbio</option>
                {CAMBIOS.map((cambio) => (
                  <option key={cambio.value} value={cambio.value}>
                    {cambio.label}
                  </option>
                ))}
              </select>
              {errors.cambio && (
                <p className="text-red-500 text-sm mt-1">{errors.cambio.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                {...register('categoria', { required: 'Categoria é obrigatória' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecione a categoria</option>
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="text-red-500 text-sm mt-1">{errors.categoria.message}</p>
              )}
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor *
              </label>
              <input
                type="text"
                {...register('cor', { required: 'Cor é obrigatória' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Branco"
              />
              {errors.cor && (
                <p className="text-red-500 text-sm mt-1">{errors.cor.message}</p>
              )}
            </div>

            {/* Portas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portas *
              </label>
              <input
                type="number"
                {...register('portas', {
                  required: 'Número de portas é obrigatório',
                  min: { value: 2, message: 'Mínimo 2 portas' },
                  max: { value: 5, message: 'Máximo 5 portas' }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="4"
                min="2"
                max="5"
              />
              {errors.portas && (
                <p className="text-red-500 text-sm mt-1">{errors.portas.message}</p>
              )}
            </div>

            {/* Status (apenas para edição) */}
            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('descricao')}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Descrição detalhada do veículo..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
