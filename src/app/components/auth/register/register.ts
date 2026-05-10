import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { RouterLink } from '@angular/router';
import { RegisterDto } from '../../../models/registerDto';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMsg = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMsg = '';

    const name = this.name.trim();
    const email = this.email.trim();
    const password = this.password.trim();

    if (!name || !email || !password) {
      this.errorMsg = 'All fields are required';
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(name)) {
      this.errorMsg = 'Name must contain only letters';
      return;
    }

    if (!this.validateEmail(email)) {
      this.errorMsg = 'Invalid email format';
      return;
    }

    if (!this.validatePassword(password)) {
      this.errorMsg =
        'Password must contain 1 uppercase, 1 lowercase, 1 number and be 6+ chars';
      return;
    }

    if (password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }

    this.loading = true;

    const dto: RegisterDto = { name, email, password };

    this.authService.register(dto).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  }
}

