import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors: string[] = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            } else {
              console.error(error.statusText, error.status);
            }
            break;
          case 401:
            console.error('Unauthorized', error.status);
            // If token expired, logout user
            if (error.error === 'Token expired') {
              authService.logout();
              router.navigateByUrl('/login');
            }
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            router.navigateByUrl('/server-error', { 
              state: { error: error.error } 
            });
            break;
          default:
            console.error('Something unexpected went wrong');
            console.error(error);
            break;
        }
      }
      return throwError(() => error);
    })
  );
};