# 🤝 Guia de Contribuição - Backoffice Veículos

Obrigado por considerar contribuir com o projeto Backoffice Veículos! Este guia irá ajudá-lo a entender como contribuir de forma eficaz.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Testes](#testes)
- [Documentação](#documentação)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Features](#solicitar-features)

## 🚀 Como Contribuir

### Tipos de Contribuição

1. **🐛 Bug Fixes**: Correção de bugs existentes
2. **✨ Features**: Implementação de novas funcionalidades
3. **📚 Documentação**: Melhoria da documentação
4. **🧪 Testes**: Adição ou melhoria de testes
5. **🎨 UI/UX**: Melhorias na interface e experiência
6. **⚡ Performance**: Otimizações de performance
7. **🔒 Segurança**: Melhorias de segurança

### Antes de Começar

- [ ] Verifique se já existe uma issue relacionada
- [ ] Leia a documentação do projeto
- [ ] Configure o ambiente de desenvolvimento
- [ ] Familiarize-se com os padrões de código

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git
- Editor de código (VS Code recomendado)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/backoffice-veiculos-web.git
cd backoffice-veiculos-web

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp env.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Extensões Recomendadas (VS Code)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ Bom
interface UserProps {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'seller';
}

const UserCard: React.FC<UserProps> = ({ id, name, email, role }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <span className={`role role--${role}`}>{role}</span>
    </div>
  );
};

// ❌ Ruim
const UserCard = (props) => {
  return <div>{props.name}</div>;
};
```

### Nomenclatura

```typescript
// Componentes: PascalCase
const MetricCard = () => {};

// Hooks: camelCase com prefixo 'use'
const useMetrics = () => {};

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Interfaces: PascalCase
interface UserData {}

// Tipos: PascalCase
type UserRole = 'admin' | 'manager';
```

### Estrutura de Arquivos

```
src/components/
├── MetricCard/
│   ├── index.tsx          # Componente principal
│   ├── MetricCard.test.tsx # Testes
│   ├── MetricCard.stories.tsx # Storybook
│   └── types.ts           # Tipos específicos
```

### Imports

```typescript
// ✅ Ordem correta
// 1. React e bibliotecas externas
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';

// 2. Imports internos (absolutos)
import { useAuth } from '@/components/Auth/AuthProvider';
import { formatCurrency } from '@/utils/formatters';

// 3. Imports relativos
import './MetricCard.css';
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Auth/            # Autenticação
│   ├── Dashboard/       # Dashboard
│   ├── Layout/          # Layout
│   └── _tests_/         # Testes
├── hooks/               # Hooks customizados
├── lib/                 # Configurações
├── pages/               # Páginas Next.js
├── services/            # Serviços de API
├── types/               # Definições TypeScript
├── utils/               # Utilitários
└── styles/              # Estilos
```

### Convenções de Pastas

- **components/**: Componentes reutilizáveis
- **pages/**: Páginas do Next.js (roteamento)
- **hooks/**: Hooks customizados
- **services/**: Lógica de API
- **utils/**: Funções utilitárias
- **types/**: Definições TypeScript

## 🔄 Processo de Desenvolvimento

### 1. Criar Branch

```bash
# Branch para feature
git checkout -b feature/nova-funcionalidade

# Branch para bugfix
git checkout -b bugfix/corrigir-erro

# Branch para hotfix
git checkout -b hotfix/correcao-critica
```

### 2. Desenvolvimento

```bash
# Fazer commits frequentes
git add .
git commit -m "feat: adicionar componente MetricCard"

# Push da branch
git push origin feature/nova-funcionalidade
```

### 3. Convenções de Commit

```bash
# Formato: tipo(escopo): descrição

# Tipos
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção

# Exemplos
feat(dashboard): adicionar gráfico de vendas
fix(auth): corrigir validação de token
docs(readme): atualizar instruções de instalação
```

### 4. Pull Request

- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Screenshots (se aplicável)
- [ ] Descrição clara das mudanças

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testes E2E
npm run test:e2e
```

### Escrever Testes

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders with correct props', () => {
    render(
      <MetricCard 
        title="Sales" 
        value={1000} 
        change={5.2} 
      />
    );
    
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<MetricCard title="Sales" loading />);
    expect(screen.getByTestId('metric-skeleton')).toBeInTheDocument();
  });
});
```

### Cobertura de Testes

- **Mínimo**: 80% de cobertura
- **Ideal**: 90%+ de cobertura
- **Crítico**: 100% para componentes de segurança

## 📚 Documentação

### JSDoc

```typescript
/**
 * Componente para exibir métricas do dashboard
 * @param title - Título da métrica
 * @param value - Valor numérico
 * @param change - Variação percentual
 * @param loading - Estado de carregamento
 */
interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  loading?: boolean;
}
```

### README

- Atualizar README.md para mudanças significativas
- Incluir exemplos de uso
- Documentar novas dependências

### Storybook

```typescript
// MetricCard.stories.tsx
export default {
  title: 'Dashboard/MetricCard',
  component: MetricCard,
  parameters: {
    docs: {
      description: {
        component: 'Componente para exibir métricas do dashboard'
      }
    }
  }
};

export const Default = {
  args: {
    title: 'Total Sales',
    value: 125000,
    change: 12.5
  }
};
```

## 🔀 Pull Requests

### Template de PR

```markdown
## 📝 Descrição
Breve descrição das mudanças realizadas.

## 🔗 Issue Relacionada
Closes #123

## 🧪 Testes
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes E2E (se aplicável)
- [ ] Testado manualmente

## 📸 Screenshots
(Se aplicável)

## 📋 Checklist
- [ ] Código segue os padrões do projeto
- [ ] Documentação atualizada
- [ ] Testes passando
- [ ] Build sem erros
```

### Review Process

1. **Automático**: CI/CD pipeline
2. **Code Review**: Pelo menos 1 aprovação
3. **QA**: Teste manual (se necessário)
4. **Merge**: Após aprovação

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
## 🐛 Descrição do Bug
Descrição clara e concisa do bug.

## 🔄 Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## 🎯 Comportamento Esperado
O que deveria acontecer.

## 📱 Ambiente
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.2.3]

## 📸 Screenshots
(Se aplicável)

## 📋 Informações Adicionais
Qualquer informação adicional relevante.
```

## ✨ Solicitar Features

### Template de Feature Request

```markdown
## 🚀 Feature Request
Descrição clara da funcionalidade desejada.

## 💡 Motivação
Por que esta feature seria útil?

## 📋 Descrição Detalhada
Como a feature deveria funcionar?

## 🎨 Mockups/Exemplos
(Se aplicável)

## 📋 Alternativas Consideradas
Outras soluções que você considerou.

## 📱 Contexto Adicional
Qualquer contexto adicional.
```

## 🏷️ Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

## 🤝 Código de Conduta

### Nossos Compromissos

- Ambiente acolhedor e inclusivo
- Respeito mútuo
- Foco no que é melhor para a comunidade
- Aceitar críticas construtivas

### Comportamentos Inaceitáveis

- Linguagem ou imagens ofensivas
- Trolling, insultos ou ataques pessoais
- Assédio público ou privado
- Publicação de informações privadas

## 📞 Suporte

### Canais de Comunicação

- **Issues**: Para bugs e features
- **Discussions**: Para dúvidas gerais
- **Email**: suporte@backoffice.com

### Recursos Úteis

- [Documentação da API](docs/API.md)
- [Arquitetura do Sistema](docs/DASHBOARD_ARCHITECTURE.md)
- [Guia de Deploy](docs/DEPLOY.md)

## 🎉 Reconhecimento

Contribuidores são reconhecidos em:

- README.md
- Release notes
- Hall of fame
- Certificados de contribuição

---

**Obrigado por contribuir! 🚀**

*Este guia é um documento vivo e será atualizado conforme necessário.*
