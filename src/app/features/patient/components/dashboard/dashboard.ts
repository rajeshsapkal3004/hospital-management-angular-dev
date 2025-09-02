import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Userservice } from '../../../../core/services/userservices/userservice'; 
import { Auth } from '../../../../core/services/auth'; 
import { 
  PatientDashboardStats, 
  Appointment, 
  MedicalRecord,
  Patient,
} from '../../../../core/models/patient.model';
import { AdminUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  imports: [
     CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{

  isLoading = false;
  currentUser: AdminUser | null = null;
  currentPatient: Patient | null = null;
  dashboardStats: PatientDashboardStats | null = null;
  upcomingAppointments: Appointment[] = [];
  recentMedicalRecords: MedicalRecord[] = [];

  quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with a doctor',
      icon: 'event_available',
      route: '/patient/appointments/book',
      color: '#2196f3'
    },
    {
      title: 'View Records',
      description: 'Access your medical history and reports',
      icon: 'description',
      route: '/patient/medical-records',
      color: '#4caf50'
    },
    {
      title: 'Prescriptions',
      description: 'Check your current medications',
      icon: 'medication',
      route: '/patient/prescriptions',
      color: '#ff9800'
    },
    {
      title: 'Lab Results',
      description: 'View your latest test results',
      icon: 'biotech',
      route: '/patient/lab-results',
      color: '#9c27b0'
    }
  ];

  constructor(
    private patientService: Userservice,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadCurrentUser();
    this.loadPatientProfile();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadPatientProfile(): void {
    this.patientService.currentPatient$.subscribe(patient => {
      this.currentPatient = patient;
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Load dashboard stats
    this.patientService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    // Load upcoming appointments
    this.patientService.getUpcomingAppointments().subscribe({
      next: (appointments) => {
        this.upcomingAppointments = appointments.slice(0, 3); // Show only 3
      },
      error: (error) => {
        console.error('Error loading upcoming appointments:', error);
      }
    });

    // Load recent medical records
    this.patientService.getMedicalRecords(0, 3).subscribe({
      next: (response) => {
        this.recentMedicalRecords = response.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
        this.isLoading = false;
      }
    });
  }

  getUserWelcomeMessage(): string {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    
    if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    } else if (hour >= 18) {
      greeting = 'Good evening';
    }

    return `${greeting}, ${this.currentUser?.firstName || 'Patient'}!`;
  }

  getAppointmentStatusClass(status: string): string {
    switch (status) {
      case 'SCHEDULED':
        return 'status-scheduled';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(dateString: string | undefined | null): string {
    if (!dateString) {
      return 'Not available';
    }
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string | undefined | null): string {
    if (!timeString) {
      return 'Not available';
    }
    
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      if (isNaN(time.getTime())) {
        return 'Invalid time';
      }
      
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid time';
    }
  }

  // Add null check helper methods
  hasLastVisitDate(): boolean {
    return !!(this.dashboardStats?.lastVisitDate);
  }

  hasNextAppointmentDate(): boolean {
    return !!(this.dashboardStats?.nextAppointmentDate);
  }

  getLastVisitDate(): string {
    return this.dashboardStats?.lastVisitDate || '';
  }

  getNextAppointmentDate(): string {
    return this.dashboardStats?.nextAppointmentDate || '';
  }

  // Safe formatters for stats
  formatLastVisitDate(): string {
    if (!this.dashboardStats?.lastVisitDate) {
      return 'No visits yet';
    }
    return this.formatDate(this.dashboardStats.lastVisitDate);
  }

  formatNextAppointmentDate(): string {
    if (!this.dashboardStats?.nextAppointmentDate) {
      return 'No appointments scheduled';
    }
    return this.formatDate(this.dashboardStats.nextAppointmentDate);
  }



  getVisitTypeClass(type: string): string {
    switch (type) {
      case 'CONSULTATION':
        return 'visit-consultation';
      case 'FOLLOW_UP':
        return 'visit-followup';
      case 'EMERGENCY':
        return 'visit-emergency';
      case 'CHECKUP':
        return 'visit-checkup';
      default:
        return '';
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

}
