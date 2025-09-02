import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { UserRole } from '../models/auth.model';
import { APP_CONSTANTS } from '../constants/app.constants';

// Main role guard function that can be used for both CanActivate and CanActivateChild
const checkRoleAccess = (route: any, state: any): boolean => {
  const authService = inject(Auth);
  const router = inject(Router);

  try {
    // First check authentication
    if (!authService.isAuthenticated()) {
      console.warn('User not authenticated, redirecting to login');
      router.navigate([APP_CONSTANTS.ROUTES.LOGIN]);
      return false;
    }

    // Get current user
    const user = authService.getCurrentUser();
    if (!user) {
      console.warn('No user found, redirecting to login');
      router.navigate([APP_CONSTANTS.ROUTES.LOGIN]);
      return false;
    }

    // Get required roles - check both route and parent route data
    let expectedRoles: UserRole[] = route.data?.['roles'];
    
    // If no roles on current route, check parent route
    if (!expectedRoles && route.parent?.data?.['roles']) {
      expectedRoles = route.parent.data['roles'];
    }
    
    // If still no roles specified, allow access (or deny based on your security model)
    if (!expectedRoles || expectedRoles.length === 0) {
      console.warn('No roles specified for this route, allowing access');
      return true; // Change to false for stricter security
    }

    // Check if user has required role
    const hasRequiredRole = expectedRoles.includes(user.role);
    
    if (hasRequiredRole) {
      console.log(`Access granted for role: ${user.role} to route: ${state.url}`);
      return true;
    }

    // Access denied - redirect to appropriate dashboard
    console.warn(`Access denied. User role: ${user.role}, Required roles: ${expectedRoles.join(', ')}, Attempted route: ${state.url}`);
    const dashboardRoute = authService.getDashboardRoute();
    router.navigate([dashboardRoute]);
    return false;

  } catch (error) {
    console.error('Error in role guard:', error);
    router.navigate([APP_CONSTANTS.ROUTES.LOGIN]);
    return false;
  }
};

// Export as CanActivateFn
export const roleGuard: CanActivateFn = (route, state) => {
  return checkRoleAccess(route, state);
};

// Export as CanActivateChildFn for child routes
export const roleChildGuard: CanActivateChildFn = (childRoute, state) => {
  return checkRoleAccess(childRoute, state);
};
