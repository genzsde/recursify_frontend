import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { RegisterDto } from '../../../models/registerDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
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

  register(): void {
    this.errorMsg = '';
    this.cdr.detectChanges();
    
    const name = this.name.trim();
    const email = this.email.trim();
    const password = this.password.trim();

    if (!name || !email || !password) {
      this.errorMsg = 'All fields are required';
      this.cdr.detectChanges();
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(name)) {
      this.errorMsg = 'Name must contain only letters';
      this.cdr.detectChanges();
      return;
    }
    if (!this.validateEmail(email)) {
      this.errorMsg = 'Invalid email format';
      this.cdr.detectChanges();
      return;
    }
    if (!this.validatePassword(password)) {
      this.errorMsg = 'Password must contain 1 uppercase, 1 lowercase, 1 number and be 6+ chars';
      this.cdr.detectChanges();
      return;
    }
    if (password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const dto: RegisterDto = { name, email, password };

    this.authService.register(dto).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/verify-email'], { queryParams: { email } });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        
        let extractedMessage = 'Registration failed';
        
        if (err.error && typeof err.error === 'object' && err.error.error) {
          extractedMessage = String(err.error.error);
        } else if (err.error && typeof err.error === 'object' && err.error.message) {
          extractedMessage = String(err.error.message);
        } else if (typeof err.error === 'string') {
          extractedMessage = err.error;
        } else if (err.status === 400) {
          extractedMessage = 'User already exists';
        }

        // CRITICAL FIX: Run inside NgZone so Angular detects the change
        this.ngZone.run(() => {
          this.errorMsg = extractedMessage;
          console.log('>>> SET errorMsg =', this.errorMsg);
          this.cdr.detectChanges();
        });
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