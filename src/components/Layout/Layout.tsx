import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { usePermissions } from '@/hooks/usePermissions';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasPermission } = usePermissions();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} showMenuButton={true} />

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page header */}
              {(title || description) && (
                <div className="mb-8">
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* Page content */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;