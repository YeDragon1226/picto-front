import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'review', loadComponent: () => import('./review/review').then(m => m.Review) },
  { path: 'tasks', loadComponent: () => import('./tasks/tasks').then(m => m.Tasks) },
  { path: 'calendar', loadComponent: () => import('./calendar/calendar').then(m => m.Calendar) },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login)}
];
