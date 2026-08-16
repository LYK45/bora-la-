import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


export interface SnackbarData {
  message: string;
  type: 'success' | 'error' | 'info'
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarSubject = new Subject<SnackbarData>();

  snackbar$ = this.snackbarSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) {
    this.snackbarSubject.next({ message, type, duration });
  }
}
