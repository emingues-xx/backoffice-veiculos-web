import React from 'react';
import { AlertCircle, XCircle, Info, CheckCircle, X } from 'lucide-react';

export type ErrorType = 'error' | 'warning' | 'info' | 'success';

export interface ErrorMessageProps {
  type?: ErrorType;
  title?: string;
  message: string;
  details?: string;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  type = 'error',
  title,
  message,
  details,
  onClose,
  showIcon = true,
  className = '',
  size = 'md',
  dismissible = false
}) => {
  const getIcon = () => {
    if (!showIcon) return null;

    const iconClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

    switch (type) {
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      default:
        return <XCircle className={`${iconClass} text-red-500`} />;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'rounded-md border p-4';
    const sizeClasses = {
      sm: 'p-2 text-sm',
      md: 'p-4 text-base',
      lg: 'p-6 text-lg'
    };

    const typeClasses = {
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800'
    };

    return `${baseClasses} ${sizeClasses[size]} ${typeClasses[type]} ${className}`;
  };

  const getTitleClasses = () => {
    const baseClasses = 'font-medium';
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    return `${baseClasses} ${sizeClasses[size]}`;
  };

  const getMessageClasses = () => {
    const baseClasses = 'mt-1';
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return `${baseClasses} ${sizeClasses[size]}`;
  };

  const getDetailsClasses = () => {
    const baseClasses = 'mt-2 font-mono text-xs bg-white bg-opacity-50 p-2 rounded border';
    return baseClasses;
  };

  return (
    <div className={getContainerClasses()}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className={getTitleClasses()}>
              {title}
            </h3>
          )}
          
          <p className={getMessageClasses()}>
            {message}
          </p>
          
          {details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-medium opacity-75 hover:opacity-100">
                Ver detalhes
              </summary>
              <pre className={getDetailsClasses()}>
                {details}
              </pre>
            </details>
          )}
        </div>
        
        {dismissible && onClose && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Componentes específicos para cada tipo
export const ErrorAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="error" />
);

export const WarningAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="warning" />
);

export const InfoAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="info" />
);

export const SuccessAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="success" />
);

// Hook para gerenciar estado de erro
export const useErrorMessage = () => {
  const [error, setError] = React.useState<{
    type: ErrorType;
    title?: string;
    message: string;
    details?: string;
  } | null>(null);

  const showError = React.useCallback((errorData: {
    type?: ErrorType;
    title?: string;
    message: string;
    details?: string;
  }) => {
    setError({
      type: 'error',
      ...errorData
    });
  }, []);

  const showWarning = React.useCallback((errorData: {
    title?: string;
    message: string;
    details?: string;
  }) => {
    setError({
      type: 'warning',
      ...errorData
    });
  }, []);

  const showInfo = React.useCallback((errorData: {
    title?: string;
    message: string;
    details?: string;
  }) => {
    setError({
      type: 'info',
      ...errorData
    });
  }, []);

  const showSuccess = React.useCallback((errorData: {
    title?: string;
    message: string;
    details?: string;
  }) => {
    setError({
      type: 'success',
      ...errorData
    });
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const ErrorComponent = React.useMemo(() => {
    if (!error) return null;

    return (
      <ErrorMessage
        type={error.type}
        title={error.title}
        message={error.message}
        details={error.details}
        onClose={clearError}
        dismissible
      />
    );
  }, [error, clearError]);

  return {
    error,
    showError,
    showWarning,
    showInfo,
    showSuccess,
    clearError,
    ErrorComponent
  };
};

export default ErrorMessage;
