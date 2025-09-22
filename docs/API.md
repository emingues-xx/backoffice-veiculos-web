# API Documentation - Backoffice Veículos Web

## Visão Geral

O Backoffice Veículos Web se conecta ao Backend for Frontend (BFF) através de uma API REST. Todas as requisições são feitas para o BFF que atua como intermediário entre o frontend e os serviços backend.

## Configuração

### Base URL
```
http://localhost:3002
```

### Headers Padrão
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>" // Opcional
}
```

## Endpoints

### Health Check

#### GET /health
Verifica o status do BFF e serviços dependentes.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "up",
    "bff": "up"
  }
}
```

### Veículos

#### GET /api/veiculos
Lista veículos com filtros e paginação.

**Query Parameters:**
- `page` (number): Página atual (padrão: 1)
- `limit` (number): Itens por página (padrão: 25)
- `search` (string): Busca por marca, modelo ou descrição
- `marca` (string): Filtrar por marca
- `modelo` (string): Filtrar por modelo
- `anoMin` (number): Ano mínimo
- `anoMax` (number): Ano máximo
- `precoMin` (number): Preço mínimo
- `precoMax` (number): Preço máximo
- `combustivel` (string): Tipo de combustível
- `cambio` (string): Tipo de câmbio
- `categoria` (string): Categoria do veículo
- `status` (string): Status do veículo

**Response:**
```json
{
  "data": {
    "veiculos": [
      {
        "id": "uuid",
        "marca": "Toyota",
        "modelo": "Corolla",
        "ano": 2023,
        "preco": 85000.00,
        "quilometragem": 15000,
        "combustivel": "flex",
        "cambio": "automatico",
        "cor": "Branco",
        "portas": 4,
        "categoria": "sedan",
        "status": "ativo",
        "descricao": "Veículo em excelente estado",
        "imagens": ["url1", "url2"],
        "dataCriacao": "2024-01-15T10:30:00Z",
        "dataAtualizacao": "2024-01-15T10:30:00Z",
        "vendedor": {
          "id": "uuid",
          "nome": "João Silva",
          "email": "joao@email.com"
        }
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 25,
    "totalPages": 6
  },
  "success": true
}
```

#### GET /api/veiculos/:id
Obtém detalhes de um veículo específico.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "marca": "Toyota",
    "modelo": "Corolla",
    // ... outros campos
  },
  "success": true
}
```

#### POST /api/veiculos
Cria um novo veículo.

**Request Body:**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2023,
  "preco": 85000.00,
  "quilometragem": 15000,
  "combustivel": "flex",
  "cambio": "automatico",
  "cor": "Branco",
  "portas": 4,
  "categoria": "sedan",
  "descricao": "Veículo em excelente estado",
  "imagens": ["url1", "url2"]
}
```

#### PUT /api/veiculos/:id
Atualiza um veículo existente.

**Request Body:**
```json
{
  "preco": 82000.00,
  "status": "vendido",
  "descricao": "Veículo vendido"
}
```

#### DELETE /api/veiculos/:id
Remove um veículo.

**Response:**
```json
{
  "success": true,
  "message": "Veículo removido com sucesso"
}
```

### Dashboard

#### GET /api/dashboard/metrics
Obtém métricas para o dashboard.

**Response:**
```json
{
  "data": {
    "totalVeiculos": 150,
    "veiculosAtivos": 120,
    "veiculosVendidos": 30,
    "vendasMes": 15,
    "receitaMes": 1250000.00,
    "receitaTotal": 8500000.00,
    "veiculosPorCategoria": [
      {
        "categoria": "sedan",
        "quantidade": 45
      }
    ],
    "vendasPorMes": [
      {
        "mes": "2024-01",
        "vendas": 15,
        "receita": 1250000.00
      }
    ],
    "topMarcas": [
      {
        "marca": "Toyota",
        "quantidade": 25,
        "vendas": 20
      }
    ]
  },
  "success": true
}
```

### Vendas

#### GET /api/vendas
Lista vendas realizadas.

**Query Parameters:**
- `page` (number): Página atual
- `limit` (number): Itens por página
- `dataInicio` (string): Data de início (ISO 8601)
- `dataFim` (string): Data de fim (ISO 8601)

**Response:**
```json
{
  "data": {
    "vendas": [
      {
        "id": "uuid",
        "veiculoId": "uuid",
        "veiculo": {
          "marca": "Toyota",
          "modelo": "Corolla",
          "ano": 2023
        },
        "preco": 85000.00,
        "dataVenda": "2024-01-15T10:30:00Z",
        "comprador": {
          "nome": "Maria Santos",
          "email": "maria@email.com",
          "telefone": "(11) 99999-9999"
        },
        "vendedor": {
          "id": "uuid",
          "nome": "João Silva"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 25,
    "totalPages": 2
  },
  "success": true
}
```

### Upload

#### POST /api/upload
Faz upload de imagens.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "data": {
    "url": "https://storage.example.com/images/veiculo-123.jpg"
  },
  "success": true
}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Tratamento de Erros

Todas as respostas de erro seguem o padrão:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "code": "ERROR_CODE",
  "details": {
    // Detalhes adicionais do erro
  }
}
```

## Autenticação

O sistema suporta autenticação via Bearer Token. O token deve ser incluído no header `Authorization`:

```
Authorization: Bearer <seu-token>
```

## Rate Limiting

- **Dashboard**: 100 requests/minuto
- **Veículos**: 200 requests/minuto
- **Vendas**: 50 requests/minuto
- **Upload**: 10 requests/minuto

## Exemplos de Uso

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Listar veículos
const veiculos = await api.get('/api/veiculos', {
  params: {
    page: 1,
    limit: 25,
    status: 'ativo'
  }
});

// Criar veículo
const novoVeiculo = await api.post('/api/veiculos', {
  marca: 'Toyota',
  modelo: 'Corolla',
  ano: 2023,
  preco: 85000.00,
  // ... outros campos
});
```

### cURL

```bash
# Health check
curl http://localhost:3002/health

# Listar veículos
curl "http://localhost:3002/api/veiculos?page=1&limit=25&status=ativo"

# Criar veículo
curl -X POST http://localhost:3002/api/veiculos \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Toyota",
    "modelo": "Corolla",
    "ano": 2023,
    "preco": 85000.00
  }'
```
