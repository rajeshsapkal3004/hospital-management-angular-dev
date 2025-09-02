// auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Token } from './token';
import {
  LoginRequest,
  LoginResponse,
  AdminUser,
  UserRole
} from '../models/auth.model';
import { APP_CONSTANTS } from '../constants/app.constants';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: Token,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.tokenService.getToken();
    const userStr = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER);

    if (token && !this.tokenService.isTokenExpired() && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.setCurrentUser(user);
        this.setAuthenticated(true);
      } catch (error) {
        this.handleLogout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}${APP_CONSTANTS.API_ENDPOINTS.LOGIN}`, credentials)
      .pipe(
        map(response => {
          console.log('Backend response:', response);

          // Transform the backend response to match your LoginResponse interface
          const loginResponse: LoginResponse = {
            success: true,
            token: response.token,
            refreshToken: response.refreshToken,
            user: {
              id: response.id,
              username: response.username, // Add username field
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              role: this.mapRoleFromBackend(response.roles[0]), // Map the first role
              permissions: response.roles || []
            },
            expiresIn: 3600
          };

          return loginResponse; // IMPORTANT: Return the transformed response
        }),
        tap(loginResponse => {
          this.handleLoginSuccess(loginResponse);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // Updated role mapping based on your backend response
  private mapRoleFromBackend(backendRole: string): UserRole {
    switch (backendRole) {
      case 'ROLE_ADMIN':
        return UserRole.ADMIN;
      case 'ROLE_SUPER_ADMIN':
        return UserRole.SUPER_ADMIN;
      case 'ROLE_DOCTOR':
        return UserRole.DOCTOR;
      case 'ROLE_NURSE':
        return UserRole.NURSE;
      case 'ROLE_PATIENT':
        return UserRole.PATIENT;
      case 'ROLE_RECEPTIONIST':
        return UserRole.RECEPTIONIST;
      case 'ROLE_LAB_TECHNICIAN':
        return UserRole.LAB_TECHNICIAN;
      case 'ROLE_PHARMACIST':
        return UserRole.PHARMACIST;
      case 'ROLE_STAFF':
        return UserRole.STAFF;
      default:
        console.warn('Unknown role:', backendRole);
        return UserRole.STAFF; // Default fallback
    }
  }

  private handleLoginSuccess(loginResponse: LoginResponse): void {
    this.tokenService.setToken(loginResponse.token);
    if (loginResponse.refreshToken) {
      this.tokenService.setRefreshToken(loginResponse.refreshToken);
    }

    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(loginResponse.user));
    this.setCurrentUser(loginResponse.user);
    this.setAuthenticated(true);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}${APP_CONSTANTS.API_ENDPOINTS.LOGOUT}`, {})
      .subscribe({
        next: () => this.handleLogout(),
        error: () => this.handleLogout()
      });
  }

  private handleLogout(): void {
    this.tokenService.removeTokens();
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    this.setCurrentUser(null);
    this.setAuthenticated(false);
    this.router.navigate([APP_CONSTANTS.ROUTES.LOGIN]);
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value && !this.tokenService.isTokenExpired();
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN) || this.hasRole(UserRole.SUPER_ADMIN);
  }

  // Updated dashboard routing based on roles
  getDashboardRoute(): string {
    const user = this.getCurrentUser();

    if (!user) return APP_CONSTANTS.ROUTES.LOGIN;

    switch (user.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.DOCTOR:
        return '/doctor/dashboard';
      case UserRole.NURSE:
        return '/nurse/dashboard';
      case UserRole.PATIENT:
        return '/patient/dashboard';
      case UserRole.RECEPTIONIST:
        return '/receptionist/dashboard';
      case UserRole.LAB_TECHNICIAN:
        return '/lab/dashboard';
      case UserRole.PHARMACIST:
        return '/pharmacy/dashboard';
      case UserRole.STAFF:
        return '/staff/dashboard';
      default:
        console.warn('Unknown role for dashboard routing:', user.role);
        return '/dashboard'; // Generic dashboard fallback
    }
  }

  private setCurrentUser(user: AdminUser | null): void {
    this.currentUserSubject.next(user);
  }

  private setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  register(registrationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patients/register`, registrationData)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }


}
