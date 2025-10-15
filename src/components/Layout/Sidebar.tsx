import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Car,
  TrendingUp,
  Users,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  Shield
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const navigation: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      permission: 'dashboard:read'
    },
    {
      name: 'Veículos',
      href: '/veiculos',
      icon: Car,
      permission: 'vehicles:read'
    },
    {
      name: 'Vendas',
      href: '/vendas',
      icon: TrendingUp,
      permission: 'sales:read'
    },
    {
      name: 'Relatórios',
      href: '/relatorios',
      icon: FileText,
      permission: 'reports:read'
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      permission: 'users:read'
    },
    {
      name: 'Métricas',
      href: '/metricas',
      icon: BarChart3,
      permission: 'metrics:read'
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      permission: 'settings:read'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission as any);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Backoffice
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${active
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <Icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`
                        ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full
                        ${active
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Sistema Seguro
                </p>
                <p className="text-xs text-gray-500">
                  Versão 1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;