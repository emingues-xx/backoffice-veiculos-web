# Backoffice Veículos Web

Sistema de backoffice para gestão de veículos do e-commerce, desenvolvido com Next.js e TypeScript.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **State Management**: React Query
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Heroicons, Lucide React
- **HTTP Client**: Axios

## 📋 Funcionalidades

### ✅ Implementadas
- **Dashboard**: Métricas e gráficos em tempo real
- **Gestão de Veículos**: CRUD completo com filtros avançados
- **Listagem de Vendas**: Histórico de vendas realizadas
- **Interface Responsiva**: Design moderno e mobile-first
- **Integração BFF**: Comunicação com backend via BFF

### 🚧 Em Desenvolvimento
- Relatórios avançados
- Gestão de usuários
- Configurações do sistema
- Upload de imagens
- Notificações em tempo real

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- BFF rodando em `http://localhost:3002`

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
NEXT_PUBLIC_BFF_BASE_URL=http://localhost:3002
```

4. **Execute o projeto**
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard/      # Componentes do dashboard
│   ├── Layout/         # Layout e navegação
│   └── Veiculos/       # Componentes de veículos
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
├── pages/              # Páginas Next.js
├── styles/             # Estilos globais
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

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

O sistema se conecta ao Backend for Frontend (BFF) disponível em `http://localhost:3002` através das seguintes APIs:

### Endpoints Utilizados
- `GET /health` - Health check
- `GET /api/veiculos` - Listar veículos
- `POST /api/veiculos` - Criar veículo
- `PUT /api/veiculos/:id` - Atualizar veículo
- `DELETE /api/veiculos/:id` - Excluir veículo
- `GET /api/dashboard/metrics` - Métricas do dashboard
- `GET /api/vendas` - Listar vendas

## 🎨 Design System

O sistema utiliza um design system consistente baseado em:
- **Cores**: Paleta primária azul com tons de cinza
- **Tipografia**: Inter font family
- **Componentes**: Headless UI para acessibilidade
- **Layout**: Grid responsivo com Tailwind CSS

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com navegação colapsável
- **Mobile**: Interface otimizada para touch

## 🔒 Segurança

- Validação de formulários no frontend
- Sanitização de dados de entrada
- Headers de segurança configurados
- Autenticação preparada para integração

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test

# Testes com coverage
npm run test:coverage
```

## 📦 Deploy

### Build de Produção
```bash
npm run build
npm run start
```

### Variáveis de Ambiente para Produção
```env
NEXT_PUBLIC_BFF_BASE_URL=https://api.veiculos.com
NODE_ENV=production
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Squad

- **Squad Backoffice**: Time responsável pelo desenvolvimento e manutenção
- **Tribe E-commerce**: Grupo responsável pelo domínio completo

## 📞 Suporte

Para suporte técnico, entre em contato com a Squad Backoffice ou abra uma issue no repositório.
