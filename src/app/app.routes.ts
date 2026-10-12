import { Routes } from '@angular/router';
import { Home } from './core/home/home';
import { Login } from './core/auth-services/login/login';
import { Register } from './core/auth-services/register/register';
import { Recovery } from './core/auth-services/recovery/recovery';
import { DashboardView } from './core/features/dashboard/dashboard-view';
import { authGuard } from './core/auth-services/guards/auth-guard';
import { Transactions } from './core/features/transactions/transactions';
import { Profile } from './core/profile/profile';
import { Goal } from './core/features/goals/goal';

export const routes: Routes = [
  // 🔓 Rotas Públicas (Livre Acesso)
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recovery', component: Recovery },

  // 🔒 Rotas Privadas
  { path: 'dashboard', component: DashboardView, canActivate: [authGuard] },
  { path: 'transactions', component: Transactions, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'goals', component: Goal, canActivate: [authGuard] },

  // 🔄 Redirecionamento
  { path: '**', redirectTo: '' }
];
