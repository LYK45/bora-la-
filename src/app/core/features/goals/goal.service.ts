import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Goal } from './goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private apiUrl = (environment.apiUrl);
  private http = inject(HttpClient);

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals`);
  }

  createGoal(transaction: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, transaction);
  }

  updateGoal(id: string, transaction: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/goals/${id}`, transaction);
  }

  deleteGoal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/goals/${id}`);
  }
}
