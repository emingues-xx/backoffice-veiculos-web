interface ErrorContext {
  componentStack?: string;
  errorBoundary?: string;
  userId?: string;
  userRole?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

interface ErrorLog {
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'validation' | 'permission' | 'system';
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private getSeverity(error: Error, context: ErrorContext): ErrorLog['severity'] {
    // Erros críticos
    if (error.name === 'ChunkLoadError' || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk')) {
      return 'critical';
    }

    // Erros de rede
    if (error.name === 'NetworkError' || 
        error.message.includes('fetch') ||
        error.message.includes('network')) {
      return 'high';
    }

    // Erros de permissão
    if (error.message.includes('permission') ||
        error.message.includes('unauthorized') ||
        error.message.includes('forbidden')) {
      return 'medium';
    }

    // Erros de validação
    if (error.message.includes('validation') ||
        error.message.includes('invalid') ||
        error.message.includes('required')) {
      return 'low';
    }

    // Erros de sistema
    if (error.name === 'TypeError' || 
        error.name === 'ReferenceError' ||
        error.name === 'SyntaxError') {
      return 'high';
    }

    return 'medium';
  }

  private getCategory(error: Error, context: ErrorContext): ErrorLog['category'] {
    if (error.name === 'NetworkError' || 
        error.message.includes('fetch') ||
        error.message.includes('network')) {
      return 'network';
    }

    if (error.message.includes('permission') ||
        error.message.includes('unauthorized') ||
        error.message.includes('forbidden')) {
      return 'permission';
    }

    if (error.message.includes('validation') ||
        error.message.includes('invalid') ||
        error.message.includes('required')) {
      return 'validation';
    }

    if (error.name === 'ChunkLoadError' ||
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk')) {
      return 'system';
    }

    return 'javascript';
  }

  private createErrorLog(error: Error, context: ErrorContext): ErrorLog {
    return {
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      },
      severity: this.getSeverity(error, context),
      category: this.getCategory(error, context)
    };
  }

  private addToLogs(errorLog: ErrorLog) {
    this.logs.unshift(errorLog);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  private logToConsole(errorLog: ErrorLog) {
    if (!this.isDevelopment) return;

    const { message, stack, context, severity, category } = errorLog;
    
    const logMethod = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    
    console.group(`🚨 ${severity.toUpperCase()} - ${category.toUpperCase()}`);
    console[logMethod](message);
    console.log('Context:', context);
    if (stack) {
      console.log('Stack:', stack);
    }
    console.groupEnd();
  }

  private async sendToServer(errorLog: ErrorLog) {
    if (this.isDevelopment) return;

    try {
      // Aqui você pode implementar o envio para um serviço de logging
      // como Sentry, LogRocket, ou seu próprio endpoint
      await fetch('/api/logs/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog)
      });
    } catch (sendError) {
      console.error('Failed to send error log to server:', sendError);
    }
  }

  public log(error: Error, context: ErrorContext = {}) {
    const errorLog = this.createErrorLog(error, context);
    
    this.addToLogs(errorLog);
    this.logToConsole(errorLog);
    this.sendToServer(errorLog);
  }

  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  public getLogsBySeverity(severity: ErrorLog['severity']): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  public getLogsByCategory(category: ErrorLog['category']): ErrorLog[] {
    return this.logs.filter(log => log.category === category);
  }

  public clearLogs() {
    this.logs = [];
  }

  public getStats() {
    const stats = {
      total: this.logs.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      byCategory: {
        javascript: 0,
        network: 0,
        validation: 0,
        permission: 0,
        system: 0
      },
      recent: this.logs.slice(0, 10)
    };

    this.logs.forEach(log => {
      stats.bySeverity[log.severity]++;
      stats.byCategory[log.category]++;
    });

    return stats;
  }
}

// Instância singleton
const errorLogger = new ErrorLogger();

// Função principal para logging de erros
export const logError = (error: Error, context: ErrorContext = {}) => {
  errorLogger.log(error, context);
};

// Função para logging de erros de API
export const logApiError = (error: Error, endpoint: string, method: string, status?: number) => {
  logError(error, {
    endpoint,
    method,
    status,
    category: 'network'
  });
};

// Função para logging de erros de validação
export const logValidationError = (error: Error, field: string, value: any) => {
  logError(error, {
    field,
    value,
    category: 'validation'
  });
};

// Função para logging de erros de permissão
export const logPermissionError = (error: Error, resource: string, action: string, userId?: string) => {
  logError(error, {
    resource,
    action,
    userId,
    category: 'permission'
  });
};

// Função para logging de erros de sistema
export const logSystemError = (error: Error, component: string) => {
  logError(error, {
    component,
    category: 'system'
  });
};

// Hook para usar o logger em componentes React
export const useErrorLogger = () => {
  return {
    logError,
    logApiError,
    logValidationError,
    logPermissionError,
    logSystemError,
    getLogs: () => errorLogger.getLogs(),
    getStats: () => errorLogger.getStats(),
    clearLogs: () => errorLogger.clearLogs()
  };
};

// Utilitários para diferentes tipos de erro
export const createError = (message: string, name: string = 'CustomError'): Error => {
  const error = new Error(message);
  error.name = name;
  return error;
};

export const createApiError = (message: string, status: number): Error => {
  const error = new Error(message);
  error.name = 'ApiError';
  (error as any).status = status;
  return error;
};

export const createValidationError = (message: string, field: string): Error => {
  const error = new Error(message);
  error.name = 'ValidationError';
  (error as any).field = field;
  return error;
};

export const createPermissionError = (message: string, resource: string, action: string): Error => {
  const error = new Error(message);
  error.name = 'PermissionError';
  (error as any).resource = resource;
  (error as any).action = action;
  return error;
};

export default errorLogger;
