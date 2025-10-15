import React, { ComponentType } from 'react';
import { usePermissions, Permission, Role } from '@/hooks/usePermissions';
import AccessDenied from '@/pages/AccessDenied';

export interface WithPermissionOptions {
  permission?: Permission;
  permissions?: Permission[];
  role?: Role;
  roles?: Role[];
  requireAll?: boolean;
  fallback?: ComponentType<any>;
  redirectTo?: string;
}

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPermissionOptions
) {
  const WithPermissionComponent = (props: P) => {
    const {
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole
    } = usePermissions();

    const {
      permission,
      permissions,
      role,
      roles,
      requireAll = false,
      fallback: FallbackComponent = AccessDenied
    } = options;

    let hasAccess = false;

    // Verificar permissão única
    if (permission) {
      hasAccess = hasPermission(permission);
    }

    // Verificar múltiplas permissões
    if (permissions && permissions.length > 0) {
      hasAccess = requireAll 
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }

    // Verificar role única
    if (role) {
      hasAccess = hasRole(role);
    }

    // Verificar múltiplas roles
    if (roles && roles.length > 0) {
      hasAccess = hasAnyRole(roles);
    }

    // Se não tem acesso, renderizar componente de fallback
    if (!hasAccess) {
      return <FallbackComponent />;
    }

    // Se tem acesso, renderizar componente original
    return <WrappedComponent {...props} />;
  };

  WithPermissionComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPermissionComponent;
}

// HOC para verificar permissão específica
export function withPermissionCheck<P extends object>(
  WrappedComponent: ComponentType<P>,
  permission: Permission
) {
  return withPermission(WrappedComponent, { permission });
}

// HOC para verificar role específica
export function withRoleCheck<P extends object>(
  WrappedComponent: ComponentType<P>,
  role: Role
) {
  return withPermission(WrappedComponent, { role });
}

// HOC para verificar múltiplas permissões (qualquer uma)
export function withAnyPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  permissions: Permission[]
) {
  return withPermission(WrappedComponent, { permissions, requireAll: false });
}

// HOC para verificar múltiplas permissões (todas)
export function withAllPermissions<P extends object>(
  WrappedComponent: ComponentType<P>,
  permissions: Permission[]
) {
  return withPermission(WrappedComponent, { permissions, requireAll: true });
}

// HOC para verificar múltiplas roles
export function withAnyRole<P extends object>(
  WrappedComponent: ComponentType<P>,
  roles: Role[]
) {
  return withPermission(WrappedComponent, { roles });
}

// HOC para apenas administradores
export function withAdminOnly<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return withRoleCheck(WrappedComponent, 'admin');
}

// HOC para administradores e managers
export function withManagerAccess<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return withAnyRole(WrappedComponent, ['admin', 'manager']);
}

// HOC para vendedores e acima
export function withSellerAccess<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return withAnyRole(WrappedComponent, ['admin', 'manager', 'seller']);
}

// HOC para todos os usuários autenticados
export function withAuthenticatedAccess<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return withAnyRole(WrappedComponent, ['admin', 'manager', 'seller', 'viewer']);
}
