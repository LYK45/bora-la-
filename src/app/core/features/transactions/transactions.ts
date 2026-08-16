import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from './transaction.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from './transaction.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-transactions',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder)
  private transactionService = inject(TransactionService);
  private snackbarService = inject(SnackbarService);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  isModalOpen = false;
  searchTerm = '';
  filterTipo = '';

  transactionForm: FormGroup = this.fb.group({
    tipo: ['despesa', [Validators.required]],
    valor: [null, [Validators.required, Validators.min(0.01)]],
    categoria: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    data: [new Date().toISOString().substring(0, 10), [Validators.required]]
  });

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data: any) => {
        this.transactions = data.transacoes || [];
        this.applyFilters();
      }
    });
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      const descricao = t.descricao || '';
      const categoria = t.categoria || '';
      const matchSearch = descricao.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        categoria.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchTipo = !this.filterTipo || t.tipo === this.filterTipo;
      return matchSearch && matchTipo;
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onFilterTipoChange(event: any) {
    this.filterTipo = event.target.value;
    this.applyFilters();
  };

  openModal() {
    this.isModalOpen = true;
    this.transactionForm.reset({
      tipo: 'despesa',
      data: new Date().toISOString().substring(0, 10)
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.transactionForm.invalid) return;

    this.transactionService.createTransaction(this.transactionForm.value).subscribe({
      next: () => {
        this.loadTransactions();
        this.closeModal();
        this.snackbarService.show('Transação criada com sucesso!', 'success');
      },
      error: (err) => {
        this.snackbarService.show('Erro ao criar transação.', 'error');
      }
    });
  }

  onDelete(id: string) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
          this.snackbarService.show('Transação excluída com sucesso!', 'success');
        },
        error: (err) => {
          this.snackbarService.show('Erro ao excluir transação.', 'error');
        }
      })
    }
  }
}
