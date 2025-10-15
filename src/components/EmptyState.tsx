import React from 'react';
import { Search, Filter, RefreshCw, Plus, FileText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  type?: 'no-data' | 'no-results' | 'error' | 'loading';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
  secondaryAction,
  type = 'no-data',
  className = ''
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'no-results':
        return Search;
      case 'error':
        return RefreshCw;
      case 'loading':
        return RefreshCw;
      default:
        return FileText;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'loading':
        return 'text-blue-500 animate-spin';
      default:
        return 'text-gray-400';
    }
  };

  const IconComponent = Icon || getDefaultIcon();

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${getIconColor()}`}>
            <IconComponent className="w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <button
              onClick={action.onClick}
              className={`
                inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                ${action.variant === 'primary'
                  ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500'
                }
              `}
            >
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componentes específicos para diferentes tipos de estado vazio
export const NoDataState: React.FC<{
  title?: string;
  description?: string;
  onCreateNew?: () => void;
  createLabel?: string;
}> = ({
  title = 'Nenhum dado encontrado',
  description = 'Não há dados para exibir no momento.',
  onCreateNew,
  createLabel = 'Criar novo'
}) => (
  <EmptyState
    title={title}
    description={description}
    icon={Plus}
    action={onCreateNew ? {
      label: createLabel,
      onClick: onCreateNew,
      variant: 'primary'
    } : undefined}
  />
);

export const NoResultsState: React.FC<{
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  clearFiltersLabel?: string;
}> = ({
  title = 'Nenhum resultado encontrado',
  description = 'Tente ajustar os filtros para encontrar o que está procurando.',
  onClearFilters,
  clearFiltersLabel = 'Limpar filtros'
}) => (
  <EmptyState
    title={title}
    description={description}
    icon={Filter}
    type="no-results"
    action={onClearFilters ? {
      label: clearFiltersLabel,
      onClick: onClearFilters,
      variant: 'secondary'
    } : undefined}
  />
);

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}> = ({
  title = 'Erro ao carregar dados',
  description = 'Ocorreu um erro ao carregar os dados. Tente novamente.',
  onRetry,
  retryLabel = 'Tentar novamente'
}) => (
  <EmptyState
    title={title}
    description={description}
    icon={RefreshCw}
    type="error"
    action={onRetry ? {
      label: retryLabel,
      onClick: onRetry,
      variant: 'primary'
    } : undefined}
  />
);

export const LoadingState: React.FC<{
  title?: string;
  description?: string;
}> = ({
  title = 'Carregando...',
  description = 'Aguarde enquanto os dados são carregados.'
}) => (
  <EmptyState
    title={title}
    description={description}
    icon={RefreshCw}
    type="loading"
  />
);

// Hook para gerenciar estado vazio
export const useEmptyState = () => {
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [emptyStateConfig, setEmptyStateConfig] = React.useState<{
    title: string;
    description: string;
    type?: 'no-data' | 'no-results' | 'error' | 'loading';
    action?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' };
  } | null>(null);

  const showEmptyState = React.useCallback((config: {
    title: string;
    description: string;
    type?: 'no-data' | 'no-results' | 'error' | 'loading';
    action?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' };
  }) => {
    setEmptyStateConfig(config);
    setIsEmpty(true);
  }, []);

  const hideEmptyState = React.useCallback(() => {
    setIsEmpty(false);
    setEmptyStateConfig(null);
  }, []);

  const EmptyStateComponent = React.useMemo(() => {
    if (!isEmpty || !emptyStateConfig) return null;

    return (
      <EmptyState
        title={emptyStateConfig.title}
        description={emptyStateConfig.description}
        type={emptyStateConfig.type}
        action={emptyStateConfig.action}
      />
    );
  }, [isEmpty, emptyStateConfig]);

  return {
    isEmpty,
    showEmptyState,
    hideEmptyState,
    EmptyStateComponent
  };
};

export default EmptyState;
