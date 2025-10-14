# 🚗 Backoffice Veículos Web

Sistema completo de backoffice para gestão de veículos e vendas, desenvolvido com Next.js 14 e TypeScript. Interface moderna e responsiva para administração de concessionárias e marketplaces de veículos.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form com validação
- **Charts**: Recharts para métricas e gráficos
- **Icons**: Heroicons, Lucide React
- **HTTP Client**: Axios com interceptors
- **Authentication**: JWT Bearer Token
- **Image Handling**: Next.js Image Optimization

## 📋 Funcionalidades

### ✅ Implementadas
- **🔐 Autenticação**: Login/logout com JWT, proteção de rotas
- **📊 Dashboard**: Métricas em tempo real, gráficos de vendas e veículos
- **🚗 Gestão de Veículos**: CRUD completo com filtros avançados, upload de imagens
- **💰 Gestão de Vendas**: Listagem, criação e edição de vendas
- **🔍 Filtros Avançados**: Por marca, modelo, ano, preço, combustível, categoria
- **📱 Interface Responsiva**: Design moderno e mobile-first
- **🖼️ Upload de Imagens**: Suporte a múltiplas imagens com preview
- **🌐 Integração BFF**: Comunicação robusta com backend via BFF
- **🔄 Validação de Imagens**: Verificação automática de URLs de imagens
- **📄 Paginação**: Sistema completo de paginação para listagens

### 🚧 Em Desenvolvimento
- Relatórios avançados com exportação
- Gestão completa de usuários
- Configurações do sistema
- Notificações em tempo real
- Sistema de permissões

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Acesso ao BFF em produção ou local

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd backoffice-veiculos-web
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# URLs do BFF
NEXT_PUBLIC_BFF_BASE_URL=https://bff-production-cae3.up.railway.app/
BFF_BASE_URL=https://backoffice-veiculos-bff-production.up.railway.app

# Configurações da API
NEXT_PUBLIC_API_TIMEOUT=10000

# Ambiente
NODE_ENV=development
```

4. **Execute o projeto**
```bash
# Desenvolvimento
npm run dev

# Ou em porta específica
npm run dev -- -p 3018
```

O sistema estará disponível em `http://localhost:3000` (ou porta especificada)

### 🐳 Docker (Opcional)

```bash
# Build da imagem
docker build -t backoffice-veiculos-web .

# Executar container
docker run -p 3000:3000 backoffice-veiculos-web
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Autenticação (Login, AuthProvider)
│   ├── Dashboard/      # Componentes do dashboard
│   ├── Layout/         # Layout, Header, Sidebar
│   └── Vehicles/       # Componentes de veículos
├── hooks/              # Custom hooks (useAuth, useVehicles, useDashboard)
├── lib/                # API client, configurações
├── pages/              # Páginas Next.js
│   ├── veiculos/       # Gestão de veículos
│   ├── vendas/         # Gestão de vendas
│   ├── relatorios/     # Relatórios
│   └── usuarios/       # Gestão de usuários
├── styles/             # Estilos globais
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Desenvolvimento em porta específica
npm run dev -- -p 3018

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 🌐 Integração com BFF

O sistema se conecta ao Backend for Frontend (BFF) em produção através das seguintes APIs:

### 🔗 URLs de Produção
- **BFF Principal**: `https://bff-production-cae3.up.railway.app/`
- **BFF Secundário**: `https://backoffice-veiculos-bff-production.up.railway.app`
- **API Direta**: `https://backoffice-veiculos-api-production.up.railway.app`

### 📡 Endpoints Utilizados

#### 🔐 Autenticação
- `POST /api/users/login` - Login (API direta)
- `POST /api/auth/login` - Login (BFF)

#### 🚗 Veículos
- `GET /api/vehicles` - Listar veículos com filtros
- `POST /api/vehicles` - Criar veículo
- `GET /api/vehicles/:id` - Buscar veículo por ID
- `PUT /api/vehicles/:id` - Atualizar veículo
- `DELETE /api/vehicles/:id` - Excluir veículo
- `PATCH /api/vehicles/:id/status` - Atualizar status

#### 💰 Vendas
- `GET /api/sales` - Listar vendas
- `POST /api/sales` - Criar venda
- `GET /api/sales/:id` - Buscar venda por ID
- `PUT /api/sales/:id` - Atualizar venda
- `DELETE /api/sales/:id` - Excluir venda

