import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Panel } from './pages/panel/panel';
import { authGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'panel', component: Panel, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
