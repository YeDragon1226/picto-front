import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  username = '';
  password = '';
  showLogin = false;

  constructor(private router: Router) {}

  login() {
    if (this.username && this.password) {
      this.router.navigate(['/home']);
    } else {
      alert('Enter both username and password.');
    }
  }

  onLogoHover() {
    this.showLogin = true;
  }
}