#### 📊 Dashboard
- `GET /api/dashboard/metrics` - Métricas do dashboard
- `GET /api/sales/stats` - Estatísticas de vendas

#### 🔧 Utilitários
- `GET /health` - Health check

## 🔐 Autenticação

### Credenciais de Acesso
- **Email**: `admin@backoffice.com`
- **Senha**: `Admin123!@#`

### Como Funciona
1. Login via API direta para evitar problemas de CORS
2. Token JWT armazenado no localStorage
3. Interceptadores automáticos para adicionar Bearer Token
4. Proteção de rotas com AuthProvider

## 🎨 Design System

O sistema utiliza um design system consistente baseado em:
- **Cores**: Paleta primária azul (#3B82F6) com tons de cinza
- **Tipografia**: Inter font family
- **Componentes**: Headless UI para acessibilidade
- **Layout**: Grid responsivo com Tailwind CSS
- **Ícones**: Heroicons e Lucide React

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- **Desktop**: Layout completo com sidebar fixa
- **Tablet**: Layout adaptado com navegação colapsável
- **Mobile**: Interface otimizada para touch com menu hambúrguer

## 🔒 Segurança

- ✅ Validação de formulários no frontend e backend
- ✅ Sanitização de dados de entrada
- ✅ Headers de segurança configurados
- ✅ Autenticação JWT implementada
- ✅ Proteção de rotas sensíveis
- ✅ Interceptadores para tratamento de erros

## 🖼️ Gestão de Imagens

- **Upload**: Suporte a múltiplas imagens com drag & drop
- **Preview**: Visualização em tempo real
- **Validação**: Verificação automática de URLs
- **Fallback**: Substituição automática de imagens inválidas
- **Otimização**: Next.js Image Optimization

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test

# Testes com coverage
npm run test:coverage

# Testes de integração
npm run test:integration
```

## 📦 Deploy

### 🚀 Railway (Produção)
O sistema está configurado para deploy automático no Railway:

```bash
# Build de produção
npm run build

# Variáveis de ambiente no Railway
NEXT_PUBLIC_BFF_BASE_URL=https://bff-production-cae3.up.railway.app/
BFF_BASE_URL=https://backoffice-veiculos-bff-production.up.railway.app
NEXT_PUBLIC_API_TIMEOUT=10000
NODE_ENV=production
```

### 🐳 Docker
```bash
# Build da imagem
docker build -t backoffice-veiculos-web .

# Executar container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BFF_BASE_URL=https://bff-production-cae3.up.railway.app \
  backoffice-veiculos-web
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente Completas
```env
# URLs do BFF
NEXT_PUBLIC_BFF_BASE_URL=https://bff-production-cae3.up.railway.app/
BFF_BASE_URL=https://backoffice-veiculos-bff-production.up.railway.app

# Configurações da API
NEXT_PUBLIC_API_TIMEOUT=10000

# Ambiente
NODE_ENV=production

# URLs de fallback (desenvolvimento)
NEXT_PUBLIC_FALLBACK_API_URL=https://backoffice-veiculos-api-production.up.railway.app
```

### Next.js Config
- **Rewrites**: Proxy automático para BFF
- **Images**: Configuração para domínios externos
- **Headers**: Configuração de segurança e encoding

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Use a API direta em desenvolvimento
2. **Imagens não carregam**: Verifique os domínios em `next.config.js`
3. **Login falha**: Confirme as credenciais e URLs
4. **Dados não aparecem**: Verifique os logs do console

### Logs de Debug
```bash
# Habilitar logs detalhados
DEBUG=api:* npm run dev
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Testes unitários obrigatórios

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Squad

- **Squad Backoffice**: Time responsável pelo desenvolvimento e manutenção
- **Tribe E-commerce**: Grupo responsável pelo domínio completo

## 📞 Suporte

Para suporte técnico:
- 📧 Email: squad-backoffice@empresa.com
- 🐛 Issues: [GitHub Issues](https://github.com/empresa/backoffice-veiculos-web/issues)
- 📚 Documentação: [Wiki do Projeto](https://github.com/empresa/backoffice-veiculos-web/wiki)

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Produção
