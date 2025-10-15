import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/Auth/AuthProvider';
import { usePermissions, Permission, Role } from '@/hooks/usePermissions';
import AccessDenied from '@/pages/AccessDenied';
import { ErrorBoundary } from './ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  role?: Role;
  roles?: Role[];
  requireAll?: boolean;
  fallback?: React.ComponentType<any>;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  fallback: FallbackComponent = AccessDenied,
  redirectTo
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole
  } = usePermissions();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return <FallbackComponent />;
  }

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Check single role
  if (role) {
    hasAccess = hasRole(role);
  }

  // Check multiple roles
  if (roles && roles.length > 0) {
    hasAccess = hasAnyRole(roles);
  }

  // If no specific permission/role check, allow access for authenticated users
  if (!permission && !permissions && !role && !roles) {
    hasAccess = true;
  }

  // No access
  if (!hasAccess) {
    return <FallbackComponent />;
  }

  // Has access - render children with error boundary
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

// HOC for protecting pages
export const withProtectedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  const ProtectedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );

  ProtectedComponent.displayName = `withProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ProtectedComponent;
};

// Specific protection components
export const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute role="admin">
    {children}
  </ProtectedRoute>
);

export const ManagerAccess: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute roles={['admin', 'manager']}>
    {children}
  </ProtectedRoute>
);

export const SellerAccess: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute roles={['admin', 'manager', 'seller']}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
