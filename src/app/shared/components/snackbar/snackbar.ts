import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { SnackbarService } from "../../services/snackbar.service";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css',
  standalone: true
})
export class Snackbar implements OnInit, OnDestroy {
  private snackbarService = inject(SnackbarService);
  private subscription!: Subscription;
  private timeoutId: any;

  message = '';
  type: 'success' | 'error' | 'info' = 'success';
  isVisible = false;

  ngOnInit(): void {
    this.subscription = this.snackbarService.snackbar$.subscribe({
      next: (data) => {
        this.message = data.message;
        this.type = data.type;
        this.isVisible = true;

        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        const duration = data.duration || 3000;
        this.timeoutId = setTimeout(() => {
          this.close();
        }, duration);
      }
    });
  }

  close() {
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
