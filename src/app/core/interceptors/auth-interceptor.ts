import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../services/auth';
import { Token } from '../services/token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const authService = inject(Auth);
  const tokenService = inject(Token);

  const token = tokenService.getToken();
  
  // Add auth header if token exists and is not expired
  if (token && !tokenService.isTokenExpired()) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid, logout user
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};
