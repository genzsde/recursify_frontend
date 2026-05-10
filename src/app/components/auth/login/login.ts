import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { RouterLink } from '@angular/router';
import { LoginDto } from '../../../models/loginDto';
import { AuthResponseDto } from '../../../models/authResponseDto';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMsg = '';

    const email = this.email.trim();
    const password = this.password.trim();

    if (!email || !password) {
      this.errorMsg = 'All fields are required';
      return;
    }

    if (!this.validateEmail(email)) {
      this.errorMsg = 'Invalid email format';
      return;
    }

    if (password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    const dto: LoginDto = { email, password };

    this.authService.login(dto).subscribe({
      next: (res: AuthResponseDto) => {
        this.authService.saveToken(res.token);
        localStorage.setItem('userName', res.name);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
