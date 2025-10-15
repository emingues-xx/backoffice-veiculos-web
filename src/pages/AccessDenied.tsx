import React from 'react';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/Auth/AuthProvider';

const AccessDenied: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acesso Negado
        </h1>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Permissão Insuficiente
              </h2>
              
              <p className="text-sm text-gray-600 mb-4">
                Esta área requer permissões especiais que seu usuário não possui.
              </p>

              {user && (
                <div className="bg-gray-50 rounded-md p-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Informações da sua conta:
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Função:</strong> {user.role}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Precisa de acesso?
                </h3>
                <p className="text-sm text-blue-700">
                  Entre em contato com o administrador do sistema para solicitar as permissões necessárias.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGoBack}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </button>
              
              <button
                onClick={handleGoHome}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir para Início
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500">
            <p>Código do erro: 403 - Forbidden</p>
            <p className="mt-1">
              Se você acredita que isso é um erro, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
