import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

// Services and Models
import { Auth } from '../../../../core/services/auth';
import { Notification } from '../../../../core/services/notification';
import { LoginRequest } from '../../../../core/models/auth.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  environment = environment;
  
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: Notification
  ) {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      const dashboardRoute = this.authService.getDashboardRoute();
      this.router.navigate([dashboardRoute]);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['rajesh_sapkal', [Validators.required, Validators.minLength(3)]],
      password: ['Test@1234', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Login successful!');
          
          // Determine dashboard based on role
          const dashboardRoute = this.authService.getDashboardRoute();
          console.log('Navigating to dashboard:', dashboardRoute);
          this.router.navigate([dashboardRoute]);
        },
        error: (error) => {
          const message = error?.error?.message ||
                          error?.message ||
                          'Login failed. Please check your credentials and try again.';
          this.notificationService.showError(message);
        }
      });
  } else {
    this.markFormGroupTouched();
  }
}


  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
    }
    
    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Username',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
