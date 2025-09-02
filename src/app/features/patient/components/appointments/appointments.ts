
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Userservice } from '../../../../core/services/userservices/userservice'; 
import { Notification } from '../../../../core/services/notification'; 
import { Appointment } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {
   appointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];
  cancelledAppointments: Appointment[] = [];
  
  isLoading = false;
  selectedTabIndex = 0;

  constructor(
    private patientService: Userservice,
    private notificationService: Notification,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    
    this.patientService.getAppointments().subscribe({
      next: (response) => {
        this.appointments = response.content;
        this.categorizeAppointments();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.isLoading = false;
      }
    });
  }

  private categorizeAppointments(): void {
    const now = new Date();
    
    this.upcomingAppointments = this.appointments.filter(apt => 
      (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED') && 
      new Date(apt.appointmentDate) >= now
    );
    
    this.pastAppointments = this.appointments.filter(apt => 
      apt.status === 'COMPLETED' || 
      (new Date(apt.appointmentDate) < now && apt.status !== 'CANCELLED')
    );
    
    this.cancelledAppointments = this.appointments.filter(apt => 
      apt.status === 'CANCELLED'
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SCHEDULED':
        return 'status-scheduled';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'NO_SHOW':
        return 'status-no-show';
      default:
        return '';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'CONSULTATION':
        return 'type-consultation';
      case 'FOLLOW_UP':
        return 'type-followup';
      case 'EMERGENCY':
        return 'type-emergency';
      case 'CHECKUP':
        return 'type-checkup';
      default:
        return '';
    }
  }

  canCancelAppointment(appointment: Appointment): boolean {
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return (appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && 
           hoursDifference > 24; // Can cancel if more than 24 hours away
  }

  canRescheduleAppointment(appointment: Appointment): boolean {
    return this.canCancelAppointment(appointment);
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const reason = 'Patient requested cancellation';
      
      this.patientService.cancelAppointment(appointment.id, reason).subscribe({
        next: () => {
          this.notificationService.showSuccess('Appointment cancelled successfully');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.notificationService.showError('Failed to cancel appointment');
        }
      });
    }
  }

  rescheduleAppointment(appointment: Appointment): void {
    // In a real app, this would open a dialog to select new date/time
    this.notificationService.showInfo('Reschedule feature coming soon');
  }

  getDaysUntilAppointment(appointmentDate: string): number {
    const appointment = new Date(appointmentDate);
    const now = new Date();
    const timeDiff = appointment.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  isAppointmentSoon(appointmentDate: string): boolean {
    return this.getDaysUntilAppointment(appointmentDate) <= 7;
  }

}
