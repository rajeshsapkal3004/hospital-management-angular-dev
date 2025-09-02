import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRole } from '../../core/models/auth.model';
import { roleGuard } from '../../core/guards/role-guard';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { UserManagement } from './components/user-management/user-management';
import { SystemSettings } from './components/system-settings/system-settings';
import { Reports } from './components/reports/reports';
import { authGuard } from '../../core/guards/auth-guard';

const routes: Routes = [
   {
    path: '',
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
        data: { title: 'Admin Dashboard' }
      },
      
      // User Management
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/user-management/user-management').then(m => m.UserManagement),
            data: { title: 'User Management' }
          },
          // {
          //   path: 'create',
          //   loadComponent: () => import('./components/user-management/create-user/create-user.component').then(m => m.CreateUserComponent),
          //   data: { title: 'Create User' }
          // },
          // {
          //   path: ':id/edit',
          //   loadComponent: () => import('./components/user-management/edit-user/edit-user.component').then(m => m.EditUserComponent),
          //   data: { title: 'Edit User' }
          // },
          // {
          //   path: ':id',
          //   loadComponent: () => import('./components/user-management/user-detail/user-detail.component').then(m => m.UserDetailComponent),
          //   data: { title: 'User Details' }
          // }
        ]
      },
      
      // // Department Management
      // {
      //   path: 'departments',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/department-management/department-management.component').then(m => m.DepartmentManagementComponent),
      //       data: { title: 'Department Management' }
      //     },
      //     {
      //       path: 'create',
      //       loadComponent: () => import('./components/department-management/create-department/create-department.component').then(m => m.CreateDepartmentComponent),
      //       data: { title: 'Create Department' }
      //     },
      //     {
      //       path: ':id/edit',
      //       loadComponent: () => import('./components/department-management/edit-department/edit-department.component').then(m => m.EditDepartmentComponent),
      //       data: { title: 'Edit Department' }
      //     }
      //   ]
      // },
      
      // Appointment Management
      // {
      //   path: 'appointments',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/appointment-management/appointment-management.component').then(m => m.AppointmentManagementComponent),
      //       data: { title: 'Appointment Management' }
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () => import('./components/appointment-management/appointment-detail/appointment-detail.component').then(m => m.AdminAppointmentDetailComponent),
      //       data: { title: 'Appointment Details' }
      //     }
      //   ]
      // },
      
      // Patient Management
      // {
      //   path: 'patients',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/patient-management/patient-management.component').then(m => m.PatientManagementComponent),
      //       data: { title: 'Patient Management' }
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () => import('./components/patient-management/patient-detail/patient-detail.component').then(m => m.AdminPatientDetailComponent),
      //       data: { title: 'Patient Details' }
      //     }
      //   ]
      // },
      
      // Doctor Management
      // {
      //   path: 'doctors',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/doctor-management/doctor-management.component').then(m => m.DoctorManagementComponent),
      //       data: { title: 'Doctor Management' }
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () => import('./components/doctor-management/doctor-detail/doctor-detail.component').then(m => m.AdminDoctorDetailComponent),
      //       data: { title: 'Doctor Details' }
      //     }
      //   ]
      // },
      
      // Reports & Analytics
      {
        path: 'reports',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/reports/reports').then(m => m.Reports),
            data: { title: 'Reports & Analytics' }
          },
          // {
          //   path: 'financial',
          //   loadComponent: () => import('./components/reports/financial-reports/financial-reports.component').then(m => m.FinancialReportsComponent),
          //   data: { title: 'Financial Reports' }
          // },
          // {
          //   path: 'operational',
          //   loadComponent: () => import('./components/reports/operational-reports/operational-reports.component').then(m => m.OperationalReportsComponent),
          //   data: { title: 'Operational Reports' }
          // },
          // {
          //   path: 'patient-analytics',
          //   loadComponent: () => import('./components/reports/patient-analytics/patient-analytics.component').then(m => m.PatientAnalyticsComponent),
          //   data: { title: 'Patient Analytics' }
          // }
        ]
      },
      
      // System Settings
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/system-settings/system-settings').then(m => m.SystemSettings),
            data: { title: 'System Settings' }
          },
          // {
          //   path: 'general',
          //   loadComponent: () => import('./components/system-settings/general-settings/general-settings.component').then(m => m.GeneralSettingsComponent),
          //   data: { title: 'General Settings' }
          // },
          // {
          //   path: 'security',
          //   loadComponent: () => import('./components/system-settings/security-settings/security-settings.component').then(m => m.SecuritySettingsComponent),
          //   data: { title: 'Security Settings' }
          // },
          // {
          //   path: 'backup',
          //   loadComponent: () => import('./components/system-settings/backup-settings/backup-settings.component').then(m => m.BackupSettingsComponent),
          //   data: { title: 'Backup Settings' }
          // }
        ]
      },
      
      // // Audit Logs
      // {
      //   path: 'audit-logs',
      //   loadComponent: () => import('./components/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent),
      //   data: { title: 'Audit Logs' }
      // },
      
      // // System Health
      // {
      //   path: 'system-health',
      //   loadComponent: () => import('./components/system-health/system-health.component').then(m => m.SystemHealthComponent),
      //   data: { title: 'System Health' }
      // },
      
      // // Notifications Management
      // {
      //   path: 'notifications',
      //   loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent),
      //   data: { title: 'Notifications Management' }
      // },
      
      // Default redirect to dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
