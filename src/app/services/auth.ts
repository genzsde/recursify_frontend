import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RegisterDto } from '../models/registerDto';
import { UserResponseDto } from '../models/userResponseDto';
import { AuthResponseDto } from '../models/authResponseDto';
import { LoginDto } from '../models/loginDto';
import { VerifyEmailDto } from '../models/verifyEmailDto';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  register(
    dto: RegisterDto
  ): Observable<UserResponseDto> {

    return this.http.post<UserResponseDto>(
      `${this.baseUrl}/register`,
      dto
    );
  }

  login(
    dto: LoginDto
  ): Observable<AuthResponseDto> {

    return this.http.post<AuthResponseDto>(
      `${this.baseUrl}/login`,
      dto
    );
  }

  verifyEmail(
    dto: VerifyEmailDto
  ): Observable<string> {

    return this.http.post(
      `${this.baseUrl}/verify-email`,
      dto,
      {
        responseType: 'text'
      }
    );
  }

  saveToken(token: string) {

    localStorage.setItem(
      'authToken',
      token
    );
  }

  getToken(): string | null {

    return localStorage.getItem(
      'authToken'
    );
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  logout() {

    localStorage.removeItem('authToken');

    localStorage.removeItem('userName');
  }
}