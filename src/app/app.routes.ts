import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'calendar', loadComponent: () => import('./calendar/calendar').then(m => m.Calendar) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login)}
];
