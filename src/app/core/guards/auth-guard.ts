import { CanActivateFn } from '@angular/router';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core'
import { map, take } from 'rxjs/operators';
import { Auth } from '../services/auth';
import { APP_CONSTANTS } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated && authService.isAuthenticated()) {
        return true;
      } else {
        router.navigate([APP_CONSTANTS.ROUTES.LOGIN], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    })
  );
};
