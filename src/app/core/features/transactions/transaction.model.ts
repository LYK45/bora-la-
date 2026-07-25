export type TipoTransacao = 'receita' | 'despesa';

export interface Transaction {
  _id?: string;
  usuarioId?: string;
  tipo: TipoTransacao;
  valor: number;
  categoria: string;
  descricao: string;
  data: string | Date;
  metaId?: string | null;
}
