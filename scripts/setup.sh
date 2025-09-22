#!/bin/bash

echo "🚀 Configurando Backoffice Veículos Web..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar variáveis de ambiente
if [ ! -f .env.local ]; then
    echo "⚙️ Configurando variáveis de ambiente..."
    cp env.example .env.local
    echo "✅ Arquivo .env.local criado"
    echo "📝 Edite o arquivo .env.local se necessário"
else
    echo "✅ Arquivo .env.local já existe"
fi

# Verificar se o BFF está rodando
echo "🔍 Verificando conexão com BFF..."
if curl -s http://localhost:3002/health > /dev/null; then
    echo "✅ BFF está rodando em http://localhost:3002"
else
    echo "⚠️ BFF não está rodando em http://localhost:3002"
    echo "   Certifique-se de que o BFF está iniciado antes de executar o frontend"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "Para iniciar o projeto:"
echo "  npm run dev"
echo ""
echo "O sistema estará disponível em:"
echo "  http://localhost:3000"
echo ""
echo "Para mais informações, consulte o README.md"
