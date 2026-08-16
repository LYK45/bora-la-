import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from './core/auth-services/auth';
import { Snackbar } from "./shared/components/snackbar/snackbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Snackbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  private authService = inject(Auth);

  showSidebar = false;

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const publicRoutes = ['/', '/login', '/register', '/recovery'];
        this.showSidebar = this.authService.isLoggedIn() && !publicRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
  logout() {
    this.authService.logout();
  }
}
