export interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  quilometragem: number;
  combustivel: 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'eletrico' | 'hibrido';
  cambio: 'manual' | 'automatico' | 'cvt';
  cor: string;
  portas: number;
  categoria: 'hatch' | 'sedan' | 'suv' | 'pickup' | 'caminhao' | 'moto';
  status: 'ativo' | 'inativo' | 'vendido' | 'reservado';
  descricao?: string;
  imagens: string[];
  dataCriacao: string;
  dataAtualizacao: string;
  vendedor: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface CreateVeiculoRequest {
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
  quilometragem: number;
  combustivel: Veiculo['combustivel'];
  cambio: Veiculo['cambio'];
  cor: string;
  portas: number;
  categoria: Veiculo['categoria'];
  descricao?: string;
  imagens?: string[];
}

export interface UpdateVeiculoRequest extends Partial<CreateVeiculoRequest> {
  status?: Veiculo['status'];
}

export interface VeiculoFilters {
  marca?: string;
  modelo?: string;
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  combustivel?: Veiculo['combustivel'];
  cambio?: Veiculo['cambio'];
  categoria?: Veiculo['categoria'];
  status?: Veiculo['status'];
  search?: string;
}

export interface VeiculoListResponse {
  veiculos: Veiculo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
