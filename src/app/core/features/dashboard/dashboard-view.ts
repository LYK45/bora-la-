import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Dashboard } from './dashboard';
import { DashboardData } from './dashboard.model';

@Component({
  selector: 'app-dashboard-view',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './dashboard-view.html',
  styleUrl: './dashboard-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardView implements OnInit {
  private dashboardService = inject(Dashboard);

  dashboardData = signal<DashboardData | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDashboard();
  }

  retry(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar seu resumo financeiro. Tente novamente.');
        this.isLoading.set(false);
      }
    });
  }
}
