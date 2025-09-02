import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientLayout } from './layout/patient-layout/patient-layout';
import { roleGuard } from '../../core/guards/role-guard';
import { UserRole } from '../../core/models/auth.model';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/profile/profile';
import { MedicalRecords } from './components/medical-records/medical-records';
import { Appointments } from './components/appointments/appointments';
import { authGuard } from '../../core/guards/auth-guard';

const routes: Routes = [
 {
    path: '',
    loadComponent: () => import('./layout/patient-layout/patient-layout').then(m => m.PatientLayout),
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.PATIENT] },
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
        data: { title: 'Dashboard' }
      },
      
      // Appointments
      {
        path: 'appointments',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/appointments/appointments').then(m => m.Appointments),
            data: { title: 'My Appointments' }
          },
          {
            path: 'book',
            loadComponent: () => import('./components/book-appointment/book-appointment').then(m => m.BookAppointment),
            data: { title: 'Book Appointment' }
          },
          // {
          //   path: ':id',
          //   loadComponent: () => import('./components/appointment-detail/appo').then(m => m.AppointmentDetailComponent),
          //   data: { title: 'Appointment Details' }
          // }
        ]
      },
      
      // Medical Records
      {
        path: 'medical-records',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/medical-records/medical-records').then(m => m.MedicalRecords),
            data: { title: 'Medical Records' }
          },
          {
            path: ':id',
            loadComponent: () => import('./components/medical-record-detail-component/medical-record-detail-component').then(m => m.MedicalRecordDetailComponent),
            data: { title: 'Medical Record Details' }
          }
        ]
      },
      
      // // Prescriptions
      // {
      //   path: 'prescriptions',
      //   loadComponent: () => import('./components/prescriptions/prescriptions.component').then(m => m.PrescriptionsComponent),
      //   data: { title: 'Prescriptions' }
      // },
      
      // Lab Results
      // {
      //   path: 'lab-results',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/lab-results/lab-results.component').then(m => m.LabResultsComponent),
      //       data: { title: 'Lab Results' }
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () => import('./components/lab-result-detail/lab-result-detail.component').then(m => m.LabResultDetailComponent),
      //       data: { title: 'Lab Result Details' }
      //     }
      //   ]
      // },
      
      // Health Tracking
      // {
      //   path: 'health-tracking',
      //   loadComponent: () => import('./components/health-tracking/health-tracking.component').then(m => m.HealthTrackingComponent),
      //   data: { title: 'Health Tracking' }
      // },
      
      // Profile Management
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile').then(m => m.Profile),
        data: { title: 'My Profile' }
      },
      
      // Insurance
      // {
      //   path: 'insurance',
      //   loadComponent: () => import('./components/insurance/insurance.component').then(m => m.InsuranceComponent),
      //   data: { title: 'Insurance Information' }
      // },
      
      // Billing
      // {
      //   path: 'billing',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/billing/billing.component').then(m => m.BillingComponent),
      //       data: { title: 'Billing & Payments' }
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () => import('./components/billing/bill-detail/bill-detail.component').then(m => m.BillDetailComponent),
      //       data: { title: 'Bill Details' }
      //     }
      //   ]
      // },
      
      // Settings
      // {
      //   path: 'settings',
      //   loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
      //   data: { title: 'Settings' }
      // },
      
      // Messages/Communication
      // {
      //   path: 'messages',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./components/messages/messages.component').then(m => m.MessagesComponent),
      //       data: { title: 'Messages' }
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () => import('./components/messages/message-detail/message-detail.component').then(m => m.MessageDetailComponent),
      //       data: { title: 'Message Details' }
      //     }
      //   ]
      // },
      
      // Emergency Contacts
      // {
      //   path: 'emergency-contacts',
      //   loadComponent: () => import('./components/emergency-contacts/emergency-contacts.component').then(m => m.EmergencyContactsComponent),
      //   data: { title: 'Emergency Contacts' }
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
export class PatientRoutingModule { }