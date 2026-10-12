import { Component, inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { TransactionService } from './transaction.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Transaction } from './transaction.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css'],
})
export class Transactions implements OnInit {
  private fb = inject(FormBuilder)
  private transactionService = inject(TransactionService);
  private snackbarService = inject(SnackbarService);
  private platformId = inject(PLATFORM_ID);
  private cdRef = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  isModalOpen = false;
  isEditing = false;
  editingTransactionId: string | null = null;
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
    if (isPlatformBrowser(this.platformId)) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data: any) => {
        this.transactions = data.transacoes || data || [];
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
    // Detect changes safely on the next microtask to avoid
    // ExpressionChangedAfterItHasBeenCheckedError during the same CD cycle.
    try {
      Promise.resolve().then(() => this.cdRef.detectChanges());
    } catch (e) { /* noop */ }
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
    this.isEditing = false;
    this.editingTransactionId = null;
    this.isModalOpen = true;
    this.transactionForm.reset({
      tipo: 'despesa',
      data: new Date().toISOString().substring(0, 10)
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingTransactionId = null;
  }

  openEditModal(transaction: Transaction) {
    this.isEditing = true;
    this.editingTransactionId = transaction._id || null;
    this.isModalOpen = true;

    let dateStr = '';
    if (transaction.data) {
      const dateObj = new Date(transaction.data);
      dateStr = dateObj.toISOString().substring(0, 10);
    }
    else {
      dateStr = new Date().toISOString().substring(0, 10);
    }

    this.transactionForm.patchValue({
      tipo: transaction.tipo,
      valor: transaction.valor,
      categoria: transaction.categoria,
      descricao: transaction.descricao,
      data: dateStr
    })
  }

  onSubmit() {
    if (this.transactionForm.invalid) return;

    const transactionData = this.transactionForm.value;

    if (this.isEditing && this.editingTransactionId) {
      this.transactionService.updateTransaction(this.editingTransactionId, transactionData).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
          this.snackbarService.show('Transação atualizada com sucesso!', 'success');
        },
        error: (err) => {
          this.snackbarService.show('Erro ao atualizar transação.', 'error');
        }
      });
    }
    else {
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
