import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';


@Component({
  selector: 'app-verify-email',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmailComponent
implements OnInit {

  email = '';

  code = '';

  loading = false;

  successMsg = '';

  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.email =
      this.route.snapshot.queryParams['email'];
  }

  verifyEmail() {

    this.successMsg = '';

    this.errorMsg = '';

    if (!this.code || this.code.length !== 6) {

      this.errorMsg =
        'Please enter valid 6-digit code';

      return;
    }

    this.loading = true;

    this.authService.verifyEmail({
      email: this.email,
      code: this.code
    })
    .subscribe({

      next: () => {

        this.loading = false;

        this.successMsg =
          'Email verified successfully ✅';

        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 1800);
      },

      error: (err) => {

        this.loading = false;

        this.errorMsg =
          err.error ||
          'Invalid or expired verification code ❌';
      }
    });
  }
}