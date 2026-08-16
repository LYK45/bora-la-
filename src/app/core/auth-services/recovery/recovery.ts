import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recovery',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './recovery.html',
  styleUrl: './recovery.css',
})
export class Recovery {
  private fb = inject(FormBuilder);

  errorMessage = '';
  successMessage = '';

  recoveryForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.recoveryForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.recoveryForm.invalid) return;

    const email = this.recoveryForm.value.email;
    this.successMessage = `Se o e-mail "${email}" estiver cadastrado no sistema,
    você receberá um link de redefinição de senha em alguns minutos.`;
  }
}
