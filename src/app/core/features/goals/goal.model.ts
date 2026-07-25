export interface Goal {
  _id?: string;
  id?: string;
  usuarioId?: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  dataLimite?: string | Date;
  progressoPorcentagem?: number;
}
