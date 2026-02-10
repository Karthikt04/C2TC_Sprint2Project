import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminApi } from '../../services/admin-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private api: AdminApi, private router: Router) { }

  login() {
    this.errorMessage = '';
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        localStorage.setItem('loggedIn', 'true');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid credentials. Try again!';
        } else {
          this.errorMessage = 'Something went wrong. Please try later.';
        }
      }
    });
  }
}