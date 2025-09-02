import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

import { Userservice } from '../../../../core/services/userservices/userservice'; 
import { Notification } from '../../../../core/services/notification'; 
import { 
  Doctor, 
  TimeSlot, 
  AppointmentBooking 
} from '../../../../core/models/patient.model';
@Component({
  selector: 'app-book-appointment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatRadioModule
  ],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointment implements OnInit {

   specializationForm!: FormGroup;
  doctorForm!: FormGroup;
  appointmentForm!: FormGroup;
  
  specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Surgery', 'Internal Medicine',
    'Orthopedics', 'Dermatology', 'Psychiatry', 'Radiology', 'Anesthesiology',
    'Emergency Medicine', 'Family Medicine', 'Obstetrics & Gynecology'
  ];

  appointmentTypes = [
    { value: 'CONSULTATION', label: 'Consultation' },
    { value: 'FOLLOW_UP', label: 'Follow-up' },
    { value: 'CHECKUP', label: 'Check-up' }
  ];

  doctors: Doctor[] = [];
  availableSlots: TimeSlot[] = [];
  selectedDoctor: Doctor | null = null;
  selectedDate: Date | null = null;
  
  isLoadingDoctors = false;
  isLoadingSlots = false;
  isBooking = false;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: Userservice,
    private notificationService: Notification,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.specializationForm = this.formBuilder.group({
      specialization: ['', Validators.required]
    });

    this.doctorForm = this.formBuilder.group({
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required]
    });

    this.appointmentForm = this.formBuilder.group({
      timeSlot: ['', Validators.required],
      appointmentType: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Watch for specialization changes
    this.specializationForm.get('specialization')?.valueChanges.subscribe(specialization => {
      if (specialization) {
        this.loadDoctors(specialization);
      }
    });

    // Watch for doctor and date changes
    this.doctorForm.valueChanges.subscribe(value => {
      if (value.doctorId && value.appointmentDate) {
        this.selectedDoctor = this.doctors.find(d => d.id === value.doctorId) || null;
        this.selectedDate = value.appointmentDate;
        this.loadAvailableSlots();
      }
    });
  }

  private loadDoctors(specialization: string): void {
    this.isLoadingDoctors = true;
    this.patientService.getDoctors(specialization).subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.isLoadingDoctors = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.notificationService.showError('Failed to load doctors');
        this.isLoadingDoctors = false;
      }
    });
  }

  private loadAvailableSlots(): void {
    if (!this.selectedDoctor || !this.selectedDate) return;

    this.isLoadingSlots = true;
    const dateString = this.selectedDate.toISOString().split('T')[0];
    
    this.patientService.getDoctorAvailableSlots(this.selectedDoctor.id, dateString).subscribe({
      next: (slots) => {
        this.availableSlots = slots.filter(slot => slot.isAvailable);
        this.isLoadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading available slots:', error);
        this.notificationService.showError('Failed to load available time slots');
        this.isLoadingSlots = false;
      }
    });
  }

  bookAppointment(): void {
    if (this.appointmentForm.valid && this.selectedDoctor && this.selectedDate) {
      this.isBooking = true;
      
      const selectedSlot = this.availableSlots.find(
        slot => slot.id === this.appointmentForm.value.timeSlot
      );

      if (!selectedSlot) {
        this.notificationService.showError('Please select a valid time slot');
        this.isBooking = false;
        return;
      }

      const booking: AppointmentBooking = {
        doctorId: this.selectedDoctor.id,
        appointmentDate: this.selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedSlot.time,
        reason: this.appointmentForm.value.reason,
        type: this.appointmentForm.value.appointmentType
      };

      this.patientService.bookAppointment(booking).subscribe({
        next: (appointment) => {
          this.notificationService.showSuccess('Appointment booked successfully!');
          this.router.navigate(['/patient/appointments', appointment.id]);
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
          this.notificationService.showError('Failed to book appointment');
          this.isBooking = false;
        }
      });
    } else {
      this.markAllFormsAsTouched();
      this.notificationService.showError('Please fill in all required fields');
    }
  }

  private markAllFormsAsTouched(): void {
    this.specializationForm.markAllAsTouched();
    this.doctorForm.markAllAsTouched();
    this.appointmentForm.markAllAsTouched();
  }

  getDoctorRating(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMinDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  getMaxDate(): Date {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Book up to 30 days in advance
    return maxDate;
  }

  goBack(): void {
    this.router.navigate(['/patient/appointments']);
  }

  canProceedToStep2(): boolean {
    return this.specializationForm.valid;
  }

  canProceedToStep3(): boolean {
    return this.doctorForm.valid && this.availableSlots.length > 0;
  }

  canBookAppointment(): boolean {
    return this.appointmentForm.valid && !this.isBooking;
  }

}
