import { useMemo } from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';

export type Permission = 
  | 'dashboard:read'
  | 'dashboard:write'
  | 'vehicles:read'
  | 'vehicles:write'
  | 'vehicles:delete'
  | 'sales:read'
  | 'sales:write'
  | 'sales:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'reports:read'
  | 'reports:write'
  | 'settings:read'
  | 'settings:write'
  | 'metrics:read'
  | 'metrics:export';

export type Role = 'admin' | 'manager' | 'seller' | 'viewer';

export interface PermissionMatrix {
  [key: string]: Permission[];
}

// Matriz de permissões por role
const PERMISSION_MATRIX: PermissionMatrix = {
  admin: [
    'dashboard:read',
    'dashboard:write',
    'vehicles:read',
    'vehicles:write',
    'vehicles:delete',
    'sales:read',
    'sales:write',
    'sales:delete',
    'users:read',
    'users:write',
    'users:delete',
    'reports:read',
    'reports:write',
    'settings:read',
    'settings:write',
    'metrics:read',
    'metrics:export'
  ],
  manager: [
    'dashboard:read',
    'dashboard:write',
    'vehicles:read',
    'vehicles:write',
    'vehicles:delete',
    'sales:read',
    'sales:write',
    'sales:delete',
    'users:read',
    'reports:read',
    'reports:write',
    'settings:read',
    'metrics:read',
    'metrics:export'
  ],
  seller: [
    'dashboard:read',
    'vehicles:read',
    'vehicles:write',
    'sales:read',
    'sales:write',
    'reports:read',
    'metrics:read'
  ],
  viewer: [
    'dashboard:read',
    'vehicles:read',
    'sales:read',
    'reports:read',
    'metrics:read'
  ]
};

export interface UsePermissionsReturn {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  userRole: Role | null;
  userPermissions: Permission[];
  canAccess: (resource: string, action: string) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSeller: boolean;
  isViewer: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  const userRole = useMemo((): Role | null => {
    if (!user?.role) return null;
    return user.role as Role;
  }, [user?.role]);

  const userPermissions = useMemo((): Permission[] => {
    if (!userRole) return [];
    return PERMISSION_MATRIX[userRole] || [];
  }, [userRole]);

  const hasPermission = useMemo(() => {
    return (permission: Permission): boolean => {
      return userPermissions.includes(permission);
    };
  }, [userPermissions]);

  const hasAnyPermission = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      return permissions.some(permission => userPermissions.includes(permission));
    };
  }, [userPermissions]);

  const hasAllPermissions = useMemo(() => {
    return (permissions: Permission[]): boolean => {
      return permissions.every(permission => userPermissions.includes(permission));
    };
  }, [userPermissions]);

  const hasRole = useMemo(() => {
    return (role: Role): boolean => {
      return userRole === role;
    };
  }, [userRole]);

  const hasAnyRole = useMemo(() => {
    return (roles: Role[]): boolean => {
      return userRole ? roles.includes(userRole) : false;
    };
  }, [userRole]);

  const canAccess = useMemo(() => {
    return (resource: string, action: string): boolean => {
      const permission = `${resource}:${action}` as Permission;
      return hasPermission(permission);
    };
  }, [hasPermission]);

  const isAdmin = useMemo(() => hasRole('admin'), [hasRole]);
  const isManager = useMemo(() => hasRole('manager'), [hasRole]);
  const isSeller = useMemo(() => hasRole('seller'), [hasRole]);
  const isViewer = useMemo(() => hasRole('viewer'), [hasRole]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    userRole,
    userPermissions,
    canAccess,
    isAdmin,
    isManager,
    isSeller,
    isViewer
  };
};

// Hook para verificar permissões específicas de recursos
export const useResourcePermissions = (resource: string) => {
  const { hasPermission, canAccess } = usePermissions();

  return useMemo(() => ({
    canRead: canAccess(resource, 'read'),
    canWrite: canAccess(resource, 'write'),
    canDelete: canAccess(resource, 'delete'),
    canExport: canAccess(resource, 'export'),
    hasAnyAccess: hasPermission(`${resource}:read` as Permission) || 
                  hasPermission(`${resource}:write` as Permission) ||
                  hasPermission(`${resource}:delete` as Permission)
  }), [resource, hasPermission, canAccess]);
};

// Hook para verificar permissões de dashboard
export const useDashboardPermissions = () => {
  return useResourcePermissions('dashboard');
};

// Hook para verificar permissões de veículos
export const useVehiclePermissions = () => {
  return useResourcePermissions('vehicles');
};

// Hook para verificar permissões de vendas
export const useSalesPermissions = () => {
  return useResourcePermissions('sales');
};

// Hook para verificar permissões de usuários
export const useUserPermissions = () => {
  return useResourcePermissions('users');
};

// Hook para verificar permissões de relatórios
export const useReportPermissions = () => {
  return useResourcePermissions('reports');
};

// Hook para verificar permissões de métricas
export const useMetricsPermissions = () => {
  return useResourcePermissions('metrics');
};

// Hook para verificar permissões de configurações
export const useSettingsPermissions = () => {
  return useResourcePermissions('settings');
};
