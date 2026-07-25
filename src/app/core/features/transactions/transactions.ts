import { Component, inject } from '@angular/core';
import { TransactionService } from './transaction.service'; // 👈 Importa o serviço

@Component({
  selector: 'app-transactions',
  imports: [],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  private transactionService = inject(TransactionService); // 👈 Injeta o serviço
}
