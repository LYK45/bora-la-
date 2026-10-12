import { Component, inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalsService } from './goal.service';
import { Goal as GoalModel } from './goal.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goal.html',
  styleUrl: './goal.css',
})
export class Goal implements OnInit {
  private fb = inject(FormBuilder);
  private goalService = inject(GoalsService);
  private snackbarService = inject(SnackbarService);
  private platformId = inject(PLATFORM_ID);
  private cdRef = inject(ChangeDetectorRef);

  goals: GoalModel[] = [];

  isModalOpen = false;
  isEditing = false;
  editingGoalId: string | null = null;

  goalForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required]],
    valorAlvo: [null, [Validators.required, Validators.min(0.01)]],
    valorAtual: [0, [Validators.required, Validators.min(0)]],
    dataLimite: ['']
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoals();
    }
  }

  loadGoals(): void {
    this.goalService.getGoals().subscribe({
      next: (data: any) => {
        this.goals = data.metas || data.goals || (Array.isArray(data) ? data : []);
        try {
          Promise.resolve().then(() => this.cdRef.detectChanges());
        } catch (e) { /* noop */ }
      },
      error: () => {
        this.snackbarService.show('Erro ao carregar metas.', 'error');
      }
    });
  }

  calculatePercentage(valorAtual: number, valorAlvo: number): number {
    if (!valorAlvo || valorAlvo <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round(((valorAtual || 0) / valorAlvo) * 100)));
  }

  openModal(): void {
    this.isEditing = false;
    this.editingGoalId = null;
    this.isModalOpen = true;
    this.goalForm.reset({
      titulo: '',
      valorAlvo: null,
      valorAtual: 0,
      dataLimite: ''
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingGoalId = null;
  }

  openEditModal(goal: GoalModel): void {
    this.isEditing = true;
    this.editingGoalId = goal._id || goal.id || null;
    this.isModalOpen = true;

    let dateStr = '';
    if (goal.dataLimite) {
      const dateObj = new Date(goal.dataLimite);
      if (!isNaN(dateObj.getTime())) {
        dateStr = dateObj.toISOString().substring(0, 10);
      }
    }

    this.goalForm.patchValue({
      titulo: goal.titulo,
      valorAlvo: goal.valorAlvo,
      valorAtual: goal.valorAtual ?? 0,
      dataLimite: dateStr
    });
  }

  onSubmit(): void {
    if (this.goalForm.invalid) return;

    const formValue = this.goalForm.value;
    const goalData: GoalModel = {
      titulo: formValue.titulo,
      valorAlvo: Number(formValue.valorAlvo),
      valorAtual: Number(formValue.valorAtual) || 0,
      dataLimite: formValue.dataLimite ? formValue.dataLimite : undefined
    };

    if (this.isEditing && this.editingGoalId) {
      this.goalService.updateGoal(this.editingGoalId, goalData).subscribe({
        next: () => {
          this.loadGoals();
          this.closeModal();
          this.snackbarService.show('Meta atualizada com sucesso!', 'success');
        },
        error: () => {
          this.snackbarService.show('Erro ao atualizar meta.', 'error');
        }
      });
    } else {
      this.goalService.createGoal(goalData).subscribe({
        next: () => {
          this.loadGoals();
          this.closeModal();
          this.snackbarService.show('Meta criada com sucesso!', 'success');
        },
        error: () => {
          this.snackbarService.show('Erro ao criar meta.', 'error');
        }
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.goalService.deleteGoal(id).subscribe({
        next: () => {
          this.loadGoals();
          this.snackbarService.show('Meta excluída com sucesso!', 'success');
        },
        error: () => {
          this.snackbarService.show('Erro ao excluir meta.', 'error');
        }
      });
    }
  }
}
