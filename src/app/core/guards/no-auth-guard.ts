import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';  // or 'rxjs' in RxJS 7+
import { Auth } from '../services/auth';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Return a UrlTree to redirect to the dashboard
        const dashboardRoute = authService.getDashboardRoute();
        return router.createUrlTree([dashboardRoute]);
      }
      // Allow navigation to the auth routes
      return true;
    })
  );
};
