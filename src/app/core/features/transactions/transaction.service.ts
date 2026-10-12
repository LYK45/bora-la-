import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Transaction } from './transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    const timestamp = new Date().getTime(); // 👈 Cria a marcação de tempo
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions?t=${timestamp}`); // 👈 Adiciona na URL
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }

  updateTransaction(id: string, transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<any> { // 👈 Observable<any>
    return this.http.delete<any>(`${this.apiUrl}/transactions/${id}`);
  }
}
