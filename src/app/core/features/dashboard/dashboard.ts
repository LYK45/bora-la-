import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DashboardData } from './dashboard.model';

@Injectable({
  providedIn: 'root',
})

export class Dashboard {
  private apiUrl = (environment.apiUrl);
  private http = inject(HttpClient);

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboards`);
  }

}
