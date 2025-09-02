import { Component, EventEmitter, Output } from '@angular/core';
import { AdminUser } from '../../../../core/models/auth.model';
import { Patient } from '../../../../core/models/patient.model';
import { Auth } from '../../../../core/services/auth';
import { Userservice } from '../../../../core/services/userservices/userservice';
import { Router } from '@angular/router';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { AdminRoutingModule } from "../../../admin/admin-routing-module";
import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { MatDivider } from "@angular/material/divider";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-header-component',
  imports: [MatToolbar, MatIconModule, AdminRoutingModule, MatMenuModule, MatChipsModule, MatDivider,CommonModule],
  templateUrl: './patient-header-component.html',
  styleUrl: './patient-header-component.css'
})
export class PatientHeaderComponent {
   @Output() menuToggle = new EventEmitter<void>();
  
  currentUser: AdminUser | null = null;
  currentPatient: Patient | null = null;

  constructor(
    private authService: Auth,
    private patientService: Userservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.patientService.currentPatient$.subscribe(patient => {
      this.currentPatient = patient;
    });

    // Load patient profile if not loaded
    if (!this.currentPatient && this.currentUser) {
      this.loadPatientProfile();
    }
  }

  private loadPatientProfile(): void {
    this.patientService.getProfile().subscribe({
      next: (patient) => {
        this.patientService.setCurrentPatient(patient);
      },
      error: (error) => {
        console.error('Error loading patient profile:', error);
      }
    });
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    this.router.navigate(['/patient/profile']);
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'Patient';
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`;
    }
    return 'P';
  }

  getPatientNumber(): string {
    return this.currentPatient?.patientId || 'N/A';
  }

}
