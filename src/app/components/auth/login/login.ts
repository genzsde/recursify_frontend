import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { RouterLink } from '@angular/router';
import { LoginDto } from '../../../models/loginDto';
import { AuthResponseDto } from '../../../models/authResponseDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  mouseX = 0;
  mouseY = 0;
  private mouseListener!: (e: MouseEvent) => void;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.mouseListener = (e: MouseEvent) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    };
    window.addEventListener('mousemove', this.mouseListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.mouseListener);
  }

  login(): void {
    this.errorMsg = '';
    this.cdr.detectChanges();

    const email = this.email.trim();
    const password = this.password.trim();

    if (!email || !password) {
      this.errorMsg = 'All fields are required';
      this.cdr.detectChanges();
      return;
    }

    if (!this.validateEmail(email)) {
      this.errorMsg = 'Invalid email format';
      this.cdr.detectChanges();
      return;
    }

    if (password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const dto: LoginDto = { email, password };

    this.authService.login(dto).subscribe({
      next: (res: AuthResponseDto) => {
        this.authService.saveToken(res.token);
        localStorage.setItem('userName', res.name);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        let extractedMessage = 'Login failed';

        try {
          if (err.error && typeof err.error === 'object') {
            if (err.error.error) {
              extractedMessage = String(err.error.error);
            } else if (err.error.message) {
              extractedMessage = String(err.error.message);
            }
          } else if (typeof err.error === 'string') {
            extractedMessage = this.cleanExceptionString(err.error);
          } else {
            // Status-based fallback
            if (err.status === 400) extractedMessage = 'Invalid credentials';
            if (err.status === 401) extractedMessage = 'Invalid email or password';
            if (err.status === 403) extractedMessage = 'Account not verified';
            if (err.status === 404) extractedMessage = 'User not found';
            if (err.status === 500) extractedMessage = 'Server error';
          }
        } catch (e) {
          console.log('Error extraction failed:', e);
        }

        // CRITICAL: Run inside NgZone so Angular detects the change
        this.ngZone.run(() => {
          this.errorMsg = extractedMessage;
          console.log('>>> LOGIN ERROR SET:', this.errorMsg);
          this.cdr.detectChanges();
        });
      }
    });
  }

  private cleanExceptionString(error: string): string {
    if (!error) return 'Login failed';
    return error
      .replace(/^java\.lang\.\w+Exception:\s*/, '')
      .replace(/^\w+Exception:\s*/, '')
      .trim();
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}