import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { Data } from './data/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
    constructor(private router: Router) {}

  todayTasks: string[] = [];

  ngOnInit() {
    const data = new Data();
    this.todayTasks = data.getTodayTasks();
  }

  logout(): void {
     this.router.navigate(['/login']);
  }

  isLoginPage(): boolean {
  return this.router.url === '/login';
}
}
