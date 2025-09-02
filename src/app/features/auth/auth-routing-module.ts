import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { noAuthGuard } from '../../core/guards/no-auth-guard';
import { Register } from './components/register/register';

const routes: Routes = [
 {
    path: '',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login),
        data: { title: 'Login' }
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register').then(m => m.Register),
        data: { title: 'Register' }
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password').then(m => m.ForgotPassword),
        data: { title: 'Forgot Password' }
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./components/reset-password/reset-password').then(m => m.ResetPassword),
        data: { title: 'Reset Password' }
      },
      // {
      //   path: 'verify-email',
      //   loadComponent: () => import('./components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
      //   data: { title: 'Verify Email' }
      // },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
