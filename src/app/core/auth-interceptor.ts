import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Get token
  const token = authService.getToken() || localStorage.getItem('authToken');

  let authReq = req;

  // Attach JWT automatically
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      console.log("Interceptor Error:", error);

      // 401 → Unauthorized / token expired
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
      }

      // 400 → Validation error (your duplicate question case)
      if (error.status === 400) {
        return throwError(() => error.error);
      }

      // 500 → Server crash
      if (error.status === 500) {
        alert("Server error. Try again later.");
      }

      return throwError(() => error);
    })
  );
};
