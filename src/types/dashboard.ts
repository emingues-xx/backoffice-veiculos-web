export interface DashboardMetrics {
  totalVeiculos: number;
  veiculosAtivos: number;
  veiculosVendidos: number;
  vendasMes: number;
  receitaMes: number;
  receitaTotal: number;
  veiculosPorCategoria: {
    categoria: string;
    quantidade: number;
  }[];
  vendasPorMes: {
    mes: string;
    vendas: number;
    receita: number;
  }[];
  topMarcas: {
    marca: string;
    quantidade: number;
    vendas: number;
  }[];
}

export interface Venda {
  id: string;
  veiculoId: string;
  veiculo: {
    marca: string;
    modelo: string;
    ano: number;
  };
  preco: number;
  dataVenda: string;
  comprador: {
    nome: string;
    email: string;
    telefone: string;
  };
  vendedor: {
    id: string;
    nome: string;
  };
}

export interface VendasResponse {
  vendas: Venda[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
