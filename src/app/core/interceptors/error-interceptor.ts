import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Notification } from '../services/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
 const notificationService = inject(Notification);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Server Error: ${error.status}`;
        }
      }

      // Show error notification (except for 401 as auth interceptor handles it)
      if (error.status !== 401) {
        notificationService.showError(errorMessage);
      }

      console.error('HTTP Error:', error);
      
      return throwError(() => error);
    })
  );
};
