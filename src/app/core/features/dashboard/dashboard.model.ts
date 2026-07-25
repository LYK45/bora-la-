import { Goal } from '../goals/goal.model';

export interface DashboardData {
  saldo: number;
  totalReceitas: number;
  totalDespesas: number;
  despesasPorCategoria: Record<string, number>;
  metas: Goal[];
}
