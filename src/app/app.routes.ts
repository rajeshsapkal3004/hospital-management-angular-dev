import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const appRoutes: Routes = [
   // Auth routes (accessible only when not authenticated)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-routing-module').then(m => m.AuthRoutingModule),
    canActivate: [noAuthGuard]
  },
  
  // Admin routes
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-routing-module').then(m => m.AdminRoutingModule),
    canActivate: [authGuard]
  },
  
  // Patient routes
  {
    path: 'patient',
    loadChildren: () => import('./features/patient/patient-routing-module').then(m => m.PatientRoutingModule),
    canActivate: [authGuard]
  },
  
  // Doctor routes
  {
    path: 'doctor',
    loadChildren: () => import('./features/doctor/doctor-routing-module').then(m => m.DoctorRoutingModule),
    canActivate: [authGuard]
  },
  
  // Nurse routes
  {
    path: 'nurse',
    loadChildren: () => import('./features/nurse/nurse-routing-module').then(m => m.NurseRoutingModule),
    canActivate: [authGuard]
  },
  
  // Receptionist routes
  {
    path: 'receptionist',
    loadChildren: () => import('./features/receptionist/receptionist-routing-module').then(m => m.ReceptionistRoutingModule),
    canActivate: [authGuard]
  },
  
  // Pharmacist routes
  {
    path: 'pharmacist',
    loadChildren: () => import('./features/pharmacy/pharmacy-routing-module').then(m => m.PharmacyRoutingModule),
    canActivate: [authGuard]
  },
  
  // Lab Technician routes
  {
    path: 'lab-technician',
    loadChildren: () => import('./features/medical-lab/medical-lab-routing-module').then(m => m.MedicalLabRoutingModule),
    canActivate: [authGuard]
  },
  
  // Default route with role-based redirect
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  
  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy: PreloadAllModules,
    enableTracing: false // Set to true for debugging
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
